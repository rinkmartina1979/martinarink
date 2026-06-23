"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type SubmitState = "idle" | "submitting" | "done" | "error";

const inputBase =
  "w-full px-4 py-3 bg-cream border border-sand text-ink placeholder-ink-quiet/40 " +
  "text-[15px] leading-[1.7] focus:outline-none focus:border-ink-soft rounded-[1px] transition-colors duration-200";

interface SessionRequestFormProps {
  token: string;
  /** When true, render the done state inline rather than replacing the whole block. */
  onSuccess?: () => void;
}

export function SessionRequestForm({ token, onSuccess }: SessionRequestFormProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [reason, setReason] = useState("");
  const [preferredTimeframe, setPreferredTimeframe] = useState("");
  const [urgency, setUrgency] = useState<"normal" | "soon">("normal");
  const [note, setNote] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting" || reason.trim().length === 0) return;
    setState("submitting");
    try {
      const res = await fetch("/api/members/session-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, reason, preferredTimeframe, urgency, note }),
      });
      if (res.ok) {
        setState("done");
        onSuccess?.();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-[15px] leading-[1.75] text-ink-soft py-2">
        Thank you — Martina has your request and will be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label
          htmlFor="srf-reason"
          className="block text-[10px] tracking-[0.26em] uppercase text-ink-quiet mb-2"
        >
          What would you like? <span className="text-pink">*</span>
        </label>
        <textarea
          id="srf-reason"
          rows={3}
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={cn(inputBase, "resize-y")}
          placeholder="A session, a question, something to discuss…"
        />
      </div>

      <div>
        <label
          htmlFor="srf-timeframe"
          className="block text-[10px] tracking-[0.26em] uppercase text-ink-quiet mb-2"
        >
          Preferred timeframe
        </label>
        <input
          id="srf-timeframe"
          type="text"
          value={preferredTimeframe}
          onChange={(e) => setPreferredTimeframe(e.target.value)}
          className={inputBase}
          placeholder="e.g. next week, mornings"
        />
      </div>

      <div>
        <span className="block text-[10px] tracking-[0.26em] uppercase text-ink-quiet mb-2">
          Urgency
        </span>
        <div className="flex gap-2" role="radiogroup" aria-label="Urgency">
          {([["normal", "Normal"], ["soon", "Soon"]] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              role="radio"
              aria-checked={urgency === val}
              onClick={() => setUrgency(val)}
              className={cn(
                "px-5 py-2.5 text-[14px] rounded-[1px] border cursor-pointer transition-colors duration-200",
                urgency === val
                  ? "bg-plum text-cream border-plum"
                  : "bg-cream text-ink-soft border-sand hover:border-ink-soft",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="srf-note"
          className="block text-[10px] tracking-[0.26em] uppercase text-ink-quiet mb-2"
        >
          Anything else
        </label>
        <textarea
          id="srf-note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={cn(inputBase, "resize-y")}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="px-7 py-3 bg-plum text-cream text-[12px] uppercase tracking-[0.18em] rounded-[1px] cursor-pointer hover:bg-plum-deep transition-colors duration-200 disabled:opacity-60"
        >
          {state === "submitting" ? "Sending…" : "Send to Martina"}
        </button>
        {state === "error" && (
          <span className="text-[13px] text-pink">
            Could not send — please try again.
          </span>
        )}
      </div>
    </form>
  );
}
