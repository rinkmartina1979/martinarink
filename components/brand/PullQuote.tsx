/**
 * PullQuote — editorial "breath" between dense sections.
 *
 * Vogue/long-form convention: an oversized italic line, set apart with the
 * brand's signature pink hairline, that punctuates a text-heavy page and gives
 * the eye a rest on mobile. Server component — no interactivity.
 *
 * Type scale is deliberately restrained at the mobile floor (28px) so the line
 * never overflows a 320px viewport, then opens up to 42px on desktop.
 */

interface PullQuoteProps {
  children: React.ReactNode;
  /** Optional small-caps attribution beneath the quote. */
  cite?: string;
  /** Surface — defaults to cream; use bone to contrast an adjacent cream band. */
  surface?: "cream" | "bone";
}

export function PullQuote({ children, cite, surface = "cream" }: PullQuoteProps) {
  const bg = surface === "bone" ? "bg-bone" : "bg-cream";
  return (
    <section className={`${bg} py-20 md:py-28`}>
      <figure className="container-content max-w-3xl mx-auto text-center">
        <span aria-hidden className="mx-auto block h-px w-12 bg-pink mb-8" />
        <blockquote
          className="font-[family-name:var(--font-display)] italic text-ink
                     leading-[1.25] tracking-[-0.01em]
                     text-[28px] sm:text-[34px] md:text-[42px]"
        >
          {children}
        </blockquote>
        {cite && (
          <figcaption className="mt-8 font-[family-name:var(--font-body)] text-[11px] uppercase tracking-[0.22em] text-ink-quiet">
            {cite}
          </figcaption>
        )}
      </figure>
    </section>
  );
}
