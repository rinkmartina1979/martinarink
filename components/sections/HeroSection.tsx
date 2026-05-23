/**
 * HeroSection — full-bleed Vogue editorial split hero.
 *
 * ┌─────────────────────────────────────────┬─────────────────────────────┐
 * │  LEFT 54% — bg-aubergine editorial      │  RIGHT 46% — full-bleed     │
 * │                                         │  portrait, no bg, no frame  │
 * │  eyebrow · H1 · script · body · CTAs   │  fill + object-cover        │
 * └─────────────────────────────────────────┴─────────────────────────────┘
 *
 * KEY DECISIONS:
 *  1. The <section> is the grid — no container-content wrapper.
 *     Container would cap at 1280px and add lateral padding, which
 *     prevents the portrait from bleeding to the viewport edge.
 *
 *  2. bg-aubergine lives on the LEFT div, not on the section.
 *     This lets the right column be a raw full-bleed image panel.
 *
 *  3. objectPosition via inline style, not Tailwind arbitrary class.
 *     Tailwind v4 doesn't reliably generate object-position utilities.
 *     Tune in DevTools: document.querySelector('.hero-portrait').style.objectPosition = 'X% Y%'
 *
 *  4. Mobile: full-width image banner (h-[70svh]) BELOW the text,
 *     with a bottom-to-aubergine vignette so the stacked sections read cleanly.
 *
 *  5. Fonts: Playfair Display (Bodoni sub via --font-display),
 *     DM Sans (Brandon Grotesque sub via --font-body),
 *     Sloop Script (premium local via --font-script).
 *     All correct — no changes needed to lib/fonts.ts.
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
 * Image is 2400×1792 (landscape). The right column is portrait-proportioned,
 * so the crop cuts left/right. '62% 0%' centres on Martina's face/upper body.
 *
 * To tune live in DevTools console:
 *   document.querySelector('.hero-portrait').style.objectPosition = '62% 0%'
 * Try: '58% 0%' (face left), '70% 0%' (face right), '62% 5%' (pull down)
 */
const OBJ_POSITION = "62% 0%";

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
      className={[
        /* Full-viewport split grid — section IS the grid */
        "relative grid min-h-[100svh]",
        /* Mobile: single column (portrait stacks below) */
        "grid-cols-1",
        /* Desktop: 54/46 split */
        "lg:grid-cols-[54fr_46fr]",
      ].join(" ")}
    >

      {/* ══════════════════════════════════════════════════
          LEFT — aubergine editorial column
          ══════════════════════════════════════════════════ */}
      <div
        className={[
          "relative z-10 flex flex-col justify-center",
          "bg-aubergine",
          /* Mobile/tablet padding */
          "px-8 py-20 sm:px-12 md:px-14",
          /* Desktop: top-pad clears fixed nav (~80px) */
          "lg:px-14 lg:py-[7rem] xl:px-20 2xl:px-24",
        ].join(" ")}
      >

        {/* ── Eyebrow ── */}
        <div
          className="mb-8 flex items-center gap-4"
          style={{ animation: anim("0.05s") }}
        >
          <span className="h-px w-10 shrink-0 bg-pink" aria-hidden />
          <p className="font-[family-name:var(--font-body)]
                        text-[10px] font-semibold uppercase
                        tracking-[0.34em] text-cream/60">
            Private sober muse mentorship
          </p>
        </div>

        {/* ── H1 — Playfair Display (Bodoni sub), weight 400 ── */}
        <h1
          className="font-[family-name:var(--font-display)]
                     font-normal leading-[0.96] tracking-[-0.03em]
                     text-cream"
          style={{
            fontSize: "clamp(3.5rem, 6.2vw, 7.4rem)",
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
          className="mt-7 flex items-center gap-5"
          style={{ animation: anim("0.20s") }}
        >
          <span className="h-px w-7 shrink-0 bg-pink" aria-hidden />
          <ScriptAccent
            className="leading-none text-pink"
            style={{ fontSize: "clamp(2rem, 3.2vw, 4rem)" }}
          >
            and yet.
          </ScriptAccent>
          <span className="h-px w-14 shrink-0 bg-pink" aria-hidden />
        </div>

        {/* ── Body copy ── */}
        <p
          className="mt-8 max-w-[500px]
                     font-[family-name:var(--font-body)]
                     text-[17px] md:text-[19px] leading-[1.65]
                     text-cream/75"
          style={{ animation: anim("0.28s") }}
        >
          Private mentorship for accomplished women who are ready
          to feel at home inside the life they built.
        </p>

        {/* ── Second body paragraph (heroSubheadline from Sanity/page.tsx) ── */}
        {heroSubheadline && (
          <p
            className="mt-5 max-w-[500px]
                       font-[family-name:var(--font-body)]
                       text-[15px] md:text-[17px] leading-[1.7]
                       text-cream/55"
            style={{ animation: anim("0.33s") }}
          >
            {heroSubheadline}
          </p>
        )}

        {/* ── Editorial hairline ── */}
        <hr
          className="hidden lg:block mt-9 mb-0 border-none h-px w-14 bg-cream/20"
          aria-hidden
        />

        {/* ── CTAs ── */}
        <div
          className="mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ animation: anim("0.35s") }}
        >
          {/* PRIMARY — cream fill + aubergine text */}
          <Link
            href={heroCtaUrl}
            className="inline-flex h-14 w-full sm:w-auto sm:min-w-[240px]
                       items-center justify-center
                       rounded-[1px] border border-cream bg-cream
                       px-8 font-[family-name:var(--font-body)]
                       text-[11px] font-semibold uppercase tracking-[0.22em]
                       text-aubergine transition-all duration-300 ease-out
                       hover:bg-transparent hover:text-cream
                       focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-4 focus-visible:outline-cream"
          >
            {heroCta}&nbsp;<span aria-hidden>→</span>
          </Link>

          {/* SECONDARY — ghost cream border */}
          <Link
            href={heroSecondaryUrl}
            className="inline-flex h-14 w-full sm:w-auto sm:min-w-[240px]
                       items-center justify-center
                       rounded-[1px] border border-cream/35
                       px-8 font-[family-name:var(--font-body)]
                       text-[11px] font-semibold uppercase tracking-[0.22em]
                       text-cream/80 transition-all duration-300 ease-out
                       hover:border-cream hover:bg-cream hover:text-aubergine
                       focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-4 focus-visible:outline-cream"
          >
            {heroSecondaryLabel}&nbsp;<span aria-hidden>→</span>
          </Link>
        </div>

        {/* ── Trust micro-copy ── */}
        <p
          className="mt-6 font-[family-name:var(--font-body)]
                     text-[10px] uppercase tracking-[0.34em] text-cream/40"
          style={{ animation: anim("0.42s") }}
        >
          Private &middot; Confidential &middot; By application
        </p>

      </div>

      {/* ══════════════════════════════════════════════════
          RIGHT — full-bleed portrait (desktop only)
          ─────────────────────────────────────────────────
          No bg-cream. No padding. No frame.
          The aubergine / portrait colour break IS the seam.
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
      </div>

      {/* ══════════════════════════════════════════════════
          MOBILE image — full-width banner below text
          h-[70svh] gives strong presence without pushing
          too far down on 375px screens.
          Bottom vignette fades into the cream section below.
          ══════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden lg:hidden h-[70svh]">
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
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24
                     bg-gradient-to-t from-cream/70 to-transparent"
        />
      </div>

    </section>
  );
}
