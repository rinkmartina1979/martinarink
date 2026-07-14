/**
 * Analytics event abstraction.
 *
 * Wraps @vercel/analytics track() + GA4 dataLayer push.
 * Fails silently if tracking IDs are not configured.
 * NEVER sends email, answers, or personal data to analytics.
 */

export type AssessmentEventName =
  | "assessment_started"
  | "assessment_question_answered"
  | "assessment_email_submitted"
  | "assessment_completed"
  | "assessment_result_viewed"
  | "assessment_cta_clicked"
  | "assessment_high_intent_lead"
  | "assessment_error";

export interface AssessmentEventProps {
  archetype?: string;
  serviceIntent?: string;
  readinessLevel?: string;
  privacyNeed?: string;
  questionIndex?: number;
  ctaLabel?: string;
  ctaHref?: string;
  errorType?: string;
}

/** Non-assessment funnel events — application through paid programme. */
export type FunnelEventName =
  | "application_submitted"
  | "deposit_checkout_opened"
  | "deposit_paid"
  | "tier_selected"
  | "balance_checkout_opened"
  | "balance_paid";

export interface FunnelEventProps {
  programme?: string;
  variantKey?: string;
  paymentMode?: "full" | "instalments";
}

/** Shared push — Vercel Analytics + GA4 dataLayer. Never throws. */
function pushEvent(name: string, rawProps: object): void {
  const props = rawProps as Record<string, unknown>;
  try {
    // Vercel Analytics (client-side only)
    if (typeof window !== "undefined") {
      // @vercel/analytics track function
      const va = (window as unknown as { va?: (event: string, props?: Record<string, unknown>) => void }).va;
      if (typeof va === "function") {
        va(name, props);
      }

      // GA4 dataLayer
      const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
      if (Array.isArray(dataLayer)) {
        dataLayer.push({ event: name, ...props });
      }
    }
  } catch {
    // Never throw from analytics
  }
}

/** Track an analytics event — safe to call anywhere (client or server). */
export function trackAssessment(
  name: AssessmentEventName,
  props: AssessmentEventProps = {}
): void {
  pushEvent(name, props);
}

/** Convenience: track high-intent lead (no PII) */
export function trackHighIntentLead(
  archetype: string,
  serviceIntent: string
): void {
  trackAssessment("assessment_high_intent_lead", {
    archetype,
    serviceIntent,
    readinessLevel: "high",
  });
}

/** Track a post-assessment funnel event — safe to call anywhere (client or server). */
export function trackFunnel(
  name: FunnelEventName,
  props: FunnelEventProps = {}
): void {
  pushEvent(name, props);
}
