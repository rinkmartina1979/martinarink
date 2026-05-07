/**
 * Brevo (formerly Sendinblue) API client
 * Replaces Kit for newsletter subscription and assessment lead capture.
 *
 * API docs:
 * - Contacts:  https://developers.brevo.com/reference/createcontact
 * - Events:    https://developers.brevo.com/reference/createevent (Marketing API v3)
 *
 * NOTE: Brevo automations are triggered by EVENTS, not by contact creation.
 * Adding a contact alone will NOT fire any automation. You MUST also call
 * trackBrevoEvent() — every automation in the Brevo UI listens for an
 * `event_name` on the contact's email.
 */

const BREVO_API_BASE = "https://api.brevo.com/v3";

interface BrevoContactOptions {
  email: string;
  firstName?: string;
  /** Brevo list IDs to add the contact to (numeric) */
  listIds?: number[];
  /** Custom contact attributes — keys must match your Brevo attribute names */
  attributes?: Record<string, string | boolean | number>;
  /** If true, update the contact if it already exists */
  updateEnabled?: boolean;
}

interface BrevoResult {
  success: boolean;
  error?: string;
  contactId?: number;
}

export async function addBrevoContact({
  email,
  firstName,
  listIds = [],
  attributes = {},
  updateEnabled = true,
}: BrevoContactOptions): Promise<BrevoResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[Brevo] BREVO_API_KEY not set — skipping contact creation");
    return { success: false, error: "BREVO_API_KEY not configured" };
  }

  const payload: Record<string, unknown> = {
    email,
    updateEnabled,
  };

  // Build attributes — FIRSTNAME is a built-in Brevo attribute
  const allAttributes: Record<string, string | boolean | number> = {
    ...attributes,
  };
  if (firstName) allAttributes["FIRSTNAME"] = firstName;
  if (Object.keys(allAttributes).length > 0) {
    payload.attributes = allAttributes;
  }

  if (listIds.length > 0) {
    payload.listIds = listIds;
  }

  try {
    const res = await fetch(`${BREVO_API_BASE}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    // 201 = created, 204 = updated (when updateEnabled)
    if (res.status === 201 || res.status === 204) {
      let contactId: number | undefined;
      try {
        const data = await res.json();
        contactId = data.id;
      } catch {
        // 204 returns no body — that's fine
      }
      return { success: true, contactId };
    }

    const errorBody = await res.text();
    console.error("[Brevo] API error:", res.status, errorBody);
    return { success: false, error: `HTTP ${res.status}: ${errorBody}` };
  } catch (err) {
    console.error("[Brevo] Network error:", err);
    return { success: false, error: "Network error" };
  }
}

// ── EVENTS ───────────────────────────────────────────────────────────
// Without this call, no Brevo automation will ever trigger.
// The event_name MUST match exactly what is configured in the Brevo UI
// (Automations → Trigger → "When a custom event is performed").
// ─────────────────────────────────────────────────────────────────────

export type BrevoEventName =
  | "newsletter_subscribed"
  | "assessment_completed"
  | "high_intent_lead"
  | "popup_email_captured"
  | "consultation_booked"
  | "consultation_canceled"
  | "consultation_no_show";

interface BrevoEventOptions {
  email: string;
  eventName: BrevoEventName;
  /** Optional event-specific properties (e.g. archetype, source) */
  properties?: Record<string, string | number | boolean>;
  /** Optional contact properties to update on the contact record at the same time */
  contactProperties?: Record<string, string | number | boolean>;
}

export async function trackBrevoEvent({
  email,
  eventName,
  properties = {},
  contactProperties = {},
}: BrevoEventOptions): Promise<BrevoResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[Brevo] BREVO_API_KEY not set — skipping event tracking");
    return { success: false, error: "BREVO_API_KEY not configured" };
  }

  const payload = {
    event_name: eventName,
    identifiers: { email_id: email },
    event_properties: properties,
    contact_properties: contactProperties,
  };

  try {
    const res = await fetch(`${BREVO_API_BASE}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    // 204 = accepted (Brevo docs). Anything 2xx is success.
    if (res.status >= 200 && res.status < 300) {
      return { success: true };
    }

    const errorBody = await res.text();
    console.error("[Brevo] Event API error:", res.status, errorBody);
    return { success: false, error: `HTTP ${res.status}: ${errorBody}` };
  } catch (err) {
    console.error("[Brevo] Event network error:", err);
    return { success: false, error: "Network error" };
  }
}

/**
 * Convenience: subscribe a newsletter signup to the newsletter list AND
 * fire the `newsletter_subscribed` event (so the welcome automation runs).
 */
export async function subscribeNewsletter({
  email,
  firstName,
  source = "newsletter-form",
}: {
  email: string;
  firstName?: string;
  source?: string;
}): Promise<BrevoResult> {
  const listIdRaw = process.env.BREVO_LIST_ID_NEWSLETTER;
  const listIds = listIdRaw ? [parseInt(listIdRaw, 10)] : [];

  const contactResult = await addBrevoContact({
    email,
    firstName,
    listIds,
    attributes: { SOURCE: source },
  });

  // Fire-and-forget events — never block the contact creation result.
  // Always fire newsletter_subscribed; if the signup came from the popup,
  // ALSO fire popup_email_captured so the popup-specific welcome runs.
  trackBrevoEvent({
    email,
    eventName: "newsletter_subscribed",
    properties: { source },
  }).catch((err) =>
    console.error("[Brevo] newsletter_subscribed event failed:", err),
  );

  if (source === "popup") {
    trackBrevoEvent({
      email,
      eventName: "popup_email_captured",
      properties: { source },
    }).catch((err) =>
      console.error("[Brevo] popup_email_captured event failed:", err),
    );
  }

  return contactResult;
}

/**
 * Convenience: add an assessment lead with archetype data AND fire the
 * `assessment_completed` event (and `high_intent_lead` if readiness=high).
 *
 * The 5-letter Brevo automation listens for `assessment_completed` and
 * branches by ARCHETYPE / READINESS attributes on the contact record.
 */
export async function subscribeAssessmentLead({
  email,
  firstName,
  archetype,
  serviceIntent,
  readinessLevel,
  privacyNeed,
  completedAt,
}: {
  email: string;
  firstName?: string;
  archetype: string;
  serviceIntent: string;
  readinessLevel: string;
  privacyNeed: string;
  completedAt: string;
}): Promise<BrevoResult> {
  const listIdRaw = process.env.BREVO_LIST_ID_ASSESSMENT;
  const listIds = listIdRaw ? [parseInt(listIdRaw, 10)] : [];

  const contactResult = await addBrevoContact({
    email,
    firstName,
    listIds,
    attributes: {
      SOURCE: "assessment",
      ARCHETYPE: archetype,
      SERVICE_INTENT: serviceIntent,
      READINESS: readinessLevel,
      PRIVACY_NEED: privacyNeed,
      ASSESSMENT_COMPLETED: true,
      COMPLETED_AT: completedAt,
    },
  });

  // Fire the assessment_completed event so the welcome-letter automation runs.
  trackBrevoEvent({
    email,
    eventName: "assessment_completed",
    properties: {
      archetype,
      service_intent: serviceIntent,
      readiness: readinessLevel,
      privacy_need: privacyNeed,
    },
  }).catch((err) =>
    console.error("[Brevo] assessment_completed event failed:", err),
  );

  // Fire a SECOND event for high-intent leads so a separate
  // "warm the founder up before her consultation" automation can branch.
  if (readinessLevel === "high") {
    trackBrevoEvent({
      email,
      eventName: "high_intent_lead",
      properties: {
        archetype,
        service_intent: serviceIntent,
      },
    }).catch((err) =>
      console.error("[Brevo] high_intent_lead event failed:", err),
    );
  }

  return contactResult;
}
