// NURNBERGER_APPROVED — written permission from Mrs. Nürnberger confirmed (client-verified 2026-06-15).
const NURNBERGER_APPROVED = true;

const ITEMS = [
  { label: "Author", credit: "Three books · Spiegel Bestseller" },
  { label: "Cultural work", credit: "Isabella Blow · London" },
  { label: "Perspective", credit: "Six years alcohol-free" },
  { label: "Recognition", credit: "Miss Germany · Empowering Women" },
  ...(NURNBERGER_APPROVED
    ? [{ label: "Clinical partner", credit: "Mrs. Nürnberger · My Way Betty Ford" }]
    : []),
];

/**
 * AuthorityStrip — credentials presented as a quiet editorial facts grid.
 *
 * Sits beneath PressMarquee but on a distinct surface (bone vs cream) so it
 * reads as its own banner, not a continuation of the press rail. Each cell
 * stacks a small label over a display-type value with vertical dividers —
 * the museum/luxury "facts" treatment, legible at a glance.
 */
export function AuthorityStrip() {
  return (
    <section className="bg-bone border-y border-sand/40">
      <div className="container-content py-11 md:py-14">
        <p className="mb-9 text-center text-[10px] uppercase tracking-[0.34em] text-ink-quiet md:mb-11">
          For the record
        </p>

        <ul className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <li
              key={item.label}
              className="border-l border-sand/50 px-5 text-center max-lg:[&:nth-child(odd)]:border-l-0 md:px-8 lg:[&:nth-child(4n+1)]:border-l-0"
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-ink-quiet">
                {item.label}
              </p>
              <p className="font-[family-name:var(--font-display)] text-[17px] leading-snug text-ink md:text-[19px]">
                {item.credit}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
