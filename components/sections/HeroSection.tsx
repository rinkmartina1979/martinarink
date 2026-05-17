/**
 * HeroSection — server component, zero Framer Motion.
 * CSS animations use @keyframes fadeUp from globals.css.
 * No blur · No placeholder · No filter anywhere.
 */

import Image from "next/image";
import Link from "next/link";
import { ScriptAccent } from "@/components/brand/ScriptAccent";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DUR  = "0.85s";

function anim(delay: string) {
  return `fadeUp ${DUR} ${EASE} ${delay} both`;
}

interface HeroSectionProps {
  heroCta?: string;
  heroCtaUrl?: string;
  heroSecondaryLabel?: string;
  heroSecondaryUrl?: string;
}

export function HeroSection({
  heroCta            = "Begin the assessment",
  heroCtaUrl         = "/assessment",
  heroSecondaryLabel = "Explore the work",
  heroSecondaryUrl   = "/work-with-me",
}: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#2A1538" }}
    >
      {/* ══════════════════════════════════════════════════════
          DESKTOP PORTRAIT
          · w-[47%] right column — matches reference 2 balance
          · objectPosition "50% 52%" — shows full face + seated
            pose including blouse, tie, arms, cream trousers,
            sofa, plant/vase. Face is NOT the dominant element.
          · Seam: w-6 only — minimal, not foggy
          · No bottom gradient
          ══════════════════════════════════════════════════════ */}
      <div className="hidden md:block absolute right-0 top-0 h-full w-[47%] overflow-hidden">
        <Image
          src="/images/portraits/martina-hero-editorial.png"
          alt="Martina Rink — private mentor for accomplished women"
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 47vw, 100vw"
          className="h-full w-full object-cover"
          style={{ objectPosition: "50% 52%" }}
        />

        {/* Left seam — 24 px only, whisper-thin, zero fog */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-6
                     bg-gradient-to-r from-[#2A1538] to-transparent"
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          TEXT COLUMN
          · lg:w-[53%] — matches 47% image column
          · py-12 md:py-14 lg:py-12 — compact, reference 2 rhythm
          · items-start — overline always clears navbar
          ══════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 flex items-start container-content
                   pt-24 pb-12 md:pt-16 lg:pt-16 md:pb-14"
        style={{ minHeight: "calc(100svh - 92px)" }}
      >
        <div className="w-full md:w-[53%] md:pr-10 lg:pr-14">

          {/* — Overline — */}
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

          {/* — H1 —
              clamp(3.5rem, 5.8vw, 7rem)
                → ~56 px @ 390 px mobile
                → ~84 px @ 1440 px desktop  (4 lines, Vogue scale)
                → ~112 px @ 1920 px desktop (capped at 7 rem = 112 px)

              Target line rhythm at 1440px:
                "You've built a"
                "life that looks"
                "extraordinary"
                "from the outside"
          */}
          <h1
            className="font-[family-name:var(--font-display)]"
            style={{
              animation:     anim("0.12s"),
              fontSize:      "clamp(3.5rem, 5.8vw, 7rem)",
              lineHeight:    0.88,
              letterSpacing: "-0.055em",
              color:         "#FFF9F4",
            }}
          >
            You&rsquo;ve built a life{" "}
            that looks{" "}
            <em className="italic">extraordinary</em>
            <br className="hidden md:inline" />{" "}
            from&nbsp;the&nbsp;outside
          </h1>

          {/* — Pink hairline + script accent — */}
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

          {/* — Body copy — hardcoded per brief, not Sanity — */}
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

          {/* — CTAs — */}
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

      {/* ══════════════════════════════════════════════════════
          MOBILE PORTRAIT — below text, full width, sharp.
          · object-[center_top] — face at top of frame
          · h-[60svh] — enough room to show seated composition
          · No blur · No filter · No placeholder
          ══════════════════════════════════════════════════════ */}
      <div
        className="md:hidden relative overflow-hidden"
        style={{ height: "60svh" }}
      >
        <Image
          src="/images/portraits/martina-hero-editorial.png"
          alt="Martina Rink"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="h-full w-full object-cover object-[center_top]"
        />
        {/* Micro top fade — joins text block */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 inset-x-0 h-10
                     bg-gradient-to-b from-[#2A1538] to-transparent"
        />
      </div>

    </section>
  );
}
