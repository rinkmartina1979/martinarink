/**
 * POST /api/workbook
 *
 * Upserts a client's foundation-workbook section (the one-time deep exercises).
 * Parallel to /api/journal — the journal write path is intentionally untouched.
 *
 * Security & privacy:
 *  - The member token is the credential. clientId is derived from the verified
 *    token payload — NEVER trusted from the request body.
 *  - Writes go through the server-only Sanity write client.
 *  - Sections default to visibility "private". Content is never logged and
 *    never placed in notification emails.
 *  - "needs-support" fires an internal flag to Martina (no content), plus a
 *    Brevo event. This is not an emergency channel (disclaimer shown in UI).
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { waitUntil } from "@vercel/functions";
import { verifyMemberToken } from "@/lib/members/token";
import { writeClient, hasWriteClient } from "@/sanity/lib/writeClient";
import { trackBrevoEvent } from "@/lib/brevo";
import { needsSupportNotification } from "@/lib/email-templates";
import { logAuditEvent, clientIp } from "@/lib/members/audit";
import {
  WorkbookContentSchema,
  WorkbookSectionKeySchema,
  VisibilitySchema,
} from "@/lib/workbook/sections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  token: z.string().min(1),
  sectionKey: WorkbookSectionKeySchema,
  visibility: VisibilitySchema,
  content: WorkbookContentSchema,
});

interface ProfileRef {
  _id: string;
  firstName: string;
  email: string | null;
  revokedAt: string | null;
  tokenVersion: number | null;
}

export async function POST(req: NextRequest) {
  if (!hasWriteClient(writeClient)) {
    return NextResponse.json(
      { error: "Workbook storage not configured" },
      { status: 503 },
    );
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
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const data = parsed.data;

  // ── Authorise: clientId comes from the token, not the body ──
  const payload = verifyMemberToken(data.token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  }
  const { clientId } = payload;

  let profile: ProfileRef | null;
  try {
    profile = await wc.fetch<ProfileRef | null>(
      `*[_type == "clientProfile" && clientId == $clientId][0]{ _id, firstName, email, revokedAt, tokenVersion }`,
      { clientId },
    );
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }
  if (!profile) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Revocation: blocked if access revoked or the link is an older token version.
  if (profile.revokedAt || (payload.tv ?? 1) < (profile.tokenVersion ?? 1)) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  }

  const now = new Date().toISOString();
  const id = `workbook-${clientId}-${data.sectionKey}`;

  // Stamp signedAt the first time a signed contract is saved.
  const isSignedContract =
    data.sectionKey === "contract" &&
    typeof data.content.contractSignature === "string" &&
    data.content.contractSignature.trim().length > 0;

  try {
    await wc.createIfNotExists({
      _id: id,
      _type: "workbookSection",
      client: { _type: "reference", _ref: profile._id },
      clientId,
      sectionKey: data.sectionKey,
      visibility: "private",
      createdAt: now,
    });
    const patch = wc
      .patch(id)
      .set({ content: data.content, visibility: data.visibility, updatedAt: now });
    if (isSignedContract) patch.setIfMissing({ signedAt: now });
    await patch.commit();
  } catch (err) {
    // Log the failure WITHOUT any workbook content.
    console.error("[Workbook] write failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Could not save your entry" }, { status: 502 });
  }

  // ── Audit (no body) + activity timestamps ──
  const ip = clientIp(req.headers);
  waitUntil(logAuditEvent("workbook_saved", { clientId, meta: data.sectionKey, ip }));
  waitUntil(
    wc
      .patch(profile._id)
      .set({ lastUsedAt: new Date().toISOString(), lastClientUpdateAt: new Date().toISOString() })
      .commit()
      .then(() => undefined)
      .catch(() => undefined),
  );

  // ── needs-support → notify Martina (no content) + Brevo event ──
  if (data.visibility === "needs-support") {
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "contact@martinarink.com";
    const notifyEmail = process.env.RESEND_NOTIFY_EMAIL ?? process.env.RESEND_REPLY_TO;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://martinarink.com";

    waitUntil(logAuditEvent("needs_support", { clientId, meta: `workbook ${data.sectionKey}`, ip }));

    if (resendKey && notifyEmail) {
      const { subject, html } = needsSupportNotification({
        firstName: profile.firstName,
        entryDate: now.slice(0, 10),
        studioUrl: `${siteUrl}/admin`,
      });
      waitUntil(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
          body: JSON.stringify({
            from: `Martina Rink <${fromEmail}>`,
            to: [notifyEmail],
            subject,
            html,
          }),
        })
          .then((res) => {
            if (!res.ok) console.error("[Workbook] support email failed:", res.status);
          })
          .catch((e) => console.error("[Workbook] support email error:", e)),
      );
    }

    if (profile.email) {
      waitUntil(
        trackBrevoEvent({
          email: profile.email,
          eventName: "workbook_needs_support",
          properties: { client_id: clientId, section: data.sectionKey },
        }).catch((e) => console.error("[Workbook] Brevo event failed:", e)),
      );
    }
  }

  return NextResponse.json({ success: true });
}
