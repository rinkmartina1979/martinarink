/**
 * /dev/fonts — Script font preview for client approval.
 * This page is noindex (excluded from robots.txt) and for internal review only.
 * Martina: choose the script font you prefer for the signature accent.
 * Current font: Dancing Script (option B below).
 */

import type { Metadata } from "next";
import {
  Dancing_Script,
  Great_Vibes,
  Pinyon_Script,
  Rochester,
  Pacifico,
} from "next/font/google";

export const metadata: Metadata = {
  title: "Font Preview — Martina Rink",
  robots: { index: false, follow: false },
};

// ── 5 script font options + current ───────────────────────────
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--dev-dancing",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--dev-great-vibes",
});

const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--dev-pinyon",
});

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--dev-rochester",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--dev-pacifico",
});

const PHRASES = [
  "welcome home, love",
  "— and yet.",
  "come home to yourself",
  "it's about time, darling.",
  "Martina",
];

const FONTS = [
  {
    label: "A — Great Vibes",
    description: "Elegant, elongated loops. Similar to Buffalo but more fluid. Very premium.",
    variable: "--dev-great-vibes",
    cls: dancingScript.variable + " " + greatVibes.variable,
    fontVar: "var(--dev-great-vibes)",
  },
  {
    label: "B — Dancing Script (CURRENT)",
    description: "Current font. Clean, legible at small sizes. Professional but approachable.",
    variable: "--dev-dancing",
    cls: dancingScript.variable,
    fontVar: "var(--dev-dancing)",
    isCurrent: true,
  },
  {
    label: "C — Pinyon Script",
    description: "Calligraphic, high contrast. More formal and editorial — closest to Buffalo.",
    variable: "--dev-pinyon",
    cls: dancingScript.variable + " " + pinyonScript.variable,
    fontVar: "var(--dev-pinyon)",
  },
  {
    label: "D — Rochester",
    description: "Upright script. Confident and legible — slightly quirky.",
    variable: "--dev-rochester",
    cls: dancingScript.variable + " " + rochester.variable,
    fontVar: "var(--dev-rochester)",
  },
  {
    label: "E — Pacifico",
    description: "Rounded, retro. Warm and distinctive — more casual, less editorial.",
    variable: "--dev-pacifico",
    cls: dancingScript.variable + " " + pacifico.variable,
    fontVar: "var(--dev-pacifico)",
  },
];

export default function FontPreviewPage() {
  return (
    <div
      className={[
        dancingScript.variable,
        greatVibes.variable,
        pinyonScript.variable,
        rochester.variable,
        pacifico.variable,
        "min-h-screen bg-cream pt-24 pb-20",
      ].join(" ")}
    >
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="mb-16 border-b border-sand/60 pb-10">
          <p className="text-[10px] uppercase tracking-[0.24em] text-ink-quiet mb-3">
            Internal · Design review · noindex
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[44px] text-ink leading-tight">
            Script Font Options
          </h1>
          <p className="mt-4 text-[17px] text-ink-soft max-w-lg">
            Martina — please review the five options below and tell us which feels most right for your signature accent text. Option B is currently live on the site.
          </p>
        </div>

        {/* Font cards */}
        <div className="space-y-16">
          {FONTS.map((font) => (
            <section
              key={font.label}
              className={`p-10 ${font.isCurrent ? "bg-mint border-l-4 border-pink" : "bg-bone"}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink">
                    {font.label}
                  </h2>
                  <p className="mt-1 text-[14px] text-ink-quiet">{font.description}</p>
                </div>
                {font.isCurrent && (
                  <span className="text-[10px] uppercase tracking-[0.18em] bg-pink text-cream px-3 py-1.5">
                    Currently live
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {PHRASES.map((phrase) => (
                  <div key={phrase} className="flex items-baseline gap-6">
                    <span
                      className="text-ink"
                      style={{
                        fontFamily: font.fontVar,
                        fontSize: "clamp(2rem, 4vw, 3.5rem)",
                        lineHeight: 1.1,
                      }}
                    >
                      {phrase}
                    </span>
                    <span className="text-[12px] text-ink-quiet shrink-0">
                      — at 32–56px
                    </span>
                  </div>
                ))}

                {/* Small size preview */}
                <div className="mt-4 pt-4 border-t border-sand/40">
                  <span className="text-[12px] uppercase tracking-[0.16em] text-ink-quiet mr-4">
                    At 22px:
                  </span>
                  {PHRASES.slice(0, 3).map((phrase) => (
                    <span
                      key={phrase}
                      className="inline-block mr-8 text-ink"
                      style={{ fontFamily: font.fontVar, fontSize: "22px" }}
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-sand/40 text-[13px] text-ink-quiet">
          <p>To switch fonts: tell us the option letter (A–E) and the developer will update the global font token in under 5 minutes. This page will be removed before public launch.</p>
        </div>
      </div>
    </div>
  );
}
