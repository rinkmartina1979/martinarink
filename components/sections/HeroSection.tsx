/**
 * HeroSection — Premium 52/48 split editorial hero.
 *
 * ┌────────────────────────────────┬─────────────────────┐
 * │  LEFT 52% — editorial copy     │  RIGHT 48% — portrait│
 * │                                │                      │
 * │  eyebrow (pink hairline)       │  fill + object-cover │
 * │  H1  (display, tight leading)  │  object-[50%_42%]    │
 * │  script accent "and yet."      │                      │
 * │  body copy                     │  left seam gradient  │
 * │  CTAs (cream fill / ghost)     │  (desktop only)      │
 * │  trust micro-copy              │                      │
 * └────────────────────────────────┴─────────────────────┘
 *
 * KEY RULES:
 *  1. Image is a true portrait COLUMN — not a background strip.
 *     It sits in its own grid cell and bleeds to the right edge.
 *
 *  2. Primary CTA = cream fill + aubergine text.
 *     Plum is the site-wide action colour but inside the aubergine
 *     hero, cream-on-dark is the luxury editorial choice.
 *
 *  3. Grid uses min-h, not h, so if copy grows (e.g. translated text)
 *     the section grows rather than overflowing.
 *
 *  4. object-[50%_42%]: 42% down the image keeps the face (eyes,
 *     smile, neck) visible at every container aspect ratio.
 *
 *  5. Left seam gradient is desktop-only (lg:block) — it dissolves
 *     the image edge into the aubergine text column.
 *
 *  6. Mobile: text column first in DOM → above the portrait.
 *     Portrait gets a fixed svh height so it never disappears.
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
const HERO_IMG = "/images/portraits/martina-hero-editorial.png";

/* ─── props ──────────────────────────────────────────────────── */
interface HeroSectionProps {
  heroCta?:            string;
  heroCtaUrl?:         string;
  heroSecondaryLabel?: string;
  heroSecondaryUrl?:   string;
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export function HeroSection({
  heroCta            = "Begin the assessment",
  heroCtaUrl         = "/assessment",
  heroSecondaryLabel = "Explore the work",
  heroSecondaryUrl   = "/work-with-me",
}: HeroSectionProps) {
  return (
    /*
      SECTION — full width, aubergine background.
      The grid inside is not wrapped in container-content because
      the right image column must bleed to the viewport edge.
    */
    <section className="relative overflow-hidden bg-aubergine text-cream">

      {/*
        GRID
        ─────────────────────────────────────────────────────
        Mobile:  1 column, stacked (text above, portrait below)
        Desktop: 52% left text / 48% right portrait

        min-h keeps the hero at least full-viewport-minus-navbar.
        Uses min-h (not h) so very-tall content can grow safely.
      */}
      <div
        className="grid grid-cols-1
                   min-h-[calc(100svh-72px)]
                   md:min-h-[calc(100svh-80px)]
                   lg:grid-cols-[52%_48%]"
      >

        {/* ══════════════════════════════════════════════════
            LEFT — editorial copy  (source-order 1 = mobile first)
            justify-center centres the block at any grid height.
            ══════════════════════════════════════════════════ */}
        <div
          className="flex flex-col justify-center
                     px-6  py-12
                     sm:px-10
                     md:px-16 md:py-16
                     lg:px-20 lg:py-20
                     xl:px-28"
        >

          {/* ── Eyebrow — pink hairline + overline label ── */}
          <div
            className="mb-6 flex items-center gap-4"
            style={{ animation: anim("0.05s") }}
          >
            <span className="h-px w-10 shrink-0 bg-pink" aria-hidden />
            <p className="font-[family-name:var(--font-body)]
                          text-[10px] font-semibold uppercase
                          tracking-[0.34em] text-cream/60">
              Private mentorship
            </p>
          </div>

          {/* ── H1 ── */}
          <h1
            className="font-[family-name:var(--font-display)]
                       text-[clamp(3.2rem,5.2vw,7.8rem)]
                       leading-[0.88] tracking-[-0.055em]
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
              className="text-[clamp(2.6rem,3.8vw,5rem)] leading-none text-pink"
            >
              and yet.
            </ScriptAccent>
          </div>

          {/* ── Body copy ── */}
          <p
            className="mt-7 max-w-[520px]
                       font-[family-name:var(--font-body)]
                       text-[18px] md:text-[20px] leading-[1.65]
                       text-cream/78"
            style={{ animation: anim("0.28s") }}
          >
            Private mentorship for accomplished women who are ready
            to feel at home inside the life they built.
          </p>

          {/* ── CTAs ── */}
          <div
            className="mt-8 flex flex-col gap-4 sm:flex-row"
            style={{ animation: anim("0.35s") }}
          >
            {/*
              PRIMARY — cream fill + aubergine text.
              Inside the aubergine hero, cream-on-dark is the luxury
              editorial choice. Hover inverts to ghost.
            */}
            <Link
              href={heroCtaUrl}
              className="inline-flex h-16 items-center justify-center
                         rounded-[1px] border border-cream bg-cream
                         px-9 font-[family-name:var(--font-body)]
                         text-[12px] font-semibold uppercase tracking-[0.28em]
                         text-aubergine transition-all duration-300 ease-out
                         hover:bg-transparent hover:text-cream
                         focus-visible:outline focus-visible:outline-2
                         focus-visible:outline-offset-4 focus-visible:outline-cream"
            >
              {heroCta}&nbsp;<span aria-hidden>→</span>
            </Link>

            {/*
              SECONDARY — ghost: cream border, transparent fill.
              Hover fills cream, text goes aubergine — mirrors primary.
            */}
            <Link
              href={heroSecondaryUrl}
              className="inline-flex h-16 items-center justify-center
                         rounded-[1px] border border-cream/35
                         px-9 font-[family-name:var(--font-body)]
                         text-[12px] font-semibold uppercase tracking-[0.28em]
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
            className="mt-7 font-[family-name:var(--font-body)]
                       text-[10px] uppercase tracking-[0.34em] text-cream/40"
            style={{ animation: anim("0.42s") }}
          >
            Private &middot; Confidential &middot; By application
          </p>

        </div>

        {/* ══════════════════════════════════════════════════
            RIGHT — portrait column  (source-order 2 = below text on mobile)

            min-h-[58svh]: on mobile the portrait gets a meaningful
            height instead of collapsing.

            lg:min-h-0: on desktop the grid row height dictates size —
            the image fills the full height of the grid.

            object-[50%_42%]: 42% positions the anchor at the eyes
            so face, neck, and wrist stay visible at any aspect ratio.
            ══════════════════════════════════════════════════ */}
        <div
          className="relative min-h-[58svh]
                     sm:min-h-[65svh]
                     lg:min-h-0"
        >
          <Image
            src={HERO_IMG}
            alt="Martina Rink — private mentor, editorial studio portrait"
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover object-[50%_42%]"
          />

          {/*
            LEFT SEAM GRADIENT — desktop only.
            Dissolves the image's left edge into the aubergine
            text column. Gives a clean split without a hard line.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0
                       hidden w-24 lg:block"
            style={{
              background:
                "linear-gradient(to right, var(--color-aubergine), transparent)",
            }}
          />
        </div>

      </div>

    </section>
  );
}
