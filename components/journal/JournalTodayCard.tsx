import Link from "next/link";

/**
 * Entry-point card for one of today's rituals. Presentational only.
 * `done` reflects whether an entry already exists for today.
 */
export function JournalTodayCard({
  title,
  german,
  href,
  done,
}: {
  title: string;
  german: string;
  href: string;
  done: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block bg-bone border border-sand/40 p-6 rounded-[1px] hover:border-aubergine transition-colors duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
            {title}
          </p>
          <p className="text-[13px] text-ink-quiet italic mt-1">{german}</p>
        </div>
        <span
          className="flex-shrink-0 w-4 h-4 rounded-full mt-1.5 flex items-center justify-center"
          aria-hidden="true"
        >
          {done ? (
            <span className="w-4 h-4 rounded-full bg-aubergine flex items-center justify-center">
              <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#F7F3EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-sand/70" />
          )}
        </span>
      </div>
      <p className="mt-4 text-[13px] text-plum group-hover:text-plum-deep transition-colors">
        {done ? "Revisit →" : "Begin →"}
      </p>
    </Link>
  );
}
