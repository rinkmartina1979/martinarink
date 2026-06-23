import Link from "next/link";

/**
 * The single primary action on the dashboard. One CTA only.
 * Internal links use next/link; external (Calendly) use a plain anchor.
 */
export function NextActionCard({
  title,
  description,
  ctaLabel,
  ctaHref,
  dueAt,
}: {
  title: string;
  description: string | null;
  ctaLabel: string;
  ctaHref: string;
  dueAt?: string | null;
}) {
  const external = /^https?:\/\//.test(ctaHref);
  const due =
    dueAt
      ? new Date(dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" })
      : null;

  const cta = external ? (
    <a
      href={ctaHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-8 py-3 bg-aubergine text-cream text-[12px] uppercase tracking-[0.18em] rounded-[1px] hover:bg-ink transition-colors duration-200"
    >
      {ctaLabel}
    </a>
  ) : (
    <Link
      href={ctaHref}
      className="inline-block px-8 py-3 bg-aubergine text-cream text-[12px] uppercase tracking-[0.18em] rounded-[1px] hover:bg-ink transition-colors duration-200"
    >
      {ctaLabel}
    </Link>
  );

  return (
    <div className="bg-bone border-y border-r border-sand/40 border-l-[3px] border-l-aubergine p-6 md:p-8 md:py-9">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">Your next step</p>
      <p className="font-[family-name:var(--font-display)] text-[26px] md:text-[32px] text-ink leading-[1.2]">
        {title}
      </p>
      {description && (
        <p className="mt-3 text-[15px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)] max-w-xl">
          {description}
        </p>
      )}
      <div className="mt-7">{cta}</div>
      {due && (
        <p className="mt-4 text-[13px] text-ink-quiet font-[family-name:var(--font-body)]">
          When you&rsquo;re ready — by {due}.
        </p>
      )}
    </div>
  );
}
