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
  heroCta           = "Begin the assessment",
  heroCtaUrl        = "/assessment",
  heroSecondaryLabel = "Explore the work",
  heroSecondaryUrl  = "/work-with-me",
}: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#2A1538" }}
    >
      {/* ══════════════════════════════════════════════════════
          DESKTOP PORTRAIT
          · w-[48%] — wider column gives more editorial room
          · objectPosition "50% 35%" — shows full face + torso
          · Left seam: w-12 (48 px) Tailwind gradient only
          · No bottom gradient — removed to keep image clean
          ══════════════════════════════════════════════════════ */}
      <div className="hidden md:block absolute right-0 top-0 h-full w-[48%] overflow-hidden">
        <Image
          src="/images/portraits/martina-hero-editorial.png"
          alt="Martina Rink — private mentor for accomplished women"
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 48vw, 100vw"
          className="object-cover"
          style={{ objectPosition: "50% 35%" }}
        />

        {/* Left-seam — 48 px only, Tailwind gradient, no inline style */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-12
                     bg-gradient-to-r from-[#2A1538] to-transparent"
        />
        {/* NO bottom gradient — removed per brief */}
      </div>

      {/* ══════════════════════════════════════════════════════
          TEXT COLUMN
          · w-[52%] on md+ — matches the wider image column
          · pt-20 md:pt-20 lg:pt-24 — breathing room from navbar
          · items-start so overline always clears the top edge
          ══════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 flex items-start container-content
                   pt-28 pb-16 md:pt-20 lg:pt-24 md:pb-16"
        style={{ minHeight: "calc(100svh - 92px)" }}
      >
        <div className="md:w-[52%] md:pr-10 lg:pr-14">

          {/* — Overline — */}
          <p
            className="mb-7 flex items-center gap-3
                       font-[family-name:var(--font-body)]"
            style={{
              animation:    anim("0s"),
              fontSize:     "10px",
              letterSpacing:"0.36em",
              textTransform:"uppercase",
              color:        "rgba(255,249,244,0.72)",   /* slightly more readable */
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
              clamp(3.8rem, 6.7vw, 7.8rem)
                → ~58 px @ 390 px mobile
                → ~97 px @ 1440 px desktop
                → ~129 px @ 1920 px desktop (capped at 7.8rem = 125 px)
              leading-[0.86] · tracking-[-0.06em]                        */}
          <h1
            className="font-[family-name:var(--font-display)]"
            style={{
              animation:    anim("0.12s"),
              fontSize:     "clamp(3.8rem, 6.7vw, 7.8rem)",
              lineHeight:   0.86,
              letterSpacing:"-0.06em",
              color:        "#FFF9F4",
            }}
          >
            You&rsquo;ve built a life{" "}
            <br className="hidden md:inline" />
            that looks{" "}
            <em className="italic">extraordinary</em>
            <br className="hidden md:inline" />{" "}
            from the outside
          </h1>

          {/* — Pink hairline + script accent — */}
          <div
            className="mt-6 flex items-center gap-4"
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
              className="leading-none text-[clamp(1.9rem,3.4vw,3rem)] text-pink"
            >
              and yet.
            </ScriptAccent>
          </div>

          {/* — Body copy — hardcoded per brief, not Sanity — */}
          <p
            className="mt-7 max-w-[400px] font-[family-name:var(--font-body)]"
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
            className="mt-9 flex flex-col sm:flex-row gap-4 sm:items-center"
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
                fontSize:     "12px",
                letterSpacing:"0.26em",
                textTransform:"uppercase",
                backgroundColor:"#F8F4F1",
                color:        "#2A1538",
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
                fontSize:     "12px",
                letterSpacing:"0.26em",
                textTransform:"uppercase",
                border:       "1px solid rgba(255,249,244,0.35)",
                color:        "rgba(255,249,244,0.75)",
              }}
            >
              {heroSecondaryLabel}
            </Link>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE PORTRAIT — below text, full width, sharp.
          objectPosition centers on face at top of frame.
          No blur · No filter · No placeholder.
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
          className="object-cover"
          style={{ objectPosition: "50% 20%" }}
        />
        {/* Micro top fade only — joins text block cleanly */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 inset-x-0 h-12
                     bg-gradient-to-b from-[#2A1538] to-transparent"
        />
      </div>

    </section>
  );
}
