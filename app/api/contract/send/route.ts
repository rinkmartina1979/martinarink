/**
 * POST /api/contract/send
 *
 * Admin-only endpoint. Martina fills in programme details and sends
 * a HMAC-signed contract link to the client.
 *
 * Auth: ADMIN_SECRET checked in request body.
 * Storage: Vercel Blob — contracts/drafts/{contractId}.json
 */

import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { put } from "@vercel/blob";
import { addBrevoContact, trackBrevoEvent } from "@/lib/brevo";
import { contractInviteEmail } from "@/lib/email-templates";

const PROGRAMME_LABELS: Record<string, string> = {
  "sober-muse": "The Sober Muse Method",
  empowerment: "Female Empowerment & Leadership",
  consultation: "Private Consultation",
};

const SendSchema = z.object({
  adminSecret: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1),
  programme: z.enum(["sober-muse", "empowerment", "consultation"]),
  serviceDescription: z.string().min(10),
  fee: z.string().min(1),
  deliveryMethod: z.enum(["Online", "In-person", "Telephone"]),
  location: z.string().optional(),
  contractDate: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Auth check
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || parsed.data.adminSecret !== adminSecret) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contractSecret = process.env.CONTRACT_SECRET;
  if (!contractSecret) {
    console.error("[Contract/send] CONTRACT_SECRET not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const {
    email,
    firstName,
    programme,
    serviceDescription,
    fee,
    deliveryMethod,
    location,
    contractDate,
  } = parsed.data;

  const programmeLabel = PROGRAMME_LABELS[programme] ?? programme;
  const contractId = crypto.randomUUID();
  const sentAt = new Date().toISOString();

  // ── Store draft in Vercel Blob ──────────────────────────────────
  const draft = {
    contractId,
    email,
    firstName,
    programme,
    programmeLabel,
    serviceDescription,
    fee,
    deliveryMethod,
    location: location ?? null,
    contractDate,
    version: "1.0",
    sentAt,
    status: "sent",
  };

  try {
    await put(`contracts/drafts/${contractId}.json`, JSON.stringify(draft), {
      access: "public",
      contentType: "application/json",
    });
  } catch (err) {
    console.error("[Contract/send] Blob write failed:", err);
    return NextResponse.json({ error: "Failed to store contract" }, { status: 500 });
  }

  // ── Build HMAC-signed contract URL ──────────────────────────────
  const sig = createHmac("sha256", contractSecret)
    .update(`${contractId}|${email}`)
    .digest("hex");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://martinarink.com";
  const contractUrl = `${siteUrl}/contract/${contractId}?sig=${sig}`;

  // ── Send contract invite email via Resend ───────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "hello@martinarink.com";
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL ?? process.env.RESEND_REPLY_TO;

  if (resendKey) {
    const invite = contractInviteEmail({ firstName, programmeLabel, contractUrl });
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: `Martina Rink <${fromEmail}>`,
        to: [email],
        reply_to: notifyEmail,
        subject: invite.subject,
        html: invite.html,
      }),
    }).catch((err) => console.error("[Contract/send] Resend failed:", err));
  }

  // ── Brevo: update contact + fire event ─────────────────────────
  addBrevoContact({
    email,
    firstName,
    attributes: {
      CONTRACT_STATUS: "sent",
      CONTRACT_ID: contractId,
    },
  }).catch((err) => console.error("[Contract/send] Brevo contact failed:", err));

  trackBrevoEvent({
    email,
    eventName: "contract_sent",
    properties: { programme, contract_id: contractId },
    contactProperties: {
      FIRSTNAME: firstName,
      CONTRACT_STATUS: "sent",
      CONTRACT_ID: contractId,
    },
  }).catch((err) => console.error("[Contract/send] Brevo event failed:", err));

  return NextResponse.json({ success: true, contractId, contractUrl });
}
