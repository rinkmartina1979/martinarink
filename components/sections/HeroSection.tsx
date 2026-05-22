/**
 * HeroSection — 2026 stacked editorial.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  ROW 1 — TEXT  (flex-shrink-0, compact, fills width)        │
 * │  [Headline — left]               [CTAs — right, baseline]   │
 * │  [Script accent]                                            │
 * │  [Body copy — left]                                         │
 * ├─────────────────────────────────────────────────────────────┤
 * │  ROW 2 — IMAGE  (flex-1, full viewport width)               │
 * │  fill + object-cover + object-[center_8%]                   │
 * └─────────────────────────────────────────────────────────────┘
 *
 * KEY RULES:
 *  1. Section height is EXACT: calc(100svh - navbar).
 *     NOT min-height — min-height lets the text row grow past the
 *     fold and pushes the image out of view entirely.
 *
 *  2. Row 1 is flex-shrink-0 (never compressed) with compact padding.
 *     Row 2 is flex-1 (fills EVERY pixel remaining after Row 1).
 *
 *  3. Image uses fill + object-cover. The parent must be:
 *       · position: relative  — required by next/image fill
 *       · overflow: hidden    — clips the scaled image to bounds
 *       · have explicit height (flex-1 inherits from section) ✓
 *
 *  4. object-[center_8%]: keeps Martina's face in frame on any
 *     container height. 8% = the vertical anchor point of her face.
 *
 *  5. Text layout: headline + CTAs on the SAME ROW at desktop.
 *     This fills the horizontal space and stops the dead-space
 *     problem on wide viewports.
 */

import Image from "next/image";
import { PlumButton }  from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { ScriptAccent } from "@/components/brand/ScriptAccent";

/* ─── animation ──────────────────────────────────────────────── */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
function anim(delay: string) {
  return `fadeUp 0.85s ${EASE} ${delay} both`;
}

/* ─── image ──────────────────────────────────────────────────── */
const HERO_IMG = "/images/portraits/martina-hero-empowerment.jpg";
// Placeholder matches studio wall tone — no dark flash while loading
const HERO_BG  = "#EEE8E2";

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
      SECTION — exact viewport height minus fixed navbar.
      ─────────────────────────────────────────────────────
      h-[calc(100svh-72px)] mobile   (navbar = 72px)
      md:h-[calc(100svh-80px)]       (navbar = 80px on md+)

      WHY h- not min-h-:
        min-height lets the flex children grow beyond the viewport.
        Text row at large font → overflows fold → image is invisible.
        Fixed height = section always fits the screen exactly. ✓
    */
    <section
      className="flex flex-col overflow-hidden bg-aubergine text-cream
                 h-[calc(100svh-72px)] md:h-[calc(100svh-80px)]"
    >

      {/* ══════════════════════════════════════════════════
          ROW 1 — TEXT  (flex-shrink-0)
          ──────────────────────────────────────────────────
          flex-shrink-0: this row never collapses.
          Padding is intentionally compact — the goal is to
          leave the maximum vertical space for the image.
          ══════════════════════════════════════════════════ */}
      <div
        className="flex-shrink-0
                   px-6 pt-8 pb-5
                   sm:px-10
                   md:px-14 md:pt-10 md:pb-6
                   lg:px-20 lg:pt-12 lg:pb-7
                   xl:px-28"
      >

        {/* ── TOP ROW: Headline left | CTAs right ──────────
            At desktop the headline and CTAs sit on the
            same horizontal band, filling the full width.
            At mobile they stack vertically (flex-col).
        ── */}
        <div
          className="flex flex-col gap-4
                     lg:flex-row lg:items-end lg:justify-between lg:gap-8"
          style={{ animation: anim("0.10s") }}
        >

          {/* Headline */}
          <h1
            className="font-[family-name:var(--font-display)]
                       text-[clamp(2.6rem,3.9vw,5.4rem)]
                       leading-[0.88]
                       tracking-[-0.05em]
                       text-cream
                       max-w-[700px]"
          >
            You&rsquo;ve built a life that
            looks{" "}
            <em className="italic">extraordinary</em>
            <br className="hidden md:block" />{" "}
            from&nbsp;the&nbsp;outside
          </h1>

          {/* CTAs — baseline-aligned to headline bottom at lg+ */}
          <div
            className="flex flex-col sm:flex-row gap-3 shrink-0 lg:pb-[3px]"
            style={{ animation: anim("0.28s") }}
          >
            <PlumButton href={heroCtaUrl}>
              {heroCta}&nbsp;<span aria-hidden>→</span>
            </PlumButton>
            <GhostButton variant="light" href={heroSecondaryUrl}>
              {heroSecondaryLabel}
            </GhostButton>
          </div>

        </div>

        {/* ── BOTTOM ROW: Script left | Body copy right ────
            Script accent on the left.
            Body copy on the right aligned under the CTAs.
        ── */}
        <div
          className="mt-4 flex flex-col gap-3
                     lg:flex-row lg:items-start lg:justify-between lg:gap-8"
          style={{ animation: anim("0.22s") }}
        >

          {/* Script + pink hairline */}
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex-shrink-0 h-px bg-pink"
              style={{ width: "clamp(40px, 4vw, 64px)" }}
            />
            <ScriptAccent
              className="leading-none text-[clamp(1.7rem,2.6vw,3.4rem)] text-pink"
            >
              and yet.
            </ScriptAccent>
          </div>

          {/* Body copy — right side under the CTA buttons */}
          <div className="lg:max-w-[420px] shrink-0">
            <p
              className="font-[family-name:var(--font-body)]
                         text-[15px] md:text-[16px] leading-[1.7]"
              style={{
                color: "color-mix(in srgb, var(--color-cream) 68%, transparent)",
              }}
            >
              Private mentorship for accomplished women who are ready
              to feel at home inside the life they built.
            </p>
            <p
              className="mt-3 font-[family-name:var(--font-body)]
                         text-[10px] uppercase tracking-[0.24em]"
              style={{
                color: "color-mix(in srgb, var(--color-cream) 34%, transparent)",
              }}
            >
              Private &middot; Confidential &middot; By application
            </p>
          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════
          ROW 2 — FULL-WIDTH IMAGE  (flex-1)
          ──────────────────────────────────────────────────
          flex-1:          fills every remaining pixel after
                           the text row — guaranteed visible.

          relative:        REQUIRED for next/image fill.

          overflow-hidden: clips scaled image to bounds.

          bg-[HERO_BG]:    warm cream placeholder so the
                           panel tone matches the photo bg
                           before the image finishes loading.
          ══════════════════════════════════════════════════ */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ backgroundColor: HERO_BG }}
      >

        <Image
          src={HERO_IMG}
          alt="Martina Rink — private mentor, studio portrait with roses and books"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[center_8%]"
        />

        {/* Top gradient: dissolves text panel into image */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-16 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(35,23,39,0.55) 0%, transparent 100%)",
          }}
        />

        {/* Bottom gradient: grounds the section */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(35,23,39,0.28) 0%, transparent 100%)",
          }}
        />

      </div>

    </section>
  );
}
