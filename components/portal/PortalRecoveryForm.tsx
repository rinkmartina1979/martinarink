"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type State = "idle" | "submitting" | "done";

export function PortalRecoveryForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    try {
      await fetch("/api/members/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
    } catch {
      /* generic UX regardless */
    }
    // Always show the same neutral confirmation (no enumeration).
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
        <p className="text-[15px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
          If this email is connected to a private portal, a new link will arrive shortly.
          Please check your inbox, and your spam folder if needed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="recovery-email"
          className="block text-[10px] tracking-[0.26em] uppercase text-ink-quiet mb-2 font-[family-name:var(--font-body)]"
        >
          Email
        </label>
        <input
          id="recovery-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "w-full px-4 py-3 bg-cream border border-sand text-ink placeholder-ink-quiet/40",
            "text-[15px] leading-[1.7] focus:outline-none focus:border-aubergine rounded-[1px]",
            "transition-colors duration-200",
          )}
          placeholder="you@example.com"
        />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="px-8 py-3 bg-aubergine text-cream text-[12px] uppercase tracking-[0.18em] rounded-[1px] cursor-pointer hover:bg-ink transition-colors duration-200 disabled:opacity-60"
      >
        {state === "submitting" ? "Sending…" : "Send my private link"}
      </button>
    </form>
  );
}
