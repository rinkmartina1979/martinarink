/**
 * POST /api/checkout/programme
 *
 * Creates a Stripe Checkout Session for the programme BALANCE (total − €350 deposit)
 * for the client's chosen tier. Uses the Stripe product ID from lib/pricing.ts with
 * an explicit unit_amount so we charge the balance against the correct product.
 *
 * SECURITY: clientId is derived from the verified token, never the body. Paying the
 * balance is what grants programme access — handled by the Stripe webhook
 * (checkout.session.completed, metadata.type === "programme-balance"). This route
 * never writes entitlement fields itself.
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { stripe, hasStripe } from "@/lib/stripe";
import { verifyMemberToken } from "@/lib/members/token";
import { writeClient, hasWriteClient } from "@/sanity/lib/writeClient";
import { getVariant, getBalance, getInstalmentPlan, INSTALMENT_COUNT } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  token: z.string().min(1),
  // Optional — if supplied, we persist it before checkout; otherwise we use the
  // variant already stored on the profile.
  variantKey: z.string().min(1).optional(),
  paymentMode: z.enum(["full", "instalments"]).optional().default("full"),
});

interface ProfileForCheckout {
  _id: string;
  email: string | null;
  programmeVariant: string | null;
  stripeCustomerId: string | null;
  revokedAt: string | null;
  tokenVersion: number | null;
}

export async function POST(req: NextRequest) {
  if (!hasStripe(stripe)) {
    return NextResponse.json(
      { error: "Payment not configured — STRIPE_SECRET_KEY is missing" },
      { status: 503 },
    );
  }
  if (!hasWriteClient(writeClient)) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }
  const wc = writeClient;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }
  const { token, variantKey: bodyVariantKey, paymentMode } = parsed.data;

  // ── Authorise via token ──
  const payload = verifyMemberToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  }
  const { clientId } = payload;

  let profile: ProfileForCheckout | null;
  try {
    profile = await wc.fetch<ProfileForCheckout | null>(
      `*[_type == "clientProfile" && clientId == $clientId][0]{
        _id, email, programmeVariant, stripeCustomerId, revokedAt, tokenVersion
      }`,
      { clientId },
    );
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }
  if (!profile) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }
  if (profile.revokedAt || (payload.tv ?? 1) < (profile.tokenVersion ?? 1)) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  }

  // Resolve the tier: body override (persist it) or the stored selection.
  const variantKey = bodyVariantKey ?? profile.programmeVariant ?? null;
  const variant = getVariant(variantKey);
  if (!variant || variant.programme === "consultation" || !variant.stripeProductId) {
    return NextResponse.json({ error: "No programme tier selected" }, { status: 422 });
  }

  const balance = getBalance(variant);
  if (balance <= 0) {
    return NextResponse.json({ error: "No balance due for this tier" }, { status: 422 });
  }

  // Persist the selection if the client switched tiers at checkout time.
  if (bodyVariantKey && bodyVariantKey !== profile.programmeVariant) {
    try {
      await wc.patch(profile._id).set({ programmeVariant: bodyVariantKey }).commit();
    } catch (err) {
      console.error("[checkout/programme] variant persist failed:", err);
    }
  }

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://martinarink.com";

  try {
    const customerFields = profile.stripeCustomerId
      ? { customer: profile.stripeCustomerId }
      : profile.email
      ? { customer_email: profile.email }
      : {};

    const session =
      paymentMode === "instalments"
        ? await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
              {
                price_data: {
                  currency: "eur",
                  product: variant.stripeProductId,
                  unit_amount: getInstalmentPlan(variant).perCents,
                  recurring: { interval: "month" },
                },
                quantity: 1,
              },
            ],
            success_url: `${origin}/members/${token}/welcome?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/members/${token}/billing?cancelled=1`,
            ...customerFields,
            subscription_data: {
              metadata: {
                clientId,
                variantKey,
                type: "programme-instalment",
                totalInstalments: String(INSTALMENT_COUNT),
              },
            },
            allow_promotion_codes: false,
          })
        : await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
              {
                price_data: {
                  currency: "eur",
                  product: variant.stripeProductId,
                  unit_amount: balance * 100,
                },
                quantity: 1,
              },
            ],
            success_url: `${origin}/members/${token}/welcome?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/members/${token}/billing?cancelled=1`,
            ...customerFields,
            metadata: {
              clientId,
              variantKey,
              type: "programme-balance",
            },
            allow_promotion_codes: false,
          });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout/programme] Stripe error:", err);
    const message =
      err instanceof Stripe.errors.StripeError ? err.message : "Checkout session creation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
