"use client";

interface Props {
  current: number; // 1-indexed
  total: number;
}

export function AssessmentProgress({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] tracking-[0.2em] uppercase text-ink-quiet font-[family-name:var(--font-body)]">
          {current} of {total}
        </span>
        <span className="text-[11px] tracking-[0.2em] uppercase text-ink-quiet font-[family-name:var(--font-body)]">
          Points of Departure
        </span>
      </div>
      <div className="h-[1px] bg-sand w-full">
        <div
          className="h-[1px] bg-pink transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
