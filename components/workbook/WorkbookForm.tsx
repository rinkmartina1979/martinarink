"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  type WorkbookSection,
  type Visibility,
  VISIBILITY_VALUES,
} from "@/lib/workbook/sections";
import { PrivacyToggle } from "@/components/journal/PrivacyToggle";
import { NeedsSupportFlag } from "@/components/journal/NeedsSupportFlag";
import { SignatureField } from "./SignatureField";

type SaveState = "idle" | "saving" | "saved" | "error";

export interface WorkbookFormProps {
  token: string;
  sectionDef: WorkbookSection;
  clientId: string;
  initialContent: Record<string, string>;
  initialVisibility: Visibility;
}

const inputBase =
  "w-full px-4 py-3 bg-cream border border-sand text-ink placeholder-ink-quiet/40 " +
  "text-[15px] leading-[1.7] focus:outline-none focus:border-plum rounded-[1px] " +
  "transition-colors duration-200";

function draftKey(clientId: string, sectionKey: string) {
  return `workbook-draft-${clientId}-${sectionKey}`;
}

export function WorkbookForm({
  token,
  sectionDef,
  clientId,
  initialContent,
  initialVisibility,
}: WorkbookFormProps) {
  const router = useRouter();
  const key = sectionDef.key;

  // Load localStorage draft on first render — takes priority over server prefill
  // so a client never loses a half-finished entry after a page reload.
  const [values, setValues] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return initialContent;
    try {
      const raw = localStorage.getItem(draftKey(clientId, key));
      if (raw) {
        const draft = JSON.parse(raw) as {
          content?: Record<string, string>;
          visibility?: string;
        };
        if (draft.content) return { ...initialContent, ...draft.content };
      }
    } catch {
      // Corrupt draft — fall through to server prefill
    }
    return initialContent;
  });

  const [visibility, setVisibility] = useState<Visibility>(() => {
    if (typeof window === "undefined") return initialVisibility;
    try {
      const raw = localStorage.getItem(draftKey(clientId, key));
      if (raw) {
        const draft = JSON.parse(raw) as { visibility?: string };
        if (
          draft.visibility &&
          (VISIBILITY_VALUES as readonly string[]).includes(draft.visibility)
        ) {
          return draft.visibility as Visibility;
        }
      }
    } catch {
      // Fall through
    }
    return initialVisibility;
  });

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const lastSaved = useRef(
    JSON.stringify({ c: initialContent, v: initialVisibility }),
  );

  // Debounced draft persistence to localStorage — survives reload, network loss,
  // and token expiry. Cleared after a successful server save.
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistDraft = useCallback(
    (nextValues: Record<string, string>, nextVisibility: Visibility) => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
      draftTimer.current = setTimeout(() => {
        try {
          localStorage.setItem(
            draftKey(clientId, key),
            JSON.stringify({ content: nextValues, visibility: nextVisibility }),
          );
        } catch {
          // Storage full — silently ignore
        }
      }, 400);
    },
    [clientId, key],
  );

  // Persist draft whenever values or visibility change.
  useEffect(() => {
    persistDraft(values, visibility);
  }, [values, visibility, persistDraft]);

  const save = useCallback(
    async (nextValues: Record<string, string>, nextVisibility: Visibility) => {
      const signature = JSON.stringify({ c: nextValues, v: nextVisibility });
      if (signature === lastSaved.current) return;

      setSaveState("saving");

      try {
        const res = await fetch("/api/workbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            sectionKey: key,
            visibility: nextVisibility,
            content: nextValues,
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
        lastSaved.current = signature;
        setSaveState("saved");
        // Clear the localStorage draft — server now holds the canonical copy.
        try {
          localStorage.removeItem(draftKey(clientId, key));
        } catch {
          // Ignore
        }
        router.refresh();
      } catch {
        setSaveState("error");
      }
    },
    [token, key, clientId, router],
  );

  const handleBlur = () => void save(values, visibility);

  const handleVisibility = (v: Visibility) => {
    setVisibility(v);
    void save(values, v);
  };

  const setField = (fieldKey: string, value: string) =>
    setValues((prev) => ({ ...prev, [fieldKey]: value }));

  const isTwoColumn = sectionDef.layout === "two-column";

  return (
    <form
      className="space-y-10"
      onSubmit={(e) => {
        e.preventDefault();
        void save(values, visibility);
      }}
    >
      {/* Two-column layout for prosCons; otherwise stacked */}
      {isTwoColumn ? (
        <div className="grid md:grid-cols-2 gap-6">
          {sectionDef.prompts.map((p) => (
            <PromptField
              key={p.key}
              id={`wb-${key}-${p.key}`}
              prompt={p}
              value={values[p.key] ?? ""}
              onChange={(v) => setField(p.key, v)}
              onBlur={handleBlur}
            />
          ))}
        </div>
      ) : (
        sectionDef.prompts.map((p) => (
          <PromptField
            key={p.key}
            id={`wb-${key}-${p.key}`}
            prompt={p}
            value={values[p.key] ?? ""}
            onChange={(v) => setField(p.key, v)}
            onBlur={handleBlur}
          />
        ))
      )}

      <PrivacyToggle value={visibility} onChange={handleVisibility} />

      {(sectionDef.sensitive || visibility === "needs-support") && (
        <NeedsSupportFlag />
      )}

      <div className="flex items-center gap-5 pt-2">
        <button
          type="submit"
          className="px-8 py-3 bg-plum text-cream text-[12px] uppercase tracking-[0.18em] rounded-[1px] cursor-pointer hover:bg-plum-deep transition-colors duration-200"
        >
          Save
        </button>
        <p
          aria-live="polite"
          className={cn(
            "text-[13px] font-[family-name:var(--font-body)] transition-opacity duration-500",
            saveState === "idle" ? "opacity-0" : "opacity-100",
            saveState === "error" ? "text-pink" : "text-ink-quiet",
          )}
        >
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Saved."}
          {saveState === "error" && "Could not save — try again."}
        </p>
      </div>
    </form>
  );
}

/* ─── Internal field renderer ─────────────────────────────────── */

interface PromptFieldProps {
  id: string;
  prompt: WorkbookSection["prompts"][number];
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function PromptField({ id, prompt, value, onChange, onBlur }: PromptFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block mb-3 font-[family-name:var(--font-body)]">
        <span className="block text-[15px] text-ink leading-snug">{prompt.en}</span>
        <span className="block text-[12px] text-ink-quiet italic mt-1">{prompt.de}</span>
      </label>

      {prompt.type === "signature" ? (
        <SignatureField
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      ) : prompt.type === "short" ? (
        <input
          id={id}
          type="text"
          className={inputBase}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      ) : (
        <textarea
          id={id}
          rows={5}
          className={cn(inputBase, "resize-y min-h-[120px]")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      )}
    </div>
  );
}
