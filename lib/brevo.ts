/**
 * Brevo (Sendinblue) v3 contacts API helpers.
 *
 * Two exported functions:
 *   - addBrevoContact: low-level; pass any attributes + listIds.
 *   - subscribeAssessmentLead: high-level; for the assessment funnel.
 *
 * Both upsert (updateEnabled: true) so re-submissions don't 400.
 * Both return { success: boolean, error?: string } and never throw.
 *
 * Auth: Brevo expects `api-key` header (NOT `Authorization: Bearer`).
 */

const BREVO_ENDPOINT = "https://api.brevo.com/v3/contacts";

type BrevoResult = { success: true } | { success: false; error: string };

type Attributes = Record<string, string | number | boolean | undefined | null>;

interface AddBrevoContactInput {
  email: string;
  firstName?: string;
  lastName?: string;
  listIds?: number[];
  attributes?: Attributes;
}

/**
 * Low-level: create or update a Brevo contact.
 * Strips undefined/null values from attributes before sending.
 */
export async function addBrevoContact(
  input: AddBrevoContactInput
): Promise<BrevoResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { success: false, error: "BREVO_API_KEY not configured" };
  }

  const cleanAttrs: Record<string, string | number | boolean> = {};
  if (input.firstName) cleanAttrs.FIRSTNAME = input.firstName;
  if (input.lastName) cleanAttrs.LASTNAME = input.lastName;
  if (input.attributes) {
    for (const [k, v] of Object.entries(input.attributes)) {
      if (v !== undefined && v !== null && v !== "") {
        cleanAttrs[k] = v;
      }
    }
  }

  const payload: Record<string, unknown> = {
    email: input.email,
    updateEnabled: true,
    attributes: cleanAttrs,
  };
  if (input.listIds && input.listIds.length > 0) {
    payload.listIds = input.listIds;
  }

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 204) {
      return { success: true };
    }

    // Brevo returns 400 with code "duplicate_parameter" if contact exists
    // and updateEnabled wasn't honored — read the body for diagnostics.
    let detail = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      detail = `${detail}: ${JSON.stringify(data)}`;
    } catch {
      // ignore body parse errors
    }
    return { success: false, error: detail };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ── Assessment funnel helper ──────────────────────────────────

interface SubscribeAssessmentLeadInput {
  email: string;
  firstName?: string;
  archetype: string;
  serviceIntent: string;
  readinessLevel: string;
  privacyNeed: string;
  completedAt: string;
}

/**
 * High-level: subscribe an assessment completer to the Assessment Leads list.
 * Uses BREVO_LIST_ID_ASSESSMENT env var.
 */
export async function subscribeAssessmentLead(
  input: SubscribeAssessmentLeadInput
): Promise<BrevoResult> {
  const listIdRaw = process.env.BREVO_LIST_ID_ASSESSMENT;
  if (!listIdRaw) {
    return { success: false, error: "BREVO_LIST_ID_ASSESSMENT not configured" };
  }
  const listId = parseInt(listIdRaw, 10);
  if (Number.isNaN(listId)) {
    return { success: false, error: "BREVO_LIST_ID_ASSESSMENT is not a number" };
  }

  return addBrevoContact({
    email: input.email,
    firstName: input.firstName,
    listIds: [listId],
    attributes: {
      ARCHETYPE: input.archetype,
      SERVICE_INTENT: input.serviceIntent,
      READINESS: input.readinessLevel,
      PRIVACY_NEED: input.privacyNeed,
      SOURCE: "assessment",
      ASSESSMENT_COMPLETED: true,
      COMPLETED_AT: input.completedAt,
    },
  });
}

// ── Newsletter helper ─────────────────────────────────────────

interface SubscribeNewsletterInput {
  email: string;
  firstName?: string;
}

/**
 * Subscribe to the Newsletter list. Uses BREVO_LIST_ID_NEWSLETTER.
 */
export async function subscribeNewsletter(
  input: SubscribeNewsletterInput
): Promise<BrevoResult> {
  const listIdRaw = process.env.BREVO_LIST_ID_NEWSLETTER;
  if (!listIdRaw) {
    return { success: false, error: "BREVO_LIST_ID_NEWSLETTER not configured" };
  }
  const listId = parseInt(listIdRaw, 10);
  if (Number.isNaN(listId)) {
    return { success: false, error: "BREVO_LIST_ID_NEWSLETTER is not a number" };
  }

  return addBrevoContact({
    email: input.email,
    firstName: input.firstName,
    listIds: [listId],
    attributes: { SOURCE: "newsletter" },
  });
}
