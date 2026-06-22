"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type State = "idle" | "open" | "submitting" | "done" | "error";

const inputBase =
  "w-full px-4 py-3 bg-cream border border-sand text-ink placeholder-ink-quiet/40 " +
  "text-[15px] leading-[1.7] focus:outline-none focus:border-aubergine rounded-[1px] transition-colors duration-200";

/**
 * Lightweight "request a session / ask for support" card. Not chat.
 * Reveals a small form, posts to /api/members/session-request.
 */
export function SupportRequestCard({ token }: { token: string }) {
  const [state, setState] = useState<State>("idle");
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
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">Support</p>

      {state === "done" ? (
        <p className="text-[15px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
          Thank you — Martina has your request and will be in touch.
        </p>
      ) : state === "idle" ? (
        <>
          <p className="font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
            Need to reach Martina?
          </p>
          <p className="mt-2 text-[14px] text-ink-soft font-[family-name:var(--font-body)]">
            Ask for a session or let her know what you&rsquo;d like to discuss.
          </p>
          <button
            type="button"
            onClick={() => setState("open")}
            className="mt-5 inline-block text-[13px] text-plum hover:text-plum-deep transition-colors cursor-pointer"
          >
            Request a session or support →
          </button>
        </>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="sr-reason" className="block text-[10px] tracking-[0.26em] uppercase text-ink-quiet mb-2 font-[family-name:var(--font-body)]">
              What would you like? <span className="text-pink">*</span>
            </label>
            <textarea
              id="sr-reason"
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={cn(inputBase, "resize-y")}
              placeholder="A session, a question, something to discuss…"
            />
          </div>
          <div>
            <label htmlFor="sr-timeframe" className="block text-[10px] tracking-[0.26em] uppercase text-ink-quiet mb-2 font-[family-name:var(--font-body)]">
              Preferred timeframe
            </label>
            <input
              id="sr-timeframe"
              type="text"
              value={preferredTimeframe}
              onChange={(e) => setPreferredTimeframe(e.target.value)}
              className={inputBase}
              placeholder="e.g. next week, mornings"
            />
          </div>
          <div>
            <span className="block text-[10px] tracking-[0.26em] uppercase text-ink-quiet mb-2 font-[family-name:var(--font-body)]">
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
                    urgency === val ? "bg-aubergine text-cream border-aubergine" : "bg-cream text-ink-soft border-sand hover:border-aubergine",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="sr-note" className="block text-[10px] tracking-[0.26em] uppercase text-ink-quiet mb-2 font-[family-name:var(--font-body)]">
              Anything else
            </label>
            <textarea
              id="sr-note"
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
              className="px-7 py-3 bg-aubergine text-cream text-[12px] uppercase tracking-[0.18em] rounded-[1px] cursor-pointer hover:bg-ink transition-colors duration-200 disabled:opacity-60"
            >
              {state === "submitting" ? "Sending…" : "Send to Martina"}
            </button>
            {state === "error" && (
              <span className="text-[13px] text-pink font-[family-name:var(--font-body)]">
                Could not send — please try again.
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
