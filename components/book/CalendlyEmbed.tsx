"use client";

/**
 * CalendlyEmbed — wraps the Calendly inline widget with a postMessage listener.
 *
 * HOW THE FREE-TIER WORKAROUND WORKS:
 * ─────────────────────────────────────
 * Calendly's Standard plan ($10/mo) exposes a webhook subscription API that
 * pushes signed payloads to our server. On the Free plan that API returns 403.
 *
 * However, the Calendly embed widget (the <iframe>) fires `window.postMessage`
 * events to the **parent window** whenever a booking is completed. This is part
 * of their public embed API and works on ALL plans, including Free.
 *
 * The event shape:
 *   {
 *     event: "calendly.event_scheduled",
 *     payload: {
 *       event:   { uri: "https://api.calendly.com/scheduled_events/<uuid>" },
 *       invitee: { uri: "https://api.calendly.com/scheduled_events/<uuid>/invitees/<uuid>" }
 *     }
 *   }
 *
 * The payload does NOT include PII (email, name) — it only includes URIs.
 * Our API route `/api/webhooks/calendly-embed` fetches the full invitee object
 * via those URIs using our PAT (CALENDLY_PERSONAL_ACCESS_TOKEN), then fires
 * the same Brevo `consultation_booked` event and Resend notification as the
 * server-side webhook handler would have.
 *
 * Security: The embed can only be rendered from our domain. The API route
 * validates that both URIs start with `https://api.calendly.com/` before
 * fetching — so a bad actor posting fake URIs either gets a 404 from Calendly
 * or a response that does not match our expected schema (no email → no Brevo
 * event fires). There is no signing key, but there is no payload spoofing
 * vector worth meaningful concern for a coaching-business booking flow.
 *
 * Docs: https://developer.calendly.com/api-docs/ZG9jOjI3ODM2MTY-notificationand-embeds
 */

import { useEffect, useRef } from "react";

interface CalendlyPostMessagePayload {
  event: string;
  payload?: {
    event?: { uri?: string };
    invitee?: { uri?: string };
  };
}

interface CalendlyEmbedProps {
  /** Full Calendly URL — e.g. https://calendly.com/martinarink/let-s-make-a-change */
  url: string;
  /** Optional: fires in the browser after a booking so the parent can show a thank-you message */
  onBooked?: (eventUri: string, inviteeUri: string) => void;
}

export function CalendlyEmbed({ url, onBooked }: CalendlyEmbedProps) {
  /**
   * postedRef prevents double-firing in React 18 StrictMode (effects run twice
   * in dev). In production this is never triggered.
   */
  const postedRef = useRef(false);

  useEffect(() => {
    function handleMessage(e: MessageEvent<CalendlyPostMessagePayload>) {
      // Only handle Calendly messages
      if (
        !e.data ||
        typeof e.data !== "object" ||
        e.data.event !== "calendly.event_scheduled"
      ) {
        return;
      }

      // Dedupe in StrictMode dev double-mount
      if (postedRef.current) return;
      postedRef.current = true;

      const eventUri = e.data.payload?.event?.uri;
      const inviteeUri = e.data.payload?.invitee?.uri;

      if (!eventUri || !inviteeUri) {
        console.warn(
          "[CalendlyEmbed] Received calendly.event_scheduled but URIs are missing",
          e.data,
        );
        return;
      }

      // Notify server — fire-and-forget, never block the UX
      fetch("/api/webhooks/calendly-embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventUri, inviteeUri }),
      }).catch((err) => {
        // Silent fail — the booking is confirmed in Calendly regardless.
        // Martina sees it in her Calendly dashboard; this just adds automation.
        console.warn("[CalendlyEmbed] Backend notification failed:", err);
      });

      // Notify parent component if a callback was provided
      onBooked?.(eventUri, inviteeUri);
    }

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      // Reset dedupe guard when the component remounts (e.g. navigation)
      postedRef.current = false;
    };
  }, [onBooked]);

  const embedUrl = new URL(url);
  embedUrl.searchParams.set("hide_event_type_details", "0");
  embedUrl.searchParams.set("hide_gdpr_banner", "1");
  // Brand colours — primary_color is used for CTAs inside the widget
  embedUrl.searchParams.set("primary_color", "5C2D8E"); // plum
  embedUrl.searchParams.set("text_color", "1E1B17");
  embedUrl.searchParams.set("background_color", "F7F3EE"); // cream

  return (
    <iframe
      src={embedUrl.toString()}
      title="Book a private consultation with Martina Rink"
      width="100%"
      style={{ minHeight: "700px", border: "none", display: "block" }}
      loading="lazy"
      allow="payment"
    />
  );
}
