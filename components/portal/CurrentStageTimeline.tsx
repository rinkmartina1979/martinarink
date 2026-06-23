/**
 * Quiet stage indicator — a single sentence, no progress bars or dots.
 * 2026 editorial approach: the client knows where she is without a widget.
 *
 * If enrolledAt is provided and the stage is active/integration, we show
 * the month number (e.g. "Month 2 · Your programme is active.").
 */

const STAGE_SENTENCE: Record<string, string> = {
  accepted:     "Your programme is being prepared.",
  consultation: "You are in your consultation phase.",
  onboarding:   "You are in your onboarding phase.",
  active:       "Your programme is active.",
  integration:  "You are in your final month.",
  completed:    "Your programme has concluded.",
};

function monthIn(enrolledAt: string): number {
  const start = new Date(enrolledAt).getTime();
  const now   = Date.now();
  return Math.max(1, Math.ceil((now - start) / (1000 * 60 * 60 * 24 * 30)));
}

export function CurrentStageTimeline({
  portalStage,
  enrolledAt,
}: {
  portalStage:  string | null;
  enrolledAt?:  string | null;
}) {
  const sentence = STAGE_SENTENCE[portalStage ?? ""] ?? "Your programme is underway.";
  const showMonth =
    enrolledAt && (portalStage === "active" || portalStage === "integration");
  const month = showMonth ? monthIn(enrolledAt!) : null;

  return (
    <div className="flex items-start gap-3 py-1 px-1">
      <span
        aria-hidden="true"
        className="flex-shrink-0 mt-[6px] w-1.5 h-1.5 rounded-full bg-aubergine/40"
      />
      <p className="text-[14px] text-ink-soft font-[family-name:var(--font-body)] leading-[1.6]">
        {month !== null && (
          <span className="text-ink font-medium">Month {month}.{" "}</span>
        )}
        {sentence}
      </p>
    </div>
  );
}
