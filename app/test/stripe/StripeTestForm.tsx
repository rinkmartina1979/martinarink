"use client";

import { useState } from "react";

export function StripeTestForm() {
  const [secret, setSecret] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<1 | 5>(1);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleTest = async () => {
    if (!secret || !email) {
      setErrorMsg("Fill in both the test secret and your email.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-test-secret": secret,
        },
        body: JSON.stringify({ email, amount }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setErrorMsg(data.error ?? "Failed to create session");
        setStatus("error");
        return;
      }

      window.location.href = data.url;
    } catch {
      setErrorMsg("Network error — check console.");
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-md bg-cream border border-sand/60 p-10 space-y-8">

      {/* Header */}
      <div className="border-b border-sand/40 pb-6">
        <p className="text-[10px] uppercase tracking-[0.24em] text-ink-quiet mb-2">
          Internal · Not indexed
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[28px] text-ink leading-tight">
          Stripe production smoke test
        </h1>
        <p className="mt-3 text-[14px] leading-[1.7] text-ink-soft">
          Charges a real card. Refund immediately after confirming: payment →
          webhook → Resend email → Brevo contact.
        </p>
      </div>

      {/* Test secret */}
      <div className="space-y-2">
        <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
          Test secret <span className="text-plum">*</span>
        </label>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Value of STRIPE_TEST_SECRET"
          className="w-full px-4 py-3 bg-cream border border-sand text-ink text-[14px] focus:outline-none focus:border-ink-soft transition-colors"
        />
        <p className="text-[11px] text-ink-quiet">
          Set <code className="bg-bone px-1 py-0.5">STRIPE_TEST_SECRET</code> in
          Vercel → paste the value here.
        </p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
          Your email <span className="text-plum">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 bg-cream border border-sand text-ink text-[14px] focus:outline-none focus:border-ink-soft transition-colors"
        />
        <p className="text-[11px] text-ink-quiet">
          Confirmation email lands here. Brevo contact is created with this address.
        </p>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
          Test amount
        </label>
        <div className="flex gap-3">
          {([1, 5] as const).map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className={[
                "flex-1 py-3 text-[13px] uppercase tracking-[0.14em] border transition-colors",
                amount === val
                  ? "border-ink bg-ink text-cream"
                  : "border-sand text-ink-soft hover:border-ink-soft",
              ].join(" ")}
            >
              €{val}.00
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-[13px] text-plum bg-plum/5 border border-plum/20 px-4 py-3">
          {errorMsg}
        </p>
      )}

      {/* CTA */}
      <button
        onClick={handleTest}
        disabled={status === "loading"}
        className="w-full py-4 bg-plum text-cream text-[12px] uppercase tracking-[0.2em] hover:bg-plum-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading"
          ? "Creating session…"
          : `Charge €${amount}.00 in production`}
      </button>

      {/* Post-payment checklist */}
      <div className="border-t border-sand/40 pt-6 space-y-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink-quiet">
          After payment — verify each step
        </p>
        {[
          "Stripe → Payments — status: Paid",
          "Stripe → Webhooks → recent events — checkout.session.completed → 200 OK",
          "Resend → Logs — 'Deposit received' delivered to inbox",
          "Brevo → Contacts → DEPOSIT_PAID = true",
          "Stripe → Payments → Refund the charge",
        ].map((step, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="shrink-0 w-5 h-5 border border-sand/60 flex items-center justify-center text-[10px] text-ink-quiet mt-0.5">
              {i + 1}
            </span>
            <p className="text-[13px] leading-[1.6] text-ink-soft">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
