import Link from "next/link";

/**
 * Calm journal status — month + reflection count, no streaks.
 */
export function JournalStatusCard({
  monthIndex,
  mornings,
  evenings,
  href,
}: {
  monthIndex: number;
  mornings: number;
  evenings: number;
  href: string;
}) {
  const total = mornings + evenings;
  return (
    <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">Your journal</p>
      <p className="font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
        Month {monthIndex} in progress
      </p>
      <p className="mt-2 text-[14px] text-ink-soft font-[family-name:var(--font-body)]">
        {total === 0
          ? "Your first reflection is waiting when you are."
          : `${total} ${total === 1 ? "reflection" : "reflections"} saved.`}
      </p>
      <Link
        href={href}
        className="mt-5 inline-block text-[13px] text-plum hover:text-plum-deep transition-colors"
      >
        Continue your journal →
      </Link>
    </div>
  );
}
