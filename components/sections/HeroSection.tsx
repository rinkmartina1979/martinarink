"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScriptAccent } from "@/components/brand/ScriptAccent";

/* ── Animation preset ──────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

/* ── Types ─────────────────────────────────────────────────── */
interface HeroSectionProps {
  heroCta?: string;
  heroCtaUrl?: string;
  heroSecondaryLabel?: string;
  heroSecondaryUrl?: string;
  heroSubheadline?: string;
}

/* ── Component ─────────────────────────────────────────────── */
export function HeroSection({
  heroCta = "Begin the assessment",
  heroCtaUrl = "/assessment",
  heroSecondaryLabel = "Explore the work",
  heroSecondaryUrl = "/work-with-me",
  heroSubheadline = "Private mentorship for accomplished women who are ready to feel at home inside the life they built.",
}: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#2A1538" }}
    >
      {/* ── Desktop portrait — absolute right, full section height ── */}
      <div className="hidden md:block absolute right-0 top-0 h-full w-[44%] overflow-hidden">
        <Image
          src="/images/portraits/martina-hero.jpg"
          alt="Martina Rink — private mentor"
          fill
          sizes="44vw"
          className="object-cover object-[center_top]"
          priority
          fetchPriority="high"
        />
        {/* Left-edge blend — portrait dissolves into aubergine background */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-36 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #2A1538 0%, rgba(42,21,56,0.72) 55%, transparent 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #2A1538 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Text column — vertically centered ── */}
      <div
        className="relative z-10 flex items-center container-content
                   pt-28 pb-16 md:pt-0 md:pb-0"
        style={{ minHeight: "calc(100svh - 92px)" }}
      >
        <div className="md:w-[56%] md:pr-16 lg:pr-24">

          {/* Overline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-8 text-[10px] uppercase tracking-[0.36em]
                       font-[family-name:var(--font-body)]"
            style={{ color: "rgba(255,249,244,0.50)" }}
          >
            Private Sober Muse Mentorship
          </motion.p>

          {/* H1 — Vogue scale */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.12}
            className="font-[family-name:var(--font-display)]
                       leading-[0.84] tracking-[-0.065em]"
            style={{
              fontSize: "clamp(4rem, 7.1vw, 8.5rem)",
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

          {/* Pink hairline + script accent */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.22}
            className="mt-6 flex items-center gap-5"
          >
            <div
              aria-hidden
              className="flex-shrink-0 h-px w-14 md:w-20 bg-pink"
            />
            <ScriptAccent
              className="text-[clamp(1.9rem,3.6vw,3.2rem)] leading-none text-pink"
            >
              and yet.
            </ScriptAccent>
          </motion.div>

          {/* Body */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.32}
            className="mt-8 max-w-[420px] text-[17px] md:text-[18px] leading-[1.7]"
            style={{ color: "rgba(255,249,244,0.65)" }}
          >
            {heroSubheadline}
          </motion.p>

          {/* CTAs */}
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
              className="inline-block px-8 py-[14px] text-[12px] uppercase
                         tracking-[0.22em] rounded-[1px] text-center
                         bg-[#FFF9F4] text-[#2A1538]
                         hover:bg-[#EDE8E0]
                         transition-colors duration-200"
            >
              {heroCta}
            </Link>

            {/* Secondary — ghost border */}
            <Link
              href={heroSecondaryUrl}
              className="inline-block px-8 py-[14px] text-[12px] uppercase
                         tracking-[0.22em] rounded-[1px] text-center
                         border border-[rgba(255,249,244,0.32)]
                         text-[rgba(255,249,244,0.72)]
                         hover:border-[rgba(255,249,244,0.65)]
                         hover:text-[#FFF9F4]
                         transition-colors duration-200"
            >
              {heroSecondaryLabel}
            </Link>
          </motion.div>

        </div>
      </div>

      {/* ── Mobile portrait — below text block ── */}
      <div
        className="md:hidden relative overflow-hidden"
        style={{ height: "62svh" }}
      >
        <Image
          src="/images/portraits/martina-hero.jpg"
          alt="Martina Rink"
          fill
          sizes="100vw"
          className="object-cover object-[center_15%]"
          priority
          fetchPriority="high"
        />
        {/* Subtle top fade into section background */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, #2A1538 0%, transparent 100%)",
          }}
        />
      </div>

    </section>
  );
}
