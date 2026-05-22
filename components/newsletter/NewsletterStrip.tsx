"use client";

/**
 * NewsletterStrip — inline newsletter CTA
 *
 * Two modes:
 *   - "compact"  → single-line form, for blog post footers / sidebar
 *   - "editorial" → full editorial treatment with image, for section embeds
 *
 * Usage:
 *   <NewsletterStrip />                    // compact, no image
 *   <NewsletterStrip variant="editorial" /> // full editorial section
 *   <NewsletterStrip source="blog-post" />  // track origin in Brevo
 */

import { useState } from "react";
import Image from "next/image";

interface NewsletterStripProps {
  variant?: "compact" | "editorial";
  source?: string;
  className?: string;
}

export function NewsletterStrip({
  variant = "compact",
  source = "newsletter-strip",
  className = "",
}: NewsletterStripProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, source }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Subscription failed");
      }
      setStatus("ok");
      setEmail("");
      setFirstName("");
    } catch (err) {
      setStatus("err");
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  /* ── Success state ─────────────────────────────────────────── */
  if (status === "ok") {
    return (
      <div className={`py-8 text-center ${className}`}>
        <span className="block text-[10px] uppercase tracking-[0.24em] text-pink mb-3 font-[family-name:var(--font-body)]">
          Welcome
        </span>
        <p className="font-[family-name:var(--font-display)] italic text-[20px] text-ink leading-snug">
          Your first letter arrives on Sunday.
        </p>
        <p className="mt-2 text-[13px] text-ink-quiet font-[family-name:var(--font-body)]">
          Check your inbox — and the spam folder, just this once.
        </p>
      </div>
    );
  }

  /* ── Compact variant ───────────────────────────────────────── */
  if (variant === "compact") {
    return (
      <div className={`bg-bone border border-sand/40 p-8 md:p-10 ${className}`}>
        <span className="h-px w-8 bg-pink block mb-5" aria-hidden />
        <p className="text-[10px] uppercase tracking-[0.24em] text-ink-quiet mb-3 font-[family-name:var(--font-body)]">
          The Sober Muse Letter
        </p>
        <p className="font-[family-name:var(--font-display)] text-[20px] md:text-[22px] leading-snug text-ink mb-2">
          One letter, once a week.
        </p>
        <p className="text-[14px] leading-[1.7] text-ink-soft mb-6 font-[family-name:var(--font-body)]">
          Identity, leadership, the examined life. For the woman who reads carefully.
        </p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="flex-1 bg-cream border border-sand px-4 py-3 text-[14px] text-ink placeholder-ink-quiet/50 focus:outline-none focus:border-plum transition-colors rounded-[1px] font-[family-name:var(--font-body)]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-8 py-3 bg-plum text-cream text-[11px] uppercase tracking-[0.18em] hover:bg-plum-deep transition-colors disabled:opacity-60 rounded-[1px] font-[family-name:var(--font-body)] shrink-0"
          >
            {status === "loading" ? "Sending…" : "Receive the letters"}
          </button>
        </form>
        {status === "err" && (
          <p className="mt-2 text-[12px] text-plum font-[family-name:var(--font-body)]">{errMsg}</p>
        )}
        <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-ink-quiet/60 font-[family-name:var(--font-body)]">
          Small list &middot; Unsubscribe any time &middot; No third-party data sharing
        </p>
      </div>
    );
  }

  /* ── Editorial variant ─────────────────────────────────────── */
  return (
    <div className={`bg-aubergine overflow-hidden ${className}`}>
      <div className="grid md:grid-cols-[1fr_0.5fr] lg:grid-cols-[1fr_0.42fr]">
        {/* Left — copy + form */}
        <div className="px-10 py-14 md:px-14 md:py-16 lg:px-16 lg:py-20">
          <span className="h-px w-10 bg-pink block mb-8" aria-hidden />
          <p className="text-[10px] uppercase tracking-[0.28em] text-cream/50 mb-4 font-[family-name:var(--font-body)]">
            The Sober Muse Letter
          </p>
          <h3 className="font-[family-name:var(--font-display)] text-[30px] md:text-[36px] lg:text-[40px] leading-[1.1] text-cream mb-5">
            One letter.
            <br />
            Once a week.
          </h3>
          <p className="text-[16px] leading-[1.8] text-cream/65 mb-8 max-w-[440px] font-[family-name:var(--font-body)]">
            I write about identity, leadership, and the examined life. About the particular loneliness
            of external success. About coming home to yourself.
          </p>

          {/* Reader testimonials */}
          <div className="mb-10 space-y-5">
            {[
              {
                quote: "The most honest writing I have read about what it actually costs to be excellent at everything.",
                name: "C.B., Managing Director",
              },
              {
                quote: "I read it slowly, on Sunday morning, with the door closed.",
                name: "E.H., Partner",
              },
            ].map((t) => (
              <div key={t.name} className="border-l border-pink/40 pl-5">
                <p className="font-[family-name:var(--font-display)] italic text-[15px] text-cream/80 leading-snug mb-2">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-cream/40 font-[family-name:var(--font-body)]">
                  — {t.name}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4 max-w-[380px]">
            <div className="relative">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder=" "
                id="es-firstname"
                className="peer w-full bg-transparent border-b border-cream/20 pb-3 pt-5 text-[15px] text-cream placeholder-transparent focus:outline-none focus:border-cream/60 transition-colors duration-200 font-[family-name:var(--font-body)]"
              />
              <label
                htmlFor="es-firstname"
                className="absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] text-cream/40 peer-placeholder-shown:text-[14px] peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-4 peer-placeholder-shown:text-cream/40 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:top-0 peer-focus:text-cream/60 transition-all duration-200 font-[family-name:var(--font-body)]"
              >
                First name — optional
              </label>
            </div>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                id="es-email"
                className="peer w-full bg-transparent border-b border-cream/20 pb-3 pt-5 text-[15px] text-cream placeholder-transparent focus:outline-none focus:border-cream/60 transition-colors duration-200 font-[family-name:var(--font-body)]"
              />
              <label
                htmlFor="es-email"
                className="absolute top-0 left-0 text-[10px] uppercase tracking-[0.2em] text-cream/40 peer-placeholder-shown:text-[14px] peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-4 peer-placeholder-shown:text-cream/40 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:top-0 peer-focus:text-cream/60 transition-all duration-200 font-[family-name:var(--font-body)]"
              >
                Your email
              </label>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-plum text-cream text-[11px] uppercase tracking-[0.2em] hover:bg-plum-deep transition-colors disabled:opacity-60 rounded-[1px] font-[family-name:var(--font-body)]"
              >
                {status === "loading" ? "Sending…" : "Receive the letters"}
              </button>
            </div>
            {status === "err" && (
              <p className="text-[12px] text-pink font-[family-name:var(--font-body)]">{errMsg}</p>
            )}
          </form>

          <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-cream/30 font-[family-name:var(--font-body)]">
            Small list &middot; Unsubscribe any time &middot; No third-party data sharing
          </p>
        </div>

        {/* Right — portrait */}
        <div className="hidden md:block relative min-h-[480px]">
          <Image
            src="/images/portraits/martina-garden-pink.jpg"
            alt="Martina Rink — The Sober Muse Letter"
            fill
            sizes="(min-width: 1024px) 25vw, 35vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}
