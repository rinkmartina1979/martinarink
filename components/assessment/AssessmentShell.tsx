"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/lib/assessment/questions";
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
  | { kind: "submitting" }
  | { kind: "error"; message: string };

const GATE_AFTER_INDEX = QUESTIONS.findIndex((q) => q.gateAfter === true);

export function AssessmentShell() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>({ kind: "intro" });
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState<string | undefined>();
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  // Current display question index (0-based)
  const currentQuestionIndex =
    stage.kind === "question" ? stage.questionIndex : null;

  const currentQuestion =
    currentQuestionIndex !== null ? QUESTIONS[currentQuestionIndex] : null;

  const selectedForCurrent =
    currentQuestion !== null && currentQuestion !== undefined
      ? (answers[currentQuestion.id] ?? null)
      : null;

  // ── HANDLERS ─────────────────────────────────────────────────

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

      // Brief delay so the selected state animates before advancing
      setTimeout(() => {
        setPendingIndex(null);

        const isLast = questionIndex === QUESTIONS.length - 1;
        const isGateQuestion = questionIndex === GATE_AFTER_INDEX;

        if (isGateQuestion && !email) {
          // Show email gate
          setStage({ kind: "emailgate", afterQuestionIndex: questionIndex });
          return;
        }

        if (isLast) {
          // All done — submit
          handleSubmit(newAnswers, email, firstName);
          return;
        }

        setStage({ kind: "question", questionIndex: questionIndex + 1 });
      }, 350);
    },
    [answers, email, firstName] // eslint-disable-line react-hooks/exhaustive-deps
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
    [answers] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSubmit = useCallback(
    async (
      finalAnswers: AnswerMap,
      finalEmail: string,
      finalFirstName?: string
    ) => {
      setStage({ kind: "submitting" });
      try {
        const res = await fetch("/api/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: finalAnswers,
            email: finalEmail,
            firstName: finalFirstName,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error ?? "Something went wrong. Please try again.");
        }

        const data = await res.json();
        trackAssessment("assessment_completed", {
          archetype: data.archetype,
          serviceIntent: data.serviceIntent,
          readinessLevel: data.readinessLevel,
        });
        router.push(`/assessment/result/${data.resultId}`);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setStage({ kind: "error", message });
      }
    },
    [router]
  );

  // ── VISIBLE QUESTION NUMBER (skips the email gate in the count) ──
  const visibleQuestionNumber =
    stage.kind === "question" ? stage.questionIndex + 1 : null;

  // ── RENDER ────────────────────────────────────────────────────

  return (
    <div className="min-h-[540px] flex flex-col">
      {/* Progress bar — only during questions */}
      {(stage.kind === "question" || stage.kind === "emailgate") && (
        <div className="mb-10">
          <AssessmentProgress
            current={
              stage.kind === "question"
                ? stage.questionIndex + 1
                : GATE_AFTER_INDEX + 1
            }
            total={QUESTIONS.length}
          />
        </div>
      )}

      {/* Stage content */}
      <div className="flex-1">
        {stage.kind === "intro" && (
          <AssessmentIntro onBegin={handleBegin} />
        )}

        {stage.kind === "question" && currentQuestion && (
          <div key={currentQuestion.id}>
            <AssessmentQuestion
              question={currentQuestion}
              selectedIndex={
                pendingIndex !== null ? pendingIndex : selectedForCurrent
              }
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
                className="mt-8 text-[12px] tracking-[0.15em] uppercase text-ink-quiet hover:text-ink-soft transition-colors"
              >
                ← Previous
              </button>
            )}
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
              className="inline-flex items-center justify-center bg-wine text-cream uppercase tracking-[0.18em] text-[12px] font-medium px-8 py-3 rounded-[1px] hover:bg-wine-deep transition-colors duration-200"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Question number label (bottom) */}
      {visibleQuestionNumber && stage.kind === "question" && (
        <div className="mt-12 pt-6 border-t border-sand">
          <p className="text-[12px] tracking-[0.15em] uppercase text-ink-quiet">
            Question {visibleQuestionNumber} of {QUESTIONS.length}
          </p>
        </div>
      )}
    </div>
  );
}
