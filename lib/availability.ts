/**
 * Availability — self-advancing intake window.
 *
 * The intake month is never hardcoded. `getNextIntake()` always returns the
 * month *after* the current one, so the scarcity badge can never go stale:
 * in June it reads "July 2026", in July "August 2026", and so on — with no
 * code edit and no deploy. Pages that render it set `revalidate` (daily ISR)
 * so the value rolls over on its own.
 *
 * To change how many openings are advertised, edit OPENINGS.
 * To change the lead time (e.g. intake is always 2 months out), edit MONTHS_AHEAD.
 */

const OPENINGS = 2;
const MONTHS_AHEAD = 1;

const OPENINGS_WORDS: Record<number, string> = {
  1: "One opening",
  2: "Two openings",
  3: "Three openings",
};

export function getNextIntake(now: Date = new Date()): {
  month: string;
  year: number;
  label: string;
} {
  const d = new Date(now.getFullYear(), now.getMonth() + MONTHS_AHEAD, 1);
  const month = d.toLocaleString("en-GB", { month: "long" });
  const year = d.getFullYear();
  return { month, year, label: `next intake ${month} ${year}` };
}

/** e.g. "Two openings · next intake July 2026" */
export function getAvailabilityLine(now: Date = new Date()): string {
  const openings = OPENINGS_WORDS[OPENINGS] ?? `${OPENINGS} openings`;
  return `${openings} · ${getNextIntake(now).label}`;
}
