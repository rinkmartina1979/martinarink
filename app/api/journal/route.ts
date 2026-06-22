/**
 * POST /api/journal
 *
 * Upserts a client's journal entry (morning / evening) or monthly review.
 *
 * Security & privacy:
 *  - The member token is the credential. clientId is derived from the verified
 *    token payload — NEVER trusted from the request body.
 *  - Writes go through the server-only Sanity write client.
 *  - Entries default to visibility "private". Journal content is never logged
 *    and never placed in notification emails.
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
  MorningEntrySchema,
  EveningEntrySchema,
  MonthlyReviewSchema,
  VisibilitySchema,
  monthIndexFor,
} from "@/lib/journal/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

const BodySchema = z.discriminatedUnion("kind", [
  z.object({
    token: z.string().min(1),
    kind: z.literal("morning"),
    date: DateKey,
    visibility: VisibilitySchema,
    content: MorningEntrySchema,
  }),
  z.object({
    token: z.string().min(1),
    kind: z.literal("evening"),
    date: DateKey,
    visibility: VisibilitySchema,
    content: EveningEntrySchema,
  }),
  z.object({
    token: z.string().min(1),
    kind: z.literal("monthly"),
    monthIndex: z.number().int().min(1).max(3),
    visibility: VisibilitySchema,
    content: MonthlyReviewSchema,
  }),
]);

interface ProfileRef {
  _id: string;
  firstName: string;
  email: string | null;
  enrolledAt: string | null;
  revokedAt: string | null;
  tokenVersion: number | null;
}

export async function POST(req: NextRequest) {
  if (!hasWriteClient(writeClient)) {
    return NextResponse.json(
      { error: "Journal storage not configured" },
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

  // Resolve the client profile (for the reference + month calc + name)
  let profile: ProfileRef | null;
  try {
    profile = await wc.fetch<ProfileRef | null>(
      `*[_type == "clientProfile" && clientId == $clientId][0]{ _id, firstName, email, enrolledAt, revokedAt, tokenVersion }`,
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

  try {
    if (data.kind === "monthly") {
      const id = `monthly-${clientId}-${data.monthIndex}`;
      await wc.createIfNotExists({
        _id: id,
        _type: "monthlyReview",
        client: { _type: "reference", _ref: profile._id },
        clientId,
        monthIndex: data.monthIndex,
        reviewDate: now.slice(0, 10),
        visibility: "private",
        createdAt: now,
      });
      await wc
        .patch(id)
        .set({ ...data.content, visibility: data.visibility, updatedAt: now })
        .commit();
    } else {
      const id = `journal-${clientId}-${data.date}-${data.kind}`;
      const monthIndex = profile.enrolledAt
        ? monthIndexFor(profile.enrolledAt, data.date)
        : 1;
      await wc.createIfNotExists({
        _id: id,
        _type: "journalEntry",
        client: { _type: "reference", _ref: profile._id },
        clientId,
        entryDate: data.date,
        entryType: data.kind,
        monthIndex,
        visibility: "private",
        createdAt: now,
      });
      await wc
        .patch(id)
        .set({ content: data.content, visibility: data.visibility, monthIndex, updatedAt: now })
        .commit();
    }
  } catch (err) {
    // Log the failure WITHOUT any journal content.
    console.error("[Journal] write failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Could not save your entry" }, { status: 502 });
  }

  // ── Audit (no journal body) + activity timestamps ──
  const ip = clientIp(req.headers);
  const auditMeta = data.kind === "monthly" ? `monthly m${data.monthIndex}` : `${data.kind} ${data.date}`;
  waitUntil(logAuditEvent("journal_saved", { clientId, meta: auditMeta, ip }));
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
    const entryDate = data.kind === "monthly" ? now.slice(0, 10) : data.date;

    waitUntil(logAuditEvent("needs_support", { clientId, meta: entryDate, ip }));

    if (resendKey && notifyEmail) {
      const { subject, html } = needsSupportNotification({
        firstName: profile.firstName,
        entryDate,
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
            if (!res.ok) console.error("[Journal] support email failed:", res.status);
          })
          .catch((e) => console.error("[Journal] support email error:", e)),
      );
    }

    if (profile.email) {
      waitUntil(
        trackBrevoEvent({
          email: profile.email,
          eventName: "journal_needs_support",
          properties: { client_id: clientId, entry_date: entryDate },
        }).catch((e) => console.error("[Journal] Brevo event failed:", e)),
      );
    }
  }

  return NextResponse.json({ success: true });
}
