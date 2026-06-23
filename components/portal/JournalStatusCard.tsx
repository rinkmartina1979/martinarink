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

  let reflectionLine: string;
  if (total === 0) {
    reflectionLine = "Your first reflection is here when you’re ready.";
  } else if (mornings > 0 && evenings > 0) {
    reflectionLine = `${mornings} morning${mornings !== 1 ? "s" : ""} · ${evenings} evening${evenings !== 1 ? "s" : ""} this month.`;
  } else if (mornings > 0) {
    reflectionLine = `${mornings} morning reflection${mornings !== 1 ? "s" : ""} this month.`;
  } else {
    reflectionLine = `${evenings} evening reflection${evenings !== 1 ? "s" : ""} this month.`;
  }

  return (
    <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">Your journal</p>
      <p className="font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
        Month {monthIndex}
      </p>
      <p className="mt-2 text-[14px] text-ink-soft font-[family-name:var(--font-body)] leading-[1.6]">
        {reflectionLine}
      </p>
      <Link
        href={href}
        className="mt-5 inline-block text-[13px] text-plum hover:text-plum-deep transition-colors"
      >
        {total === 0 ? "Open your journal →" : "Continue your journal →"}
      </Link>
    </div>
  );
}
