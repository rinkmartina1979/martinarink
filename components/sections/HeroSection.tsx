/**
 * HeroSection — full-bleed Vogue editorial split hero.
 *
 * ┌─────────────────────────────────────────┬─────────────────────────────┐
 * │  LEFT 54% — aubergine editorial         │  RIGHT 46% — full-bleed     │
 * │                                         │  portrait, no bg, no frame  │
 * │  eyebrow · H1 · script · body · CTAs   │  fill + object-cover        │
 * └─────────────────────────────────────────┴─────────────────────────────┘
 *
 * KEY DECISIONS:
 *  1. The <section> is the grid — no container-content wrapper.
 *     Container would cap at 1280px and add lateral padding, which
 *     prevents the portrait from bleeding to the viewport edge.
 *
 *  2. bg-[#231727] lives on the LEFT div, not on the section.
 *     This lets the right column be a raw full-bleed image panel.
 *
 *  3. objectPosition via inline style, not Tailwind arbitrary class.
 *     Tailwind v4 doesn't reliably generate object-position utilities.
 *     Tune live: document.querySelector('.hero-portrait').style.objectPosition = 'X% Y%'
 *
 *  4. Mobile: full-width image banner (h-[70svh]) BELOW the text,
 *     with a bottom vignette fading to #F8F4F1 (cream) so the
 *     stacked section below reads cleanly.
 *
 *  5. Font shorthand (font-display, font-body, font-script) generated
 *     by Tailwind v4 from --font-* CSS custom properties in @theme.
 */

import Image from "next/image";
import Link  from "next/link";
import { ScriptAccent } from "@/components/brand/ScriptAccent";

/* ─── animation ──────────────────────────────────────────────── */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
function anim(delay: string) {
  return `fadeUp 0.85s ${EASE} ${delay} both`;
}

/* ─── image ──────────────────────────────────────────────────── */
const HERO_IMG = "/images/portraits/martina-women-empowerment-coach.jpg";

/**
 * objectPosition for face-anchored crop.
 * To tune live in DevTools console:
 *   document.querySelector('.hero-portrait').style.objectPosition = '62% 0%'
 */
const OBJ_POSITION = "40% 0%";

/* ─── props ──────────────────────────────────────────────────── */
interface HeroSectionProps {
  heroCta?:            string;
  heroCtaUrl?:         string;
  heroSecondaryLabel?: string;
  heroSecondaryUrl?:   string;
  heroSubheadline?:    string;
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export function HeroSection({
  heroCta            = "Begin the assessment",
  heroCtaUrl         = "/assessment",
  heroSecondaryLabel = "Explore the work",
  heroSecondaryUrl   = "/work-with-me",
  heroSubheadline    = "",
}: HeroSectionProps) {
  return (
    <section
      aria-label="Hero"
      className="relative grid min-h-screen grid-cols-1 lg:min-h-[88vh] lg:grid-cols-[54fr_46fr]"
    >

      {/* ══════════════════════════════════════════════════
          LEFT — aubergine editorial column
          ══════════════════════════════════════════════════ */}
      <div
        className="relative z-10 flex flex-col justify-center bg-[#231727]
                   px-8 py-16 sm:px-12 md:px-14
                   lg:px-14 lg:pt-[4rem] lg:pb-[2.5rem] xl:px-20 2xl:px-24"
      >

        {/* ── Eyebrow ── */}
        <div
          className="mb-5 flex items-center gap-4"
          style={{ animation: anim("0.05s") }}
        >
          <span className="h-px w-10 shrink-0 bg-pink" aria-hidden />
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.34em] text-cream/60">
            Private sober muse mentorship
          </p>
        </div>

        {/* ── H1 — Playfair Display (Bodoni sub), weight 400 ── */}
        <h1
          className="font-display font-normal leading-[0.96] tracking-[-0.03em] text-cream"
          style={{
            fontSize: "clamp(2.6rem, 4vw, 3.875rem)",
            animation: anim("0.12s"),
          }}
        >
          You&rsquo;ve built a life
          <br />that looks{" "}
          <em className="italic">extraordinary</em>
          <br />from&nbsp;the&nbsp;outside
        </h1>

        {/* ── Script accent "and yet." — Sloop Script (premium local) ── */}
        <div
          className="mt-5 flex items-center gap-5"
          style={{ animation: anim("0.20s") }}
        >
          <span className="h-px w-7 shrink-0 bg-pink" aria-hidden />
          <ScriptAccent
            className="leading-none text-pink"
            style={{ fontSize: "clamp(1.8rem, 2.8vw, 3.2rem)" }}
          >
            and yet.
          </ScriptAccent>
          <span className="h-px w-14 shrink-0 bg-pink" aria-hidden />
        </div>

        {/* ── Body copy ── */}
        <p
          className="mt-6 max-w-[500px] font-body text-[16px] leading-[1.65] text-cream/75 md:text-[18px]"
          style={{ animation: anim("0.28s") }}
        >
          Private mentorship for accomplished women who are ready
          to feel at home inside the life they built.
        </p>


        {/* ── CTAs ── */}
        <div
          className="mt-7 flex flex-col gap-3 sm:flex-row"
          style={{ animation: anim("0.35s") }}
        >
          {/* PRIMARY — cream fill + aubergine text */}
          <Link
            href={heroCtaUrl}
            className="inline-flex h-14 w-full items-center justify-center
                       rounded-[1px] border border-cream bg-cream
                       px-8 font-body text-[11px] font-semibold uppercase tracking-[0.22em]
                       text-[#231727] transition-all duration-300 ease-out
                       hover:bg-transparent hover:text-cream
                       focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-4 focus-visible:outline-cream
                       sm:w-auto sm:min-w-[240px]"
          >
            {heroCta}&nbsp;<span aria-hidden>→</span>
          </Link>

          {/* SECONDARY — ghost cream border */}
          <Link
            href={heroSecondaryUrl}
            className="inline-flex h-14 w-full items-center justify-center
                       rounded-[1px] border border-cream/35
                       px-8 font-body text-[11px] font-semibold uppercase tracking-[0.22em]
                       text-cream/80 transition-all duration-300 ease-out
                       hover:border-cream hover:bg-cream hover:text-[#231727]
                       focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-4 focus-visible:outline-cream
                       sm:w-auto sm:min-w-[240px]"
          >
            {heroSecondaryLabel}&nbsp;<span aria-hidden>→</span>
          </Link>
        </div>

        {/* ── Trust micro-copy ── */}
        <p
          className="mt-4 font-body text-[10px] uppercase tracking-[0.34em] text-cream/40"
          style={{ animation: anim("0.42s") }}
        >
          Private &middot; Confidential &middot; By application
        </p>

      </div>

      {/* ══════════════════════════════════════════════════
          RIGHT — full-bleed portrait (desktop only)
          ─────────────────────────────────────────────────
          No bg. No padding. No frame.
          The #231727 / portrait colour break IS the seam.
          overflow-hidden clips fill outside the column.
          hero-portrait class for DevTools targeting.
          ══════════════════════════════════════════════════ */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src={HERO_IMG}
          alt="Martina Rink — private mentor for accomplished women"
          fill
          priority
          fetchPriority="high"
          quality={90}
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="hero-portrait object-cover"
          style={{ objectPosition: OBJ_POSITION }}
        />
        {/* Left-edge gradient — aubergine bleeds into portrait */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-20"
          style={{ background: "linear-gradient(to right, #231727, transparent)" }}
        />
      </div>

      {/* ══════════════════════════════════════════════════
          MOBILE image — full-width banner below text
          h-[70svh] gives strong presence on 375px screens.
          Bottom vignette fades to #F8F4F1 (cream surface).
          ══════════════════════════════════════════════════ */}
      <div className="relative h-[70svh] overflow-hidden lg:hidden">
        <Image
          src={HERO_IMG}
          alt="Martina Rink — private mentor for accomplished women"
          fill
          quality={80}
          sizes="100vw"
          className="hero-portrait object-cover"
          style={{ objectPosition: OBJ_POSITION }}
        />
        {/* Bottom vignette — fades portrait into cream below on mobile */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{
            background: "linear-gradient(to top, #F8F4F1, transparent)",
          }}
        />
      </div>

    </section>
  );
}
