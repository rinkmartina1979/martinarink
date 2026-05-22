/**
 * HeroSection — server component, zero Framer Motion.
 * 2026 Vogue editorial diptych: dark text column | luminous portrait column.
 *
 * Image: square 1:1 studio portrait.
 *   · Desktop: fill + object-cover anchored at [center_8%] — face always in frame
 *   · Mobile:  aspect-[3/4] crop, same anchor
 *   · Cream placeholder bg matches studio wall tone — no aubergine flash on load
 *
 * Layout:
 *   · 55fr text | 45fr portrait at lg (1024 px+)
 *   · min-h accounts for fixed navbar: 72px mobile / 80px md+
 *   · Subtle bottom vignette ties portrait into next section
 *
 * Navbar height: h-[72px] mobile / h-[80px] md+ (Nav.tsx)
 * CSS entrance animations use @keyframes fadeUp from globals.css.
 */

import Image from "next/image";
import { PlumButton }  from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { ScriptAccent } from "@/components/brand/ScriptAccent";

/* ─── animation helper ──────────────────────────────────────── */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DUR  = "0.85s";
function anim(delay: string) {
  return `fadeUp ${DUR} ${EASE} ${delay} both`;
}

/* ─── image source (single source of truth) ────────────────── */
const HERO_IMG = "/images/portraits/martina-hero-empowerment.jpg";
// Square 1:1 format. Uses fill mode — no explicit w/h needed.
// object-[center_8%]: anchors crop at 8% from top so face
// stays prominent in any container ratio.

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
    <section className="relative overflow-hidden bg-aubergine text-cream">

      {/* ══════════════════════════════════════════════════════
          MAIN GRID
          · Single column on mobile / tablet
          · 55fr text | 45fr portrait at lg (1024px+)
          · CSS grid default align-items:stretch — both columns
            fill the full row height automatically
          ══════════════════════════════════════════════════════ */}
      <div
        className="grid min-h-[calc(100svh-72px)] md:min-h-[calc(100svh-80px)]
                   lg:grid-cols-[0.55fr_0.45fr]"
      >

        {/* ── TEXT PANEL ───────────────────────────────────── */}
        <div
          className="flex items-center
                     px-6 pb-14 pt-[max(90px,_9svh)]
                     sm:px-8
                     md:px-12 md:pb-16
                     lg:px-20 lg:pb-16 lg:pt-0"
        >
          <div className="max-w-[620px]">

            {/* ── H1 ──
                clamp(3.2rem, 5.2vw, 6.5rem)
                  ≈ 51px  at 390px  mobile
                  ≈ 75px  at 1440px desktop
            ── */}
            <h1
              className="font-[family-name:var(--font-display)]
                         text-[clamp(3.2rem,5.2vw,6.5rem)]
                         leading-[0.9]
                         tracking-[-0.05em]
                         text-cream"
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
              className="mt-4 flex items-center gap-4"
              style={{ animation: anim("0.24s") }}
            >
              <span
                aria-hidden
                className="flex-shrink-0 h-px"
                style={{
                  width:           "clamp(48px, 4.5vw, 72px)",
                  backgroundColor: "#F942AA",
                }}
              />
              <ScriptAccent
                className="leading-none text-[clamp(1.9rem,3vw,3.8rem)] text-pink"
              >
                and yet.
              </ScriptAccent>
            </div>

            {/* Body copy */}
            <p
              className="mt-7 max-w-[380px] font-[family-name:var(--font-body)]"
              style={{
                animation:  anim("0.34s"),
                fontSize:   "17px",
                lineHeight: 1.75,
                color:      "color-mix(in srgb, var(--color-cream) 72%, transparent)",
              }}
            >
              Private mentorship for accomplished women who are ready to feel at
              home inside the life they built.
            </p>

            {/* ── CTAs ─────────────────────────────────────── */}
            <div
              className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center"
              style={{ animation: anim("0.42s") }}
            >
              {/* Primary — plum fill */}
              <PlumButton href={heroCtaUrl}>
                {heroCta} <span aria-hidden className="ml-1">→</span>
              </PlumButton>

              {/* Secondary — editorial ghost on dark surface */}
              <GhostButton variant="light" href={heroSecondaryUrl}>
                {heroSecondaryLabel}
              </GhostButton>
            </div>

            {/* Micro trust signal */}
            <p
              className="mt-7 text-[11px] uppercase tracking-[0.22em] font-[family-name:var(--font-body)]"
              style={{
                animation: anim("0.50s"),
                color: "color-mix(in srgb, var(--color-cream) 38%, transparent)",
              }}
            >
              Private &middot; Confidential &middot; By application
            </p>

          </div>
        </div>

        {/* ── DESKTOP IMAGE PANEL ─────────────────────────────
            · hidden below lg — mobile image handles smaller screens
            · relative: required for next/image fill mode
            · bg-[#EEE8E2]: warm cream placeholder matching studio wall
            · object-[center_8%]: anchors top of face in frame on any crop
        ─────────────────────────────────────────────────────── */}
        <div className="hidden lg:block relative overflow-hidden bg-[#EEE8E2]">
          <Image
            src={HERO_IMG}
            alt="Martina Rink — private mentor for accomplished women, pink blouse, studio portrait"
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-[center_8%]"
          />
          {/* Subtle bottom vignette — ties into next section */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(35,23,39,0.22) 0%, transparent 100%)",
            }}
          />
          {/* Subtle left edge fade — softens the hard grid seam */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(35,23,39,0.18) 0%, transparent 100%)",
            }}
          />
        </div>

      </div>{/* /grid */}

      {/* ══════════════════════════════════════════════════════
          MOBILE IMAGE — below text, full width.
          · lg:hidden — desktop grid image takes over at 1024px
          · aspect-[3/4]: portrait crop, no layout shift
          · object-[center_8%]: face anchored at top of crop
      ══════════════════════════════════════════════════════ */}
      <div className="lg:hidden relative aspect-[3/4] overflow-hidden bg-[#EEE8E2]">
        <Image
          src={HERO_IMG}
          alt="Martina Rink — private mentor"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[center_8%]"
        />
      </div>

    </section>
  );
}
