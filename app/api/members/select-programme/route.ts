/**
 * POST /api/members/select-programme
 *
 * Persists the client's chosen programme tier (programmeVariant) on their profile.
 *
 * SECURITY INVARIANT: this writes a DISPLAY/CHECKOUT field only. It NEVER grants
 * access. Entitlement is derived exclusively from verified payment fields in
 * lib/members/entitlements.ts. A client selecting the cheapest tier unlocks
 * nothing — programme access is granted only by the Stripe webhook after the
 * balance is paid.
 *
 * clientId is derived from the verified token — never trusted from the body.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { waitUntil } from "@vercel/functions";
import { verifyMemberToken } from "@/lib/members/token";
import { writeClient, hasWriteClient } from "@/sanity/lib/writeClient";
import { logAuditEvent, clientIp } from "@/lib/members/audit";
import { getVariant } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  token: z.string().min(1),
  variantKey: z.string().min(1),
});

interface ProfileRef {
  _id: string;
  revokedAt: string | null;
  tokenVersion: number | null;
}

export async function POST(req: NextRequest) {
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
  const { token, variantKey } = parsed.data;

  // Reject unknown variant keys — must map to a real tier in lib/pricing.ts.
  const variant = getVariant(variantKey);
  if (!variant || variant.programme === "consultation") {
    return NextResponse.json({ error: "Unknown programme tier" }, { status: 422 });
  }

  // ── Authorise: clientId comes from the token, not the body ──
  const payload = verifyMemberToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  }
  const { clientId } = payload;

  let profile: ProfileRef | null;
  try {
    profile = await wc.fetch<ProfileRef | null>(
      `*[_type == "clientProfile" && clientId == $clientId][0]{ _id, revokedAt, tokenVersion }`,
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

  try {
    await wc
      .patch(profile._id)
      .set({ programmeVariant: variantKey, lastClientUpdateAt: new Date().toISOString() })
      .commit();
  } catch (err) {
    console.error("[select-programme] write failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Could not save your selection" }, { status: 502 });
  }

  const ip = clientIp(req.headers);
  waitUntil(logAuditEvent("programme_selected", { clientId, meta: variantKey, ip }));

  return NextResponse.json({ success: true, variantKey });
}
