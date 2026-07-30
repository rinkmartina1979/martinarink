/**
 * POST /api/apply
 *
 * Receives application form submissions for both programmes.
 * Sends internal notification via Resend.
 * Adds applicant to Brevo Assessment Leads list with APPLICATION_STATUS attribute.
 */

import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { z } from "zod";
import { addBrevoContact, trackBrevoEvent } from "@/lib/brevo";
import {
  applicationConfirmationEmail,
  applicationNotificationEmail,
} from "@/lib/email-templates";
import {
  BLOCKED_DOMAINS,
  isBotName,
  isGibberishText,
  isRateLimited,
  getClientIp,
} from "@/lib/bot-detection";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const ApplySchema = z.object({
  firstName: z.string().min(1),
  email: z.string().email(),
  tier: z.string().min(1),
  q1: z.string().min(10),
  q2: z.string().min(10),
  q3: z.string().min(1),
  q4: z.string().min(10),
  q5: z.string().min(1),
  consent: z.literal(true),
  programme: z.enum(["sober-muse", "empowerment"]),
  // Bot detection fields — sent by the form, never by real CRM callers
  _hp: z.string().optional(), // honeypot — must be empty
  _ts: z.number().optional(), // form-load timestamp — submission must be ≥5 s later
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ApplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { firstName, email, tier, q1, q2, q3, q4, q5, programme, _hp, _ts } = parsed.data;

  // ── Bot check 1: honeypot filled ─────────────────────────────────────────
  if (_hp && _hp.length > 0) {
    return NextResponse.json({ success: true });
  }

  // ── Bot check 2: submission too fast (<5 s from page load) ───────────────
  // Applications take longer to fill honestly than a newsletter signup, so
  // the floor is higher than the newsletter form's 3 s.
  if (_ts && Date.now() - _ts < 5000) {
    return NextResponse.json({ success: true });
  }

  // ── Bot check 3: blocked domain ──────────────────────────────────────────
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (BLOCKED_DOMAINS.has(domain)) {
    console.warn(`[Apply] Blocked domain: ${domain}`);
    return NextResponse.json({ success: true });
  }

  // ── Bot check 4: random-string name ──────────────────────────────────────
  if (isBotName(firstName)) {
    console.warn(`[Apply] Bot name detected: ${firstName} <${email}>`);
    return NextResponse.json({ success: true });
  }

  // ── Bot check 5: gibberish free-text answers ──────────────────────────────
  // Real applicants write sentences. Fuzzers send random character strings
  // like "ACGcDCpbCEXCGhFgiQMPeqc" into the long-form questions.
  if (isGibberishText(q1) || isGibberishText(q2) || isGibberishText(q4)) {
    console.warn(`[Apply] Gibberish answer detected from: ${email}`);
    return NextResponse.json({ success: true });
  }

  // ── Bot check 6: IP rate limiting ────────────────────────────────────────
  const ip = getClientIp(req);
  if (isRateLimited("apply", ip, RATE_LIMIT, RATE_WINDOW_MS)) {
    console.warn(`[Apply] Rate limited: ${ip}`);
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  // Derive a quick-glance budget tag for the notification
  const budgetTag = q5.startsWith("Yes —")
    ? "READY"
    : q5.startsWith("Yes, with")
    ? "READY-PAYMENT-PLAN"
    : "NOT-YET";

  const programmeLabels: Record<string, string> = {
    "sober-muse": "The Sober Muse Method",
    empowerment: "Female Empowerment & Leadership",
  };
  const programmeLabel = programmeLabels[programme];

  // ── Build one-click accept URL ────────────────────────────
  const acceptSecret = process.env.ACCEPT_SECRET;
  let acceptUrl: string | undefined;
  if (acceptSecret) {
    const sig = createHmac("sha256", acceptSecret)
      .update(`${email}|${firstName}|${programme}`)
      .digest("hex");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://martinarink.com";
    const url = new URL("/api/accept", siteUrl);
    url.searchParams.set("email", email);
    url.searchParams.set("firstName", firstName);
    url.searchParams.set("programme", programme);
    url.searchParams.set("sig", sig);
    acceptUrl = url.toString();
  }

  // ── Resend: internal notification + applicant confirmation ──
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || process.env.RESEND_REPLY_TO;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "contact@martinarink.com";
  const fromName = "Martina Rink";

  if (resendKey && notifyEmail) {
    // 1. Internal notification to Martina — uses branded template
    const notification = applicationNotificationEmail({
      firstName,
      email,
      programme,
      programmeLabel,
      tier,
      budgetTag,
      q1,
      q2,
      q3,
      q4,
      q5,
      submittedAt: new Date().toISOString(),
      acceptUrl,
    });

    waitUntil(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [notifyEmail],
          reply_to: email,
          subject: notification.subject,
          html: notification.html,
        }),
      }).catch((err) => console.error("[Apply] Resend notification failed:", err))
    );

    // 2. Confirmation to the applicant — bridges the 48-hour wait
    const confirmation = applicationConfirmationEmail({ firstName, programme, programmeLabel });

    waitUntil(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [email],
          reply_to: notifyEmail,
          // Archive copy → Martina receives a copy of the applicant confirmation.
          ...(notifyEmail && { bcc: [notifyEmail] }),
          subject: confirmation.subject,
          html: confirmation.html,
        }),
      }).catch((err) => console.error("[Apply] Resend confirmation failed:", err))
    );
  } else {
    console.warn("[Apply] RESEND_API_KEY or RESEND_NOTIFY_EMAIL not configured — emails skipped.");
  }

  // ── Brevo: add applicant to Assessment Leads list ────────
  const listIdRaw = process.env.BREVO_LIST_ID_ASSESSMENT;
  if (listIdRaw) {
    waitUntil(
      addBrevoContact({
        email,
        firstName,
        listIds: [parseInt(listIdRaw, 10)],
        attributes: {
          SOURCE:               "application",
          APPLICATION_STATUS:   "submitted",
          APPLICATION_PROGRAMME: programme,
          APPLICATION_TIER:     tier,
          BUDGET_READINESS:     budgetTag,
        },
      }).catch((err) => console.error("[Apply] Brevo contact failed:", err))
    );
  }

  // ── Brevo: fire application_submitted event ───────────────
  // This event drives the applicant-facing autoresponder automation —
  // an immediate, personal-feeling confirmation that bridges the 48hr wait.
  // Without this, applicants sit in silence and second-guess. Largest
  // single conversion leak in the funnel prior to this hook.
  waitUntil(
    trackBrevoEvent({
      email,
      eventName: "application_submitted",
      properties: {
        programme,
        programme_label: programmeLabel,
        tier,
        budget_readiness: budgetTag,
      },
      contactProperties: {
        FIRSTNAME: firstName,
        APPLICATION_PROGRAMME: programme,
        APPLICATION_TIER: tier,
        APPLICATION_STATUS: "submitted",
        BUDGET_READINESS: budgetTag,
      },
    }).catch((err) => console.error("[Apply] Brevo event failed:", err))
  );

  return NextResponse.json({ success: true });
}
