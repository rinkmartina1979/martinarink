/**
 * POST /api/webhooks/calendly-embed
 *
 * Free-tier Calendly booking notification handler.
 *
 * Called by CalendlyEmbed.tsx (client component) when the embed widget fires
 * the `calendly.event_scheduled` postMessage event. This replaces the server-
 * side webhook subscription (which requires a $10/mo Standard plan).
 *
 * What this does:
 *   1. Receives { eventUri, inviteeUri } from the browser
 *   2. Validates URI format (must start with https://api.calendly.com/)
 *   3. Fetches the full invitee object from Calendly REST API using PAT
 *   4. Fetches the scheduled event for start time + meeting link
 *   5. Fires Brevo `consultation_booked` event so automations run
 *   6. Sends Resend notification email to Martina
 *
 * Required env var: CALENDLY_PERSONAL_ACCESS_TOKEN (already set in Vercel)
 * Also uses: BREVO_API_KEY, RESEND_API_KEY, RESEND_NOTIFY_EMAIL, RESEND_FROM_EMAIL
 *
 * Why this is safe enough for a coaching-business booking flow:
 *   - URI validation prevents fetching arbitrary URLs
 *   - Calendly's API returns 404 for bogus URIs — no harm done
 *   - If attacker posts real URIs from a cancelled/past booking, Brevo gets a
 *     duplicate event — no PII is exposed, no money moves
 *   - Standard CORS in Next.js means only our origin can POST from a browser
 *     (a server-side POST from a bad actor still only gets a valid Calendly
 *     response, i.e. at most they "notify" us of a real booking — benign)
 */

import { NextRequest, NextResponse } from "next/server";
import { trackBrevoEvent, addBrevoContact } from "@/lib/brevo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CALENDLY_API_BASE = "https://api.calendly.com";
const CALENDLY_URI_PREFIX = "https://api.calendly.com/";

// ── Calendly REST API types ───────────────────────────────────────────

interface CalendlyInvitee {
  resource: {
    uri: string;
    email: string;
    name: string;
    first_name?: string;
    last_name?: string;
    cancel_url?: string;
    reschedule_url?: string;
    status: string; // "active" | "canceled"
    questions_and_answers?: Array<{
      question: string;
      answer: string;
      position: number;
    }>;
    tracking?: {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_term?: string;
      utm_content?: string;
      salesforce_uuid?: string | null;
    };
    created_at: string;
    updated_at: string;
    event?: string; // URI of the parent scheduled event
  };
}

interface CalendlyScheduledEvent {
  resource: {
    uri: string;
    name: string;
    status: string;
    start_time: string;
    end_time: string;
    event_type: string;
    location?: {
      type: string;
      location?: string;
      join_url?: string;
    };
    invitees_counter: {
      total: number;
      active: number;
      limit: number;
    };
    created_at: string;
    updated_at: string;
  };
}

// ── Fetch helpers ─────────────────────────────────────────────────────

async function calendlyGet<T>(
  uri: string,
  pat: string,
): Promise<T | null> {
  try {
    const res = await fetch(uri, {
      headers: {
        Authorization: `Bearer ${pat}`,
        "Content-Type": "application/json",
      },
      // 8s timeout — Calendly is fast; this protects against hangs
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error(
        `[calendly-embed] Calendly API ${res.status} for ${uri}`,
      );
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error("[calendly-embed] Calendly fetch error:", err);
    return null;
  }
}

// ── Resend notification ───────────────────────────────────────────────

async function notifyMartina(opts: {
  inviteeName: string;
  inviteeEmail: string;
  eventName: string;
  startTime: string;
  joinUrl?: string;
  utmSource?: string;
  qa: Array<{ question: string; answer: string }>;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail =
    process.env.RESEND_NOTIFY_EMAIL || process.env.RESEND_REPLY_TO;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "hello@martinarink.com";

  if (!apiKey || !notifyEmail) return;

  const qaRows = opts.qa
    .map(
      ({ question, answer }) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;color:#8A7F72;width:40%;vertical-align:top;">${question}</td>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;vertical-align:top;">${answer}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1E1B17;">
      <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8A7F72;margin-bottom:8px;">
        New consultation booked
      </p>
      <h2 style="font-size:22px;font-weight:normal;margin:0 0 8px;">
        ${opts.inviteeName}
      </h2>
      <p style="color:#8A7F72;font-size:13px;margin-bottom:24px;">
        ${opts.eventName} · ${new Date(opts.startTime).toLocaleString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Berlin",
        })} CET
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;color:#8A7F72;width:40%;">Email</td>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">${opts.inviteeEmail}</td>
        </tr>
        ${opts.utmSource ? `<tr><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;color:#8A7F72;">Came from</td><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">${opts.utmSource}</td></tr>` : ""}
        ${opts.joinUrl ? `<tr><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;color:#8A7F72;">Join link</td><td style="padding:8px 0;border-bottom:1px solid #C8B8A2;"><a href="${opts.joinUrl}" style="color:#5C2D8E;">${opts.joinUrl}</a></td></tr>` : ""}
        ${qaRows}
      </table>
      <p style="margin-top:24px;font-size:13px;color:#8A7F72;">
        Captured via embed postMessage — no Calendly plan upgrade required.
      </p>
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
        subject: `[Booking] ${opts.eventName} — ${opts.inviteeName}`,
        html,
      }),
    });
  } catch (err) {
    console.error("[calendly-embed] Resend notification failed:", err);
  }
}

// ── Route handler ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: { eventUri?: string; inviteeUri?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { eventUri, inviteeUri } = body;

  // Validate URI format — must be genuine Calendly API URIs
  if (
    typeof eventUri !== "string" ||
    typeof inviteeUri !== "string" ||
    !eventUri.startsWith(CALENDLY_URI_PREFIX) ||
    !inviteeUri.startsWith(CALENDLY_URI_PREFIX)
  ) {
    return NextResponse.json(
      { error: "Invalid or missing Calendly URIs" },
      { status: 400 },
    );
  }

  const pat = process.env.CALENDLY_PERSONAL_ACCESS_TOKEN;
  if (!pat) {
    // Degrade gracefully — log and 200 so the browser doesn't show an error
    console.error(
      "[calendly-embed] CALENDLY_PERSONAL_ACCESS_TOKEN not set — cannot fetch invitee details",
    );
    return NextResponse.json({ ok: true, warning: "PAT not configured" });
  }

  // Fetch both in parallel — Calendly is fast and both calls are independent
  const [inviteeData, eventData] = await Promise.all([
    calendlyGet<CalendlyInvitee>(inviteeUri, pat),
    calendlyGet<CalendlyScheduledEvent>(eventUri, pat),
  ]);

  if (!inviteeData?.resource) {
    console.error("[calendly-embed] Could not fetch invitee:", inviteeUri);
    // Return 200 — the booking is confirmed in Calendly regardless
    return NextResponse.json({ ok: true, warning: "Invitee fetch failed" });
  }

  const invitee = inviteeData.resource;
  const event = eventData?.resource;

  // Only process active bookings (not cancelled)
  if (invitee.status === "canceled") {
    return NextResponse.json({ ok: true, skipped: "canceled" });
  }

  const inviteeEmail = invitee.email;
  const inviteeName =
    invitee.first_name || invitee.name || "Client";

  const eventName = event?.name || "Private Consultation";
  const startTime = event?.start_time || new Date().toISOString();
  const joinUrl = event?.location?.join_url;
  const utmSource = invitee.tracking?.utm_source;

  // 1. Add/update Brevo contact
  await addBrevoContact({
    email: inviteeEmail,
    firstName: invitee.first_name || invitee.name?.split(" ")[0],
    attributes: {
      CONSULTATION_BOOKED: true,
      LAST_BOOKING_AT: new Date().toISOString(),
      ...(utmSource ? { SOURCE: utmSource } : {}),
    },
    updateEnabled: true,
  });

  // 2. Fire Brevo event (triggers the consultation_booked automation)
  await trackBrevoEvent({
    email: inviteeEmail,
    eventName: "consultation_booked",
    properties: {
      calendly_event: eventName,
      start_time: startTime,
      ...(utmSource ? { utm_source: utmSource } : {}),
    },
    contactProperties: {
      CONSULTATION_BOOKED: true,
      LAST_BOOKING_AT: new Date().toISOString(),
    },
  });

  // 3. Notify Martina via email (fire-and-forget)
  notifyMartina({
    inviteeName: invitee.name || inviteeName,
    inviteeEmail,
    eventName,
    startTime,
    joinUrl,
    utmSource,
    qa: (invitee.questions_and_answers || [])
      .sort((a, b) => a.position - b.position)
      .map(({ question, answer }) => ({ question, answer })),
  }).catch((err) =>
    console.error("[calendly-embed] Martina notification failed:", err),
  );

  console.log(
    `[calendly-embed] Processed booking: ${inviteeName} <${inviteeEmail}> for ${eventName}`,
  );

  return NextResponse.json({ ok: true });
}
