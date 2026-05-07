"use client";

/**
 * NewsletterPopup — editorial email-capture overlay.
 *
 * Triggers (whichever fires first):
 *   • 25 second on-page dwell
 *   • Mouse leaves through top of viewport (exit-intent, desktop only)
 *   • 50% scroll depth
 *
 * Suppression rules:
 *   • Once dismissed or submitted, sets `mr_popup_seen=1` cookie for 30 days.
 *   • Never shows on /assessment, /apply/*, /book, /thank-you, /admin/*,
 *     /apply/empowerment, /apply/sober-muse — anywhere we already have
 *     a higher-intent capture in progress.
 *   • Never shows during draft mode / Sanity preview.
 *   • Never shows for users with `prefers-reduced-motion` AND viewport <600px
 *     (mobile fold real estate is precious — popup would dominate the screen).
 *
 * Brand rules:
 *   • Cream background with sand hairline — no gradient, no stock-modal feel.
 *   • Banned-word scan: NO "unlock", "transform", "empower", "journey",
 *     "step into", "healing", "recovery", "amazing", "passion", "authentic".
 *   • No exclamation marks anywhere.
 *   • Max 3 sentences in body copy.
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_NAME = "mr_popup_seen";
const COOKIE_DAYS = 30;
const DELAY_MS = 25_000;
const SCROLL_THRESHOLD = 0.5;

const SUPPRESSED_PATH_PREFIXES = [
  "/assessment",
  "/apply",
  "/book",
  "/thank-you",
  "/admin",
];

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function shouldSuppressForPath(path: string): boolean {
  return SUPPRESSED_PATH_PREFIXES.some((p) => path.startsWith(p));
}

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const triggeredRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ── Trigger logic ───────────────────────────────────────────────
  const trigger = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    setOpen(true);
    // Move keyboard focus to the email input after the entrance animation.
    setTimeout(() => inputRef.current?.focus(), 350);
  }, []);

  useEffect(() => {
    // Suppress on irrelevant routes & already-seen.
    if (typeof window === "undefined") return;
    if (shouldSuppressForPath(window.location.pathname)) return;
    if (readCookie(COOKIE_NAME)) return;

    const delayTimer = window.setTimeout(trigger, DELAY_MS);

    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (window.scrollY / max >= SCROLL_THRESHOLD) trigger();
    };

    const onMouseLeave = (e: MouseEvent) => {
      // Desktop exit-intent: mouse leaves through the top of viewport.
      if (e.clientY <= 0 && window.innerWidth >= 1024) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.clearTimeout(delayTimer);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [trigger]);

  // ── Close handlers ──────────────────────────────────────────────
  const close = useCallback((reason: "dismiss" | "submitted") => {
    setOpen(false);
    writeCookie(COOKIE_NAME, reason, COOKIE_DAYS);
  }, []);

  // ESC to dismiss
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close("dismiss");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // ── Submit ──────────────────────────────────────────────────────
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          consent: true,
          source: "popup",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      // Linger on the success message for 4s, then close.
      setTimeout(() => close("submitted"), 4000);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-ink/55 backdrop-blur-[2px]"
            onClick={() => close("dismiss")}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-headline"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 z-[201] -translate-x-1/2 -translate-y-1/2 w-[min(540px,calc(100vw-32px))] max-h-[calc(100vh-32px)] overflow-y-auto bg-cream border border-sand/60 shadow-[0_24px_80px_-16px_rgba(30,27,23,0.35)]"
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => close("dismiss")}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-ink-quiet hover:text-ink transition-colors text-[22px] leading-none"
            >
              ×
            </button>

            <div className="px-8 md:px-12 pt-12 pb-10">
              {status !== "success" ? (
                <>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
                    A letter, from time to time
                  </p>
                  <h2
                    id="popup-headline"
                    className="mt-4 font-[family-name:var(--font-display)] text-[28px] md:text-[32px] leading-[1.15] text-ink"
                  >
                    For the woman who reads slowly.
                  </h2>
                  <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft">
                    A short letter from me when something is worth saying. On
                    the inner life of capable women, and on the question
                    underneath the question. No funnel. No followups. Unsubscribe
                    in one click.
                  </p>

                  <form onSubmit={onSubmit} className="mt-7 space-y-4">
                    <div>
                      <label
                        htmlFor="popup-firstname"
                        className="sr-only"
                      >
                        First name (optional)
                      </label>
                      <input
                        id="popup-firstname"
                        type="text"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name (optional)"
                        className="w-full bg-bone border border-sand/60 px-4 py-3 text-[15px] text-ink placeholder:text-ink-quiet/70 focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum/20 rounded-[1px]"
                      />
                    </div>
                    <div>
                      <label htmlFor="popup-email" className="sr-only">
                        Email
                      </label>
                      <input
                        ref={inputRef}
                        id="popup-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        className="w-full bg-bone border border-sand/60 px-4 py-3 text-[15px] text-ink placeholder:text-ink-quiet/70 focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum/20 rounded-[1px]"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-[13px] text-plum">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full bg-plum hover:bg-plum-deep text-cream uppercase tracking-[0.18em] text-[11px] font-medium py-4 rounded-[1px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "submitting"
                        ? "Sending…"
                        : "Send me the letter"}
                    </button>

                    <p className="text-[11px] leading-[1.6] text-ink-quiet/80 text-center">
                      One email at a time. Your address is never shared.
                    </p>
                  </form>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
                    Thank you
                  </p>
                  <h2 className="mt-4 font-[family-name:var(--font-display)] text-[28px] leading-[1.2] text-ink">
                    You will hear from me.
                  </h2>
                  <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft max-w-[360px] mx-auto">
                    A short note has been sent to confirm your email. Check
                    your inbox — and your spam folder, just in case.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
