"use client";

import { useState } from "react";

/**
 * InlineLetterCapture — rendered on the assessment result page for
 * medium/low readiness archetypes ("reckoning" and "threshold" when not
 * routed to apply).
 *
 * Strategic purpose: capture the email at the peak-attention moment —
 * directly on the result page — instead of sending the user to a separate
 * /newsletter page where the click-through rate drops sharply. The redirect
 * was the largest single leak in the assessment funnel.
 *
 * Posts directly to /api/newsletter with source="assessment-result" so the
 * signup is attributable in Brevo.
 */
export function InlineLetterCapture({ archetype }: { archetype: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: `assessment-result-${archetype}`,
          consent: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Could not subscribe.");
      }

      setStatus("done");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  if (status === "done") {
    return (
      <div className="border border-sand/60 bg-violet-soft/40 px-6 py-7 md:px-8 md:py-8">
        <p className="font-[family-name:var(--font-display)] italic text-[20px] text-ink mb-2">
          The first letter is on its way.
        </p>
        <p className="text-[14px] leading-[1.7] text-ink-soft">
          Check your inbox in the next few minutes. If it does not arrive, it
          is almost certainly in spam — please drag it out so the rest of the
          letters reach you.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-sand/60 bg-bone px-6 py-7 md:px-8 md:py-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ink-quiet mb-3">
        The private letters
      </p>
      <p className="font-[family-name:var(--font-display)] italic text-[20px] md:text-[22px] leading-[1.4] text-ink mb-5">
        Slow, considered writing — sent only when there is something worth
        saying. No marketing, no funnels. Read by women who recognise
        themselves in this work.
      </p>
      <form
        onSubmit={onSubmit}
        className="flex flex-col sm:flex-row gap-3 mt-4"
      >
        <label htmlFor="letter-email" className="sr-only">
          Email address
        </label>
        <input
          id="letter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 bg-cream border border-sand px-4 py-3 text-[15px] text-ink placeholder:text-ink-quiet/60 focus:outline-none focus:border-plum transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-plum text-cream uppercase tracking-[0.16em] text-[12px] font-medium px-7 py-3 rounded-[1px] hover:bg-plum-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Sending…" : "Receive the letters"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-[13px] text-plum">{errorMsg}</p>
      )}
      <p className="mt-4 text-[12px] text-ink-quiet leading-[1.6]">
        One-click unsubscribe. Your address is held privately and never sold.
      </p>
    </div>
  );
}
