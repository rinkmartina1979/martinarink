import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";

interface PageHeroProps {
  eyebrow: string;
  headline: React.ReactNode;
  subheadline?: string;
  cta?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  portrait?: {
    src: string;
    alt: string;
    /** objectPosition CSS value — default "50% 15%" */
    objectPosition?: string;
    /** sizes attribute — default "(min-width: 1024px) 46vw, 100vw" */
    sizes?: string;
  };
  /** dark = aubergine #231727 (default) | light = cream */
  variant?: "dark" | "light";
  /** Slot rendered after subheadline, before CTAs (availability badge, etc.) */
  children?: React.ReactNode;
}

/**
 * PageHero — Vogue 2026 editorial hero for inner pages.
 *
 * Three layout modes:
 *   dark  + portrait  →  54/46 split grid, min-h-[100svh], aubergine cap + nav clearance
 *   dark  + no portrait → full-width dark banner, generous padding
 *   light + no portrait → full-width cream header, flows into content below
 *
 * Portrait nav-clearance uses the same technique as HeroSection.tsx:
 *   outer div bg-[#231727] fills full column height (including behind fixed nav),
 *   inner absolute div starts at top: 80px so face is always visible below nav.
 *
 * Tune objectPosition live in DevTools:
 *   document.querySelectorAll('.page-hero-portrait')[0].style.objectPosition = 'X% Y%'
 */
export function PageHero({
  eyebrow,
  headline,
  subheadline,
  cta,
  ctaSecondary,
  portrait,
  variant = "dark",
  children,
}: PageHeroProps) {
  const isDark = variant === "dark";
  const hasPortrait = !!portrait;

  return (
    <section
      aria-label={eyebrow}
      className={
        hasPortrait
          ? "relative grid min-h-[100svh] grid-cols-1 lg:grid-cols-[54fr_46fr]"
          : isDark
          ? "relative bg-[#231727] pt-[calc(80px+4rem)] pb-20 md:pb-28"
          : "relative bg-cream pt-[calc(80px+3.5rem)] pb-0"
      }
    >

      {/* ══════════════════════════════════════════════════════
          TEXT — left column (portrait mode) or full-width
          ══════════════════════════════════════════════════ */}
      <div
        className={[
          "relative z-10 flex flex-col justify-center",
          hasPortrait
            ? [
                isDark ? "bg-[#231727]" : "bg-cream",
                "px-8 py-20 sm:px-12 md:px-14",
                "lg:px-14 lg:pt-[5rem] lg:pb-[2.5rem] xl:px-20 2xl:px-24",
              ].join(" ")
            : "container-content max-w-4xl",
        ].join(" ")}
      >

        <Eyebrow variant={isDark ? "light" : "default"} withLine>
          {eyebrow}
        </Eyebrow>

        <h1
          className={[
            "mt-6 font-[family-name:var(--font-display)] italic",
            "leading-[0.98] tracking-[-0.03em]",
            isDark ? "text-cream" : "text-ink",
          ].join(" ")}
          style={{ fontSize: "clamp(2.6rem, 4.2vw, 4.25rem)" }}
        >
          {headline}
        </h1>

        {subheadline && (
          <p
            className={[
              "mt-7 max-w-[500px] font-[family-name:var(--font-body)]",
              "text-[17px] md:text-[18px] leading-[1.7]",
              isDark ? "text-cream/65" : "text-ink-soft",
            ].join(" ")}
          >
            {subheadline}
          </p>
        )}

        {/* Children slot — availability badge, extra signals, etc. */}
        {children}

        {/* CTAs */}
        {cta && (
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {isDark ? (
              /* Dark variant: cream fill → ghost on hover */
              <Link
                href={cta.href}
                className="inline-flex h-14 w-full items-center justify-center
                  rounded-[1px] border border-cream bg-cream
                  px-8 font-[family-name:var(--font-body)] text-[11px]
                  font-semibold uppercase tracking-[0.22em]
                  text-[#231727] transition-all duration-300 ease-out
                  hover:bg-transparent hover:text-cream
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-4 focus-visible:outline-cream
                  sm:w-auto sm:min-w-[240px]"
              >
                {cta.label}&nbsp;<span aria-hidden>→</span>
              </Link>
            ) : (
              /* Light variant: plum fill button */
              <PlumButton href={cta.href}>{cta.label}</PlumButton>
            )}

            {ctaSecondary && isDark && (
              <Link
                href={ctaSecondary.href}
                className="inline-flex h-14 w-full items-center justify-center
                  rounded-[1px] border border-cream/35
                  px-8 font-[family-name:var(--font-body)] text-[11px]
                  font-semibold uppercase tracking-[0.22em]
                  text-cream/80 transition-all duration-300 ease-out
                  hover:border-cream hover:bg-cream hover:text-[#231727]
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-4 focus-visible:outline-cream
                  sm:w-auto sm:min-w-[240px]"
              >
                {ctaSecondary.label}&nbsp;<span aria-hidden>→</span>
              </Link>
            )}
          </div>
        )}

        {/* Trust micro-copy — dark + CTA only */}
        {isDark && cta && (
          <p className="mt-4 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.34em] text-cream/35">
            Private &middot; Confidential &middot; By application
          </p>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════
          PORTRAIT — desktop
          Outer bg-[#231727] fills full column height including
          the 80px zone behind the fixed nav (seamless band).
          Inner div starts at top: 80px — face clear of nav.
          ══════════════════════════════════════════════════ */}
      {hasPortrait && (
        <div className="relative hidden lg:block bg-[#231727]">
          <div
            className="absolute left-0 right-0 bottom-0 overflow-hidden"
            style={{ top: "80px" }}
          >
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              priority
              fetchPriority="high"
              quality={90}
              sizes={portrait.sizes ?? "(min-width: 1024px) 46vw, 100vw"}
              className="page-hero-portrait object-cover"
              style={{ objectPosition: portrait.objectPosition ?? "50% 15%" }}
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          PORTRAIT — mobile (full-width banner below text)
          h-[55svh] gives strong presence on 375px screens.
          ══════════════════════════════════════════════════ */}
      {hasPortrait && (
        <div className="relative h-[55svh] overflow-hidden lg:hidden">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            quality={80}
            sizes="100vw"
            className="page-hero-portrait object-cover"
            style={{ objectPosition: portrait.objectPosition ?? "50% 15%" }}
          />
        </div>
      )}

    </section>
  );
}
