"use client";

import { useState } from "react";
import { SessionRequestForm } from "./SessionRequestForm";

type CardState = "idle" | "open" | "done";

export function SupportRequestCard({ token }: { token: string }) {
  const [cardState, setCardState] = useState<CardState>("idle");

  return (
    <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">Support</p>

      {cardState === "done" ? (
        <p className="text-[15px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
          Thank you — Martina has your request and will be in touch.
        </p>
      ) : cardState === "idle" ? (
        <>
          <p className="font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
            Need to reach Martina?
          </p>
          <p className="mt-2 text-[14px] text-ink-soft font-[family-name:var(--font-body)]">
            Ask for a session or let her know what you&rsquo;d like to discuss.
          </p>
          <button
            type="button"
            onClick={() => setCardState("open")}
            className="mt-5 inline-block text-[13px] text-plum hover:text-plum-deep transition-colors cursor-pointer"
          >
            Request a session or support →
          </button>
        </>
      ) : (
        <SessionRequestForm token={token} onSuccess={() => setCardState("done")} />
      )}
    </div>
  );
}
