/**
 * 3-Month Journal — bilingual prompt definitions (single source of truth).
 *
 * Prompts are reproduced verbatim (DE/EN) from Martina Rink & Ruta Nürnberger's
 * "My Journal — My Transformation" workbook. This is established product content:
 * the brand-voice banned-word rules do NOT apply to these strings. Any NEW
 * wrapper/UI copy elsewhere must still obey the banned-word + no-exclamation rules.
 *
 * Used by both the portal forms and the server-side zod validation so the two
 * never drift.
 */

import { z } from "zod";

export type JournalFieldType = "short" | "long" | "boolean";

export interface JournalPrompt {
  /** Field key — matches the Sanity field name and the zod schema key. */
  key: string;
  /** English label (primary). */
  en: string;
  /** German label (secondary, shown muted under the English). */
  de: string;
  type: JournalFieldType;
}

/* ── Morning ritual ───────────────────────────────────────────── */

export const MORNING_PROMPTS: JournalPrompt[] = [
  { key: "feeling",      en: "How do I feel today?",   de: "Wie geht es mir heute?",        type: "short" },
  { key: "sleepQuality", en: "How did I sleep?",       de: "Wie habe ich geschlafen?",      type: "short" },
  { key: "gratefulFor",  en: "I am grateful for…",     de: "Ich bin dankbar für…",          type: "long"  },
  { key: "todayGreatIf", en: "Today would be great if…", de: "Heute wäre es gut, wenn…",    type: "long"  },
  { key: "goalsToday",   en: "My goal(s) for today",   de: "Mein Ziel(e) heute",            type: "long"  },
];

/* ── Evening reflection ───────────────────────────────────────── */

export const EVENING_PROMPTS: JournalPrompt[] = [
  { key: "feeling",            en: "How did I feel today?",            de: "Wie ging es mir heute?",            type: "short" },
  { key: "sleepQuality",       en: "How did I sleep?",                 de: "Wie habe ich geschlafen?",          type: "short" },
  { key: "gratefulFor",        en: "I am grateful for…",               de: "Ich bin dankbar für…",              type: "long"  },
  { key: "highlights",         en: "Highlights of the day",            de: "Highlights des Tages",              type: "long"  },
  { key: "difficultSituations",en: "Difficult situation(s)",           de: "Schwierige Situation(en)",          type: "long"  },
  { key: "goodForMyself",      en: "What good have I done for myself?",de: "Was habe ich Gutes für mich getan?",type: "long"  },
  // Consumption tracking — clinically sensitive. Never required.
  { key: "didConsume",         en: "Did you drink / consume?",         de: "Hast du getrunken / konsumiert?",   type: "boolean" },
  { key: "consumeWhat",        en: "What?",                            de: "Was?",                              type: "short" },
  { key: "consumeHowMuch",     en: "How much?",                        de: "Wie viel?",                         type: "short" },
  { key: "trigger",            en: "Why / what was the trigger?",      de: "Warum / was war der Auslöser?",     type: "long"  },
  { key: "noticedChanges",     en: "Did I notice any changes in my daily life?", de: "Habe ich eine Veränderung in meinem täglichen Leben bemerkt?", type: "long" },
  { key: "tomorrowAffirmations", en: "Tomorrow's affirmations",        de: "Morgige Affirmationen",             type: "long"  },
  { key: "goalsTomorrow",      en: "My goal(s) for tomorrow",          de: "Mein Ziel(e) für morgen",           type: "long"  },
];

/* ── Monthly review ───────────────────────────────────────────── */

export const MONTHLY_PROMPTS: JournalPrompt[] = [
  { key: "accomplished", en: "What have I accomplished this month?",                   de: "Was habe ich diesen Monat geschafft/erreicht?", type: "long" },
  { key: "whatWorked",   en: "What worked well and which routines helped me?",         de: "Was hat diesen Monat gut funktioniert und welche Routinen haben mir geholfen?", type: "long" },
  { key: "improveNext",  en: "What can I improve next month and how?",                 de: "Was kann ich im nächsten Monat besser machen und wie?", type: "long" },
  { key: "towardGoals",  en: "What have I done to move closer to my goals this year?",  de: "Was habe ich gemacht, um meinem Ziel für dieses Jahr näher zu kommen?", type: "long" },
  { key: "celebrate",    en: "How can I recognize and celebrate my successes?",        de: "Was kann ich tun, um meine Erfolge anzuerkennen und zu feiern?", type: "long" },
];

/* ── Visibility (privacy by design) ───────────────────────────── */

export const VISIBILITY_VALUES = ["private", "shared", "needs-support"] as const;
export type Visibility = (typeof VISIBILITY_VALUES)[number];

export const VISIBILITY_OPTIONS: { value: Visibility; label: string; helper: string }[] = [
  {
    value: "private",
    label: "Private to me",
    helper: "Yours alone in your space. Martina does not read this.",
  },
  {
    value: "shared",
    label: "Share with Martina",
    helper: "Martina can read this entry before your next session.",
  },
  {
    value: "needs-support",
    label: "I'd like support",
    helper: "Flags this entry for Martina. Not for emergencies — see the resources below.",
  },
];

/* ── Validation (shared by API + forms) ───────────────────────── */
// Reflection fields are always optional — a private ritual must never reject
// a half-finished entry. Only structural fields are required.

const reflection = z.string().trim().max(5000).optional();

export const VisibilitySchema = z.enum(VISIBILITY_VALUES);

export const MorningEntrySchema = z.object({
  feeling: reflection,
  sleepQuality: reflection,
  gratefulFor: reflection,
  todayGreatIf: reflection,
  goalsToday: reflection,
});

export const EveningEntrySchema = z.object({
  feeling: reflection,
  sleepQuality: reflection,
  gratefulFor: reflection,
  highlights: reflection,
  difficultSituations: reflection,
  goodForMyself: reflection,
  didConsume: z.boolean().optional(),
  consumeWhat: reflection,
  consumeHowMuch: reflection,
  trigger: reflection,
  noticedChanges: reflection,
  tomorrowAffirmations: reflection,
  goalsTomorrow: reflection,
});

export const MonthlyReviewSchema = z.object({
  accomplished: reflection,
  whatWorked: reflection,
  improveNext: reflection,
  towardGoals: reflection,
  celebrate: reflection,
});

export type MorningEntry = z.infer<typeof MorningEntrySchema>;
export type EveningEntry = z.infer<typeof EveningEntrySchema>;
export type MonthlyReviewEntry = z.infer<typeof MonthlyReviewSchema>;

/* ── Helpers ──────────────────────────────────────────────────── */

/** ISO date (YYYY-MM-DD) in the user's local sense — caller passes a Date. */
export function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * 1-based month index (1–3) of an entry within a 3-month programme.
 * Clamped to 1..3 so out-of-range dates never break the UI.
 */
export function monthIndexFor(enrolledAtIso: string, entryDateIso: string): number {
  const start = new Date(enrolledAtIso);
  const entry = new Date(entryDateIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(entry.getTime())) return 1;
  const days = Math.floor((entry.getTime() - start.getTime()) / 86_400_000);
  return Math.min(3, Math.max(1, Math.floor(days / 30) + 1));
}

/** German, non-emergency crisis resources — shown on sensitive surfaces. */
export const CRISIS_RESOURCES = {
  disclaimer:
    "This space is for reflection, not emergencies. If you are in crisis or thinking about harming yourself, please reach out now — you deserve immediate support.",
  lines: [
    { label: "Telefonseelsorge (24/7, free)", value: "0800 111 0 111  ·  0800 111 0 222" },
    { label: "Europe-wide emotional support", value: "116 123" },
    { label: "Emergency", value: "112" },
  ],
} as const;
