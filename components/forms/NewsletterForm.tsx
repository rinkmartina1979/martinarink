"use client";

import { useState } from "react";
import { PlumButton } from "@/components/brand/PlumButton";

export function NewsletterForm() {
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
        body: JSON.stringify({ email, firstName }),
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

  if (status === "ok") {
    return (
      <div className="py-10 text-center max-w-md mx-auto">
        <span className="block text-[11px] uppercase tracking-[0.22em] text-pink mb-4">
          welcome
        </span>
        <p className="font-[family-name:var(--font-display)] italic text-[22px] text-ink leading-snug">
          Your letter is on its way.
        </p>
        <p className="mt-2 text-[14px] text-ink-soft">Check your inbox — and the spam folder, just this once.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto">
      {/* Editorial hairline inputs — no box, bottom border only */}
      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder=" "
            id="nf-firstname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="peer w-full bg-transparent border-b border-sand/80 pb-3 pt-5 text-[15px] text-ink placeholder-transparent focus:outline-none focus:border-plum transition-colors duration-200"
          />
          <label
            htmlFor="nf-firstname"
            className="absolute top-0 left-0 text-[11px] uppercase tracking-[0.2em] text-ink-quiet peer-placeholder-shown:text-[14px] peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-4 peer-placeholder-shown:text-ink-soft/60 peer-focus:text-[11px] peer-focus:tracking-[0.2em] peer-focus:top-0 peer-focus:text-plum transition-all duration-200"
          >
            First name — optional
          </label>
        </div>

        <div className="relative">
          <input
            type="email"
            required
            placeholder=" "
            id="nf-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full bg-transparent border-b border-sand/80 pb-3 pt-5 text-[15px] text-ink placeholder-transparent focus:outline-none focus:border-plum transition-colors duration-200"
          />
          <label
            htmlFor="nf-email"
            className="absolute top-0 left-0 text-[11px] uppercase tracking-[0.2em] text-ink-quiet peer-placeholder-shown:text-[14px] peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-4 peer-placeholder-shown:text-ink-soft/60 peer-focus:text-[11px] peer-focus:tracking-[0.2em] peer-focus:top-0 peer-focus:text-plum transition-all duration-200"
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
        <p className="mt-3 text-[13px] text-plum">{errorMsg}</p>
      )}

      <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-ink-quiet/70 text-center">
        One letter · Once a week · Unsubscribe any time
      </p>
    </form>
  );
}
