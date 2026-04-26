import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  attribution: string;
  nda?: boolean;
  className?: string;
}

export function TestimonialCard({
  quote,
  attribution,
  nda,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "bg-blush p-10 md:p-14 max-w-3xl mx-auto",
        className,
      )}
    >
      <span
        aria-hidden
        className="block font-[family-name:var(--font-display)] italic text-pink-soft text-[80px] leading-none -mb-4"
      >
        “
      </span>
      <blockquote className="font-[family-name:var(--font-display)] italic text-ink text-2xl md:text-[28px] leading-snug">
        {quote}
      </blockquote>
      <figcaption className="mt-6 text-[0.8125rem] uppercase tracking-[0.15em] text-ink-quiet">
        — {attribution}
        {nda && (
          <span className="block mt-1 text-[0.6875rem] tracking-[0.18em] text-ink-quiet/70">
            Identity withheld under NDA
          </span>
        )}
      </figcaption>
    </figure>
  );
}
