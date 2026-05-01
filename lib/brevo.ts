/**
 * Brevo (formerly Sendinblue) API client
 * Replaces Kit for newsletter subscription and assessment lead capture.
 * API docs: https://developers.brevo.com/reference/createcontact
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

/**
 * Convenience: subscribe a newsletter signup to the newsletter list.
 */
export async function subscribeNewsletter({
  email,
  firstName,
}: {
  email: string;
  firstName?: string;
}): Promise<BrevoResult> {
  const listIdRaw = process.env.BREVO_LIST_ID_NEWSLETTER;
  const listIds = listIdRaw ? [parseInt(listIdRaw, 10)] : [];

  return addBrevoContact({
    email,
    firstName,
    listIds,
    attributes: {
      SOURCE: "newsletter-form",
    },
  });
}

/**
 * Convenience: add an assessment lead with archetype data.
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

  return addBrevoContact({
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
}
