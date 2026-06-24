import Link from "next/link";
import { WORKBOOK_TOTAL } from "@/lib/workbook/sections";

/**
 * Dashboard card — foundation workbook progress.
 * Calm, no gamification. Mirrors JournalStatusCard structure.
 */
export function WorkbookCard({
  startedKeys,
  href,
}: {
  startedKeys: string[];
  href: string;
}) {
  const count = startedKeys.length;
  const done = count >= WORKBOOK_TOTAL;

  return (
    <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">
        Your foundation
      </p>
      <p className="font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
        {done ? "Foundation complete." : `${count} of ${WORKBOOK_TOTAL} sections`}
      </p>
      <p className="mt-2 text-[14px] text-ink-soft font-[family-name:var(--font-body)] leading-[1.6]">
        {count === 0
          ? "The written foundation of your programme — begin when you're ready."
          : done
          ? "All foundation exercises complete."
          : "The identity work at the heart of your programme."}
      </p>
      <Link
        href={href}
        className="mt-5 inline-block text-[13px] text-plum hover:text-plum-deep transition-colors"
      >
        {count === 0 ? "Open your workbook →" : "Continue your workbook →"}
      </Link>
    </div>
  );
}
