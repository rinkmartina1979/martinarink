import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { ARCHETYPE_RESULTS } from "@/lib/assessment/result-copy";
import { deriveRouting } from "@/lib/assessment/scoring";
import type { Archetype, ServiceIntent, ReadinessLevel, PrivacyNeed } from "@/lib/assessment/types";
import type { Metadata } from "next";

interface DecodedResult {
  archetype: Archetype;
  serviceIntent: ServiceIntent;
  readinessLevel: ReadinessLevel;
  privacyNeed: PrivacyNeed;
}

function decodeResultId(resultId: string): DecodedResult | null {
  try {
    const underscoreIndex = resultId.indexOf("_");
    if (underscoreIndex === -1) return null;
    const encoded = resultId.slice(underscoreIndex + 1);
    const decoded = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8"));
    if (
      !decoded.archetype ||
      !decoded.serviceIntent ||
      !decoded.readinessLevel ||
      !decoded.privacyNeed
    )
      return null;
    return decoded as DecodedResult;
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ resultId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resultId } = await params;
  const decoded = decodeResultId(resultId);
  const archetype = decoded?.archetype;
  const name = archetype ? ARCHETYPE_RESULTS[archetype]?.name : null;

  return buildMetadata({
    title: name ? `Your result: ${name}` : "Your Assessment Result",
    description:
      "A private letter — written specifically for where you are right now.",
    path: `/assessment/result/${resultId}`,
    noIndex: true,
  });
}

export default async function AssessmentResultPage({ params }: Props) {
  const { resultId } = await params;
  const decoded = decodeResultId(resultId);

  if (!decoded) notFound();

  const { archetype, serviceIntent, readinessLevel, privacyNeed } = decoded;
  const copy = ARCHETYPE_RESULTS[archetype];
  if (!copy) notFound();

  // Adjust CTA hrefs based on serviceIntent
  const routing = deriveRouting({
    archetype,
    scores: { reckoning: 0, threshold: 0, return: 0 },
    serviceIntent,
    readinessLevel,
    privacyNeed,
  });

  return (
    <>
      {/* ── RESULT HEADER ────────────────────────────────────────── */}
      <section className="bg-ink pt-32 md:pt-44 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink/30 to-transparent" />

        <div className="container-content max-w-2xl mx-auto px-6">
          {/* Archetype label */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-6 bg-pink" />
            <span className="text-[11px] tracking-[0.22em] uppercase text-pink-soft/80 font-[family-name:var(--font-body)]">
              Your result
            </span>
          </div>

          {/* Archetype name */}
          <h1 className="font-[family-name:var(--font-display)] text-[38px] md:text-[52px] leading-[1.08] text-cream">
            {copy.name}
          </h1>

          {/* Tagline */}
          <p className="mt-5 text-[17px] md:text-[19px] leading-[1.65] text-cream/75 max-w-lg">
            {copy.tagline}
          </p>
        </div>
      </section>

      {/* ── LETTER BODY ──────────────────────────────────────────── */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-content max-w-[640px] mx-auto px-6">
          {/* Opening */}
          <p className="font-[family-name:var(--font-display)] italic text-[22px] md:text-[26px] leading-[1.45] text-ink border-l-2 border-pink pl-6 mb-12">
            {copy.opening}
          </p>

          {/* Body paragraphs */}
          <div className="space-y-7">
            {copy.bodyParagraphs.map((para, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.8] text-ink-soft"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Closing */}
          <p className="mt-10 text-[17px] leading-[1.7] text-ink font-medium">
            {copy.closing}
          </p>

          {/* Signature */}
          <div className="mt-10 pt-8 border-t border-sand flex items-center gap-5">
            <div className="h-[1px] w-8 bg-sand" />
            <span className="font-[family-name:var(--font-script)] text-[22px] text-ink-soft">
              Martina
            </span>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-bone border-t border-sand py-16 md:py-20">
        <div className="container-content max-w-[640px] mx-auto px-6">
          <p className="text-[13px] tracking-[0.2em] uppercase text-ink-quiet mb-8">
            The natural next step
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href={routing.primaryHref}
              className="inline-flex items-center justify-center bg-wine text-cream uppercase tracking-[0.18em] text-[12px] font-medium px-10 py-4 rounded-[1px] hover:bg-wine-deep transition-colors duration-200"
            >
              {routing.primaryLabel}
            </a>

            {routing.secondaryHref && (
              <a
                href={routing.secondaryHref}
                className="inline-flex items-center justify-center border border-sand text-ink-soft uppercase tracking-[0.15em] text-[12px] font-medium px-8 py-4 rounded-[1px] hover:border-ink-quiet hover:text-ink transition-colors duration-200"
              >
                {routing.secondaryLabel}
              </a>
            )}
          </div>

          {/* Reassurance */}
          <p className="mt-8 text-[13px] leading-[1.65] text-ink-quiet max-w-sm">
            There is no pressure here. Come back to this letter when you are
            ready. It will wait.
          </p>
        </div>
      </section>

      {/* ── RETAKE ───────────────────────────────────────────────── */}
      <section className="bg-cream py-10 border-t border-sand/50">
        <div className="container-content max-w-[640px] mx-auto px-6 text-center">
          <a
            href="/assessment"
            className="text-[12px] tracking-[0.15em] uppercase text-ink-quiet hover:text-ink-soft transition-colors"
          >
            Return to the assessment
          </a>
        </div>
      </section>
    </>
  );
}
