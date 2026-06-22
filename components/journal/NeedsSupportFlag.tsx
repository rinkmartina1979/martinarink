import { CRISIS_RESOURCES } from "@/lib/journal/prompts";

/**
 * Crisis-resources panel. Shown whenever an entry is flagged "I'd like support".
 * Phase-1 wording is DE-focused, non-emergency. FINAL CLINICAL WORDING IS FLAGGED
 * FOR HUMAN REVIEW (Ruta Nürnberger) before this is treated as production-final.
 */
export function NeedsSupportFlag() {
  return (
    <div className="border border-pink/50 bg-blush/40 p-5 rounded-[1px]" role="note">
      <p className="text-[10px] uppercase tracking-[0.26em] text-ink-quiet mb-3 font-[family-name:var(--font-body)]">
        A gentle note
      </p>
      <p className="text-[14px] leading-[1.7] text-ink-soft mb-4 font-[family-name:var(--font-body)]">
        {CRISIS_RESOURCES.disclaimer}
      </p>
      <dl className="space-y-2">
        {CRISIS_RESOURCES.lines.map((line) => (
          <div key={line.label} className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="text-[13px] text-ink-quiet sm:w-56 flex-shrink-0 font-[family-name:var(--font-body)]">
              {line.label}
            </dt>
            <dd className="text-[14px] text-ink font-[family-name:var(--font-body)]">
              {line.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
