/**
 * POST /api/checkout/test
 *
 * Creates a real Stripe Checkout Session for €1 (production smoke test).
 * Uses inline price_data — no Price ID required, no Stripe product created.
 *
 * Gate: requires X-Test-Secret header matching STRIPE_TEST_SECRET env var.
 * This prevents accidental public use of a production charge endpoint.
 *
 * After the test:
 *   1. Refund the charge in Stripe Dashboard → Payments
 *   2. Confirm webhook fired: Stripe → Developers → Webhooks → recent events
 *   3. Confirm email: Resend → Logs
 *   4. Confirm Brevo: Contacts → find the test email
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // ── Gate — require secret header to prevent accidental charges ──
  const testSecret = process.env.STRIPE_TEST_SECRET;
  const providedSecret = req.headers.get("x-test-secret");

  if (!testSecret || providedSecret !== testSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY not configured" },
      { status: 503 }
    );
  }

  let body: { email?: string; amount?: number } = {};
  try {
    body = await req.json();
  } catch {
    // use defaults
  }

  // Amount: 100 = €1.00, 500 = €5.00 (Stripe uses cents)
  const amountCents = body.amount === 5 ? 500 : 100;
  const amountLabel = amountCents === 500 ? "€5.00" : "€1.00";

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" });

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://martinarink.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Production Smoke Test — ${amountLabel}`,
              description:
                "This charge verifies the end-to-end payment flow. Refund immediately after confirming.",
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      // Pre-fill the test email if provided
      ...(body.email ? { customer_email: body.email } : {}),
      success_url: `${origin}/test/stripe/success?session_id={CHECKOUT_SESSION_ID}&amount=${amountCents}`,
      cancel_url: `${origin}/test/stripe`,
      metadata: {
        source: "production-smoke-test",
        amount_cents: String(amountCents),
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[checkout/test] Stripe error:", err);
    const message =
      err instanceof Stripe.errors.StripeError
        ? err.message
        : "Session creation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
