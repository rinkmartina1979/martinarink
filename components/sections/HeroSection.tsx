/**
 * HeroSection — server component, zero Framer Motion.
 * 2026 Vogue-style editorial split: text (55fr) | portrait (45fr).
 *
 * Layout rules enforced here:
 *  · No fill · No object-cover · No absolute image wrapper
 *  · No overflow-hidden crop on portrait · No gradients · No blur
 *  · Desktop: CSS grid, portrait pinned to bottom with object-contain
 *  · Mobile:  text first, full portrait second (h-auto, no crop)
 *
 * CSS entrance animations use @keyframes fadeUp from globals.css.
 */

import Image from "next/image";
import Link  from "next/link";
import { ScriptAccent } from "@/components/brand/ScriptAccent";

/* ─── animation helper ──────────────────────────────────────── */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DUR  = "0.85s";
function anim(delay: string) {
  return `fadeUp ${DUR} ${EASE} ${delay} both`;
}

/* ─── image source (single source of truth) ────────────────── */
const HERO_IMG = "/images/portraits/martina-hero-editorial.png";
// Actual file dimensions: 1024 × 1536 (2 : 3 portrait)
const IMG_W = 1024;
const IMG_H = 1536;

/* ─── props ─────────────────────────────────────────────────── */
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
    <section className="relative overflow-hidden bg-[#2A1538] text-[#FFF9F4]">

      {/* ══════════════════════════════════════════════════════
          MAIN GRID
          · Single column on mobile / tablet
          · 55 fr text | 45 fr portrait at lg (1024 px +)
          · min-h accounts for 92 px fixed navbar
          ══════════════════════════════════════════════════════ */}
      <div
        className="mx-auto grid min-h-[calc(100svh-92px)] max-w-[1440px]
                   lg:grid-cols-[0.55fr_0.45fr]"
      >

        {/* ── TEXT PANEL ───────────────────────────────────── */}
        <div
          className="flex items-center
                     px-6 py-14
                     sm:px-8
                     md:px-12 md:py-16
                     lg:px-20 lg:py-12"
        >
          <div className="max-w-[760px]">

            {/* Overline */}
            <p
              className="mb-6 flex items-center gap-3
                         font-[family-name:var(--font-body)]"
              style={{
                animation:     anim("0s"),
                fontSize:      "10px",
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color:         "rgba(255,249,244,0.72)",
              }}
            >
              <span
                aria-hidden
                className="inline-block flex-shrink-0 h-px w-8"
                style={{ backgroundColor: "#F942AA" }}
              />
              Private Sober Muse Mentorship
            </p>

            {/* ── H1 ──
                clamp(3.4rem, 5.7vw, 7rem)
                  ≈ 54 px  at 390 px  mobile
                  ≈ 82 px  at 1440 px desktop
                  ≈ 112 px at 1960 px (capped)

                Target line-breaks at 1440 px:
                  "You've built a"
                  "life that looks"
                  "extraordinary"
                  "from the outside"
            ── */}
            <h1
              className="font-[family-name:var(--font-display)]
                         text-[clamp(3.4rem,5.7vw,7rem)]
                         leading-[0.88]
                         tracking-[-0.055em]
                         text-[#FFF9F4]"
              style={{ animation: anim("0.12s") }}
            >
              You&rsquo;ve built a life{" "}
              that looks{" "}
              <em className="italic">extraordinary</em>
              <br className="hidden sm:inline" />{" "}
              from&nbsp;the&nbsp;outside
            </h1>

            {/* Pink hairline + script accent */}
            <div
              className="mt-3 flex items-center gap-4"
              style={{ animation: anim("0.24s") }}
            >
              <span
                aria-hidden
                className="flex-shrink-0 h-px"
                style={{
                  width:           "clamp(56px, 5vw, 80px)",
                  backgroundColor: "#F942AA",
                }}
              />
              <ScriptAccent
                className="leading-none text-[clamp(2rem,3.2vw,4rem)] text-pink"
              >
                and yet.
              </ScriptAccent>
            </div>

            {/* Body copy */}
            <p
              className="mt-6 max-w-[400px] font-[family-name:var(--font-body)]"
              style={{
                animation:  anim("0.34s"),
                fontSize:   "17px",
                lineHeight: 1.72,
                color:      "rgba(255,249,244,0.72)",
              }}
            >
              Private mentorship for accomplished women who are ready to feel at
              home inside the life they built.
            </p>

            {/* ── CTAs ─────────────────────────────────────── */}
            <div
              className="mt-7 flex flex-col sm:flex-row gap-4 sm:items-center"
              style={{ animation: anim("0.42s") }}
            >
              {/* Primary — cream fill */}
              <Link
                href={heroCtaUrl}
                className="inline-flex items-center justify-center gap-2
                           rounded-[1px] px-8 py-[13px]
                           font-[family-name:var(--font-body)]
                           transition-colors duration-200
                           hover:bg-[#EDE8E0]"
                style={{
                  fontSize:        "12px",
                  letterSpacing:   "0.26em",
                  textTransform:   "uppercase",
                  backgroundColor: "#F8F4F1",
                  color:           "#2A1538",
                }}
              >
                {heroCta}
                <span aria-hidden>→</span>
              </Link>

              {/* Secondary — ghost border */}
              <Link
                href={heroSecondaryUrl}
                className="inline-flex items-center justify-center
                           rounded-[1px] px-8 py-[13px]
                           font-[family-name:var(--font-body)]
                           border transition-colors duration-200
                           hover:border-[rgba(255,249,244,0.65)]
                           hover:text-[#FFF9F4]"
                style={{
                  fontSize:      "12px",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  border:        "1px solid rgba(255,249,244,0.35)",
                  color:         "rgba(255,249,244,0.75)",
                }}
              >
                {heroSecondaryLabel}
              </Link>
            </div>

          </div>
        </div>

        {/* ── DESKTOP IMAGE PANEL ─────────────────────────────
            · hidden below lg — mobile image is a separate element
            · bg-[#EDE8E0] = brand bone, matches sofa/wall tones
            · items-end: portrait grounded at bottom of panel
            · object-contain: full portrait, zero crop
        ─────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex items-end justify-center bg-[#EDE8E0]">
          <Image
            src={HERO_IMG}
            alt="Martina Rink — private mentor for accomplished women"
            width={IMG_W}
            height={IMG_H}
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="h-[calc(100svh-92px)] w-auto max-w-full object-contain"
          />
        </div>

      </div>{/* /grid */}

      {/* ══════════════════════════════════════════════════════
          MOBILE IMAGE — below text, full width.
          · lg:hidden — desktop grid image takes over at 1024 px
          · h-auto w-full: full portrait, natural height, no crop
          · No fill · No object-cover · No overflow-hidden
          ══════════════════════════════════════════════════════ */}
      <div className="lg:hidden bg-[#EDE8E0]">
        <Image
          src={HERO_IMG}
          alt="Martina Rink"
          width={IMG_W}
          height={IMG_H}
          priority
          fetchPriority="high"
          sizes="100vw"
          className="h-auto w-full object-contain"
        />
      </div>

    </section>
  );
}
