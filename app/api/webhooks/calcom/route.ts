/**
 * POST /api/webhooks/calcom
 *
 * Cal.com webhook handler — the single booking-source-of-truth as of the
 * 2026 migration off Calendly. Unlike Calendly's free tier, Cal.com signs
 * webhooks on every plan including free, so this is a real server-verified
 * event rather than a client-side postMessage workaround.
 *
 * Events handled:
 *   - BOOKING_CREATED     → sets clientProfile.nextSessionAt + calcomBookingUid,
 *                           fires consultation_booked Brevo event, emails Martina
 *   - BOOKING_RESCHEDULED → updates nextSessionAt to the new time
 *   - BOOKING_CANCELLED   → clears nextSessionAt (only if the stored uid matches)
 *
 * Client matching: the booking's attendee email is matched against
 * clientProfile.email. Bookings from non-clients (e.g. the public €350
 * consultation funnel, before a clientProfile exists) still fire the Brevo
 * event + Martina notification, but skip the Sanity patch.
 *
 * Signature verification: Cal.com sends `X-Cal-Signature-256` — an HMAC-SHA256
 * hex digest of the raw request body, keyed with the webhook's signing secret
 * (shown once at creation in Cal.com → Settings → Developer → Webhooks).
 *
 * Webhook setup (one-time, by Martina):
 *   Cal.com → Settings → Developer → Webhooks → New
 *   Subscriber URL: https://martinarink.com/api/webhooks/calcom
 *   Events: BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED
 *   Secret: generate and store as CALCOM_WEBHOOK_SECRET in Vercel.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { trackBrevoEvent } from "@/lib/brevo";
import { consultationBookingEmail } from "@/lib/email-templates";
import { writeClient, hasWriteClient } from "@/sanity/lib/writeClient";
import { client as readClient } from "@/sanity/lib/client";

export const runtime = "nodejs"; // crypto.timingSafeEqual is not available on edge.
export const dynamic = "force-dynamic";

function verifyCalComSignature(
  rawBody: string,
  header: string | null,
  secret: string,
): boolean {
  if (!header) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(header, "hex"));
  } catch {
    return false;
  }
}

interface CalComAttendee {
  email?: string;
  name?: string;
  timeZone?: string;
}

interface CalComBookingPayload {
  uid?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  attendees?: CalComAttendee[];
  organizer?: { email?: string; name?: string };
  cancellationReason?: string;
  responses?: Record<string, { value?: string; label?: string }>;
  metadata?: Record<string, unknown>;
}

interface CalComWebhookBody {
  triggerEvent?: string;
  payload?: CalComBookingPayload;
}

async function notifyMartinaOfBooking(payload: CalComBookingPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || process.env.RESEND_REPLY_TO;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "contact@martinarink.com";
  if (!apiKey || !notifyEmail) return;

  const attendee = payload.attendees?.[0];
  if (!attendee?.email) return;

  const qaRows = Object.entries(payload.responses || {})
    .filter(([key]) => !["email", "name", "location"].includes(key))
    .map(([, v]) => ({ question: v.label || "Note", answer: v.value ? String(v.value) : "" }))
    .filter((row) => row.answer);

  const email = consultationBookingEmail({
    inviteeName: attendee.name || "Client",
    inviteeEmail: attendee.email,
    eventName: payload.title || "Session",
    startTime: payload.startTime || "(unknown time)",
    qaRows,
  });

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: `Martina Rink <${fromEmail}>`,
        to: [notifyEmail],
        reply_to: attendee.email,
        subject: email.subject,
        html: email.html,
      }),
    });
  } catch (err) {
    console.error("[Cal.com webhook] Resend notification failed:", err);
  }
}

async function patchClientSession(
  attendeeEmail: string,
  fields: { nextSessionAt: string | null; calcomBookingUid: string | null },
) {
  if (!hasWriteClient(writeClient)) return;
  try {
    const profile = await readClient.fetch<{ _id: string } | null>(
      `*[_type == "clientProfile" && email == $email][0] { _id }`,
      { email: attendeeEmail },
    );
    if (!profile) return; // not a client yet (e.g. pre-application consultation) — no-op
    await writeClient.patch(profile._id).set(fields).commit();
  } catch (err) {
    console.error("[Cal.com webhook] Sanity patch failed:", err);
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const secret = process.env.CALCOM_WEBHOOK_SECRET;

  if (!secret) {
    console.error("[Cal.com webhook] CALCOM_WEBHOOK_SECRET not set — rejecting.");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const sigHeader = req.headers.get("x-cal-signature-256");
  if (!verifyCalComSignature(rawBody, sigHeader, secret)) {
    console.warn("[Cal.com webhook] Invalid signature — rejecting.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: CalComWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { triggerEvent, payload } = body;
  if (!payload) return NextResponse.json({ ok: true });

  const attendee = payload.attendees?.[0];
  const attendeeEmail = attendee?.email;

  switch (triggerEvent) {
    case "BOOKING_CREATED":
    case "BOOKING_RESCHEDULED": {
      if (attendeeEmail && payload.startTime && payload.uid) {
        await patchClientSession(attendeeEmail, {
          nextSessionAt: payload.startTime,
          calcomBookingUid: payload.uid,
        });
        await trackBrevoEvent({
          email: attendeeEmail,
          eventName: "consultation_booked",
          properties: {
            calcom_event: payload.title || "",
            start_time: payload.startTime,
          },
          contactProperties: {
            BOOKING_STATUS: "booked",
            LAST_BOOKING_DATE: new Date().toISOString(),
          },
        });
      }
      notifyMartinaOfBooking(payload).catch((err) =>
        console.error("[Cal.com webhook] notify failed:", err),
      );
      break;
    }

    case "BOOKING_CANCELLED": {
      if (attendeeEmail) {
        // Only clear nextSessionAt if this cancellation matches the stored booking —
        // prevents a stale/duplicate cancellation event from wiping a newer booking.
        if (hasWriteClient(writeClient) && payload.uid) {
          try {
            const profile = await readClient.fetch<{ _id: string; calcomBookingUid: string | null } | null>(
              `*[_type == "clientProfile" && email == $email][0] { _id, calcomBookingUid }`,
              { email: attendeeEmail },
            );
            if (profile && profile.calcomBookingUid === payload.uid) {
              await writeClient.patch(profile._id).set({ nextSessionAt: null }).commit();
            }
          } catch (err) {
            console.error("[Cal.com webhook] cancellation patch failed:", err);
          }
        }
        await trackBrevoEvent({
          email: attendeeEmail,
          eventName: "consultation_canceled",
          properties: {
            calcom_event: payload.title || "",
            cancellation_reason: payload.cancellationReason || "",
          },
          contactProperties: { BOOKING_STATUS: "canceled" },
        });
      }
      break;
    }

    default:
      console.log("[Cal.com webhook] Unhandled event:", triggerEvent);
  }

  return NextResponse.json({ ok: true });
}
