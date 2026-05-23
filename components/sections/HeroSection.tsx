/**
 * HeroSection — Vogue editorial split hero.
 *
 * ┌─────────────────────────────────────┬──────────────────────────────┐
 * │  LEFT 54% — aubergine editorial     │  RIGHT 46% — cream portrait  │
 * │                                     │                              │
 * │  eyebrow (pink hairline)            │  cream panel, padded         │
 * │  H1  (display, tight leading)       │  aspect-[4/3] wrapper        │
 * │  script accent "and yet."           │  object-cover object-center  │
 * │  body copy + subheadline            │  image is 4:3 landscape —    │
 * │  CTAs (cream fill / ghost)          │  matches wrapper exactly,    │
 * │  trust micro-copy                   │  zero crop guaranteed        │
 * └─────────────────────────────────────┴──────────────────────────────┘
 *
 * KEY RULES:
 *  1. The hero image (martina-women-empowerment-coach.jpg) is 2048×1529,
 *     aspect ratio ~4:3. The right panel uses aspect-[4/3] so the image
 *     fills it perfectly with object-cover — no cropping ever occurs.
 *
 *  2. The right panel has cream background + padding. The photo is framed
 *     like an editorial plate, not stretched as a background.
 *
 *  3. No seam gradient. No blur. No vignette. The colour break between
 *     aubergine and cream IS the editorial seam.
 *
 *  4. Mobile: stacked text-first, image second. aspect-[4/3] is preserved.
 *     Padding removed so the image fills mobile width edge-to-edge.
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
    <section className="relative overflow-hidden bg-aubergine text-cream">

      {/*
        GRID
        ─────────────────────────────────────────────────────
        container-content centres and constrains the layout.
        items-center vertically aligns both columns.
        pt-[88px] clears the fixed nav on mobile.
        lg:min-h lets desktop fill the viewport without forcing it.
      */}
      <div
        className="container-content
                   grid grid-cols-1 lg:grid-cols-[54%_46%]
                   items-center gap-8 lg:gap-10
                   pt-[88px] pb-12
                   md:pt-[96px] md:pb-14
                   lg:min-h-[calc(100svh-80px)] lg:py-14"
      >

        {/* ══════════════════════════════════════════════════
            LEFT — editorial copy
            max-w-[720px] keeps text from stretching too wide
            on very large screens inside the 54% column.
            ══════════════════════════════════════════════════ */}
        <div className="max-w-[720px]">

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
                       leading-[0.86] tracking-[-0.055em]
                       text-cream"
            style={{
              fontSize: "clamp(3.5rem, 6.2vw, 7.4rem)",
              animation: anim("0.12s"),
            }}
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
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            style={{ animation: anim("0.35s") }}
          >
            {/* PRIMARY — cream fill + aubergine text */}
            <Link
              href={heroCtaUrl}
              className="inline-flex h-14 w-full sm:w-auto sm:min-w-[260px]
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
              className="inline-flex h-14 w-full sm:w-auto sm:min-w-[260px]
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
            RIGHT — editorial portrait panel
            ─────────────────────────────────────────────────
            Cream background with padding frames the photo like
            a magazine plate. The aspect-[4/3] wrapper matches
            the image's native ratio (2048×1529 ≈ 4:3) exactly —
            object-cover fills it with zero cropping.

            No seam gradient. No blur. No vignette.
            The cream/aubergine colour break IS the editorial seam.
            ══════════════════════════════════════════════════ */}
        <div
          className="bg-cream
                     p-0 sm:p-4 lg:p-8 xl:p-10
                     self-center"
          style={{ animation: anim("0.15s") }}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={HERO_IMG}
              alt="Martina Rink — private mentor seated with books in an editorial interior"
              fill
              priority
              fetchPriority="high"
              quality={90}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

      </div>

    </section>
  );
}
