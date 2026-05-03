@AGENTS.md

# Martina Rink — Project Context (read every session)

## Stack (locked)
- **Next.js 16.2 + App Router** — React 19.2, TypeScript 5
- **Tailwind CSS 4** — CSS-first config via `@theme` in `app/globals.css` (NO `tailwind.config.ts`)
- **Framer Motion** for entrance animations
- **Sanity v3** (CMS) · **Vercel** (host) · **Cal.com** (booking) · **Kit** (email)
- **Stripe** (payments) · **Resend** (transactional) · **Tally Pro** (assessment)

## Brand voice — never violate
**Banned words:** unlock · transform · empower (verb) · journey · step into · healing · recovery · addict · problem drinker · amazing · incredible · passion · authentic · authenticity
**Banned punctuation:** exclamation marks. Anywhere.
**Voice:** First-person · observational · precise · warm · unhurried.
- Max 3 sentences per paragraph, then a break
- Questions allowed (especially unanswered)
- "Darling/love" once on Empowerment page only
- Script accent ("and yet.") on homepage hero only
- Paragraphs under 100 words

## Brand colors — Tailwind class names map to these
- `cream #F7F3EE` — primary surface (80% of pages, NEVER use #FFFFFF)
- `bone #EDE8E0` — cards, elevated surfaces
- `blush #F5E8EC` — testimonial cards (1 per page max)
- `ink #1E1B17` — primary text + dark sections
- `ink-soft #4A3728` — body, subheads
- `ink-quiet #8A7F72` — captions, eyebrow labels
- `sand #C8B8A2` — hairlines
- `plum #5C2D8E` — PRIMARY CTA FILLS ONLY (Deep Amethyst — Vogue 2026 editorial purple, replaces wine; never text/headings)
- `plum-deep #451F6B` — button hover only
- `pink #F942AA` — script accent + 1px hairlines (<5% of page)
- `pink-soft #FDBFE2` — soft tints
- `violet-soft #F3EBF5` — section surfaces (from CI Farbe 3)
- `violet-mid #E6C7EB` — testimonial cards, soft highlights (from CI Farbe 3)
- `mint #C9EADE` — ONE section per page max
- `gold #C9A84C` — dark sections only
- `navy #1A1A2E` — dark section bg

## Typography (next/font)
- **Display** = Playfair Display (substitute for Bodoni Moda) — 40px+ only
- **Body** = DM Sans (substitute for Brandon Grotesque) — 17px / 1.7
- **Script** = Dancing Script (substitute for Buffalo) — max 5/page

## Pricing (consistent across all pages)
- Sober Muse Method: from €5,000 (90 days)
- Female Empowerment & Leadership: from €7,500 (6–12 months)
- Private Consultation: €450 (credited toward programme)

## Operating rules
1. Server Components by default — `"use client"` only for animations / forms / browser APIs
2. All fonts via `next/font` (loaded in `app/layout.tsx`)
3. All images via `next/image` with explicit width/height
4. Every page exports `metadata` from `lib/metadata.ts`
5. Forms = `react-hook-form` + `zod`
6. Buttons: `rounded-[1px]` (near-zero, editorial)
7. CTAs: SENTENCE CASE or ALL CAPS — never Title Case
8. Run banned-word scan before commit

## Site map
| Path | Indexed | Purpose |
|------|---------|---------|
| `/` | ✓ | Homepage |
| `/about` | ✓ | About Martina |
| `/sober-muse` | ✓ | Programme — 90 days, from €5K |
| `/empowerment` | ✓ | Programme — 6–12mo, from €7.5K |
| `/work-with-me` | ✓ | Conversion hub |
| `/assessment` | ✓ | Tally embed (7 questions) |
| `/writing` | ✓ | Sanity blog index |
| `/writing/[slug]` | ✓ | Article pages |
| `/newsletter` | ✓ | Kit signup |
| `/press` | ✓ | Press & speaking |
| `/contact` | ✓ | Press contact only |
| `/book` | ✗ | Cal.com embed (noindex) |
| `/apply/sober-muse` | ✗ | Application form |
| `/apply/empowerment` | ✗ | Application form |
| `/thank-you` | ✗ | Post-submit |
| `/legal/privacy` | ✓ | Privacy policy |
| `/legal/imprint` | ✓ | Impressum |
| `/legal/terms` | ✓ | Terms of service |
