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

  /*
   * Dot tracking:
   *  - Intro phase: show a single compact "Before we begin" indicator (no numbered dots)
   *  - Main phase: show exactly MAIN_COUNT dots — one per scored question.
   *    This keeps the dot count and "Question N of 7" label in sync.
   */
  const mainQuestionIndex = isIntroPhase ? -1 : questionIndex - INTRO_COUNT; // 0-based, -1 if intro

  const phaseLabel = isIntroPhase
    ? `Before we begin — ${questionIndex + 1} of ${INTRO_COUNT}`
    : `Question ${mainQuestionIndex + 1} of ${MAIN_COUNT}`;

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

      {/* Segmented dots */}
      <div className="flex items-center gap-[5px]">
        {isIntroPhase ? (
          /* ── Intro phase: 3 compact dots, no numbered labels ── */
          Array.from({ length: INTRO_COUNT }).map((_, i) => {
            const isActive = i === questionIndex;
            const isDone   = i < questionIndex;
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
          })
        ) : (
          /* ── Main phase: exactly 7 dots — matches "Question N of 7" label ── */
          Array.from({ length: MAIN_COUNT }).map((_, i) => {
            const isActive = i === mainQuestionIndex;
            const isDone   = i < mainQuestionIndex;
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
          })
        )}
      </div>

      {/* Thin hairline fill bar */}
      <div className="mt-3 h-px w-full bg-sand">
        <div
          className="h-px bg-pink/50 transition-all duration-500 ease-out"
          style={{
            width: isIntroPhase
              ? `${Math.round(((questionIndex + 1) / INTRO_COUNT) * 30)}%`
              : `${Math.round(((mainQuestionIndex + 1) / MAIN_COUNT) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
