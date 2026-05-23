/**
 * Points of Departure — Assessment Types
 *
 * Four archetypes derived from A/B/C/D answer tally.
 * Secondary signals (serviceIntent, readinessLevel, privacyNeed) are
 * derived from the winning archetype — kept for downstream compat.
 */

export type Archetype = "exhausted" | "doubting" | "pleasing" | "empowered";

export type ServiceIntent = "sober-muse" | "empowerment" | "both";

export type ReadinessLevel = "low" | "medium" | "high";

export type PrivacyNeed = "standard" | "high";

/** Raw answer from a single question — the selected option index (0–3) */
export type AnswerMap = Record<string, number>; // questionId → optionIndex

/** A/B/C/D letter tally */
export type AnswerTally = Record<"A" | "B" | "C" | "D", number>;

/** Final archetype scoring result */
export interface ScoringResult {
  archetype: Archetype;
  tally: AnswerTally;
  scores: Record<Archetype, number>;
  serviceIntent: ServiceIntent;
  readinessLevel: ReadinessLevel;
  privacyNeed: PrivacyNeed;
}

/** Each option maps to one A/B/C/D archetype key */
export interface OptionScores {
  archetypeKey: "A" | "B" | "C" | "D";
}

export interface AssessmentOption {
  id: string;
  label: string;
  scores: OptionScores;
}

export interface AssessmentQuestion {
  id: string;
  order: number;
  /** true for the three "Before we begin" warm-up questions */
  isIntro?: boolean;
  question: string;
  subtext?: string;
  options: AssessmentOption[];
  /** If true, the email gate renders after this question */
  gateAfter?: boolean;
}

/** Payload sent from client to /api/assessment */
export interface AssessmentSubmission {
  answers: AnswerMap;
  email: string;
  firstName?: string;
}

/** Server response from /api/assessment */
export interface AssessmentResponse {
  resultId: string;
  archetype: Archetype;
  serviceIntent: ServiceIntent;
  readinessLevel: ReadinessLevel;
}

/** Fallback copy for each archetype (used when Sanity is unavailable) */
export interface ArchetypeResult {
  archetype: Archetype;
  name: string;
  tagline: string;
  opening: string;
  bodyParagraphs: string[];
  closing: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCta?: {
    label: string;
    href: string;
  };
}
