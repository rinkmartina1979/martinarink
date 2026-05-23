/**
 * FunnelProgress — "You are here" indicator
 *
 * Shown at the top of every conversion page:
 * Assessment → Result → Apply → Consultation
 *
 * Makes the user feel momentum, not confusion.
 * Keeps cognitive load low — one line, always visible.
 */

interface Step {
  label: string;
  sublabel?: string;
}

const STEPS: Step[] = [
  { label: "Assessment",    sublabel: "5 min" },
  { label: "Your result",   sublabel: "private letter" },
  { label: "Apply",         sublabel: "5 questions" },
  { label: "Consultation",  sublabel: "€350 · 45 min" },
];

type StepVariant = "done" | "active" | "upcoming";

interface FunnelProgressProps {
  /** 1-based index of the active step */
  activeStep: 1 | 2 | 3 | 4;
  /** "light" = on dark (aubergine) bg; "dark" = on cream/bone bg */
  variant?: "light" | "dark";
}

export function FunnelProgress({ activeStep, variant = "dark" }: FunnelProgressProps) {
  const isLight = variant === "light";

  function stepVariant(index: number): StepVariant {
    if (index + 1 < activeStep) return "done";
    if (index + 1 === activeStep) return "active";
    return "upcoming";
  }

  return (
    <div
      className={[
        "w-full border-b",
        isLight ? "border-cream/10 bg-aubergine" : "border-sand/60 bg-cream",
      ].join(" ")}
    >
      <div className="container-content max-w-3xl mx-auto">
        <div className="flex items-stretch">
          {STEPS.map((step, i) => {
            const v = stepVariant(i);
            const isLast = i === STEPS.length - 1;

            return (
              <div
                key={step.label}
                className={[
                  "flex-1 flex flex-col justify-center py-3 px-3 md:px-5",
                  "relative",
                  /* Active underline */
                  v === "active" ? "border-b-2 border-pink -mb-px" : "",
                ].join(" ")}
              >
                {/* Step number + connector */}
                <div className="flex items-center gap-2 mb-[3px]">
                  {/* Dot */}
                  <span
                    className={[
                      "shrink-0 w-[18px] h-[18px] rounded-full border flex items-center justify-center",
                      "text-[9px] font-semibold transition-all duration-300",
                      v === "done"
                        ? isLight
                          ? "bg-pink/80 border-pink/80 text-aubergine"
                          : "bg-pink border-pink text-cream"
                        : v === "active"
                        ? isLight
                          ? "bg-cream border-cream text-aubergine"
                          : "bg-ink border-ink text-cream"
                        : isLight
                        ? "bg-transparent border-cream/20 text-cream/30"
                        : "bg-transparent border-sand text-ink-quiet/40",
                    ].join(" ")}
                    aria-hidden
                  >
                    {v === "done" ? "✓" : i + 1}
                  </span>

                  {/* Connector line (between steps) */}
                  {!isLast && (
                    <span
                      className={[
                        "hidden md:block flex-1 h-px",
                        v === "done"
                          ? "bg-pink/40"
                          : isLight
                          ? "bg-cream/10"
                          : "bg-sand/60",
                      ].join(" ")}
                      aria-hidden
                    />
                  )}
                </div>

                {/* Label */}
                <p
                  className={[
                    "text-[10px] md:text-[11px] font-medium uppercase tracking-[0.16em] leading-tight",
                    "transition-colors duration-200",
                    "font-[family-name:var(--font-body)]",
                    v === "active"
                      ? isLight
                        ? "text-cream"
                        : "text-ink"
                      : v === "done"
                      ? isLight
                        ? "text-cream/60"
                        : "text-ink-quiet"
                      : isLight
                      ? "text-cream/25"
                      : "text-ink-quiet/35",
                  ].join(" ")}
                >
                  {step.label}
                </p>

                {/* Sublabel — desktop only */}
                {step.sublabel && (
                  <p
                    className={[
                      "hidden md:block text-[9px] tracking-[0.1em] mt-[2px]",
                      "font-[family-name:var(--font-body)]",
                      v === "active"
                        ? isLight
                          ? "text-cream/60"
                          : "text-ink-quiet"
                        : "text-transparent",
                    ].join(" ")}
                  >
                    {step.sublabel}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
