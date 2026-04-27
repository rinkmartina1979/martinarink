/**
 * Points of Departure — Server-Side Scoring Engine
 *
 * NEVER run this on the client. The result must be computed server-side
 * so answers cannot be manipulated to game the archetype.
 */

import { QUESTIONS } from "./questions";
import type {
  Archetype,
  AnswerMap,
  ScoringResult,
  ServiceIntent,
  ReadinessLevel,
  PrivacyNeed,
} from "./types";

export function computeResult(answers: AnswerMap): ScoringResult {
  const scores: Record<Archetype, number> = {
    reckoning: 0,
    threshold: 0,
    return: 0,
  };

  let serviceIntent: ServiceIntent = "both";
  let readinessLevel: ReadinessLevel = "medium";
  let privacyNeed: PrivacyNeed = "standard";

  let hasServiceIntent = false;
  let hasReadiness = false;
  let hasPrivacy = false;

  for (const question of QUESTIONS) {
    const selectedIndex = answers[question.id];
    if (selectedIndex === undefined || selectedIndex === null) continue;

    const option = question.options[selectedIndex];
    if (!option) continue;

    const s = option.scores;
    scores.reckoning += s.reckoning ?? 0;
    scores.threshold += s.threshold ?? 0;
    scores.return += s.return ?? 0;

    if (s.serviceIntent && !hasServiceIntent) {
      serviceIntent = s.serviceIntent;
      hasServiceIntent = true;
    }
    if (s.readiness && !hasReadiness) {
      readinessLevel = s.readiness;
      hasReadiness = true;
    }
    if (s.privacy && !hasPrivacy) {
      privacyNeed = s.privacy;
      hasPrivacy = true;
    }
  }

  // Determine winning archetype
  const archetype = (Object.entries(scores) as [Archetype, number][]).reduce(
    (best, [arch, score]) => (score > scores[best] ? arch : best),
    "reckoning" as Archetype
  );

  return {
    archetype,
    scores,
    serviceIntent,
    readinessLevel,
    privacyNeed,
  };
}

/** Derive CTA routing from scoring result */
export function deriveRouting(result: ScoringResult): {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
} {
  const { readinessLevel, serviceIntent } = result;

  if (readinessLevel === "high") {
    // Ready to begin → direct application or consultation
    const programmeHref =
      serviceIntent === "empowerment"
        ? "/apply/empowerment"
        : "/apply/sober-muse";
    return {
      primaryHref: programmeHref,
      primaryLabel: "Begin the application",
      secondaryHref: "/book",
      secondaryLabel: "Request a private consultation first",
    };
  }

  if (readinessLevel === "medium") {
    // Exploring → programme pages
    const programmeHref =
      serviceIntent === "empowerment" ? "/empowerment" : "/sober-muse";
    return {
      primaryHref: programmeHref,
      primaryLabel: "Read about the programme",
      secondaryHref: "/book",
      secondaryLabel: "Or request a private consultation",
    };
  }

  // Low readiness → newsletter
  return {
    primaryHref: "/newsletter",
    primaryLabel: "Receive the private letters",
    secondaryHref: "/writing",
    secondaryLabel: "Read the writing first",
  };
}
