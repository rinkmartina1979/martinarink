import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeNewsletter } from "@/lib/brevo";
import { newsletterWelcomeEmail } from "@/lib/email-templates";

const NewsletterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  consent: z.boolean().optional(),
  // Where the signup came from — "newsletter-form" (default), "popup",
  // "footer", "blog-post", etc. Surfaces in Brevo as the SOURCE attribute.
  source: z.string().max(40).optional(),
});

export async function POST(req: NextRequest) {
  let body;
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

  const result = await subscribeNewsletter({
    email: parsed.data.email,
    firstName: parsed.data.firstName,
    source: parsed.data.source,
  });

  if (!result.success) {
    // Don't expose internal errors to the client
    console.error("[Newsletter] Subscribe failed:", result.error);
    return NextResponse.json(
      { error: "Could not subscribe at this time. Please try again." },
      { status: 502 }
    );
  }

  // ── Instant welcome via Resend ────────────────────────────────
  // Guaranteed first-touch. Fired directly from code so the subscriber
  // always receives an immediate, on-brand confirmation — it does NOT
  // depend on a Brevo automation firing. Brevo owns the scheduled drip
  // (letters 2+); this owns "Letter 1". Fire-and-forget: never blocks
  // the success response.
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@martinarink.com";
  const replyTo = process.env.RESEND_REPLY_TO || process.env.RESEND_NOTIFY_EMAIL;
  // Archive copy — Martina receives a copy of every confirmation at contact@.
  const archiveEmail = process.env.RESEND_NOTIFY_EMAIL;
  if (resendKey) {
    const welcome = newsletterWelcomeEmail(parsed.data.firstName);
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: `Martina Rink <${fromEmail}>`,
        to: [parsed.data.email],
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
