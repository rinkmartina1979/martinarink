/**
 * Internal high-intent lead notification via Resend.
 *
 * Fires when readinessLevel === "high".
 * Only runs when RESEND_API_KEY and RESEND_NOTIFY_EMAIL are configured.
 * Never blocks the user redirect.
 */

import type { Archetype, ServiceIntent, ReadinessLevel, PrivacyNeed } from "./types";

interface NotifyPayload {
  firstName?: string;
  archetype: Archetype;
  serviceIntent: ServiceIntent;
  readinessLevel: ReadinessLevel;
  privacyNeed: PrivacyNeed;
  resultId: string;
  submittedAt: string;
}

const ARCHETYPE_LABELS: Record<Archetype, string> = {
  reckoning: "The Quiet Reckoning",
  threshold: "The Threshold",
  return: "The Return",
};

const INTENT_LABELS: Record<ServiceIntent, string> = {
  "sober-muse": "Sober Muse Method",
  empowerment: "Female Empowerment & Leadership",
  both: "Both programmes",
};

export async function notifyHighIntentLead(payload: NotifyPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || process.env.RESEND_REPLY_TO;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@martinarink.com";

  if (!apiKey || !notifyEmail) {
    console.log(
      "[Assessment] High-intent notification skipped — RESEND_API_KEY or RESEND_NOTIFY_EMAIL not configured."
    );
    return;
  }

  const archetypeLabel = ARCHETYPE_LABELS[payload.archetype];
  const intentLabel = INTENT_LABELS[payload.serviceIntent];
  const nameDisplay = payload.firstName ? `, first name: ${payload.firstName}` : "";
  const privacyFlag = payload.privacyNeed === "high" ? " [PRIVACY: HIGH]" : "";

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1E1B17;">
      <h2 style="font-size: 22px; font-weight: normal; margin-bottom: 8px;">
        High-intent assessment lead${privacyFlag}
      </h2>
      <p style="color: #8A7F72; font-size: 13px; margin-bottom: 24px;">
        ${payload.submittedAt}
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #C8B8A2; color: #8A7F72; width: 40%;">Archetype</td><td style="padding: 8px 0; border-bottom: 1px solid #C8B8A2;">${archetypeLabel}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #C8B8A2; color: #8A7F72;">Programme interest</td><td style="padding: 8px 0; border-bottom: 1px solid #C8B8A2;">${intentLabel}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #C8B8A2; color: #8A7F72;">Readiness</td><td style="padding: 8px 0; border-bottom: 1px solid #C8B8A2; font-weight: bold; color: #6B2737;">HIGH</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #C8B8A2; color: #8A7F72;">Privacy need</td><td style="padding: 8px 0; border-bottom: 1px solid #C8B8A2;">${payload.privacyNeed === "high" ? "HIGH — use private-first copy" : "Standard"}</td></tr>
        ${nameDisplay ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #C8B8A2; color: #8A7F72;">Name signal</td><td style="padding: 8px 0; border-bottom: 1px solid #C8B8A2;">${payload.firstName}</td></tr>` : ""}
      </table>
      <p style="margin-top: 24px; font-size: 13px; color: #8A7F72;">
        Result ID: ${payload.resultId}
      </p>
      <p style="font-size: 13px; color: #8A7F72;">
        This lead routed to: ${payload.serviceIntent === "empowerment" ? "/apply/empowerment" : "/apply/sober-muse"}
      </p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notifyEmail],
        subject: `[High Intent] Assessment lead — ${archetypeLabel}${privacyFlag}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Assessment] Resend notification failed:", err);
    } else {
      console.log("[Assessment] High-intent notification sent to", notifyEmail);
    }
  } catch (err) {
    console.error("[Assessment] Resend notification threw:", err);
  }
}
