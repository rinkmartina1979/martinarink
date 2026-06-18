/**
 * GET /api/accept?email=...&firstName=...&programme=...&sig=...
 *
 * One-click acceptance — Martina's single action in the entire onboarding chain.
 *
 * What fires on one click:
 *   1. Acceptance email → client (booking link /book?token=approved)
 *   2. Coaching contract → client (HMAC-signed link, template pre-filled)
 *   3. Brevo contact updated → APPLICATION_STATUS = "accepted", CONTRACT_STATUS = "sent"
 *   4. Brevo events: application_accepted + contract_sent
 *   5. Redirect → /accept-sent (confirmation, contract customisation available if needed)
 *
 * What fires automatically without Martina doing anything else:
 *   - When client signs the contract → intake form invite fires (see /api/contract/sign)
 *   - When client submits intake    → Martina receives intake email (see /api/intake)
 *
 * Security: HMAC-SHA256 over "email|firstName|programme" using ACCEPT_SECRET.
 */

import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { addBrevoContact, trackBrevoEvent } from "@/lib/brevo";
import {
  acceptanceEmail,
  contractInviteEmail,
  SERVICE_DESCRIPTION_TEMPLATES,
} from "@/lib/email-templates";

// ── Constants ──────────────────────────────────────────────────────────────

const PROGRAMME_LABELS: Record<string, string> = {
  "sober-muse": "The Sober Muse Method",
  empowerment:  "Female Empowerment & Leadership",
  consultation: "Private Consultation",
};

const PROGRAMME_FEES: Record<string, string> = {
  "sober-muse": "€5,000",
  empowerment:  "€7,500",
  consultation: "€450",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function signPayload(email: string, firstName: string, programme: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`${email}|${firstName}|${programme}`)
    .digest("hex");
}

function verifySignature(expected: string, actual: string): boolean {
  if (expected.length !== actual.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
  } catch {
    return false;
  }
}

function todayGerman(): string {
  return new Date().toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function sendEmail(
  resendKey: string,
  payload: {
    from: string;
    to: string[];
    reply_to?: string;
    bcc?: string[];
    subject: string;
    html: string;
  },
  label: string,
): Promise<void> {
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error(`[Accept] ${label} email failed:`, err);
  }
}

// ── Route ──────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const email     = searchParams.get("email")     ?? "";
  const firstName = searchParams.get("firstName") ?? "";
  const programme = searchParams.get("programme") ?? "";
  const sig       = searchParams.get("sig")       ?? "";

  if (!email || !firstName || !programme || !sig) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const secret = process.env.ACCEPT_SECRET;
  if (!secret) {
    console.error("[Accept] ACCEPT_SECRET not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const expected = signPayload(email, firstName, programme, secret);
  if (!verifySignature(expected, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const programmeLabel = PROGRAMME_LABELS[programme] ?? programme;
  const resendKey      = process.env.RESEND_API_KEY ?? "";
  const fromEmail      = process.env.RESEND_FROM_EMAIL   ?? "hello@martinarink.com";
  const notifyEmail    = process.env.RESEND_NOTIFY_EMAIL ?? process.env.RESEND_REPLY_TO ?? "";
  const siteUrl        = process.env.NEXT_PUBLIC_SITE_URL ?? "https://martinarink.com";

  // ── 1. Acceptance email → client ──────────────────────────────────────
  if (resendKey) {
    const { subject, html } = acceptanceEmail({
      firstName,
      programme: programme as "sober-muse" | "empowerment" | "consultation",
      programmeLabel,
    });
    // Awaited — booking link must land before anything else
    await sendEmail(resendKey, {
      from:     `Martina Rink <${fromEmail}>`,
      to:       [email],
      reply_to: notifyEmail || fromEmail,
      ...(notifyEmail && { bcc: [notifyEmail] }),
      subject,
      html,
    }, "Acceptance");
  }

  // ── 2. Auto-send coaching contract ────────────────────────────────────
  //
  //    Programme templates are professionally written for each track.
  //    Martina can resend with a custom description from /accept-sent
  //    if she wants to personalise — but in most cases the template
  //    is sufficient and fires without her touching anything.
  //
  let contractSent = false;
  const contractSecret = process.env.CONTRACT_SECRET;

  if (contractSecret && resendKey) {
    const contractId    = crypto.randomUUID();
    const sentAt        = new Date().toISOString();

    const draft = {
      contractId,
      email,
      firstName,
      programme,
      programmeLabel,
      serviceDescription:
        SERVICE_DESCRIPTION_TEMPLATES[programme] ??
        SERVICE_DESCRIPTION_TEMPLATES["sober-muse"],
      fee:            PROGRAMME_FEES[programme] ?? "€5,000",
      deliveryMethod: "Online",
      location:       null,
      contractDate:   todayGerman(),
      version:        "1.0",
      sentAt,
      status:         "sent",
      autoSent:       true,   // flag: sent automatically, not via admin form
    };

    try {
      // Await blob write — contract must exist before client can sign
      await put(
        `contracts/drafts/${contractId}.json`,
        JSON.stringify(draft),
        { access: "public", contentType: "application/json" },
      );

      // Build HMAC-signed contract URL
      const contractSig = createHmac("sha256", contractSecret)
        .update(`${contractId}|${email}`)
        .digest("hex");
      const contractUrl = `${siteUrl}/contract/${contractId}?sig=${contractSig}`;

      // Fire invite email (non-blocking — redirect doesn't depend on this)
      const invite = contractInviteEmail({ firstName, programmeLabel, contractUrl });
      sendEmail(resendKey, {
        from:     `Martina Rink <${fromEmail}>`,
        to:       [email],
        reply_to: notifyEmail || fromEmail,
        ...(notifyEmail && { bcc: [notifyEmail] }),
        subject:  invite.subject,
        html:     invite.html,
      }, "Contract invite").catch(() => {/* already logged inside */});

      contractSent = true;

      // Track contract sent
      trackBrevoEvent({
        email,
        eventName:        "contract_sent",
        properties:       { programme, contract_id: contractId, auto_sent: true },
        contactProperties: {
          CONTRACT_STATUS: "sent",
          CONTRACT_ID:     contractId,
        },
      }).catch((err) => console.error("[Accept] Brevo contract_sent failed:", err));

    } catch (err) {
      console.error("[Accept] Auto contract send failed:", err);
      // Non-fatal — Martina can resend from /accept-sent
    }
  }

  // ── 3. Brevo: update contact ───────────────────────────────────────────
  const listIdRaw = process.env.BREVO_LIST_ID_ASSESSMENT;
  addBrevoContact({
    email,
    firstName,
    ...(listIdRaw && { listIds: [parseInt(listIdRaw, 10)] }),
    attributes: {
      APPLICATION_STATUS: "accepted",
      ...(contractSent && { CONTRACT_STATUS: "sent" }),
    },
    updateEnabled: true,
  }).catch((err) => console.error("[Accept] Brevo contact update failed:", err));

  // ── 4. Brevo: fire application_accepted event ──────────────────────────
  trackBrevoEvent({
    email,
    eventName: "application_accepted",
    properties: { programme, programme_label: programmeLabel },
    contactProperties: {
      FIRSTNAME:              firstName,
      APPLICATION_PROGRAMME:  programme,
      APPLICATION_STATUS:     "accepted",
    },
  }).catch((err) => console.error("[Accept] Brevo event failed:", err));

  // ── 5. Generate admin_token for resend-with-custom-description ─────────
  //    Scoped to this client/programme, valid 48 h (today + yesterday check).
  const dateStr    = new Date().toISOString().slice(0, 10);
  const adminToken = createHmac("sha256", secret)
    .update(`${email}|${firstName}|${programme}|${dateStr}`)
    .digest("hex");

  // ── 6. Redirect → confirmation page ───────────────────────────────────
  const confirmUrl = new URL("/accept-sent", siteUrl);
  confirmUrl.searchParams.set("name",           firstName);
  confirmUrl.searchParams.set("email",          email);
  confirmUrl.searchParams.set("programme",      programme);
  confirmUrl.searchParams.set("admin_token",    adminToken);
  confirmUrl.searchParams.set("contract_sent",  contractSent ? "1" : "0");

  return NextResponse.redirect(confirmUrl, 302);
}
