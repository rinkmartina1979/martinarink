/**
 * Foundation Workbook — section definitions (single source of truth).
 *
 * The one-time foundation exercises from Martina Rink & Ruta Nürnberger's
 * "My Journal — My Transformation" workbook (the deep identity work done once
 * at the start of the programme, distinct from the recurring daily/monthly
 * journal in lib/journal/prompts.ts).
 *
 * Prompts are reproduced verbatim (DE/EN) from the workbook — established
 * product content, so the brand-voice banned-word rules do NOT apply to these
 * strings. Any NEW wrapper/UI copy (intros, helpers) must still obey the
 * banned-word + no-exclamation rules.
 *
 * Used by both the portal forms and the server-side zod validation so the two
 * never drift. Visibility model is shared with the journal (private by default).
 */

import { z } from "zod";
import {
  VISIBILITY_VALUES,
  VISIBILITY_OPTIONS,
  VisibilitySchema,
  CRISIS_RESOURCES,
  type Visibility,
} from "@/lib/journal/prompts";

// Re-export the shared privacy primitives so workbook modules import from one place.
export { VISIBILITY_VALUES, VISIBILITY_OPTIONS, VisibilitySchema, CRISIS_RESOURCES };
export type { Visibility };

export type WorkbookFieldType = "short" | "long" | "signature";

export interface WorkbookPrompt {
  /** Field key — matches the Sanity content key and the zod schema key. */
  key: string;
  /** English label (primary). */
  en: string;
  /** German label (secondary, shown muted under the English). */
  de: string;
  type: WorkbookFieldType;
  /** Optional placeholder shown inside the field. */
  placeholder?: string;
}

export type WorkbookGroup =
  | "vision"
  | "understanding"
  | "letters"
  | "commitment"
  | "practice";

export interface WorkbookSection {
  /** Stable section key — used in the doc id and the route param. */
  key: string;
  /** English title (primary). */
  en: string;
  /** German title (secondary). */
  de: string;
  group: WorkbookGroup;
  /** Short brand-voice intro shown under the title (NEW copy — obey voice rules). */
  intro?: string;
  /** Emotionally sensitive → show the crisis disclaimer panel. */
  sensitive?: boolean;
  /** Render hint — "two-column" places the first two prompts side by side. */
  layout?: "two-column";
  prompts: WorkbookPrompt[];
}

/* ── Group metadata (display order + labels) ──────────────────── */

export const WORKBOOK_GROUPS: { key: WorkbookGroup; label: string }[] = [
  { key: "vision", label: "Vision & identity" },
  { key: "understanding", label: "Understanding" },
  { key: "letters", label: "Letters" },
  { key: "commitment", label: "Commitment" },
  { key: "practice", label: "Daily practice & free space" },
];

/* ── Sections (16) ────────────────────────────────────────────── */

export const WORKBOOK_SECTIONS: WorkbookSection[] = [
  // ── Vision & identity ──
  {
    key: "becoming",
    en: "The person I want to become",
    de: "Die Person, die ich werden möchte",
    group: "vision",
    prompts: [
      {
        key: "becoming",
        en: "The person I want to become is …",
        de: "Die Person, die ich werden möchte, ist …",
        type: "long",
      },
    ],
  },
  {
    key: "vision",
    en: "Your vision",
    de: "Visionboard",
    group: "vision",
    intro:
      "Describe the life you can see — in the present tense, as if it is already here.",
    prompts: [
      {
        key: "visionDescription",
        en: "The life I see for myself",
        de: "Meine Vision",
        type: "long",
      },
    ],
  },
  {
    key: "whyChange",
    en: "Why I want to change",
    de: "Warum möchte ich die Veränderung?",
    group: "vision",
    intro: "Find your personal motivation. — Finde deine persönliche Motivation.",
    prompts: [
      {
        key: "whyChange",
        en: "Why do I want to change?",
        de: "Warum möchte ich die Veränderung?",
        type: "long",
      },
    ],
  },
  {
    key: "smartGoal",
    en: "My goal",
    de: "Mein Ziel",
    group: "vision",
    intro:
      "Specific · Measurable · Achievable · Relevant · Time-bound. — Spezifisch · Messbar · Erreichbar · Relevant · Zeitgebunden.",
    prompts: [
      { key: "goalWhat", en: "What do I want to achieve?", de: "Was genau möchte ich erreichen?", type: "long" },
      { key: "goalWhy", en: "Why do I want to achieve it?", de: "Warum möchte ich es erreichen?", type: "long" },
      { key: "goalWho", en: "Who do I want to be part of it?", de: "Wer soll mich dabei unterstützen?", type: "long" },
      { key: "goalWhen", en: "When do I want to achieve it?", de: "Wann möchte ich es erreichen?", type: "short" },
      { key: "goalWhere", en: "Where / in which area do I want to achieve it?", de: "In welchem Bereich / Umgebung möchte ich es erreichen?", type: "short" },
    ],
  },

  // ── Understanding ──
  {
    key: "fearList",
    en: "Fear list",
    de: "Was hält mich auf?",
    group: "understanding",
    sensitive: true,
    intro: "What is holding me back? What are my worries?",
    prompts: [
      {
        key: "fearList",
        en: "What is holding me back? What are my worries?",
        de: "Was hält mich auf? Was sind meine Sorgen?",
        type: "long",
      },
    ],
  },
  {
    key: "prosCons",
    en: "The + / − list",
    de: "Die + / − Liste",
    group: "understanding",
    layout: "two-column",
    intro:
      "Take your time. What would be the positive and the negative aspects if you changed your consumption?",
    prompts: [
      { key: "prosChange", en: "Positive (+)", de: "Positiv (+)", type: "long" },
      { key: "consChange", en: "Negative (−)", de: "Negativ (−)", type: "long" },
    ],
  },
  {
    key: "voidToFill",
    en: "What void needs to be filled?",
    de: "Suche oder Sucht?",
    group: "understanding",
    sensitive: true,
    prompts: [
      {
        key: "voidToFill",
        en: "What void needs to be filled?",
        de: "Welche Leere möchte gefüllt werden?",
        type: "long",
      },
    ],
  },

  // ── Letters ──
  {
    key: "letterPast",
    en: "Letter to my past self",
    de: "Brief an mein vergangenes Ich",
    group: "letters",
    sensitive: true,
    prompts: [
      { key: "letterPast", en: "Dear past self …", de: "Liebes vergangenes Ich …", type: "long" },
    ],
  },
  {
    key: "letterFuture",
    en: "Letter to my future self",
    de: "Brief an mein zukünftiges Ich",
    group: "letters",
    prompts: [
      { key: "letterFuture", en: "Dear future self …", de: "Liebes zukünftiges Ich …", type: "long" },
    ],
  },
  {
    key: "letterFamily",
    en: "Letter to my family & loved ones",
    de: "Brief an meine Familie und Liebsten",
    group: "letters",
    prompts: [
      { key: "letterFamily", en: "To my loved ones …", de: "An meine Liebsten …", type: "long" },
    ],
  },

  // ── Commitment ──
  {
    key: "contract",
    en: "Contract with myself",
    de: "Vertrag mit mir selbst",
    group: "commitment",
    intro: "A promise, in your own words. You can return to it whenever you need to.",
    prompts: [
      { key: "contractText", en: "I hereby …", de: "Ich hiermit …", type: "long" },
      { key: "contractLocation", en: "Location, date", de: "Ort, Datum", type: "short" },
      { key: "contractSignature", en: "Signature — type your name", de: "Unterschrift — tippe deinen Namen", type: "signature" },
    ],
  },
  {
    key: "affirmations",
    en: "Create your new reality",
    de: "Kreiere deine neue Realität",
    group: "commitment",
    intro:
      "Write in the past tense, beginning with gratitude — as if you have already received it.",
    prompts: [
      { key: "affirmations", en: "My affirmations", de: "Meine Affirmationen", type: "long" },
    ],
  },

  // ── Daily practice & free space ──
  {
    key: "dailyMindset",
    en: "Mindset — feel the vision",
    de: "Mindset — fühle die Vision",
    group: "practice",
    intro: "Take your time to feel the vision rather than only think it.",
    prompts: [
      { key: "dailyMindset", en: "What I feel when I picture it", de: "Was ich fühle, wenn ich es mir vorstelle", type: "long" },
    ],
  },
  {
    key: "newLifeMeaning",
    en: "What a new life means to me",
    de: "Was bedeutet ein neues Leben für mich?",
    group: "practice",
    prompts: [
      { key: "newLifeMeaning", en: "In my new sober era …", de: "In meiner neuen, nüchternen Zeit …", type: "long" },
    ],
  },
  {
    key: "freeJournaling",
    en: "Free journaling",
    de: "Journaling",
    group: "practice",
    intro: "A blank space. Write whatever wants to be written.",
    prompts: [
      { key: "freeJournaling", en: "Free writing", de: "Freies Schreiben", type: "long" },
    ],
  },
  {
    key: "notes",
    en: "Notes",
    de: "Notizen",
    group: "practice",
    prompts: [
      { key: "notes", en: "Notes", de: "Notizen", type: "long" },
    ],
  },
];

/* ── Derived keys + lookups ───────────────────────────────────── */

export const WORKBOOK_SECTION_KEYS = WORKBOOK_SECTIONS.map((s) => s.key) as [
  string,
  ...string[],
];

export type WorkbookSectionKey = (typeof WORKBOOK_SECTIONS)[number]["key"];

export function getWorkbookSectionDef(key: string): WorkbookSection | undefined {
  return WORKBOOK_SECTIONS.find((s) => s.key === key);
}

/** Sections grouped + ordered for the hub UI. */
export function groupedSections(): { key: WorkbookGroup; label: string; sections: WorkbookSection[] }[] {
  return WORKBOOK_GROUPS.map((g) => ({
    ...g,
    sections: WORKBOOK_SECTIONS.filter((s) => s.group === g.key),
  })).filter((g) => g.sections.length > 0);
}

export const WORKBOOK_TOTAL = WORKBOOK_SECTIONS.length;

/** Every content field key across all sections (mirrors the Sanity content object). */
export const WORKBOOK_CONTENT_KEYS = WORKBOOK_SECTIONS.flatMap((s) =>
  s.prompts.map((p) => p.key),
);

/* ── Validation (shared by API + forms) ───────────────────────── */
// All fields optional — a private foundation entry must never reject a
// half-finished thought. Signatures are short; reflections allow long text.

const reflection = z.string().trim().max(5000).optional();
const signature = z.string().trim().max(120).optional();

export const WorkbookContentSchema = z
  .object({
    // Vision & identity
    becoming: reflection,
    visionDescription: reflection,
    whyChange: reflection,
    goalWhat: reflection,
    goalWhy: reflection,
    goalWho: reflection,
    goalWhen: reflection,
    goalWhere: reflection,
    // Understanding
    fearList: reflection,
    prosChange: reflection,
    consChange: reflection,
    voidToFill: reflection,
    // Letters
    letterPast: reflection,
    letterFuture: reflection,
    letterFamily: reflection,
    // Commitment
    contractText: reflection,
    contractLocation: signature,
    contractSignature: signature,
    affirmations: reflection,
    // Practice
    dailyMindset: reflection,
    newLifeMeaning: reflection,
    freeJournaling: reflection,
    notes: reflection,
  })
  .strict();

export type WorkbookContent = z.infer<typeof WorkbookContentSchema>;

export const WorkbookSectionKeySchema = z.enum(WORKBOOK_SECTION_KEYS);
