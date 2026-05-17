/**
 * HeroSection — server component, no Framer Motion.
 * CSS animations reference @keyframes fadeUp already defined in globals.css.
 * Zero JS dependency: works before hydration, works with prefers-reduced-motion.
 */

import Image from "next/image";
import Link from "next/link";
import { ScriptAccent } from "@/components/brand/ScriptAccent";

/* Shared ease for inline animation shorthand */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DUR = "0.85s";

/** Returns an inline animation string using the global fadeUp keyframe */
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
  heroCta = "Begin the assessment",
  heroCtaUrl = "/assessment",
  heroSecondaryLabel = "Explore the work",
  heroSecondaryUrl = "/work-with-me",
}: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#2A1538" }}
    >
      {/* ══════════════════════════════════════════════════════
          DESKTOP PORTRAIT — absolute right, full section height.
          Image is sharp, no blur, no filter, no placeholder.
          Left-seam gradient is 64 px and stops before the face.
          ══════════════════════════════════════════════════════ */}
      <div className="hidden md:block absolute right-0 top-0 h-full w-[44%] overflow-hidden">
        <Image
          src="/images/portraits/martina-hero-editorial.png"
          alt="Martina Rink — private mentor for accomplished women"
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover object-[50%_18%]"
        />
        {/* Left-seam blend — 64 px strip, never reaches the face */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16"
          style={{
            background:
              "linear-gradient(to right, #2A1538 0%, rgba(42,21,56,0.45) 65%, transparent 100%)",
          }}
        />
        {/* Bottom micro-fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 inset-x-0 h-16"
          style={{
            background:
              "linear-gradient(to top, rgba(42,21,56,0.55) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          TEXT COLUMN — left 56 %, vertically centred.
          CSS animations — no Framer Motion, fires on first paint.
          Font-size: clamp(3.2rem, 5.5vw, 6.8rem)
            → 51 px @ 390 px viewport
            → 79 px @ 1440 px viewport   (3–4 readable lines)
            → 106 px @ 1920 px viewport
          ══════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 flex items-start container-content
                   pt-28 pb-16 md:pt-16 lg:pt-20 md:pb-14"
        style={{ minHeight: "calc(100svh - 92px)" }}
      >
        <div className="md:w-[56%] md:pr-14 lg:pr-20">

          {/* — Overline — */}
          <p
            className="mb-7 flex items-center gap-3 font-[family-name:var(--font-body)]"
            style={{
              animation: anim("0s"),
              fontSize: "10px",
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: "rgba(255,249,244,0.65)",
            }}
          >
            <span
              aria-hidden
              className="inline-block flex-shrink-0 h-px w-8"
              style={{ backgroundColor: "#F942AA" }}
            />
            Private Sober Muse Mentorship
          </p>

          {/* — H1 — */}
          <h1
            className="font-[family-name:var(--font-display)]"
            style={{
              animation: anim("0.12s"),
              fontSize: "clamp(3.2rem, 5.5vw, 6.8rem)",
              lineHeight: 0.86,
              letterSpacing: "-0.055em",
              color: "#FFF9F4",
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
                width: "clamp(56px, 5vw, 80px)",
                backgroundColor: "#F942AA",
              }}
            />
            <ScriptAccent className="leading-none text-[clamp(1.9rem,3.4vw,3rem)] text-pink">
              and yet.
            </ScriptAccent>
          </div>

          {/* — Body copy — hardcoded per brief — */}
          <p
            className="mt-7 max-w-[400px] font-[family-name:var(--font-body)]"
            style={{
              animation: anim("0.34s"),
              fontSize: "17px",
              lineHeight: 1.72,
              color: "rgba(255,249,244,0.72)",
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
                fontSize: "12px",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                backgroundColor: "#F8F4F1",
                color: "#2A1538",
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
                fontSize: "12px",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                border: "1px solid rgba(255,249,244,0.35)",
                color: "rgba(255,249,244,0.75)",
              }}
            >
              {heroSecondaryLabel}
            </Link>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE PORTRAIT — below text, sharp, full width.
          No blur. No filter. No placeholder.
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
          className="object-cover object-[center_top]"
        />
        {/* Micro top fade — smooths join to text block */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 inset-x-0 h-12"
          style={{
            background:
              "linear-gradient(to bottom, #2A1538 0%, transparent 100%)",
          }}
        />
      </div>

    </section>
  );
}
