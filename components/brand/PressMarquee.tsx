"use client";

/**
 * PressMarquee — quiet editorial press rail.
 *
 * 2026 luxury treatment: uniform type, slow pace, and soft edge fades so the
 * names dissolve at the margins instead of hard-cutting (the detail that
 * separates a premium press rail from a ticker). CSS animation only, zero
 * layout shift. Items duplicated so the loop is seamless.
 */

const OUTLETS = [
  "Der Spiegel",
  "Brigitte",
  "STERN",
  "Vogue Germany",
  "Die Zeit",
  "Süddeutsche Zeitung",
  "BUNTE",
  "brand eins",
];

interface PressMarqueeProps {
  /** Background color class — default cream. Edge fades match this. */
  bg?: string;
  /** Text color class — default muted ink */
  color?: string;
  /** Tailwind color name the edge fade dissolves into — must match bg. */
  fade?: "cream" | "bone";
}

export function PressMarquee({
  bg = "bg-cream",
  color = "text-ink/50",
  fade = "cream",
}: PressMarqueeProps) {
  // Duplicate items so the marquee loops seamlessly
  const items = [...OUTLETS, ...OUTLETS];
  const fadeFrom = fade === "bone" ? "from-bone" : "from-cream";
  const fadeTo = fade === "bone" ? "to-bone/0" : "to-cream/0";

  return (
    <div className={`${bg} border-t border-sand/40 py-9 md:py-11 overflow-hidden`} aria-hidden>
      <p className="mb-7 text-center text-[10px] uppercase tracking-[0.34em] text-ink-quiet">
        As featured in
      </p>

      <div className="relative">
        {/* Edge fades — names dissolve at the margins */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r ${fadeFrom} ${fadeTo} md:w-40`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l ${fadeFrom} ${fadeTo} md:w-40`}
        />

        {/* DS v1 §6.7 — slow editorial pace. Hover pauses for legibility.
            prefers-reduced-motion override in globals.css. */}
        <div
          className="flex whitespace-nowrap hover:[animation-play-state:paused]"
          style={{ animation: "marquee 55s linear infinite" }}
        >
          {items.map((outlet, i) => (
            <span
              key={i}
              className={`inline-flex items-center px-10 font-[family-name:var(--font-display)] text-[19px] tracking-[0.02em] md:px-16 md:text-[23px] ${color}`}
            >
              {outlet}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
