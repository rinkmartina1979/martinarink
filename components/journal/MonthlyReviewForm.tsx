"use client";

import { MONTHLY_PROMPTS, type Visibility } from "@/lib/journal/prompts";
import { JournalForm } from "./JournalForm";

export function MonthlyReviewForm({
  token,
  monthIndex,
  initialContent,
  initialVisibility,
}: {
  token: string;
  monthIndex: number;
  initialContent: Record<string, string | boolean>;
  initialVisibility: Visibility;
}) {
  return (
    <JournalForm
      token={token}
      kind="monthly"
      prompts={MONTHLY_PROMPTS}
      monthIndex={monthIndex}
      initialContent={initialContent}
      initialVisibility={initialVisibility}
    />
  );
}
