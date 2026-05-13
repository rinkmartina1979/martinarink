import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { ARCHETYPE_RESULTS } from "@/lib/assessment/result-copy";
import { deriveRouting } from "@/lib/assessment/scoring";
import { verifyAndDecodeResultId } from "@/lib/assessment/resultId";
import { getAssessmentResult } from "@/sanity/lib/queries";
import { InlineLetterCapture } from "@/components/assessment/InlineLetterCapture";
import type { Archetype, ServiceIntent, ReadinessLevel, PrivacyNeed } from "@/lib/assessment/types";
import type { Metadata } from "next";

interface DecodedResult {
  archetype: Archetype;
  serviceIntent: ServiceIntent;
  readinessLevel: ReadinessLevel;
  privacyNeed: PrivacyNeed;
}

interface Props {
  params: Promise<{ resultId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resultId } = await params;
  const decoded = verifyAndDecodeResultId(resultId);
  const archetype = decoded?.archetype;
  const fallback = archetype ? ARCHETYPE_RESULTS[archetype] : null;
  const name = fallback?.name ?? "Your Assessment Result";

  return buildMetadata({
    title: `Your result: ${name}`,
    description:
      "A private letter — written specifically for where you are right now.",
    path: `/assessment/result/${resultId}`,
    noIndex: true,
  });
}

export default async function AssessmentResultPage({ params }: Props) {
  const { resultId } = await params;

  // Verify HMAC signature — returns null if tampered or malformed
  const decoded = verifyAndDecodeResultId(resultId) as DecodedResult | null;
  if (!decoded) notFound();

  const { archetype, serviceIntent, readinessLevel, privacyNeed } = decoded;

  // Try Sanity first, fall back to hardcoded copy
  const sanityCopy = await getAssessmentResult(archetype).catch(() => null);
  const fallbackCopy = ARCHETYPE_RESULTS[archetype];
  if (!fallbackCopy) notFound();

  const name = sanityCopy?.name ?? fallbackCopy.name;
  const tagline = sanityCopy?.tagline ?? fallbackCopy.tagline;
  const opening = sanityCopy?.opening ?? fallbackCopy.opening;
  const bodyParagraphs = sanityCopy?.bodyParagraphs ?? fallbackCopy.bodyParagraphs;
  const closing = sanityCopy?.closing ?? fallbackCopy.closing;

  const routing = deriveRouting({
    archetype,
    scores: { reckoning: 0, threshold: 0, return: 0 },
    serviceIntent,
    readinessLevel,
    privacyNeed,
  });

  const isPrivacyHigh = privacyNeed === "high";
  const isHighReadiness = readinessLevel === "high";

  return (
    <>
      {/* ── RESULT HEADER ────────────────────────────────────────── */}
      <section className="bg-ink pt-32 md:pt-44 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink/30 to-transparent" />

        <div className="container-content max-w-2xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-6 bg-pink" />
            <span className="text-[11px] tracking-[0.22em] uppercase text-pink-soft/80 font-[family-name:var(--font-body)]">
              Your result
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-[38px] md:text-[52px] leading-[1.08] text-cream">
            {name}
          </h1>

          <p className="mt-5 text-[17px] md:text-[19px] leading-[1.65] text-cream/75 max-w-lg">
            {tagline}
          </p>
        </div>
      </section>

      {/* ── LETTER BODY ──────────────────────────────────────────── */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-content max-w-[640px] mx-auto px-6">
          {/* Opening — italic pull-quote */}
          <p className="font-[family-name:var(--font-display)] italic text-[22px] md:text-[26px] leading-[1.45] text-ink border-l-2 border-pink pl-6 mb-12">
            {opening}
          </p>

          {/* Body paragraphs */}
          <div className="space-y-7">
            {bodyParagraphs.map((para, i) => (
              <p key={i} className="text-[17px] leading-[1.8] text-ink-soft">
                {para}
              </p>
            ))}
          </div>

          {/* Privacy high — extra reassurance block */}
          {isPrivacyHigh && (
            <div className="mt-12 pt-8 border-t border-sand">
              <p className="text-[14px] leading-[1.7] text-ink-quiet italic">
                A note on privacy: there is no group, no shared room, no public record.
                What we do together is entirely between us. A non-disclosure agreement
                is available on request. The conversation, if we have one, stays private.
              </p>
            </div>
          )}

          {/* Closing */}
          <p className="mt-10 text-[17px] leading-[1.7] text-ink font-medium">
            {closing}
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

      {/* ── INLINE LETTER CAPTURE — for non-high readiness only ─────
            Captures email at peak attention; replaces the leak-prone redirect
            to /newsletter that medium/low CTAs previously sent users to. */}
      {!isHighReadiness && (
        <section className="bg-cream pb-12">
          <div className="container-content max-w-[640px] mx-auto px-6">
            <InlineLetterCapture archetype={archetype} />
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-bone border-t border-sand py-16 md:py-20">
        <div className="container-content max-w-[640px] mx-auto px-6">
          <p className="text-[13px] tracking-[0.2em] uppercase text-ink-quiet mb-8">
            {isHighReadiness ? "The natural next step" : "Or — when you are ready"}
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href={routing.primaryHref}
              className="inline-flex items-center justify-center bg-plum text-cream uppercase tracking-[0.18em] text-[12px] font-medium px-10 py-4 rounded-[1px] hover:bg-plum-deep transition-colors duration-200"
            >
              {routing.primaryLabel}
            </a>

            {routing.secondaryHref && isHighReadiness && (
              <a
                href={routing.secondaryHref}
                className="inline-flex items-center justify-center border border-sand text-ink-soft uppercase tracking-[0.15em] text-[12px] font-medium px-8 py-4 rounded-[1px] hover:border-ink-quiet hover:text-ink transition-colors duration-200"
              >
                {routing.secondaryLabel}
              </a>
            )}
          </div>

          {/* High-intent extra reassurance */}
          {isHighReadiness && (
            <p className="mt-6 text-[14px] leading-[1.7] text-ink-soft max-w-sm">
              The private consultation is €450, applied in full to the programme
              if you proceed. I hold four each week.
            </p>
          )}

          {/* Privacy high CTA reassurance */}
          {isPrivacyHigh && isHighReadiness && (
            <p className="mt-4 text-[13px] leading-[1.65] text-ink-quiet max-w-sm">
              No group room. No public record. A private conversation, if and
              when it is right.
            </p>
          )}

          {/* Standard reassurance */}
          {!isHighReadiness && (
            <p className="mt-8 text-[13px] leading-[1.65] text-ink-quiet max-w-sm">
              There is no pressure here. Come back to this letter when you are
              ready. It will wait.
            </p>
          )}
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
