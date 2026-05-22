/**
 * HeroSection — 2026 stacked editorial layout.
 *
 * ┌─────────────────────────────────────────────┐  ← flex-shrink-0
 * │  ROW 1 — TEXT  (aubergine, natural height)  │
 * │  headline · script · body · CTAs            │
 * └─────────────────────────────────────────────┘
 * ┌─────────────────────────────────────────────┐  ← flex-1 min-h-[45svh]
 * │  ROW 2 — IMAGE  (full-viewport width)       │
 * │  fill + object-cover + object-[center_8%]   │
 * └─────────────────────────────────────────────┘
 *
 * WHY flex-col + flex-1 (not CSS grid):
 *   grid-rows:[auto_1fr] requires the section to be exactly 100svh —
 *   tall text on small screens collapses the image row. flex-col lets
 *   row 1 breathe at any height while flex-1 + min-h gives row 2 a
 *   guaranteed minimum AND fills all leftover space when viewport is tall.
 *
 * WHY fill + object-cover (not width/height + object-contain):
 *   The image is 1:1 square. A responsive container is NEVER 1:1.
 *   object-contain would letterbox — dead space top/bottom. fill + cover
 *   scales the image to fill the container perfectly and crops overflow.
 *   object-[center_8%] keeps the face anchored at the top of the crop.
 *
 * WHY object-[center_8%]:
 *   Center horizontal ✓. 8% from the top means: "the point 8% down
 *   from the image top stays in the crop center vertically." Face is at
 *   ~8–18% from top in this portrait. Result: face always in frame on
 *   any container ratio — landscape, portrait, square.
 *
 * Navbar height: 72px mobile / 80px md+ (Nav.tsx)
 * Animations: @keyframes fadeUp in globals.css
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
// Square 1:1 studio portrait. fill mode — no explicit w/h needed.
// Placeholder bg #EEE8E2 matches the studio wall tone in the photo.
const HERO_IMG  = "/images/portraits/martina-hero-empowerment.jpg";
const HERO_BG   = "#EEE8E2"; // warm cream — no flash on load

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
      flex flex-col   → stacks ROW 1 and ROW 2 vertically
      min-h-svh       → section fills at least the full viewport height
      overflow-hidden → prevents any child overflow bleeding out
    */
    <section className="flex flex-col min-h-svh bg-aubergine text-cream overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          ROW 1 — TEXT PANEL
          flex-shrink-0: this row is NEVER compressed — it
          always takes its full natural height. The image row
          (flex-1) absorbs any remaining space.
          ══════════════════════════════════════════════════════ */}
      <div
        className="flex-shrink-0
                   px-6 pt-[max(88px,_8svh)] pb-10
                   sm:px-10
                   md:px-16 md:pb-12
                   lg:px-20 lg:pb-14
                   xl:px-28"
      >
        {/* Inner max-width keeps text readable on ultra-wide screens */}
        <div className="max-w-[860px]">

          {/* ── H1 ──────────────────────────────────────────
              clamp: 51px @ 390px mobile → 79px @ 1440px
              leading-[0.88]: Vogue-tight, display-weight only
          ── */}
          <h1
            className="font-[family-name:var(--font-display)]
                       text-[clamp(3.2rem,5.5vw,7rem)]
                       leading-[0.88]
                       tracking-[-0.055em]
                       text-cream"
            style={{ animation: anim("0.12s") }}
          >
            You&rsquo;ve built a life{" "}
            that looks{" "}
            <em className="italic not-italic">
              <span className="italic">extraordinary</span>
            </em>
            <br className="hidden sm:block" />{" "}
            from&nbsp;the&nbsp;outside
          </h1>

          {/* ── Pink hairline + script ───────────────────── */}
          <div
            className="mt-5 flex items-center gap-4"
            style={{ animation: anim("0.24s") }}
          >
            <span
              aria-hidden
              className="flex-shrink-0 h-px bg-pink"
              style={{ width: "clamp(44px, 4.5vw, 70px)" }}
            />
            <ScriptAccent
              className="leading-none text-[clamp(1.85rem,2.9vw,3.6rem)] text-pink"
            >
              and yet.
            </ScriptAccent>
          </div>

          {/* ── Body + CTAs — side-by-side on md+ ───────────
              On mobile: stacked. On desktop: body copy left,
              CTAs right — magazine newspaper-spread layout.
          ── */}
          <div
            className="mt-8
                       flex flex-col gap-6
                       md:flex-row md:items-end md:justify-between md:gap-12"
            style={{ animation: anim("0.34s") }}
          >
            {/* Body copy */}
            <p
              className="max-w-[400px] font-[family-name:var(--font-body)]
                         text-[17px] leading-[1.75]"
              style={{
                color: "color-mix(in srgb, var(--color-cream) 72%, transparent)",
              }}
            >
              Private mentorship for accomplished women who are ready to feel
              at home inside the life they built.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <PlumButton href={heroCtaUrl}>
                {heroCta}&nbsp;<span aria-hidden>→</span>
              </PlumButton>
              <GhostButton variant="light" href={heroSecondaryUrl}>
                {heroSecondaryLabel}
              </GhostButton>
            </div>
          </div>

          {/* ── Micro trust signal ───────────────────────── */}
          <p
            className="mt-6 font-[family-name:var(--font-body)]
                       text-[11px] uppercase tracking-[0.24em]"
            style={{
              animation: anim("0.50s"),
              color: "color-mix(in srgb, var(--color-cream) 36%, transparent)",
            }}
          >
            Private &middot; Confidential &middot; By application
          </p>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ROW 2 — FULL-VIEWPORT-WIDTH IMAGE
          ──────────────────────────────────────────────────────
          flex-1:           fills ALL remaining viewport height
                            after the text row — zero wasted space.

          min-h-[45svh]:    floor height guard. If somehow the
                            text row is very tall (large font /
                            small screen), the image never collapses
                            to nothing.

          relative:         REQUIRED for next/image fill mode.
                            Without this, fill throws a layout error.

          overflow-hidden:  clips the image to the container bounds.
                            Without this, fill extends beyond the div.

          bg-[#EEE8E2]:     warm cream placeholder — matches the
                            studio wall in the photo exactly. The image
                            loads into a matching tone, zero flash.
          ══════════════════════════════════════════════════════ */}
      <div
        className="flex-1 min-h-[45svh]
                   relative overflow-hidden"
        style={{ backgroundColor: HERO_BG }}
      >

        {/*
          fill:                 image covers its parent completely.
                                No explicit width/height needed — the
                                parent div controls the size.

          object-cover:         scales image so it fills the container
                                with no letterboxing. Crops overflow.

          object-[center_8%]:   horizontal: center (face is centered in
                                the photo). vertical: 8% from top —
                                anchors the crop so Martina's face is
                                always visible regardless of how tall or
                                short the container is.

          sizes="100vw":        tells the browser this image is always
                                full viewport width → correct srcset.

          priority + fetchPriority="high": LCP element — loads first.
        */}
        <Image
          src={HERO_IMG}
          alt="Martina Rink — private mentor for accomplished women, studio portrait with roses and books"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[center_8%]"
        />

        {/* ── Top gradient: aubergine → transparent ────────
            Softens the hard seam between the dark text panel
            and the warm cream image. 80px is enough to dissolve
            cleanly without eating into the face area.
        ── */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(35,23,39,0.45) 0%, transparent 100%)",
          }}
        />

        {/* ── Bottom gradient: transparent → aubergine ─────
            Grounds the section and creates visual continuity
            into the next section below.
        ── */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(35,23,39,0.30) 0%, transparent 100%)",
          }}
        />

      </div>

    </section>
  );
}
