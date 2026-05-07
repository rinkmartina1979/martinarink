import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PortableTextBody } from "@/components/brand/PortableTextBody";
import { getVisibleCaseStudies } from "@/sanity/lib/membersQueries";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const studies = await getVisibleCaseStudies();
  const study = (studies ?? []).find((s) => s.slug === slug);

  if (!study) {
    return buildMetadata({ noIndex: true });
  }

  return buildMetadata({
    title: `${study.pseudonym} — ${study.industry} | Case study`,
    description: study.problemSnapshot ?? undefined,
    path: `/press/case/${slug}`,
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const studies = await getVisibleCaseStudies();
  const study = (studies ?? []).find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  const programmeName =
    study.programme === "sober-muse"
      ? "Sober Muse Method"
      : "Female Empowerment & Leadership";

  return (
    <div className="bg-cream">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="pt-28 md:pt-36 pb-12 px-6 border-b border-sand/30">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-[12px] text-ink-quiet">
              <li>
                <Link href="/press" className="hover:text-ink transition-colors">
                  Press &amp; Speaking
                </Link>
              </li>
              <li aria-hidden className="text-sand">›</li>
              <li>Selected work</li>
              <li aria-hidden className="text-sand">›</li>
              <li className="text-ink" aria-current="page">
                {study.pseudonym}
              </li>
            </ol>
          </nav>

          {/* Programme eyebrow */}
          <Eyebrow className="mb-5">{programmeName}</Eyebrow>

          {/* Pseudonym as h1 */}
          <h1 className="font-[family-name:var(--font-display)] text-[48px] md:text-[64px] leading-[1.05] text-ink mb-4">
            {study.pseudonym}
          </h1>

          {/* Industry */}
          <p className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet">
            {study.industry}
          </p>
        </div>
      </section>

      {/* ── Problem snapshot ───────────────────────────────────── */}
      {study.problemSnapshot && (
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="border-l-2 border-sand pl-8">
              <p className="text-[18px] leading-[1.75] text-ink-soft">
                {study.problemSnapshot}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Work narrative ─────────────────────────────────────── */}
      {study.workNarrative && study.workNarrative.length > 0 && (
        <section className="py-8 px-6">
          <div className="max-w-3xl mx-auto">
            <PortableTextBody
              value={study.workNarrative as unknown[]}
              className="space-y-6"
            />
          </div>
        </section>
      )}

      {/* ── Outcome marker ─────────────────────────────────────── */}
      {study.outcomeMarker && (
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="h-px bg-sand/40 mb-10" aria-hidden />
            <p className="font-[family-name:var(--font-display)] italic text-[26px] leading-snug text-ink text-center">
              {study.outcomeMarker}
            </p>
            <div className="h-px bg-sand/40 mt-10" aria-hidden />
          </div>
        </section>
      )}

      {/* ── Bottom CTA ─────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-bone border-t border-sand/30">
        <div className="max-w-3xl mx-auto">
          <Eyebrow className="mb-5">The work continues</Eyebrow>
          <p className="font-[family-name:var(--font-display)] text-[28px] leading-snug text-ink mb-6">
            Each private engagement is its own.
          </p>
          <Link
            href="/work-with-me"
            className="text-[15px] text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
          >
            Read about working together →
          </Link>
        </div>
      </section>
    </div>
  );
}
