/**
 * POST /api/members/session-request
 *
 * Client requests a session / support from inside the portal. Token-authed.
 * Creates a sessionRequest doc and emails Martina. Carries NO journal content.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { waitUntil } from "@vercel/functions";
import { verifyMemberToken } from "@/lib/members/token";
import { writeClient, hasWriteClient } from "@/sanity/lib/writeClient";
import { logAuditEvent, clientIp } from "@/lib/members/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  token: z.string().min(1),
  preferredTimeframe: z.string().trim().max(200).optional(),
  reason: z.string().trim().min(1).max(500),
  urgency: z.enum(["normal", "soon"]).default("normal"),
  note: z.string().trim().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  if (!hasWriteClient(writeClient)) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  const wc = writeClient;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 422 });
  }
  const data = parsed.data;

  const payload = verifyMemberToken(data.token);
  if (!payload) return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  const { clientId } = payload;

  const profile = await wc
    .fetch<{ _id: string; firstName: string; revokedAt: string | null; tokenVersion: number | null } | null>(
      `*[_type=="clientProfile" && clientId==$clientId][0]{ _id, firstName, revokedAt, tokenVersion }`,
      { clientId },
    )
    .catch(() => null);
  if (!profile) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  if (profile.revokedAt || (payload.tv ?? 1) < (profile.tokenVersion ?? 1)) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  }

  const now = new Date().toISOString();
  try {
    await wc.create({
      _type: "sessionRequest",
      client: { _type: "reference", _ref: profile._id },
      clientId,
      preferredTimeframe: data.preferredTimeframe ?? null,
      reason: data.reason,
      urgency: data.urgency,
      note: data.note ?? null,
      status: "new",
      createdAt: now,
    });
  } catch (err) {
    console.error("[session-request] write failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Could not send your request" }, { status: 502 });
  }

  const ip = clientIp(req.headers);
  waitUntil(logAuditEvent("session_requested", { clientId, meta: data.urgency, ip }));
  waitUntil(
    wc.patch(profile._id).set({ lastClientUpdateAt: now }).commit().then(() => undefined).catch(() => undefined),
  );

  // Notify Martina (no journal content; this is the client's own request text).
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "contact@martinarink.com";
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL ?? process.env.RESEND_REPLY_TO;
  if (resendKey && notifyEmail) {
    const urgencyLabel = data.urgency === "soon" ? "Soon" : "Normal";
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#F7F3EE;padding:40px;color:#1E1B17;">
        <p style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#8A7F72;margin:0 0 12px;">Session request</p>
        <p style="font-size:18px;margin:0 0 16px;">${profile.firstName} would like a session.</p>
        <p style="font-size:14px;line-height:1.7;color:#4A3728;margin:0 0 8px;"><strong>Urgency:</strong> ${urgencyLabel}</p>
        ${data.preferredTimeframe ? `<p style="font-size:14px;line-height:1.7;color:#4A3728;margin:0 0 8px;"><strong>Preferred:</strong> ${data.preferredTimeframe}</p>` : ""}
        <p style="font-size:14px;line-height:1.7;color:#4A3728;margin:0 0 8px;"><strong>Reason:</strong> ${data.reason}</p>
        ${data.note ? `<p style="font-size:14px;line-height:1.7;color:#4A3728;margin:0 0 8px;"><strong>Note:</strong> ${data.note}</p>` : ""}
        <hr style="border:none;border-top:1px solid #C8B8A2;margin:24px 0;" />
        <p style="font-size:12px;color:#8A7F72;margin:0;">Open Sanity Studio → Session Requests to respond.</p>
      </div>`;
    waitUntil(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: `Martina Rink <${fromEmail}>`,
          to: [notifyEmail],
          subject: `Session request — ${profile.firstName}${data.urgency === "soon" ? " (soon)" : ""}`,
          html,
        }),
      }).then((r) => { if (!r.ok) console.error("[session-request] email failed:", r.status); })
        .catch((e) => console.error("[session-request] email error:", e)),
    );
  }

  return NextResponse.json({ success: true });
}
