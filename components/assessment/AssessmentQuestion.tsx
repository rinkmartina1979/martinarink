"use client";

import { AssessmentOption } from "./AssessmentOption";
import type { AssessmentQuestion as QuestionType } from "@/lib/assessment/types";

interface Props {
  question: QuestionType;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export function AssessmentQuestion({ question, selectedIndex, onSelect }: Props) {
  return (
    <div className="w-full animate-[fadeUp_0.45s_ease-out_both]">
      {/* Question text */}
      <h2 className="font-[family-name:var(--font-display)] text-[26px] md:text-[32px] leading-[1.2] text-ink mb-3">
        {question.question}
      </h2>

      {question.subtext && (
        <p className="text-[14px] leading-[1.6] text-ink-quiet mb-8">
          {question.subtext}
        </p>
      )}

      {/* Options */}
      <div className="flex flex-col gap-3 mt-8">
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
