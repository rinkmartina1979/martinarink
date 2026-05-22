/**
 * PackageTiers — three engagement formats presented in Martina's brand voice.
 *
 * Weekday     Mon–Fri, structured schedule
 * The open line   Daily 8 a.m.–10 p.m., seven days
 * Alongside   In-person, travel, worldwide
 */

const TIERS = [
  {
    name: "Weekday",
    tag: "Structured",
    description:
      "Sessions and correspondence Monday to Friday. For women who prefer the work to live inside existing rhythms — contained, unhurried, and precise.",
    detail: "Weekdays only · video or in person",
  },
  {
    name: "The open line",
    tag: "Daily",
    description:
      "Support from 8 a.m. to 10 p.m., seven days a week. For women navigating something that does not observe office hours.",
    detail: "Daily · 8 a.m. – 10 p.m.",
    featured: true,
  },
  {
    name: "Alongside",
    tag: "Immersive",
    description:
      "In-person sessions, travel, and worldwide meetings. For women who want the work to be genuinely close — in the room, in the city, on the road.",
    detail: "In person · travel · worldwide",
  },
];

interface PackageTiersProps {
  /** "cream" = on light bg, "ink" = on dark bg */
  surface?: "cream" | "ink";
}

export function PackageTiers({ surface = "cream" }: PackageTiersProps) {
  const isDark = surface === "ink";

  return (
    <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-px md:bg-sand/30">
      {TIERS.map((tier) => (
        <div
          key={tier.name}
          className={[
            "relative flex flex-col gap-5 p-8 md:p-10",
            isDark
              ? tier.featured
                ? "bg-aubergine"
                : "bg-ink"
              : tier.featured
              ? "bg-bone border border-sand/60"
              : "bg-cream border border-sand/30",
          ].join(" ")}
        >
          {/* Tag */}
          <p className={[
            "text-[10px] uppercase tracking-[0.28em] font-[family-name:var(--font-body)]",
            isDark ? "text-cream/40" : "text-ink-quiet",
          ].join(" ")}>
            {tier.tag}
          </p>

          {/* Pink hairline */}
          <span className="h-px w-8 bg-pink block" aria-hidden />

          {/* Name */}
          <h3 className={[
            "font-[family-name:var(--font-display)] text-[22px] md:text-[24px] leading-snug",
            isDark ? "text-cream" : "text-ink",
          ].join(" ")}>
            {tier.name}
          </h3>

          {/* Description */}
          <p className={[
            "text-[15px] leading-[1.8] font-[family-name:var(--font-body)] flex-1",
            isDark ? "text-cream/65" : "text-ink-soft",
          ].join(" ")}>
            {tier.description}
          </p>

          {/* Detail pill */}
          <p className={[
            "text-[11px] uppercase tracking-[0.18em] font-[family-name:var(--font-body)]",
            isDark ? "text-cream/35" : "text-ink-quiet",
          ].join(" ")}>
            {tier.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
