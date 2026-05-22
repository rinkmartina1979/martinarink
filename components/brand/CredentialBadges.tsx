import Image from "next/image";

const BADGES = [
  {
    src: "/images/credentials/ici-logo.png",
    alt: "International Association of Coaching Institutes — ICI",
    name: "ICI",
    full: "International Association of Coaching Institutes",
  },
  {
    src: "/images/credentials/in-logo.png",
    alt: "International Association of NLP Institutes — IN",
    name: "IN",
    full: "International Association of NLP Institutes",
  },
];

interface CredentialBadgesProps {
  /** "strip" = slim horizontal bar (homepage / programme pages)
   *  "block" = larger centred display (about page) */
  variant?: "strip" | "block";
  className?: string;
}

export function CredentialBadges({
  variant = "strip",
  className = "",
}: CredentialBadgesProps) {
  if (variant === "block") {
    return (
      <div className={`py-12 md:py-16 ${className}`}>
        <p className="text-center text-[10px] uppercase tracking-[0.26em] text-ink-quiet mb-10 font-[family-name:var(--font-body)]">
          Accreditations
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {BADGES.map((b) => (
            <div key={b.name} className="flex flex-col items-center gap-4">
              <div className="w-[88px] h-[88px] relative grayscale opacity-60 hover:opacity-90 hover:grayscale-0 transition-all duration-500">
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  className="object-contain"
                  sizes="88px"
                />
              </div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-quiet text-center max-w-[120px] leading-snug font-[family-name:var(--font-body)]">
                {b.full}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // strip variant — compact, inline
  return (
    <div className={`flex flex-wrap items-center justify-center gap-8 md:gap-12 ${className}`}>
      <p className="text-[10px] uppercase tracking-[0.26em] text-ink-quiet font-[family-name:var(--font-body)] shrink-0">
        Accredited
      </p>
      <span className="hidden md:block h-px w-5 bg-sand/60 shrink-0" aria-hidden />
      {BADGES.map((b) => (
        <div key={b.name} className="flex items-center gap-3">
          <div className="w-[36px] h-[36px] relative grayscale opacity-55 hover:opacity-85 hover:grayscale-0 transition-all duration-500 shrink-0">
            <Image
              src={b.src}
              alt={b.alt}
              fill
              className="object-contain"
              sizes="36px"
            />
          </div>
          <span className="text-[11px] uppercase tracking-[0.14em] text-ink-quiet font-[family-name:var(--font-body)] leading-tight">
            {b.name}
          </span>
        </div>
      ))}
    </div>
  );
}
