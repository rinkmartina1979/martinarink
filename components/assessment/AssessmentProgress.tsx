"use client";

import { QUESTIONS } from "@/lib/assessment/questions";

interface Props {
  /** 0-based question index currently active */
  questionIndex: number;
}

const INTRO_COUNT = QUESTIONS.filter((q) => q.isIntro).length;
const MAIN_COUNT  = QUESTIONS.filter((q) => !q.isIntro).length;
const TOTAL       = QUESTIONS.length;

export function AssessmentProgress({ questionIndex }: Props) {
  const isIntroPhase = questionIndex < INTRO_COUNT;

  /* ── Labels ───────────────────────────────────────────────── */
  const phaseLabel = isIntroPhase
    ? `Before we begin — ${questionIndex + 1} of ${INTRO_COUNT}`
    : `Question ${questionIndex - INTRO_COUNT + 1} of ${MAIN_COUNT}`;

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={questionIndex + 1}
      aria-valuemax={TOTAL}
      aria-label={phaseLabel}
    >
      {/* Phase label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] tracking-[0.22em] uppercase text-ink-quiet font-[family-name:var(--font-body)]">
          {phaseLabel}
        </span>
        <span className="text-[11px] tracking-[0.22em] uppercase text-ink-quiet/50 font-[family-name:var(--font-body)]">
          Points of Departure
        </span>
      </div>

      {/* Segmented dot progress */}
      <div className="flex items-center gap-[5px]">
        {/* Intro dots */}
        {Array.from({ length: INTRO_COUNT }).map((_, i) => {
          const isActive   = i === questionIndex && isIntroPhase;
          const isDone     = i < questionIndex && isIntroPhase
                          || !isIntroPhase;
          return (
            <span
              key={`intro-${i}`}
              aria-hidden
              className={[
                "block transition-all duration-400",
                isActive
                  ? "h-[6px] w-6 rounded-[3px] bg-pink"
                  : isDone
                  ? "h-[3px] w-3 rounded-full bg-pink/40"
                  : "h-[3px] w-3 rounded-full bg-sand",
              ].join(" ")}
            />
          );
        })}

        {/* Separator dot */}
        <span aria-hidden className="mx-1 block h-[3px] w-[3px] rounded-full bg-sand/60" />

        {/* Main question dots */}
        {Array.from({ length: MAIN_COUNT }).map((_, i) => {
          const globalIdx  = INTRO_COUNT + i;
          const isActive   = globalIdx === questionIndex;
          const isDone     = globalIdx < questionIndex;
          return (
            <span
              key={`main-${i}`}
              aria-hidden
              className={[
                "block transition-all duration-400",
                isActive
                  ? "h-[6px] w-6 rounded-[3px] bg-pink"
                  : isDone
                  ? "h-[3px] w-3 rounded-full bg-pink/40"
                  : "h-[3px] w-3 rounded-full bg-sand",
              ].join(" ")}
            />
          );
        })}
      </div>

      {/* Thin hairline fill bar (accessibility / visual reinforcement) */}
      <div className="mt-3 h-px w-full bg-sand">
        <div
          className="h-px bg-pink/50 transition-all duration-500 ease-out"
          style={{ width: `${Math.round(((questionIndex + 1) / TOTAL) * 100)}%` }}
        />
      </div>
    </div>
  );
}
