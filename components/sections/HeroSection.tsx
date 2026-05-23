/**
 * HeroSection — Vogue editorial split hero.
 *
 * ┌─────────────────────────────────────┬──────────────────────────────┐
 * │  LEFT 54% — aubergine editorial     │  RIGHT 46% — cream portrait  │
 * │                                     │                              │
 * │  eyebrow (pink hairline)            │  flex-centered framed image  │
 * │  H1  (display, tight leading)       │  object-contain (no crop)    │
 * │  script accent "and yet."           │  face / watch / body all     │
 * │  body copy                          │  fully visible               │
 * │  CTAs (cream fill / ghost)          │                              │
 * │  trust micro-copy                   │  bg-[#F8F4F1]               │
 * └─────────────────────────────────────┴──────────────────────────────┘
 *
 * KEY RULES:
 *  1. Right column is cream (#F8F4F1), NOT aubergine with a cropped image.
 *     This gives the portrait breathing room and stops aggressive face-crop.
 *
 *  2. object-contain, not object-cover, on desktop.
 *     object-cover fills the container by cropping — it treats the portrait
 *     like wallpaper. object-contain keeps the full subject visible.
 *
 *  3. Image lives inside a MAX-SIZED inner frame (max-w-[600px],
 *     max-h-[760px]) — the portrait is intentionally placed, not stretched.
 *
 *  4. Mobile: stacked text-first, then a fixed-height cover crop of the
 *     portrait (face anchor at 35%). object-cover is acceptable on mobile
 *     because the column is narrow and the constraint is vertical, not crop.
 *
 *  5. No seam gradient needed — the aubergine/cream colour break is the seam.
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
    /*
      SECTION
      ─────────────────────────────────────────────────────
      No overflow-hidden — the cream right panel extends to
      the edge of the viewport naturally.
    */
    <section className="overflow-hidden bg-aubergine text-cream">

      {/*
        GRID
        ─────────────────────────────────────────────────────
        Mobile:  1 column — text above, cream portrait below
        Desktop: 54% aubergine text / 46% cream portrait

        min-h keeps at least one full viewport-minus-nav screen.
      */}
      <div
        className="grid grid-cols-1
                   min-h-[calc(100svh-72px)]
                   md:min-h-[calc(100svh-80px)]
                   lg:grid-cols-[54%_46%]"
      >

        {/* ══════════════════════════════════════════════════
            LEFT — editorial copy
            Source-order 1 = text appears above portrait on mobile.
            justify-center centres the block vertically at desktop.
            ══════════════════════════════════════════════════ */}
        <div
          className="flex flex-col justify-start
                     px-6  pt-[88px] pb-10
                     sm:px-10
                     md:px-16 md:pt-[96px] md:pb-12
                     lg:justify-center lg:px-20 lg:pt-0 lg:pb-0
                     xl:px-28"
        >

          {/* ── Eyebrow ── */}
          <div
            className="mb-6 flex items-center gap-4"
            style={{ animation: anim("0.05s") }}
          >
            <span className="h-px w-10 shrink-0 bg-pink" aria-hidden />
            <p className="font-[family-name:var(--font-body)]
                          text-[10px] font-semibold uppercase
                          tracking-[0.34em] text-cream/60">
              Private sober muse mentorship
            </p>
          </div>

          {/* ── H1 ── */}
          <h1
            className="font-[family-name:var(--font-display)]
                       text-[clamp(2.6rem,4.2vw,6.4rem)]
                       leading-[0.90] tracking-[-0.055em]
                       text-cream max-w-[680px]"
            style={{ animation: anim("0.12s") }}
          >
            You&rsquo;ve built a life that looks{" "}
            <em className="italic">extraordinary</em>
            <br className="hidden md:block" />{" "}
            from&nbsp;the&nbsp;outside
          </h1>

          {/* ── Script accent ── */}
          <div
            className="mt-6 flex items-center gap-5"
            style={{ animation: anim("0.20s") }}
          >
            <span className="h-px w-16 shrink-0 bg-pink" aria-hidden />
            <ScriptAccent
              className="text-[clamp(2.4rem,3.6vw,4.8rem)] leading-none text-pink"
            >
              and yet.
            </ScriptAccent>
          </div>

          {/* ── Body copy ── */}
          <p
            className="mt-7 max-w-[500px]
                       font-[family-name:var(--font-body)]
                       text-[17px] md:text-[19px] leading-[1.65]
                       text-cream/78"
            style={{ animation: anim("0.28s") }}
          >
            Private mentorship for accomplished women who are ready
            to feel at home inside the life they built.
          </p>

          {/* ── Second body paragraph (heroSubheadline) ── */}
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
            className="hidden lg:block mt-8 mb-0 border-none h-px w-14 bg-cream/20"
            aria-hidden
          />

          {/* ── CTAs ── */}
          <div
            className="mt-8 flex flex-col gap-4 sm:flex-row"
            style={{ animation: anim("0.35s") }}
          >
            {/*
              PRIMARY — cream fill + aubergine text.
              min-w prevents text wrapping on one-line desktop layout.
            */}
            <Link
              href={heroCtaUrl}
              className="inline-flex h-14 min-w-[260px] items-center justify-center
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

            {/*
              SECONDARY — ghost cream border.
              Hover fills cream, text goes aubergine — mirrors primary.
            */}
            <Link
              href={heroSecondaryUrl}
              className="inline-flex h-14 min-w-[260px] items-center justify-center
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

        {/*
          RIGHT — full-bleed portrait panel
          ─────────────────────────────────────────────────────
          2026 editorial rule: portrait fills the grid cell edge-to-edge —
          no padding, no letterbox, no cream border.
          object-cover with a top anchor (8%) keeps face + shoulders + watch
          prominently in frame without cropping the face.

          The seam gradient (absolute, left edge, 2rem wide) softens the
          hard aubergine / portrait cut — a hallmark of Vogue, Jacquemus,
          and Net-a-Porter editorial splits.
        */}
        {/*
          object-contain — shows the FULL seated subject:
          face, shoulders, watch, outfit, Chanel/Vogue books, sofa.
          For a personal brand coach, complete presence (not a Vogue
          face-crop) builds trust and communicates authority + warmth.
          Warm cream bg fills the empty letterbox areas naturally.
        */}
        <div
          className="relative overflow-hidden
                     h-[70svh] min-h-[480px]
                     lg:h-auto lg:min-h-0"
        >
          <Image
            src={HERO_IMG}
            alt="Martina Rink — private mentor, editorial studio portrait"
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover object-[center_18%]
                       lg:object-cover lg:object-[center_12%]"
          />

          {/* Seam gradient — deep editorial bleed from aubergine into the portrait */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-28
                       bg-gradient-to-r from-aubergine/55 to-transparent"
          />

          {/* Bottom vignette — mobile only, fades portrait into aubergine section below */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24
                       bg-gradient-to-t from-aubergine/60 to-transparent
                       lg:hidden"
          />
        </div>

      </div>

    </section>
  );
}
