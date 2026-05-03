/**
 * Points of Departure — Server-Side Scoring Engine
 *
 * NEVER run on the client. Result computed server-side only.
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

    // First definitive signal wins (most specific question takes precedence)
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

  // Tie-breaker: return > threshold > reckoning (high readiness wins ties)
  const TIEBREAK_ORDER: Archetype[] = ["return", "threshold", "reckoning"];
  const maxScore = Math.max(scores.reckoning, scores.threshold, scores.return);
  const archetype = TIEBREAK_ORDER.find((a) => scores[a] === maxScore) ?? "reckoning";

  return {
    archetype,
    scores,
    serviceIntent,
    readinessLevel,
    privacyNeed,
  };
}

/** Derive CTA routing from scoring result — spec-compliant labels */
export function deriveRouting(result: ScoringResult): {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
} {
  const { readinessLevel, serviceIntent } = result;

  if (readinessLevel === "high") {
    // Direct programme-specific application — labels match the offer.
    const isEmpowerment = serviceIntent === "empowerment";
    const isBoth = serviceIntent === "both";

    const applyHref = isEmpowerment
      ? "/apply/empowerment"
      : isBoth
      ? "/work-with-me"
      : "/apply/sober-muse";

    const applyLabel = isEmpowerment
      ? "APPLY — EMPOWERMENT & LEADERSHIP"
      : isBoth
      ? "EXPLORE BOTH PROGRAMMES"
      : "APPLY — THE SOBER MUSE METHOD";

    const exploreHref = isEmpowerment
      ? "/empowerment"
      : isBoth
      ? "/work-with-me"
      : "/sober-muse";

    return {
      primaryHref: applyHref,
      primaryLabel: applyLabel,
      secondaryHref: exploreHref,
      secondaryLabel: "READ THE PROGRAMME PAGE",
    };
  }

  if (readinessLevel === "medium") {
    // Not yet ready to apply — point to programme page + newsletter as soft warm-up.
    const programmeHref =
      serviceIntent === "empowerment"
        ? "/empowerment"
        : serviceIntent === "both"
        ? "/work-with-me"
        : "/sober-muse";

    return {
      primaryHref: programmeHref,
      primaryLabel: "READ ABOUT THE WORK",
      secondaryHref: "/newsletter",
      secondaryLabel: "RECEIVE THE PRIVATE LETTERS",
    };
  }

  // Low readiness → build trust through writing first.
  return {
    primaryHref: "/newsletter",
    primaryLabel: "RECEIVE THE PRIVATE LETTERS",
    secondaryHref: "/writing",
    secondaryLabel: "READ THE WRITING",
  };
}
