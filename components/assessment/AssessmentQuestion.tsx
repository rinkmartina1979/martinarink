"use client";

import { AssessmentOption } from "./AssessmentOption";
import type { AssessmentQuestion as QuestionType } from "@/lib/assessment/types";

interface Props {
  question: QuestionType;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export function AssessmentQuestion({ question, selectedIndex, onSelect }: Props) {
  /* Intro questions use body-font styling — more conversational.
     Main questions use display-font — editorial weight. */
  const isIntro = question.isIntro === true;

  return (
    <div key={question.id} className="w-full animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">

      {/* Section badge */}
      {isIntro && (
        <p className="mb-5 text-[10px] tracking-[0.3em] uppercase text-pink font-[family-name:var(--font-body)]">
          Before we begin
        </p>
      )}

      {/* Question text */}
      {isIntro ? (
        <h2 className="font-[family-name:var(--font-body)] font-medium text-[20px] md:text-[24px] leading-[1.35] text-ink mb-3">
          {question.question}
        </h2>
      ) : (
        <h2 className="font-[family-name:var(--font-display)] text-[24px] md:text-[32px] leading-[1.2] tracking-[-0.015em] text-ink mb-3">
          {question.question}
        </h2>
      )}

      {question.subtext && (
        <p className="text-[14px] leading-[1.65] text-ink-quiet mb-8 max-w-sm">
          {question.subtext}
        </p>
      )}

      {/* Options */}
      <div className="flex flex-col gap-3 mt-7">
        {question.options.map((option, i) => (
          <AssessmentOption
            key={option.id}
            label={option.label}
            selected={selectedIndex === i}
            onSelect={() => onSelect(i)}
            index={i}
          />
        ))}
      </div>

    </div>
  );
}
