// NURNBERGER_APPROVED — written permission from Mrs. Nürnberger confirmed (client-verified 2026-06-15).
const NURNBERGER_APPROVED = true;

const ITEMS = [
  { label: "Author", credit: "Three Books · Spiegel Bestseller" },
  { label: "Cultural work", credit: "Isabella Blow · London" },
  { label: "Perspective", credit: "Six years alcohol-free" },
  ...(NURNBERGER_APPROVED
    ? [{ label: "Clinical partner", credit: "Mrs. Nürnberger · My Way Betty Ford" }]
    : []),
];

/**
 * AuthorityStrip — quiet credential line.
 * Rendered directly beneath PressMarquee so press + credentials read as
 * ONE authority band, not two competing sections.
 */
export function AuthorityStrip() {
  return (
    <section className="bg-cream border-b border-sand/40">
      <div className="container-content pb-8 pt-2">
        <ul className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 text-center">
          {ITEMS.map((item, i) => (
            <li key={item.label} className="flex items-center">
              {i > 0 && (
                <span aria-hidden className="hidden md:inline-block mx-6 text-pink text-[9px]">
                  ·
                </span>
              )}
              <span className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mr-2">
                {item.label}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[14px] text-ink leading-tight">
                {item.credit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
