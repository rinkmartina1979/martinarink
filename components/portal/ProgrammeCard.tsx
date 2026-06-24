import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProgrammeDefinition } from "@/sanity/lib/membersQueries";

interface ProgrammeCardProps {
  programme: ProgrammeDefinition | null;
  enrolledAt: string | null;
  expectedCompletionAt: string | null;
  token: string;
  programmeKey?: string | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Tick() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="flex-shrink-0 mt-[3px] text-plum"
    >
      <path
        d="M2 6l3 3 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Fallback data — shown automatically when no Sanity programme document exists yet.
// Copy is Martina-voice compliant: no banned words, no exclamation marks.
const FALLBACKS: Record<string, Omit<ProgrammeDefinition, "_id" | "programmeId">> = {
  "sober-muse": {
    name: "The Sober Muse Method",
    tagline: "90 days of private 1:1 support — structured, personal, unhurried.",
    durationDisplay: "90 days",
    includedItems: [
      "Weekly private sessions with Martina",
      "90-day personal journal with daily prompts",
      "Personalised audio drops released throughout",
      "Direct WhatsApp support between sessions",
      "Final integration session and transition plan",
    ],
  },
  empowerment: {
    name: "Female Empowerment & Leadership",
    tagline: "3–12 months of leadership and identity work — for women who want to lead on their own terms.",
    durationDisplay: "3–12 months",
    includedItems: [
      "Bi-weekly private sessions with Martina",
      "Leadership identity framework and workbook",
      "Private journal and audio drops",
      "Clinical partnership with Ruta (patent engineer & coach)",
      "WhatsApp support and session recordings",
    ],
  },
};

/* ── Month progress derivation ──────────────────────────────────── */

interface MonthProgress {
  current: number;
  total: number;
  daysRemaining: number | null;
}

function deriveMonthProgress(
  enrolledAt: string | null,
  expectedCompletionAt: string | null,
  programmeKey: string | null | undefined,
): MonthProgress | null {
  if (!enrolledAt) return null;

  const start = new Date(enrolledAt);
  if (isNaN(start.getTime())) return null;

  const now = new Date();
  const daysSince = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  const current = Math.max(1, Math.floor(daysSince / 30) + 1);

  // Derive total months from expectedCompletionAt, then programme-key defaults.
  let total: number;
  let endDate: Date | null = null;

  if (expectedCompletionAt) {
    const end = new Date(expectedCompletionAt);
    if (!isNaN(end.getTime())) {
      endDate = end;
      const totalDays = Math.max(30, Math.floor((end.getTime() - start.getTime()) / 86_400_000));
      total = Math.round(totalDays / 30);
    } else {
      total = programmeKey === "sober-muse" ? 3 : 6;
    }
  } else {
    // Fallback totals — sober-muse is always 3; empowerment default to 6 for display.
    total = programmeKey === "sober-muse" ? 3 : 6;
    // Synthetic end for remaining-days calc on sober-muse.
    if (programmeKey === "sober-muse") {
      endDate = new Date(start.getTime() + 90 * 86_400_000);
    }
  }

  // Days remaining — only show if end is known and in the future.
  let daysRemaining: number | null = null;
  if (endDate) {
    const diff = Math.ceil((endDate.getTime() - now.getTime()) / 86_400_000);
    if (diff > 0) daysRemaining = diff;
  }

  return { current: Math.min(current, total), total, daysRemaining };
}

/* ── Month progress segment track ───────────────────────────────── */

function MonthProgressTrack({ progress }: { progress: MonthProgress }) {
  const { current, total, daysRemaining } = progress;
  const showLabels = total <= 6;

  return (
    <div className="mt-5 border-t border-sand/30 pt-5">
      {/* Eyebrow row */}
      <div className="flex items-baseline justify-between mb-3.5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
          Month {current} of {total}
        </p>
        {daysRemaining !== null && (
          <p className="text-[11px] text-ink-quiet font-[family-name:var(--font-body)]">
            {daysRemaining === 1 ? "1 day remaining" : `${daysRemaining} days remaining`}
          </p>
        )}
      </div>

      {/* Segmented track */}
      <div
        className="flex gap-1.5"
        role="img"
        aria-label={`Programme progress: month ${current} of ${total}`}
      >
        {Array.from({ length: total }, (_, i) => {
          const monthNum = i + 1;
          const filled = monthNum <= current;
          return (
            <div key={i} className="flex-1 flex flex-col gap-1.5">
              <div
                className={cn(
                  "h-[3px] rounded-[1px]",
                  filled ? "bg-plum" : "bg-sand/40",
                )}
              />
              {showLabels && (
                <p className="text-[9px] text-center text-ink-quiet/50 tabular-nums">
                  {monthNum}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── ProgrammeCard ──────────────────────────────────────────────── */

export function ProgrammeCard({
  programme,
  enrolledAt,
  expectedCompletionAt,
  token,
  programmeKey,
}: ProgrammeCardProps) {
  const fallback = programmeKey ? FALLBACKS[programmeKey] : null;
  const data: Partial<ProgrammeDefinition> | null = programme ?? fallback ?? null;

  if (!data) return null;

  const progress = deriveMonthProgress(enrolledAt, expectedCompletionAt, programmeKey);

  return (
    <section className="bg-bone border border-sand/30 p-6 md:p-8">
      {/* Header row — name + duration chip */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-2">
            Your programme
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-[22px] md:text-[26px] text-ink leading-snug">
            {data.name}
          </h2>
          {data.tagline && (
            <p className="mt-1 text-[15px] text-ink-soft leading-[1.7] font-[family-name:var(--font-body)]">
              {data.tagline}
            </p>
          )}
        </div>
        {data.durationDisplay && (
          <span className="flex-shrink-0 text-[11px] uppercase tracking-[0.18em] text-ink-quiet border border-sand/60 px-3 py-1.5 rounded-[1px]">
            {data.durationDisplay}
          </span>
        )}
      </div>

      {/* What's included */}
      {data.includedItems && data.includedItems.length > 0 && (
        <ul className="space-y-2 mb-6" aria-label="What's included">
          {data.includedItems.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-[14px] text-ink-soft leading-[1.65] font-[family-name:var(--font-body)]"
            >
              <Tick />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Enrolment dates */}
      {(enrolledAt || expectedCompletionAt) && (
        <div className="border-t border-sand/30 pt-4 flex flex-wrap gap-x-8 gap-y-1">
          {enrolledAt && (
            <p className="text-[12px] text-ink-quiet font-[family-name:var(--font-body)]">
              <span className="uppercase tracking-[0.12em] mr-2">Started</span>
              {formatDate(enrolledAt)}
            </p>
          )}
          {expectedCompletionAt && (
            <p className="text-[12px] text-ink-quiet font-[family-name:var(--font-body)]">
              <span className="uppercase tracking-[0.12em] mr-2">Expected completion</span>
              {formatDate(expectedCompletionAt)}
            </p>
          )}
        </div>
      )}

      {/* Month progress track — only when the programme has started */}
      {progress && <MonthProgressTrack progress={progress} />}

      {/* Resource link */}
      <div className="mt-6 pt-4 border-t border-sand/30">
        <Link
          href={`/members/${token}/resources`}
          className="text-[12px] uppercase tracking-[0.18em] text-plum hover:text-plum-deep transition-colors"
        >
          View your resources →
        </Link>
      </div>
    </section>
  );
}
