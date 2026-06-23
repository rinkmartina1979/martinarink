import Link from "next/link";
import type { ProgrammeDefinition } from "@/sanity/lib/membersQueries";

interface ProgrammeCardProps {
  programme: ProgrammeDefinition | null;
  enrolledAt: string | null;
  expectedCompletionAt: string | null;
  token: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Inline SVG — checkmark tick
function Tick() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="flex-shrink-0 mt-[3px]"
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

export function ProgrammeCard({
  programme,
  enrolledAt,
  expectedCompletionAt,
  token,
}: ProgrammeCardProps) {
  if (!programme) return null;

  return (
    <section className="bg-bone border border-sand/30 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-2">
            Your programme
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-[22px] md:text-[26px] text-ink leading-snug">
            {programme.name}
          </h2>
          {programme.tagline && (
            <p className="mt-1 text-[15px] text-ink-soft leading-[1.7]">
              {programme.tagline}
            </p>
          )}
        </div>
        {programme.durationDisplay && (
          <span className="flex-shrink-0 text-[11px] uppercase tracking-[0.18em] text-ink-quiet border border-sand/60 px-3 py-1.5 rounded-[1px]">
            {programme.durationDisplay}
          </span>
        )}
      </div>

      {programme.includedItems && programme.includedItems.length > 0 && (
        <ul className="space-y-2 mb-6">
          {programme.includedItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] text-ink-soft leading-[1.65]">
              <Tick />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {(enrolledAt || expectedCompletionAt) && (
        <div className="border-t border-sand/30 pt-4 flex flex-wrap gap-x-8 gap-y-1">
          {enrolledAt && (
            <p className="text-[12px] text-ink-quiet">
              <span className="uppercase tracking-[0.12em] mr-2">Started</span>
              {formatDate(enrolledAt)}
            </p>
          )}
          {expectedCompletionAt && (
            <p className="text-[12px] text-ink-quiet">
              <span className="uppercase tracking-[0.12em] mr-2">Expected completion</span>
              {formatDate(expectedCompletionAt)}
            </p>
          )}
        </div>
      )}

      <div className="mt-5">
        <Link
          href={`/members/${token}/resources`}
          className="text-[12px] uppercase tracking-[0.18em] text-plum hover:text-plum-deep transition-colors underline underline-offset-4"
        >
          View your resources
        </Link>
      </div>
    </section>
  );
}
