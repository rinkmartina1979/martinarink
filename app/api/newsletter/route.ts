import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeNewsletter } from "@/lib/brevo";
import { newsletterWelcomeEmail } from "@/lib/email-templates";
import { BLOCKED_DOMAINS, isBotName, isRateLimited, getClientIp } from "@/lib/bot-detection";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// ─── Schema ───────────────────────────────────────────────────────────────────

const NewsletterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().max(60).optional(),
  consent: z.boolean().optional(),
  source: z.string().max(40).optional(),
  // Bot detection fields — sent by the form, never by real CRM callers
  _hp: z.string().optional(), // honeypot — must be empty
  _ts: z.number().optional(), // form-load timestamp — submission must be ≥3 s later
});

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = NewsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, firstName, source, _hp, _ts } = parsed.data;

  // ── Bot check 1: honeypot filled ─────────────────────────────────────────
  if (_hp && _hp.length > 0) {
    // Silent accept — don't tell bots they're blocked
    return NextResponse.json({ success: true });
  }

  // ── Bot check 2: submission too fast (<3 s from page load) ───────────────
  if (_ts && Date.now() - _ts < 3000) {
    return NextResponse.json({ success: true });
  }

  // ── Bot check 3: blocked domain ──────────────────────────────────────────
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (BLOCKED_DOMAINS.has(domain)) {
    console.warn(`[Newsletter] Blocked domain: ${domain}`);
    return NextResponse.json({ success: true });
  }

  // ── Bot check 4: random-string name ──────────────────────────────────────
  if (firstName && isBotName(firstName)) {
    console.warn(`[Newsletter] Bot name detected: ${firstName} <${email}>`);
    return NextResponse.json({ success: true });
  }

  // ── Bot check 5: IP rate limiting ────────────────────────────────────────
  const ip = getClientIp(req);
  if (isRateLimited("newsletter", ip, RATE_LIMIT, RATE_WINDOW_MS)) {
    console.warn(`[Newsletter] Rate limited: ${ip}`);
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  // ── Subscribe ─────────────────────────────────────────────────────────────
  const result = await subscribeNewsletter({ email, firstName, source });

  if (!result.success) {
    console.error("[Newsletter] Subscribe failed:", result.error);
    return NextResponse.json(
      { error: "Could not subscribe at this time. Please try again." },
      { status: 502 }
    );
  }

  // ── Instant welcome via Resend — new subscribers only ─────────────────────
  // Skipping this for already-subscribed contacts is what stops repeat
  // "Welcome" emails when the same address signs up from more than one form.
  if (result.created) {
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "contact@martinarink.com";
    const replyTo = process.env.RESEND_REPLY_TO || process.env.RESEND_NOTIFY_EMAIL;
    const archiveEmail = process.env.RESEND_NOTIFY_EMAIL;

    if (resendKey) {
      const welcome = newsletterWelcomeEmail(firstName);
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: `Martina Rink <${fromEmail}>`,
          to: [email],
          ...(replyTo && { reply_to: replyTo }),
          ...(archiveEmail && { bcc: [archiveEmail] }),
          subject: welcome.subject,
          html: welcome.html,
        }),
      }).catch((err) => console.error("[Newsletter] Resend welcome failed:", err));
    } else {
      console.warn("[Newsletter] RESEND_API_KEY not set — instant welcome skipped.");
    }
  }

  return NextResponse.json({ success: true });
}
