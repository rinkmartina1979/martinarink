"use client";

import { trackAssessment, trackHighIntentLead } from "@/lib/analytics/events";

interface ResultCTAButtonsProps {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string | null;
  secondaryLabel?: string | null;
  archetype: string;
  serviceIntent: string;
  readinessLevel: string;
}

/** Primary/secondary result CTAs — client component so clicks can be tracked
 *  before the normal link navigation proceeds. */
export function ResultCTAButtons({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  archetype,
  serviceIntent,
  readinessLevel,
}: ResultCTAButtonsProps) {
  function handlePrimaryClick() {
    trackAssessment("assessment_cta_clicked", {
      ctaLabel: primaryLabel,
      ctaHref: primaryHref,
      readinessLevel,
    });
    if (readinessLevel === "high") {
      trackHighIntentLead(archetype, serviceIntent);
    }
  }

  function handleSecondaryClick() {
    trackAssessment("assessment_cta_clicked", {
      ctaLabel: secondaryLabel ?? undefined,
      ctaHref: secondaryHref ?? undefined,
      readinessLevel,
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4">
      <a
        href={primaryHref}
        onClick={handlePrimaryClick}
        className="inline-flex items-center justify-center bg-plum text-cream uppercase tracking-[0.18em] text-[12px] font-medium px-10 py-4 rounded-[1px] hover:bg-plum-deep transition-colors duration-200"
      >
        {primaryLabel}
      </a>

      {secondaryHref && (
        <a
          href={secondaryHref}
          onClick={handleSecondaryClick}
          className="inline-flex items-center justify-center border border-sand text-ink-soft uppercase tracking-[0.15em] text-[12px] font-medium px-8 py-4 rounded-[1px] hover:border-ink-quiet hover:text-ink transition-colors duration-200"
        >
          {secondaryLabel}
        </a>
      )}
    </div>
  );
}
