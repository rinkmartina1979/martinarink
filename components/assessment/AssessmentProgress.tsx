"use client";

import { QUESTIONS } from "@/lib/assessment/questions";

interface Props {
  /** 0-based question index currently active (pass QUESTIONS.length for "complete") */
  questionIndex: number;
}

const INTRO_COUNT = QUESTIONS.filter((q) => q.isIntro).length;
const MAIN_COUNT  = QUESTIONS.filter((q) => !q.isIntro).length;
const TOTAL       = QUESTIONS.length;

export function AssessmentProgress({ questionIndex }: Props) {
  const isComplete   = questionIndex >= TOTAL;
  const isIntroPhase = !isComplete && questionIndex < INTRO_COUNT;

  /*
   * Dot tracking:
   *  - Intro phase  → show INTRO_COUNT compact dots only
   *  - Main phase   → show MAIN_COUNT dots only (stays in sync with "Question N of 7")
   *  - Complete     → show MAIN_COUNT dots all filled
   */
  const mainQuestionIndex = isIntroPhase || isComplete
    ? (isComplete ? MAIN_COUNT : -1)
    : questionIndex - INTRO_COUNT; // 0-based; -1 while intro

  const phaseLabel = isComplete
    ? `All ${MAIN_COUNT} questions complete`
    : isIntroPhase
    ? `Before we begin — ${questionIndex + 1} of ${INTRO_COUNT}`
    : `Question ${mainQuestionIndex + 1} of ${MAIN_COUNT}`;

  const fillPct = isComplete
    ? 100
    : isIntroPhase
    ? Math.round(((questionIndex + 1) / INTRO_COUNT) * 30)
    : Math.round(((mainQuestionIndex + 1) / MAIN_COUNT) * 100);

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={isComplete ? TOTAL : questionIndex + 1}
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

      {/* Segmented dots */}
      <div className="flex items-center gap-[5px]">
        {isIntroPhase ? (
          /* ── Intro: INTRO_COUNT compact dots ── */
          Array.from({ length: INTRO_COUNT }).map((_, i) => {
            const isActive = i === questionIndex;
            const isDone   = i < questionIndex;
            return (
              <span
                key={`intro-${i}`}
                aria-hidden
                className={[
                  "block transition-all duration-300",
                  isActive ? "h-[6px] w-6 rounded-[3px] bg-pink"
                  : isDone  ? "h-[3px] w-3 rounded-full bg-pink/40"
                  :           "h-[3px] w-3 rounded-full bg-sand",
                ].join(" ")}
              />
            );
          })
        ) : (
          /* ── Main / Complete: exactly MAIN_COUNT dots ── */
          Array.from({ length: MAIN_COUNT }).map((_, i) => {
            const isActive = !isComplete && i === mainQuestionIndex;
            const isDone   = isComplete || i < mainQuestionIndex;
            return (
              <span
                key={`main-${i}`}
                aria-hidden
                className={[
                  "block transition-all duration-300",
                  isActive ? "h-[6px] w-6 rounded-[3px] bg-pink"
                  : isDone  ? "h-[3px] w-3 rounded-full bg-pink/40"
                  :           "h-[3px] w-3 rounded-full bg-sand",
                ].join(" ")}
              />
            );
          })
        )}
      </div>

      {/* Hairline fill bar */}
      <div className="mt-3 h-px w-full bg-sand">
        <div
          className="h-px bg-pink/50 transition-all duration-500 ease-out"
          style={{ width: `${fillPct}%` }}
        />
      </div>
    </div>
  );
}
