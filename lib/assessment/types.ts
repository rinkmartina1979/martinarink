/**
 * Points of Departure — Assessment Types
 * Server-side scoring, three archetypes, secondary segmentation signals.
 */

export type Archetype = "reckoning" | "threshold" | "return";

export type ServiceIntent = "sober-muse" | "empowerment" | "both";

export type ReadinessLevel = "low" | "medium" | "high";

export type PrivacyNeed = "standard" | "high";

/** Raw answer from a single question — the selected option index (0–3) */
export type AnswerMap = Record<string, number>; // questionId → optionIndex

/** Final archetype scoring result */
export interface ScoringResult {
  archetype: Archetype;
  scores: Record<Archetype, number>;
  serviceIntent: ServiceIntent;
  readinessLevel: ReadinessLevel;
  privacyNeed: PrivacyNeed;
}

/** Each option carries weighted scores for the three archetypes + secondary signals */
export interface OptionScores {
  reckoning: number;
  threshold: number;
  return: number;
  serviceIntent?: ServiceIntent;
  readiness?: ReadinessLevel;
  privacy?: PrivacyNeed;
}

export interface AssessmentOption {
  id: string;
  label: string;
  scores: OptionScores;
}

export interface AssessmentQuestion {
  id: string;
  order: number;
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
