/**
 * Quiet horizontal stage spine. Shows where the client is, no progress bar.
 */

const STAGES = [
  { key: "consultation", label: "Consultation" },
  { key: "onboarding", label: "Onboarding" },
  { key: "active", label: "Programme" },
  { key: "integration", label: "Final month" },
] as const;

// Map every clientProfile.portalStage to an index on the 4-step spine.
const STAGE_INDEX: Record<string, number> = {
  accepted: 0,
  consultation: 0,
  onboarding: 1,
  active: 2,
  integration: 3,
  completed: 3,
};

export function CurrentStageTimeline({ portalStage }: { portalStage: string | null }) {
  const current = STAGE_INDEX[portalStage ?? ""] ?? 1;

  return (
    <div className="bg-bone border border-sand/40 px-6 py-5 rounded-[1px]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-5">Where you are</p>
      <ol className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
        {STAGES.map((stage, i) => {
          const done = i < current;
          const here = i === current;
          return (
            <li key={stage.key} className="flex items-center gap-3 sm:flex-1">
              <span
                aria-hidden="true"
                className={[
                  "flex-shrink-0 w-2.5 h-2.5 rounded-full",
                  here ? "bg-aubergine ring-4 ring-aubergine/15" : done ? "bg-aubergine" : "bg-sand/60",
                ].join(" ")}
              />
              <span
                className={[
                  "text-[13px] font-[family-name:var(--font-body)]",
                  here ? "text-ink" : "text-ink-quiet",
                ].join(" ")}
              >
                {stage.label}
              </span>
              {i < STAGES.length - 1 && (
                <span aria-hidden="true" className="hidden sm:block flex-1 h-px bg-sand/40 mx-2" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
