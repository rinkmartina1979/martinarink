"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  type JournalPrompt,
  type Visibility,
} from "@/lib/journal/prompts";
import { PrivacyToggle } from "./PrivacyToggle";
import { NeedsSupportFlag } from "./NeedsSupportFlag";

type FieldValue = string | boolean;
type SaveState = "idle" | "saving" | "saved" | "error";

export interface JournalFormProps {
  token: string;
  kind: "morning" | "evening" | "monthly";
  prompts: JournalPrompt[];
  /** YYYY-MM-DD for daily entries. */
  date?: string;
  /** 1–3 for monthly reviews. */
  monthIndex?: number;
  initialContent: Record<string, FieldValue>;
  initialVisibility: Visibility;
}

const inputBase =
  "w-full px-4 py-3 bg-cream border border-sand text-ink placeholder-ink-quiet/40 " +
  "text-[15px] leading-[1.7] focus:outline-none focus:border-aubergine rounded-[1px] " +
  "transition-colors duration-200";

export function JournalForm({
  token,
  kind,
  prompts,
  date,
  monthIndex,
  initialContent,
  initialVisibility,
}: JournalFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, FieldValue>>(initialContent);
  const [visibility, setVisibility] = useState<Visibility>(initialVisibility);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  // Snapshot of the last successfully persisted payload, to skip no-op saves.
  const lastSaved = useRef(JSON.stringify({ c: initialContent, v: initialVisibility }));

  const save = useCallback(
    async (nextValues: Record<string, FieldValue>, nextVisibility: Visibility) => {
      const signature = JSON.stringify({ c: nextValues, v: nextVisibility });
      if (signature === lastSaved.current) return;

      setSaveState("saving");

      const body =
        kind === "monthly"
          ? { token, kind, monthIndex, visibility: nextVisibility, content: nextValues }
          : { token, kind, date, visibility: nextVisibility, content: nextValues };

      try {
        const res = await fetch("/api/journal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(String(res.status));
        lastSaved.current = signature;
        setSaveState("saved");
        // Refresh server components (progress counts, shared state in Studio).
        router.refresh();
      } catch {
        setSaveState("error");
      }
    },
    [token, kind, date, monthIndex, router],
  );

  const handleBlur = () => void save(values, visibility);

  const handleVisibility = (v: Visibility) => {
    setVisibility(v);
    void save(values, v);
  };

  const setField = (key: string, value: FieldValue) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const didConsume = values.didConsume === true;

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        void save(values, visibility);
      }}
    >
      {prompts.map((p) => {
        // Consumption sub-fields only appear once "Did you consume?" is Yes.
        if ((p.key === "consumeWhat" || p.key === "consumeHowMuch") && !didConsume) {
          return null;
        }

        const id = `j-${kind}-${p.key}`;

        return (
          <div key={p.key}>
            <label
              htmlFor={id}
              className="block mb-2 font-[family-name:var(--font-body)]"
            >
              <span className="block text-[15px] text-ink leading-snug">{p.en}</span>
              <span className="block text-[12px] text-ink-quiet italic mt-0.5">{p.de}</span>
            </label>

            {p.type === "boolean" ? (
              <div className="flex gap-2" role="radiogroup" aria-labelledby={id}>
                {[
                  { label: "No", val: false },
                  { label: "Yes", val: true },
                ].map((opt) => {
                  const active = (values[p.key] === true) === opt.val;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        setField(p.key, opt.val);
                        void save({ ...values, [p.key]: opt.val }, visibility);
                      }}
                      className={cn(
                        "px-6 py-2.5 text-[14px] rounded-[1px] border cursor-pointer transition-colors duration-200",
                        active
                          ? "bg-aubergine text-cream border-aubergine"
                          : "bg-cream text-ink-soft border-sand hover:border-aubergine",
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            ) : p.type === "short" ? (
              <input
                id={id}
                type="text"
                className={inputBase}
                value={(values[p.key] as string) ?? ""}
                onChange={(e) => setField(p.key, e.target.value)}
                onBlur={handleBlur}
              />
            ) : (
              <textarea
                id={id}
                rows={3}
                className={cn(inputBase, "resize-y min-h-[88px]")}
                value={(values[p.key] as string) ?? ""}
                onChange={(e) => setField(p.key, e.target.value)}
                onBlur={handleBlur}
              />
            )}
          </div>
        );
      })}

      <PrivacyToggle value={visibility} onChange={handleVisibility} />

      {visibility === "needs-support" && <NeedsSupportFlag />}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          className="px-8 py-3 bg-aubergine text-cream text-[12px] uppercase tracking-[0.18em] rounded-[1px] cursor-pointer hover:bg-ink transition-colors duration-200"
        >
          Save entry
        </button>
        <p
          aria-live="polite"
          className="text-[13px] text-ink-quiet font-[family-name:var(--font-body)]"
        >
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Saved."}
          {saveState === "error" && (
            <span className="text-pink">Could not save — try again.</span>
          )}
        </p>
      </div>
    </form>
  );
}
