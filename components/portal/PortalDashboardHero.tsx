/**
 * Editorial welcome hero.
 * Time-of-day greeting computed server-side (CET approximation for EU clients).
 * No metrics — a warm, personal statement of presence.
 */
import { Eyebrow } from "@/components/brand/Eyebrow";

function greetingFor(utcHour: number): string {
  const cet = (utcHour + 1) % 24; // approximate CET (UTC+1)
  if (cet >= 5 && cet < 12) return "Good morning";
  if (cet >= 12 && cet < 18) return "Good afternoon";
  return "Good evening";
}

export function PortalDashboardHero({
  firstName,
  programmeLabel,
  stageLabel,
}: {
  firstName: string;
  programmeLabel: string | null;
  stageLabel: string | null;
}) {
  const greeting = greetingFor(new Date().getUTCHours());

  return (
    <section className="bg-cream pt-28 md:pt-36 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        {programmeLabel && <Eyebrow className="mb-5">{programmeLabel}</Eyebrow>}

        <p className="font-[family-name:var(--font-body)] text-[11px] uppercase tracking-[0.22em] text-ink-quiet mb-1">
          {greeting}
        </p>

        <p className="font-[family-name:var(--font-script)] text-[52px] md:text-[68px] text-ink leading-[0.92] mb-5">
          {firstName}.
        </p>

        {stageLabel && (
          <p className="text-[15px] text-ink-soft font-[family-name:var(--font-body)] leading-[1.65] max-w-md">
            {stageLabel}
          </p>
        )}
      </div>
    </section>
  );
}
