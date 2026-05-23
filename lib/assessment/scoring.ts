/**
 * Points of Departure — Server-Side Scoring Engine
 *
 * NEVER run on the client. Result computed server-side only.
 *
 * Scoring model: tally A/B/C/D across all questions.
 * A → exhausted, B → doubting, C → pleasing, D → empowered
 */

import { QUESTIONS } from "./questions";
import type {
  Archetype,
  AnswerMap,
  AnswerTally,
  ScoringResult,
  ServiceIntent,
  ReadinessLevel,
  PrivacyNeed,
} from "./types";

const KEY_TO_ARCHETYPE: Record<"A" | "B" | "C" | "D", Archetype> = {
  A: "exhausted",
  B: "doubting",
  C: "pleasing",
  D: "empowered",
};

export function computeResult(answers: AnswerMap): ScoringResult {
  const tally: AnswerTally = { A: 0, B: 0, C: 0, D: 0 };

  for (const question of QUESTIONS) {
    const selectedIndex = answers[question.id];
    if (selectedIndex === undefined || selectedIndex === null) continue;

    const option = question.options[selectedIndex];
    if (!option) continue;

    const key = option.scores.archetypeKey;
    tally[key]++;
  }

  // Winning archetype — tie-breaker: D > C > B > A (higher readiness wins ties)
  const TIEBREAK: Array<"A" | "B" | "C" | "D"> = ["D", "C", "B", "A"];
  const maxCount = Math.max(tally.A, tally.B, tally.C, tally.D);
  const winnerKey = TIEBREAK.find((k) => tally[k] === maxCount) ?? "A";
  const archetype = KEY_TO_ARCHETYPE[winnerKey];

  // scores: map archetype → count (for compat with result page)
  const scores: Record<Archetype, number> = {
    exhausted: tally.A,
    doubting:  tally.B,
    pleasing:  tally.C,
    empowered: tally.D,
  };

  // Derive secondary signals from winning archetype
  const readinessLevel: ReadinessLevel =
    archetype === "empowered" ? "high"
    : archetype === "exhausted" ? "low"
    : "medium";

  // All new questions are empowerment-focused
  const serviceIntent: ServiceIntent = "empowerment";

  const privacyNeed: PrivacyNeed =
    archetype === "exhausted" || archetype === "pleasing" ? "high" : "standard";

  return {
    archetype,
    tally,
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
  const { readinessLevel, archetype } = result;

  if (readinessLevel === "high") {
    return {
      primaryHref: "/apply/empowerment",
      primaryLabel: "APPLY — EMPOWERMENT & LEADERSHIP",
      secondaryHref: "/empowerment",
      secondaryLabel: "READ THE PROGRAMME PAGE",
    };
  }

  if (readinessLevel === "medium") {
    const applyHref = archetype === "pleasing" ? "/book" : "/book";
    return {
      primaryHref: applyHref,
      primaryLabel: "BEGIN WITH A PRIVATE CONSULTATION",
      secondaryHref: "/newsletter",
      secondaryLabel: "RECEIVE THE PRIVATE LETTERS",
    };
  }

  // Low readiness (exhausted) → build trust through writing first
  return {
    primaryHref: "/newsletter",
    primaryLabel: "RECEIVE THE PRIVATE LETTERS",
    secondaryHref: "/writing",
    secondaryLabel: "READ THE WRITING",
  };
}
