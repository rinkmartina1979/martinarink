/**
 * POST /api/webhooks/calendly
 *
 * Calendly v2 webhook handler. v1 was deprecated May 2025 — this endpoint
 * uses the v2 signed-payload model.
 *
 * Events handled:
 *   - invitee.created          → consultation_booked
 *   - invitee.canceled         → consultation_canceled
 *   - invitee_no_show.created  → consultation_no_show
 *
 * For each event we:
 *   1. Verify the Calendly-Webhook-Signature header (HMAC-SHA256)
 *   2. Fire a Brevo event so any automation listening on the email runs
 *   3. (booked only) email Martina a Resend notification
 *
 * Webhook setup (one-time, by Martina):
 *   POST https://api.calendly.com/webhook_subscriptions
 *   Body: {
 *     url: "https://martinarink.com/api/webhooks/calendly",
 *     events: ["invitee.created", "invitee.canceled", "invitee_no_show.created"],
 *     organization: "<her org URI>",
 *     scope: "user",
 *     user: "<her user URI>"
 *   }
 *   The response includes `signing_key` — store it as CALENDLY_WEBHOOK_SIGNING_KEY.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { trackBrevoEvent } from "@/lib/brevo";

export const runtime = "nodejs"; // crypto.timingSafeEqual is not available on edge.
export const dynamic = "force-dynamic";

// Calendly signature header looks like: "t=1700000000,v1=<hex_hmac>"
function parseSignatureHeader(header: string | null): {
  timestamp: string;
  signature: string;
} | null {
  if (!header) return null;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const [k, ...rest] = kv.split("=");
      return [k.trim(), rest.join("=").trim()];
    }),
  );
  if (!parts.t || !parts.v1) return null;
  return { timestamp: parts.t, signature: parts.v1 };
}

function verifyCalendlySignature(
  rawBody: string,
  header: string | null,
  signingKey: string,
): boolean {
  const parsed = parseSignatureHeader(header);
  if (!parsed) return false;

  const { timestamp, signature } = parsed;
  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", signingKey)
    .update(payload)
    .digest("hex");

  // Reject anything older than 5 minutes — replay protection.
  const ageSec = Math.abs(Math.floor(Date.now() / 1000) - parseInt(timestamp, 10));
  if (ageSec > 300) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signature, "hex"),
    );
  } catch {
    return false;
  }
}

interface CalendlyInviteePayload {
  event: string;
  payload: {
    email?: string;
    name?: string;
    first_name?: string;
    cancel_url?: string;
    reschedule_url?: string;
    rescheduled?: boolean;
    cancellation?: { reason?: string; canceled_by?: string };
    scheduled_event?: {
      uri?: string;
      name?: string;
      start_time?: string;
      end_time?: string;
      location?: { type?: string; location?: string; join_url?: string };
    };
    questions_and_answers?: Array<{ question: string; answer: string }>;
    tracking?: { utm_source?: string; utm_medium?: string; utm_campaign?: string };
  };
}

async function notifyMartinaOfBooking(payload: CalendlyInviteePayload["payload"]) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail =
    process.env.RESEND_NOTIFY_EMAIL || process.env.RESEND_REPLY_TO;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "hello@martinarink.com";

  if (!apiKey || !notifyEmail) return;

  const inviteeName = payload.first_name || payload.name || "Client";
  const inviteeEmail = payload.email || "(no email)";
  const eventName = payload.scheduled_event?.name || "Consultation";
  const startTime = payload.scheduled_event?.start_time || "(unknown time)";
  const joinUrl = payload.scheduled_event?.location?.join_url;
  const utmSource = payload.tracking?.utm_source;

  const qaRows = (payload.questions_and_answers || [])
    .map(
      ({ question, answer }) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;color:#8A7F72;width:40%;">${question}</td><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">${answer}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1E1B17;">
      <h2 style="font-size:22px;font-weight:normal;margin-bottom:8px;">
        New consultation booked — ${inviteeName}
      </h2>
      <p style="color:#8A7F72;font-size:13px;margin-bottom:24px;">
        ${eventName} · ${startTime}
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        <tr><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;color:#8A7F72;width:40%;">Email</td><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">${inviteeEmail}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;color:#8A7F72;">Name</td><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">${payload.name || ""}</td></tr>
        ${utmSource ? `<tr><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;color:#8A7F72;">Came from</td><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">${utmSource}</td></tr>` : ""}
        ${joinUrl ? `<tr><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;color:#8A7F72;">Join link</td><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;"><a href="${joinUrl}" style="color:#5C2D8E;">${joinUrl}</a></td></tr>` : ""}
        ${qaRows}
      </table>
    </div>
  `;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notifyEmail],
        subject: `[Booking] ${eventName} — ${inviteeName}`,
        html,
      }),
    });
  } catch (err) {
    console.error("[Calendly webhook] Resend notification failed:", err);
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

  // If no signing key is configured, fail closed — never accept unsigned events.
  if (!signingKey) {
    console.error(
      "[Calendly webhook] CALENDLY_WEBHOOK_SIGNING_KEY not set — rejecting.",
    );
    return NextResponse.json(
      { error: "Webhook signing key not configured" },
      { status: 503 },
    );
  }

  const sigHeader = req.headers.get("calendly-webhook-signature");
  if (!verifyCalendlySignature(rawBody, sigHeader, signingKey)) {
    console.warn("[Calendly webhook] Invalid signature — rejecting.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: CalendlyInviteePayload;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = body.event;
  const inviteeEmail = body.payload?.email;

  if (!inviteeEmail) {
    // Some Calendly events (e.g. routing forms with no invitee yet) lack email.
    console.log("[Calendly webhook] No email in payload — acknowledging only.");
    return NextResponse.json({ ok: true });
  }

  const eventProps: Record<string, string | number | boolean> = {
    calendly_event: body.payload?.scheduled_event?.name || "",
    start_time: body.payload?.scheduled_event?.start_time || "",
  };
  if (body.payload?.tracking?.utm_source) {
    eventProps.utm_source = body.payload.tracking.utm_source;
  }

  // Map Calendly events → Brevo events
  switch (eventType) {
    case "invitee.created":
      await trackBrevoEvent({
        email: inviteeEmail,
        eventName: "consultation_booked",
        properties: eventProps,
        contactProperties: {
          CONSULTATION_BOOKED: true,
          LAST_BOOKING_AT: new Date().toISOString(),
        },
      });
      // Email Martina — fire-and-forget so we always 200 to Calendly.
      notifyMartinaOfBooking(body.payload).catch((err) =>
        console.error("[Calendly webhook] notify failed:", err),
      );
      break;

    case "invitee.canceled":
      await trackBrevoEvent({
        email: inviteeEmail,
        eventName: "consultation_canceled",
        properties: {
          ...eventProps,
          cancellation_reason: body.payload?.cancellation?.reason || "",
        },
        contactProperties: {
          CONSULTATION_BOOKED: false,
        },
      });
      break;

    case "invitee_no_show.created":
      await trackBrevoEvent({
        email: inviteeEmail,
        eventName: "consultation_no_show",
        properties: eventProps,
      });
      break;

    default:
      console.log("[Calendly webhook] Unhandled event:", eventType);
  }

  return NextResponse.json({ ok: true });
}
