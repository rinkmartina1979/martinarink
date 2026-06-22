"use client";

import { EVENING_PROMPTS, type Visibility } from "@/lib/journal/prompts";
import { JournalForm } from "./JournalForm";

export function EveningReflectionForm({
  token,
  date,
  initialContent,
  initialVisibility,
}: {
  token: string;
  date: string;
  initialContent: Record<string, string | boolean>;
  initialVisibility: Visibility;
}) {
  return (
    <JournalForm
      token={token}
      kind="evening"
      prompts={EVENING_PROMPTS}
      date={date}
      initialContent={initialContent}
      initialVisibility={initialVisibility}
    />
  );
}
