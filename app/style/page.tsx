/**
 * /style — living design reference, not a page anyone lands on (noindex).
 *
 * Renders every token straight from the real `@theme` block in app/globals.css
 * via Tailwind utility classes (bg-plum, text-ink-soft, etc.) — never a hardcoded
 * hex swatch. If globals.css changes, this page changes with it. That's the point:
 * "does this match the Vogue aesthetic" becomes a page load, not a memory.
 */

import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Design System", noIndex: true });

interface Swatch {
  name: string;
  className: string;
  note?: string;
}

const surfaces: Swatch[] = [
  { name: "cream", className: "bg-cream", note: "primary surface — 80% of pages" },
  { name: "bone", className: "bg-bone", note: "cards, alternating sections" },
  { name: "paper", className: "bg-paper", note: "highest elevation" },
];

const ink: Swatch[] = [
  { name: "ink", className: "bg-ink", note: "primary text + dark hero bg" },
  { name: "ink-soft", className: "bg-ink-soft", note: "body lead, sub-heads" },
  { name: "ink-quiet", className: "bg-ink-quiet", note: "captions, metadata" },
  { name: "sand", className: "bg-sand", note: "hairlines, dividers" },
];

const cta: Swatch[] = [
  { name: "plum", className: "bg-plum", note: "primary CTA fill — never text/headings" },
  { name: "plum-deep", className: "bg-plum-deep", note: "CTA hover" },
  { name: "plum-soft", className: "bg-plum-soft", note: "billing/investment panels" },
];

const tints: Swatch[] = [
  { name: "lilac-soft", className: "bg-lilac-soft", note: "quote blocks" },
  { name: "lilac-deep", className: "bg-lilac-deep", note: "testimonial cards" },
  { name: "blush", className: "bg-blush", note: "soft wash — 1 per page max" },
  { name: "rose", className: "bg-rose", note: "testimonial card bg" },
  { name: "mint-wash", className: "bg-mint-wash", note: "1 section per page max" },
];

const accents: Swatch[] = [
  { name: "pink", className: "bg-pink", note: "script accent, hairlines — under 5%" },
  { name: "pink-soft", className: "bg-pink-soft", note: "soft wash" },
  { name: "teal", className: "bg-teal", note: "emergency accent, rare" },
];

const darkSections: Swatch[] = [
  { name: "aubergine", className: "bg-aubergine", note: "editorial dark section" },
  { name: "aubergine-soft", className: "bg-aubergine-soft", note: "hover tint" },
  { name: "aubergine-deep", className: "bg-aubergine-deep", note: "footer / extreme dark" },
  { name: "navy", className: "bg-navy", note: "dark CTA section bg" },
  { name: "gold", className: "bg-gold", note: "gold accent — dark sections only" },
];

function ColorRow({ swatch }: { swatch: Swatch }) {
  const isDark = ["ink", "aubergine", "aubergine-soft", "aubergine-deep", "navy", "plum-deep"].includes(
    swatch.name,
  );
  return (
    <div className="flex items-center gap-4 py-3 border-b border-sand/30 last:border-b-0">
      <div
        className={`w-14 h-14 rounded-[1px] border border-sand/40 flex-shrink-0 ${swatch.className}`}
      />
      <div className="min-w-0">
        <p className="text-[14px] text-ink font-[family-name:var(--font-body)]">
          {swatch.name}
        </p>
        {swatch.note && (
          <p className="text-[12px] text-ink-quiet font-[family-name:var(--font-body)] truncate">
            {swatch.note}
          </p>
        )}
      </div>
      <p className={`ml-auto text-[11px] font-mono ${isDark ? "text-ink-quiet" : "text-ink-quiet"}`}>
        {swatch.className}
      </p>
    </div>
  );
}

function ColorGroup({ title, swatches }: { title: string; swatches: Swatch[] }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">{title}</p>
      <div>
        {swatches.map((s) => (
          <ColorRow key={s.name} swatch={s} />
        ))}
      </div>
    </div>
  );
}

export default function StyleReferencePage() {
  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-28 md:pt-36 pb-16 px-6 border-b border-sand/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
            Internal reference — not indexed
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[40px] md:text-[52px] text-ink leading-none mb-4">
            Design system.
          </h1>
          <p className="text-[15px] leading-[1.75] text-ink-soft max-w-xl">
            Every token below is rendered live from the real{" "}
            <code className="text-[13px]">@theme</code> block in{" "}
            <code className="text-[13px]">app/globals.css</code>. If this page and a
            component ever disagree, the component is wrong.
          </p>
        </div>
      </section>

      {/* Colors */}
      <section className="py-16 px-6 border-b border-sand/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[26px] text-ink mb-10">
            Color
          </h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            <ColorGroup title="Surfaces" swatches={surfaces} />
            <ColorGroup title="Ink & hairlines" swatches={ink} />
            <ColorGroup title="CTA — plum / rose" swatches={cta} />
            <ColorGroup title="Tints — one per page max" swatches={tints} />
            <ColorGroup title="Accents — under 5% of page" swatches={accents} />
            <ColorGroup title="Dark sections" swatches={darkSections} />
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="py-16 px-6 border-b border-sand/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[26px] text-ink mb-10">
            Typography
          </h2>

          <div className="space-y-8 mb-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">
                Display — Playfair Display, 40px+ only
              </p>
              <p className="font-[family-name:var(--font-display)] text-[82px] leading-[0.95] tracking-[-0.02em] text-ink">
                Display XL
              </p>
              <p className="font-[family-name:var(--font-display)] text-[56px] leading-[1.05] tracking-[-0.015em] text-ink mt-2">
                Display LG
              </p>
              <p className="font-[family-name:var(--font-display)] text-[40px] leading-[1.1] tracking-[-0.01em] text-ink mt-2">
                Display MD
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">
                Body — DM Sans, 17px / 1.7
              </p>
              <p className="font-[family-name:var(--font-display)] text-[24px] leading-[1.3] text-ink mb-2">
                H3 — 24px Playfair
              </p>
              <p className="text-[19px] leading-[1.65] text-ink-soft font-[family-name:var(--font-body)] mb-2">
                Body large — 19px. Used for lead paragraphs and pull quotes.
              </p>
              <p className="text-[17px] leading-[1.7] text-ink-soft font-[family-name:var(--font-body)] mb-2">
                Body base — 17px. The default paragraph size everywhere on the site.
              </p>
              <p className="text-[15px] leading-[1.6] text-ink-soft font-[family-name:var(--font-body)] mb-2">
                Body small — 15px. Secondary copy, form helper text.
              </p>
              <p className="text-[13px] leading-[1.4] text-ink-quiet font-[family-name:var(--font-body)] mb-2">
                Caption — 13px. Metadata, timestamps, credits.
              </p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink-quiet font-[family-name:var(--font-body)]">
                Overline — 11px, wide tracking
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">
                Script — Dancing Script, max 5 uses per page
              </p>
              <p className="font-[family-name:var(--font-script)] text-[42px] text-plum">
                and yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="py-16 px-6 border-b border-sand/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[26px] text-ink mb-10">
            Buttons
          </h2>
          <p className="text-[13px] text-ink-quiet mb-6">
            Sentence case or ALL CAPS. Never Title Case. <code>rounded-[1px]</code> — near-zero, editorial.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="px-8 py-3 bg-plum text-cream text-[12px] uppercase tracking-[0.18em] rounded-[1px] cursor-pointer hover:bg-plum-deep transition-colors duration-200"
            >
              Primary CTA
            </button>
            <button
              type="button"
              className="px-8 py-3 bg-transparent border border-ink text-ink text-[12px] uppercase tracking-[0.18em] rounded-[1px] cursor-pointer hover:bg-ink hover:text-cream transition-colors duration-200"
            >
              Secondary
            </button>
            <button
              type="button"
              className="px-8 py-3 bg-transparent text-plum text-[12px] uppercase tracking-[0.18em] rounded-[1px] cursor-pointer hover:text-plum-deep transition-colors duration-200"
            >
              Ghost / link
            </button>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 px-6 border-b border-sand/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[26px] text-ink mb-10">
            Card shells
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-bone border border-sand/40 rounded-[1px] p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-2">
                bone + sand border
              </p>
              <p className="text-[15px] text-ink-soft font-[family-name:var(--font-body)]">
                Default card — used across the portal and content sections.
              </p>
            </div>
            <div className="bg-rose rounded-[1px] p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-2">
                rose — testimonials
              </p>
              <p className="text-[15px] text-ink-soft font-[family-name:var(--font-body)]">
                Client testimonial cards use this warm rose fill.
              </p>
            </div>
            <div className="bg-aubergine rounded-[1px] p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-cream/60 mb-2">
                aubergine — dark editorial
              </p>
              <p className="text-[15px] text-cream/90 font-[family-name:var(--font-body)]">
                Approved dark section background. Gold accents only inside.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banned words / rules */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[26px] text-ink mb-8">
            Voice guardrails
          </h2>
          <div className="grid md:grid-cols-2 gap-10 text-[14px] leading-[1.7] font-[family-name:var(--font-body)]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">
                Banned words
              </p>
              <p className="text-ink-soft">
                unlock · transform · empower (as a verb) · journey · step into ·
                healing · recovery · addict · problem drinker · amazing ·
                incredible · passion · authentic · authenticity
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">
                Banned punctuation
              </p>
              <p className="text-ink-soft">Exclamation marks. Anywhere.</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mt-6 mb-3">
                Voice
              </p>
              <p className="text-ink-soft">
                First-person · observational · precise · warm · unhurried.
                Max 3 sentences per paragraph, then a break.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
