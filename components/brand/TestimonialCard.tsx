import Image from "next/image";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  attribution: string;
  nda?: boolean;
  /** Optional client portrait — only passed when a real photo + verified quote exist. */
  photoPath?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  attribution,
  nda,
  photoPath,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "bg-rose p-10 md:p-14 max-w-3xl mx-auto",
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
      <figcaption className="mt-8 flex items-center gap-4">
        {/* Portrait — rendered only when a real photo is supplied (NDA clients never have one) */}
        {photoPath && !nda && (
          <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-sand/60">
            <Image
              src={photoPath}
              alt={attribution}
              fill
              sizes="56px"
              className="object-cover object-top"
            />
          </div>
        )}
        <div className="text-[0.8125rem] uppercase tracking-[0.15em] text-ink-quiet">
          {photoPath && !nda ? attribution : `— ${attribution}`}
          {nda && (
            <span className="block mt-1 text-[0.6875rem] tracking-[0.18em] text-ink-quiet/70">
              Identity withheld under NDA
            </span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
