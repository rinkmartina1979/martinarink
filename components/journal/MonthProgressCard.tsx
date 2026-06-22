/**
 * Quiet, editorial progress — no streaks, no shaming.
 * Presentational only.
 */
export function MonthProgressCard({
  monthIndex,
  mornings,
  evenings,
}: {
  monthIndex: number;
  mornings: number;
  evenings: number;
}) {
  return (
    <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">
        Where you are
      </p>
      <p className="font-[family-name:var(--font-display)] text-[22px] text-ink leading-snug">
        Month {monthIndex} of 3
      </p>
      <p className="mt-3 text-[14px] text-ink-soft leading-[1.7] font-[family-name:var(--font-body)]">
        {mornings} {mornings === 1 ? "morning" : "mornings"} · {evenings}{" "}
        {evenings === 1 ? "evening" : "evenings"} written so far.
      </p>
    </div>
  );
}
