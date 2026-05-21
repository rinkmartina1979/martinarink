"use client";

import { useState } from "react";
import { PlumButton } from "@/components/brand/PlumButton";

interface NewsletterFormProps {
  /** Tracks where this form was rendered — surfaces in Brevo as SOURCE */
  source?: string;
  /** Dark variant — use on aubergine/ink backgrounds */
  dark?: boolean;
}

export function NewsletterForm({ source = "newsletter-form", dark = false }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, source }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Subscription failed");
      }
      setStatus("ok");
      setEmail("");
      setFirstName("");
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const borderClass = dark
    ? "border-cream/20 focus:border-cream/60"
    : "border-sand/80 focus:border-plum";
  const textClass = dark ? "text-cream" : "text-ink";
  const labelIdleClass = dark
    ? "peer-placeholder-shown:text-cream/40 peer-focus:text-cream/60"
    : "peer-placeholder-shown:text-ink-soft/60 peer-focus:text-plum";
  const labelTopClass = dark ? "text-cream/40" : "text-ink-quiet";

  if (status === "ok") {
    return (
      <div className="py-8 text-center">
        <span
          className={`block text-[10px] uppercase tracking-[0.24em] mb-3 font-[family-name:var(--font-body)] ${dark ? "text-pink" : "text-pink"}`}
        >
          Welcome
        </span>
        <p
          className={`font-[family-name:var(--font-display)] italic text-[20px] leading-snug ${dark ? "text-cream" : "text-ink"}`}
        >
          Your first letter arrives on Sunday.
        </p>
        <p className={`mt-2 text-[13px] font-[family-name:var(--font-body)] ${dark ? "text-cream/50" : "text-ink-quiet"}`}>
          Check your inbox — and the spam folder, just this once.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm">
      <div className="space-y-6">
        {/* First name */}
        <div className="relative">
          <input
            type="text"
            placeholder=" "
            id="nf-firstname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`peer w-full bg-transparent border-b pb-3 pt-5 text-[15px] placeholder-transparent focus:outline-none transition-colors duration-200 font-[family-name:var(--font-body)] ${borderClass} ${textClass}`}
          />
          <label
            htmlFor="nf-firstname"
            className={`absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] peer-placeholder-shown:text-[14px] peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-4 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:top-0 transition-all duration-200 font-[family-name:var(--font-body)] ${labelTopClass} ${labelIdleClass}`}
          >
            First name — optional
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            required
            placeholder=" "
            id="nf-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`peer w-full bg-transparent border-b pb-3 pt-5 text-[15px] placeholder-transparent focus:outline-none transition-colors duration-200 font-[family-name:var(--font-body)] ${borderClass} ${textClass}`}
          />
          <label
            htmlFor="nf-email"
            className={`absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] peer-placeholder-shown:text-[14px] peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-4 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:top-0 transition-all duration-200 font-[family-name:var(--font-body)] ${labelTopClass} ${labelIdleClass}`}
          >
            Your email
          </label>
        </div>
      </div>

      <div className="mt-10">
        <PlumButton type="submit" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Receive the letters"}
        </PlumButton>
      </div>

      {status === "err" && (
        <p className={`mt-3 text-[13px] font-[family-name:var(--font-body)] ${dark ? "text-pink" : "text-plum"}`}>
          {errorMsg}
        </p>
      )}

      <p
        className={`mt-5 text-[10px] uppercase tracking-[0.18em] text-center font-[family-name:var(--font-body)] ${dark ? "text-cream/30" : "text-ink-quiet/70"}`}
      >
        One letter &middot; Once a week &middot; Unsubscribe any time
      </p>
    </form>
  );
}
