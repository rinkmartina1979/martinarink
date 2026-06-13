"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, INTRO_QUESTIONS } from "@/lib/assessment/questions";
import { AssessmentIntro } from "./AssessmentIntro";
import { AssessmentQuestion } from "./AssessmentQuestion";
import { AssessmentEmailGate } from "./AssessmentEmailGate";
import { AssessmentProgress } from "./AssessmentProgress";
import { AssessmentLoading } from "./AssessmentLoading";
import { trackAssessment } from "@/lib/analytics/events";
import type { AnswerMap } from "@/lib/assessment/types";

type Stage =
  | { kind: "intro" }
  | { kind: "question"; questionIndex: number }
  | { kind: "emailgate"; afterQuestionIndex: number }
  | { kind: "complete" }
  | { kind: "submitting" }
  | { kind: "error"; message: string };

/** Index of the question that triggers the email gate */
const GATE_AFTER_INDEX = QUESTIONS.findIndex((q) => q.gateAfter === true);

/** Number of intro questions (shown before scored questions) */
const INTRO_COUNT = INTRO_QUESTIONS.length;

export function AssessmentShell() {
  const router = useRouter();
  const [stage, setStage]         = useState<Stage>({ kind: "intro" });
  const [answers, setAnswers]     = useState<AnswerMap>({});
  const [email, setEmail]         = useState("");
  const [firstName, setFirstName] = useState<string | undefined>();
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  /* Current 0-based question index */
  const currentQuestionIndex =
    stage.kind === "question" ? stage.questionIndex : null;

  const currentQuestion =
    currentQuestionIndex !== null ? QUESTIONS[currentQuestionIndex] : null;

  const selectedForCurrent =
    currentQuestion ? (answers[currentQuestion.id] ?? null) : null;

  /* ── HANDLERS ──────────────────────────────────────────────── */

  const handleBegin = useCallback(() => {
    trackAssessment("assessment_started");
    setStage({ kind: "question", questionIndex: 0 });
  }, []);

  const handleOptionSelect = useCallback(
    (questionIndex: number, optionIndex: number) => {
      const question = QUESTIONS[questionIndex];
      if (!question) return;

      const newAnswers = { ...answers, [question.id]: optionIndex };
      setAnswers(newAnswers);
      setPendingIndex(optionIndex);
      trackAssessment("assessment_question_answered", { questionIndex });

      setTimeout(() => {
        setPendingIndex(null);

        const isLast       = questionIndex === QUESTIONS.length - 1;
        const isGateQuestion = questionIndex === GATE_AFTER_INDEX;

        if (isGateQuestion && !email) {
          setStage({ kind: "emailgate", afterQuestionIndex: questionIndex });
          return;
        }

        if (isLast) {
          /* Move to a dedicated complete screen — no scrolling needed */
          setStage({ kind: "complete" });
          return;
        }

        setStage({ kind: "question", questionIndex: questionIndex + 1 });
      }, 320);
    },
    [answers, email, firstName], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleEmailContinue = useCallback(
    (collectedEmail: string, collectedFirstName?: string) => {
      trackAssessment("assessment_email_submitted");
      setEmail(collectedEmail);
      setFirstName(collectedFirstName);

      const nextIndex = GATE_AFTER_INDEX + 1;
      if (nextIndex >= QUESTIONS.length) {
        handleSubmit(answers, collectedEmail, collectedFirstName);
      } else {
        setStage({ kind: "question", questionIndex: nextIndex });
      }
    },
    [answers], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSubmit = useCallback(
    async (finalAnswers: AnswerMap, finalEmail: string, finalFirstName?: string) => {
      setStage({ kind: "submitting" });
      try {
        const res = await fetch("/api/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: finalAnswers,
            email:   finalEmail,
            firstName: finalFirstName,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error ?? "Something went wrong. Please try again.");
        }

        const data = await res.json();
        trackAssessment("assessment_completed", {
          archetype:     data.archetype,
          serviceIntent: data.serviceIntent,
          readinessLevel: data.readinessLevel,
        });
        router.push(`/assessment/result/${data.resultId}`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong.";
        setStage({ kind: "error", message });
      }
    },
    [router],
  );

  /* ── RENDER ─────────────────────────────────────────────────── */

  return (
    <div className="min-h-[540px] flex flex-col">

      {/* Progress — shown while answering questions, at email gate, or on complete screen */}
      {(stage.kind === "question" || stage.kind === "emailgate" || stage.kind === "complete") && (
        <div className="mb-10">
          <AssessmentProgress
            questionIndex={
              stage.kind === "complete"
                ? QUESTIONS.length          // signals "all done" to the progress bar
                : stage.kind === "question"
                ? stage.questionIndex
                : GATE_AFTER_INDEX
            }
          />
        </div>
      )}

      {/* Stage content */}
      <div className="flex-1">

        {stage.kind === "intro" && (
          <AssessmentIntro onBegin={handleBegin} />
        )}

        {stage.kind === "question" && currentQuestion && (
          <div key={`q-${currentQuestion.id}`}>
            <AssessmentQuestion
              question={currentQuestion}
              selectedIndex={pendingIndex !== null ? pendingIndex : selectedForCurrent}
              onSelect={(optionIndex) =>
                handleOptionSelect(stage.questionIndex, optionIndex)
              }
            />

            {/* Back navigation */}
            {stage.questionIndex > 0 && (
              <button
                type="button"
                onClick={() =>
                  setStage({
                    kind: "question",
                    questionIndex: stage.questionIndex - 1,
                  })
                }
                className="mt-8 text-[11px] tracking-[0.18em] uppercase text-ink-quiet hover:text-ink-soft transition-colors font-[family-name:var(--font-body)]"
              >
                ← Previous
              </button>
            )}
          </div>
        )}

        {/* ── COMPLETE SCREEN — replaces the question entirely ── */}
        {stage.kind === "complete" && (
          <div className="animate-[fadeUp_0.5s_ease-out_both] flex flex-col items-start gap-6 py-4">
            <div className="h-px w-14 bg-pink" aria-hidden />
            <h2 className="font-[family-name:var(--font-display)] text-[28px] md:text-[34px] leading-[1.15] text-ink max-w-md">
              Your letter is ready to be written.
            </h2>
            <p className="text-[15px] leading-[1.75] text-ink-soft max-w-sm font-[family-name:var(--font-body)]">
              Ten questions answered. What comes next is yours alone — a private
              letter written specifically for where you are right now.
            </p>
            <button
              type="button"
              onClick={() => handleSubmit(answers, email, firstName)}
              className="mt-2 inline-flex items-center justify-center gap-3
                         bg-plum text-cream uppercase tracking-[0.18em]
                         text-[12px] font-medium px-10 py-4 rounded-[1px]
                         hover:bg-plum-deep transition-colors duration-200
                         font-[family-name:var(--font-body)]"
            >
              Receive my private letter&nbsp;<span aria-hidden>→</span>
            </button>
            <p className="text-[11px] tracking-[0.14em] uppercase text-ink-quiet/60 font-[family-name:var(--font-body)]">
              Private &middot; Confidential &middot; Yours alone
            </p>
          </div>
        )}

        {stage.kind === "emailgate" && (
          <AssessmentEmailGate onContinue={handleEmailContinue} />
        )}

        {stage.kind === "submitting" && <AssessmentLoading />}

        {stage.kind === "error" && (
          <div className="flex flex-col items-center gap-6 text-center py-12 animate-[fadeUp_0.4s_ease-out_both]">
            <p className="text-[16px] text-ink-soft leading-[1.7] max-w-sm">
              {stage.message}
            </p>
            <button
              type="button"
              onClick={() =>
                setStage({ kind: "question", questionIndex: QUESTIONS.length - 1 })
              }
              className="inline-flex items-center justify-center bg-plum text-cream uppercase tracking-[0.18em] text-[12px] font-medium px-8 py-3 rounded-[1px] hover:bg-plum-deep transition-colors duration-200"
            >
              Try again
            </button>
          </div>
        )}

      </div>


    </div>
  );
}
