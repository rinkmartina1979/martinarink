import Link from "next/link";

interface CaseStudyCardProps {
  pseudonym: string;
  industry: string;
  programme: string;
  problemSnapshot: string;
  outcomeMarker: string;
  slug: string;
}

export function CaseStudyCard({
  pseudonym,
  industry,
  programme,
  problemSnapshot,
  outcomeMarker,
  slug,
}: CaseStudyCardProps) {
  return (
    <article className="bg-bone border border-sand/40 p-8">
      {/* Top: programme pill + industry */}
      <div className="flex items-center gap-3 mb-5">
        <span className="bg-plum/10 text-plum text-[10px] uppercase tracking-[0.18em] font-medium px-3 py-1">
          {programme}
        </span>
        <span className="text-[12px] text-ink-quiet">{industry}</span>
      </div>

      {/* Pseudonym */}
      <h2 className="font-[family-name:var(--font-display)] text-[28px] leading-[1.2] text-ink">
        {pseudonym}
      </h2>

      {/* Problem snapshot */}
      <p className="mt-4 text-[15px] leading-[1.75] text-ink-soft">
        {problemSnapshot}
      </p>

      {/* Hairline separator */}
      <div className="mt-6 h-px bg-sand/50" aria-hidden />

      {/* Outcome marker */}
      <p className="mt-4 font-[family-name:var(--font-display)] italic text-[18px] text-ink leading-snug">
        {outcomeMarker}
      </p>

      {/* Read link */}
      <div className="mt-6">
        <Link
          href={`/press/case/${slug}`}
          className="text-[13px] text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
        >
          Read the full account →
        </Link>
      </div>
    </article>
  );
}
