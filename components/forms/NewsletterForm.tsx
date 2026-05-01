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
      <div className="bg-bone p-8 text-center max-w-md mx-auto">
        <p className="font-[family-name:var(--font-display)] italic text-[20px] text-ink">
          Your letter is on its way. Check your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto">
      <div className="space-y-3">
        <input
          type="text"
          placeholder="First name (optional)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full bg-bone border border-sand px-4 py-3 text-[16px] text-ink placeholder:text-ink-quiet/70 focus:outline-none focus:border-plum"
        />
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-bone border border-sand px-4 py-3 text-[16px] text-ink placeholder:text-ink-quiet/70 focus:outline-none focus:border-plum"
        />
      </div>
      <div className="mt-5">
        <PlumButton type="submit" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Receive the letters"}
        </PlumButton>
      </div>
      {status === "err" && (
        <p className="mt-3 text-[13px] text-plum">{errorMsg}</p>
      )}
      <p className="mt-4 text-[12px] text-ink-quiet text-center">
        Your email. Nothing else required. Unsubscribing is one click.
      </p>
    </form>
  );
}
