/**
 * GET /api/accept?email=...&firstName=...&programme=...&sig=...
 *
 * One-click acceptance endpoint — called from the "Send booking link" button
 * in Martina's application notification email.
 *
 * On success:
 *   1. Sends the acceptance email (with /book?token=approved link) to the client
 *   2. Updates their Brevo status to APPLICATION_STATUS = "accepted"
 *   3. Redirects Martina to /accept-sent?name=firstName for confirmation
 *
 * Security: HMAC-SHA256 signature over "email|firstName|programme" using
 * ACCEPT_SECRET env var. Requests with invalid or missing sigs are rejected 403.
 */

import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { addBrevoContact, trackBrevoEvent } from "@/lib/brevo";
import { acceptanceEmail } from "@/lib/email-templates";

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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const email     = searchParams.get("email")     ?? "";
  const firstName = searchParams.get("firstName") ?? "";
  const programme = searchParams.get("programme") ?? "";
  const sig       = searchParams.get("sig")       ?? "";

  // ── Guard: require all params ──────────────────────────────
  if (!email || !firstName || !programme || !sig) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // ── Guard: verify HMAC signature ───────────────────────────
  const secret = process.env.ACCEPT_SECRET;
  if (!secret) {
    console.error("[Accept] ACCEPT_SECRET env var not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const expected = signPayload(email, firstName, programme, secret);
  if (!verifySignature(expected, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const programmeLabels: Record<string, string> = {
    "sober-muse": "The Sober Muse Method",
    empowerment:  "Female Empowerment & Leadership",
    consultation: "Private Consultation",
  };
  const programmeLabel = programmeLabels[programme] ?? programme;

  // ── Send acceptance email to client ───────────────────────
  const resendKey   = process.env.RESEND_API_KEY;
  const fromEmail   = process.env.RESEND_FROM_EMAIL   ?? "hello@martinarink.com";
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL ?? process.env.RESEND_REPLY_TO ?? "";

  if (resendKey) {
    const { subject, html } = acceptanceEmail({ firstName, programme: programme as "sober-muse" | "empowerment" | "consultation", programmeLabel });
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from:     `Martina Rink <${fromEmail}>`,
        to:       [email],
        reply_to: notifyEmail || fromEmail,
        subject,
        html,
      }),
    }).catch((err) => console.error("[Accept] Resend failed:", err));
  } else {
    console.warn("[Accept] RESEND_API_KEY not set — acceptance email skipped");
  }

  // ── Update Brevo contact status ────────────────────────────
  const listIdRaw = process.env.BREVO_LIST_ID_ASSESSMENT;
  if (listIdRaw) {
    addBrevoContact({
      email,
      firstName,
      listIds: [parseInt(listIdRaw, 10)],
      attributes: {
        APPLICATION_STATUS: "accepted",
      },
      updateEnabled: true,
    }).catch((err) => console.error("[Accept] Brevo update failed:", err));
  }

  trackBrevoEvent({
    email,
    eventName: "application_accepted",
    properties: { programme, programme_label: programmeLabel },
    contactProperties: {
      FIRSTNAME: firstName,
      APPLICATION_PROGRAMME: programme,
      APPLICATION_STATUS: "accepted",
    },
  }).catch((err) => console.error("[Accept] Brevo event failed:", err));

  // ── Redirect Martina to confirmation ──────────────────────
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://martinarink.com";
  const confirmUrl = new URL("/accept-sent", siteUrl);
  confirmUrl.searchParams.set("name", firstName);
  confirmUrl.searchParams.set("email", email);
  confirmUrl.searchParams.set("programme", programme);

  return NextResponse.redirect(confirmUrl, 302);
}
