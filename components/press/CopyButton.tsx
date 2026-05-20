"use client";
import { useState } from "react";

export function CopyButton({ text, label = "Copy bio" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        } catch {
          /* clipboard unavailable — silent fail */
        }
      }}
      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-body)] text-ink-quiet hover:text-ink border border-sand/60 hover:border-sand px-4 py-2 rounded-[1px] transition-all duration-200"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Copied
        </>
      ) : (
        label
      )}
    </button>
  );
}
