"use client";

/**
 * PressMarquee — infinite horizontal scroll of press logo text names.
 * Uses CSS animation only (no JS scroll), zero layout shift.
 * Items are duplicated so the loop appears seamless.
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
  /** Background color class — default cream */
  bg?: string;
  /** Text color class — default ink/55 */
  color?: string;
  /** Separator between items */
  separator?: string;
}

export function PressMarquee({
  bg = "bg-cream",
  color = "text-ink/55",
  separator = "·",
}: PressMarqueeProps) {
  // Duplicate items so the marquee loops seamlessly
  const items = [...OUTLETS, ...OUTLETS];

  return (
    <div
      className={`${bg} border-t border-sand/40 py-7 overflow-hidden`}
      aria-hidden
    >
      <p className="text-center text-[10px] uppercase tracking-[0.24em] text-ink-quiet mb-5">
        As featured in
      </p>
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 28s linear infinite" }}
      >
        {items.map((outlet, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-6 font-[family-name:var(--font-display)] text-[15px] md:text-[17px] ${color} tracking-[0.04em] px-8`}
          >
            {outlet}
            <span className="text-pink text-[10px]">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
