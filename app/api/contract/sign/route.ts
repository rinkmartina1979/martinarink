/**
 * POST /api/contract/sign
 *
 * Client submits their signature. Validates HMAC, fetches draft from Blob,
 * writes signed record, emails both parties, updates Brevo.
 *
 * Body: { contractId, sig, signedName }
 */

import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { put, del, head } from "@vercel/blob";
import { addBrevoContact, trackBrevoEvent } from "@/lib/brevo";
import { contractSignedEmail, intakeInviteEmail } from "@/lib/email-templates";

const SignSchema = z.object({
  contractId: z.string().uuid(),
  sig: z.string().min(1),
  signedName: z.string().min(2),
});

interface ContractDraft {
  contractId: string;
  email: string;
  firstName: string;
  programme: string;
  programmeLabel: string;
  serviceDescription: string;
  fee: string;
  deliveryMethod: string;
  location: string | null;
  contractDate: string;
  version: string;
  sentAt: string;
  status: string;
}

function verifySig(contractId: string, email: string, sig: string, secret: string): boolean {
  const expected = createHmac("sha256", secret)
    .update(`${contractId}|${email}`)
    .digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const contractSecret = process.env.CONTRACT_SECRET;
  if (!contractSecret) {
    console.error("[Contract/sign] CONTRACT_SECRET not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const { contractId, sig, signedName } = parsed.data;

  // ── Fetch draft from Vercel Blob ────────────────────────────────
  let draft: ContractDraft;
  try {
    // Use head() to check existence, then fetch the content
    const meta = await head(`contracts/drafts/${contractId}.json`).catch(() => null);
    if (!meta) {
      return NextResponse.json(
        { error: "Contract not found or already completed." },
        { status: 404 },
      );
    }
    // Fetch the blob content directly via its URL
    const res = await fetch(meta.url);
    if (!res.ok) {
      return NextResponse.json({ error: "Contract not found." }, { status: 404 });
    }
    draft = (await res.json()) as ContractDraft;
  } catch (err) {
    console.error("[Contract/sign] Blob fetch failed:", err);
    return NextResponse.json({ error: "Failed to retrieve contract." }, { status: 500 });
  }

  // Guard: already signed?
  if (draft.status === "signed") {
    return NextResponse.json(
      { error: "This contract has already been signed." },
      { status: 409 },
    );
  }

  // ── Verify HMAC signature ───────────────────────────────────────
  if (!verifySig(contractId, draft.email, sig, contractSecret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // ── Build signed record ─────────────────────────────────────────
  const signedAt = new Date().toISOString();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  const signedRecord = {
    ...draft,
    signedAt,
    signedName,
    signedIp: ip,
    userAgent,
    status: "signed",
  };

  // ── Write signed record to Blob ─────────────────────────────────
  try {
    await put(
      `contracts/signed/${contractId}.json`,
      JSON.stringify(signedRecord),
      { access: "public", contentType: "application/json" },
    );
    // Remove draft so repeated sign attempts return 404
    await del(`contracts/drafts/${contractId}.json`).catch(() => {
      // Non-fatal — even if del fails, signed record takes precedence
    });
  } catch (err) {
    console.error("[Contract/sign] Blob write failed:", err);
    return NextResponse.json({ error: "Failed to store signed contract." }, { status: 500 });
  }

  // ── Send signed contract emails via Resend ──────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "contact@martinarink.com";
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL ?? process.env.RESEND_REPLY_TO;

  const emailData = {
    firstName: draft.firstName,
    email: draft.email,
    programmeLabel: draft.programmeLabel,
    serviceDescription: draft.serviceDescription,
    fee: draft.fee,
    deliveryMethod: draft.deliveryMethod,
    location: draft.location ?? undefined,
    contractDate: draft.contractDate,
    contractId,
    signedAt,
    signedName,
  };

  if (resendKey) {
    // 1. Client copy
    const clientEmail = contractSignedEmail({ ...emailData, isInternal: false });
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: `Martina Rink <${fromEmail}>`,
        to: [draft.email],
        reply_to: notifyEmail,
        // Archive copy → Martina receives a copy of the client's signed contract.
        ...(notifyEmail && { bcc: [notifyEmail] }),
        subject: clientEmail.subject,
        html: clientEmail.html,
      }),
    }).catch((err) => console.error("[Contract/sign] Client email failed:", err));

    // 2. Internal copy to Martina
    if (notifyEmail) {
      const internalEmail = contractSignedEmail({ ...emailData, isInternal: true });
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: `Martina Rink <${fromEmail}>`,
          to: [notifyEmail],
          reply_to: draft.email,
          subject: internalEmail.subject,
          html: internalEmail.html,
        }),
      }).catch((err) => console.error("[Contract/sign] Internal email failed:", err));
    }

    // 3. AUTO: Intake form invite — fires immediately after signing.
    //    Eliminates Martina's manual "send intake link" step entirely.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://martinarink.com";
    const intakeUrl = `${siteUrl}/intake?programme=${encodeURIComponent(draft.programme)}`;
    const intake = intakeInviteEmail({
      firstName: draft.firstName,
      programmeLabel: draft.programmeLabel,
      intakeUrl,
    });
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: `Martina Rink <${fromEmail}>`,
        to: [draft.email],
        reply_to: notifyEmail ?? fromEmail,
        // Archive copy → Martina receives a copy of the intake invite.
        ...(notifyEmail && { bcc: [notifyEmail] }),
        subject: intake.subject,
        html: intake.html,
      }),
    }).catch((err) => console.error("[Contract/sign] Intake invite failed:", err));
  }

  // ── Brevo: update contact + fire contract_signed event ─────────────────────────
  addBrevoContact({
    email: draft.email,
    firstName: draft.firstName,
    attributes: {
      CONTRACT_STATUS: "signed",
      CONTRACT_ID: contractId,
      CONTRACT_SIGNED_AT: signedAt,
      INTAKE_STATUS: "invited",
    },
  }).catch((err) => console.error("[Contract/sign] Brevo contact failed:", err));

  trackBrevoEvent({
    email: draft.email,
    eventName: "contract_signed",
    properties: {
      programme: draft.programme,
      contract_id: contractId,
      signed_name: signedName,
    },
    contactProperties: {
      FIRSTNAME: draft.firstName,
      CONTRACT_STATUS: "signed",
      CONTRACT_ID: contractId,
      CONTRACT_SIGNED_AT: signedAt,
    },
  }).catch((err) => console.error("[Contract/sign] Brevo event failed:", err));

  return NextResponse.json({ success: true, contractId });
}
