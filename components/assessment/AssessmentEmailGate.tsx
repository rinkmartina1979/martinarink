"use client";

import { useState } from "react";

interface Props {
  onContinue: (email: string, firstName?: string) => void;
}

export function AssessmentEmailGate({ onContinue }: Props) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    onContinue(trimmed, firstName.trim() || undefined);
  }

  return (
    <div className="w-full animate-[fadeUp_0.45s_ease-out_both]">
      {/* Editorial framing — not a popup, not a wall */}
      <div className="mb-10 border-l-2 border-pink pl-6">
        <p className="font-[family-name:var(--font-display)] italic text-[22px] md:text-[26px] leading-[1.3] text-ink">
          Your result will be written as a letter.
        </p>
        <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft">
          Where would you like it sent?
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-4 max-w-sm">
          <div>
            <label
              htmlFor="gate-firstname"
              className="block text-[12px] tracking-[0.18em] uppercase text-ink-quiet mb-2"
            >
              First name <span className="text-ink-quiet/60 normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="gate-firstname"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="w-full px-4 py-3 bg-cream border border-sand text-ink placeholder-ink-quiet/60 text-[15px] focus:outline-none focus:border-ink-soft rounded-[1px] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="gate-email"
              className="block text-[12px] tracking-[0.18em] uppercase text-ink-quiet mb-2"
            >
              Email address
            </label>
            <input
              id="gate-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="you@example.com"
              className={[
                "w-full px-4 py-3 bg-cream border text-ink placeholder-ink-quiet/60 text-[15px] focus:outline-none rounded-[1px] transition-colors",
                error ? "border-wine" : "border-sand focus:border-ink-soft",
              ].join(" ")}
            />
            {error && (
              <p className="mt-2 text-[13px] text-wine">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center bg-wine text-cream uppercase tracking-[0.18em] text-[12px] font-medium px-10 py-4 rounded-[1px] hover:bg-wine-deep transition-colors duration-200 self-start"
          >
            Continue the assessment
          </button>
        </div>

        <p className="mt-6 text-[12px] text-ink-quiet leading-[1.6]">
          Your answers are private. You will receive your result letter and
          occasional writing from Martina. One click to unsubscribe, always.
        </p>
      </form>
    </div>
  );
}
