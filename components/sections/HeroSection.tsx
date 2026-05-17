"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScriptAccent } from "@/components/brand/ScriptAccent";

/* ─────────────────────────────────────────────────────────────
   Framer Motion — subtle stagger, no scale/blur on image
   ───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.88,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

interface HeroSectionProps {
  heroCta?: string;
  heroCtaUrl?: string;
  heroSecondaryLabel?: string;
  heroSecondaryUrl?: string;
  heroSubheadline?: string;
}

export function HeroSection({
  heroCta = "Begin the assessment",
  heroCtaUrl = "/assessment",
  heroSecondaryLabel = "Explore the work",
  heroSecondaryUrl = "/work-with-me",
  /* Sanity override accepted but brief copy is the default */
  heroSubheadline = "Private mentorship for accomplished women who are ready to feel at home inside the life they built.",
}: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#2A1538" }}
    >
      {/* ══════════════════════════════════════════════════════
          DESKTOP PORTRAIT — absolute right, full section height
          No blur. No filter. No placeholder blur.
          Gradient only on the very left seam (~80 px) — not over face.
          ══════════════════════════════════════════════════════ */}
      <div className="hidden md:block absolute right-0 top-0 h-full w-[44%] overflow-hidden">
        <Image
          src="/images/portraits/martina-hero-editorial.png"
          alt="Martina Rink — private mentor for accomplished women"
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover object-[55%_center]"
          /* NO placeholder, NO blurDataURL, NO blur class */
        />

        {/* Left-seam gradient — 80 px strip only, never reaches the face */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #2A1538 0%, rgba(42,21,56,0.55) 60%, transparent 100%)",
          }}
        />

        {/* Bottom micro-fade — softens the image foot, not the face */}
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(42,21,56,0.65) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          TEXT COLUMN — left 56 %, vertically centred
          ══════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 flex items-center container-content
                   pt-28 pb-16 md:pt-0 md:pb-0"
        style={{ minHeight: "calc(100svh - 92px)" }}
      >
        <div className="md:w-[56%] md:pr-14 lg:pr-20">

          {/* — Overline — */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-7 font-[family-name:var(--font-body)] flex items-center gap-3"
            style={{
              fontSize: "10px",
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: "rgba(255,249,244,0.65)",
            }}
          >
            {/* Pink hairline before overline */}
            <span
              aria-hidden
              className="inline-block h-px w-8 flex-shrink-0"
              style={{ backgroundColor: "#F942AA" }}
            />
            Private Sober Muse Mentorship
          </motion.p>

          {/* — H1 — */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.12}
            className="font-[family-name:var(--font-display)]"
            style={{
              fontSize: "clamp(4rem, 7.1vw, 8.5rem)",
              lineHeight: 0.84,
              letterSpacing: "-0.065em",
              color: "#FFF9F4",
            }}
          >
            You&rsquo;ve built a life{" "}
            <br className="hidden md:inline" />
            that looks{" "}
            <em className="italic">extraordinary</em>
            <br className="hidden md:inline" />{" "}
            from the outside
          </motion.h1>

          {/* — Pink hairline + script accent "and yet." — */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.24}
            className="mt-5 flex items-center gap-4"
          >
            <span
              aria-hidden
              className="flex-shrink-0 h-px"
              style={{
                width: "clamp(56px, 5vw, 80px)",
                backgroundColor: "#F942AA",
              }}
            />
            <ScriptAccent
              className="leading-none text-[clamp(2rem,3.8vw,3.4rem)] text-pink"
            >
              and yet.
            </ScriptAccent>
          </motion.div>

          {/* — Body copy — */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.36}
            className="mt-8 max-w-[400px] font-[family-name:var(--font-body)]"
            style={{
              fontSize: "17px",
              lineHeight: 1.72,
              color: "rgba(255,249,244,0.72)",
            }}
          >
            {heroSubheadline}
          </motion.p>

          {/* — CTAs — */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.42}
            className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center"
          >
            {/* Primary — cream fill */}
            <Link
              href={heroCtaUrl}
              className="inline-flex items-center justify-center gap-3
                         px-8 py-[13px] rounded-[1px]
                         text-center font-[family-name:var(--font-body)]
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
                         px-8 py-[13px] rounded-[1px]
                         text-center font-[family-name:var(--font-body)]
                         border transition-colors duration-200
                         hover:border-[rgba(255,249,244,0.65)] hover:text-[#FFF9F4]"
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
          </motion.div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE PORTRAIT — below text, sharp, full width
          No blur. No filter. No placeholder.
          Height 60 svh. Face centred at top.
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
          /* NO placeholder, NO blurDataURL */
        />
        {/* Very subtle top fade — smooths the join to text block */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-16 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, #2A1538 0%, transparent 100%)",
          }}
        />
      </div>

    </section>
  );
}
