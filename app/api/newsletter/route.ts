import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeNewsletter } from "@/lib/brevo";
import { newsletterWelcomeEmail } from "@/lib/email-templates";

// ─── Bot-detection helpers ────────────────────────────────────────────────────

// Known spam / disposable / bot-network domains (update as new attacks emerge)
const BLOCKED_DOMAINS = new Set([
  // Seen in the list-bombing attack (June 2026)
  "chameleongroup.co",
  "a7.ru",
  "a7goldinvest.ru",
  "a7gi.ru",
  // Common disposable mail providers
  "mailnull.com", "spamgourmet.com", "guerrillamail.com", "guerrillamail.net",
  "guerrillamail.org", "guerrillamail.biz", "guerrillamail.de", "guerrillamail.info",
  "trashmail.com", "trashmail.net", "trashmail.at", "trashmail.io",
  "yopmail.com", "yopmail.fr", "cool.fr.nf", "jetable.fr.nf",
  "nospam.ze.tc", "nomail.xl.cx", "mega.zik.dj", "speed.1s.fr",
  "courriel.fr.nf", "moncourrier.fr.nf", "monemail.fr.nf",
  "mailinator.com", "mailinator.net", "suremail.info",
  "spamfree24.org", "spamfree24.de", "spamfree24.eu", "spamfree24.info",
  "spamfree24.net", "spamfree24.com",
  "dispostable.com", "mailnesia.com", "mailnull.com",
  "spam4.me", "sharklasers.com", "guerillmail.info",
  "grr.la", "guerillamail.com", "spam.la",
  "throwam.com", "throwam.net", "throwem.com",
  "temp-mail.org", "tempmail.com", "fakemail.net",
  "10minutemail.com", "10minutemail.net", "10minutemail.org",
  "20minutemail.com", "throwaway.email",
  "vtext.com",     // SMS-to-email gateway, not a real inbox
]);

// Detect random-string names: mixed-case runs, no real word shape
// Real names: "Sarah", "Anne-Marie", "Björn", "McDonald" — at most 2 uppercase mid-word
// Bot names: "MoVzeAHYIObPRIoMwtqqMrSj" — many uppercase scattered through a long string
function isBotName(name: string): boolean {
  if (!name || name.length <= 2) return false;
  if (name.length > 30) return true; // no real first name is 30+ chars
  // Count uppercase letters beyond the first character
  const innerUpper = (name.slice(1).match(/[A-Z]/g) ?? []).length;
  // >2 uppercase mid-word AND long → random string pattern
  if (innerUpper > 2 && name.length > 12) return true;
  return false;
}

// Simple in-process rate limiter: max 5 subscriptions per IP per 10 minutes.
// Resets on cold start — intentional. Complements honeypot/name checks.
const ipRateMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRateMap.get(ip);
  if (!record || now - record.windowStart > RATE_WINDOW_MS) {
    ipRateMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  record.count += 1;
  if (record.count > RATE_LIMIT) return true;
  return false;
}

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
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
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

  // ── Instant welcome via Resend ────────────────────────────────────────────
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

  return NextResponse.json({ success: true });
}
