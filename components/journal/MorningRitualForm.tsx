"use client";

import { MORNING_PROMPTS, type Visibility } from "@/lib/journal/prompts";
import { JournalForm } from "./JournalForm";

export function MorningRitualForm({
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
      kind="morning"
      prompts={MORNING_PROMPTS}
      date={date}
      initialContent={initialContent}
      initialVisibility={initialVisibility}
    />
  );
}
