import { Eyebrow } from "@/components/brand/Eyebrow";

/**
 * Editorial welcome hero. Calm, personal, no metrics.
 */
export function PortalDashboardHero({
  firstName,
  programmeLabel,
  stageLabel,
}: {
  firstName: string;
  programmeLabel: string | null;
  stageLabel: string | null;
}) {
  return (
    <section className="bg-cream pt-28 md:pt-36 pb-10 px-6 border-b border-sand/30">
      <div className="max-w-3xl mx-auto">
        {programmeLabel && <Eyebrow className="mb-5">{programmeLabel}</Eyebrow>}
        <p className="font-[family-name:var(--font-script)] text-[40px] md:text-[52px] text-ink leading-none">
          Good to see you, {firstName}.
        </p>
        {stageLabel && (
          <p className="mt-6 text-[15px] text-ink-soft font-[family-name:var(--font-body)]">
            {stageLabel}
          </p>
        )}
      </div>
    </section>
  );
}
