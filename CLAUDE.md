@AGENTS.md

# Martina Rink — Project Context (read every session)

---

## PROJECT GOVERNANCE — READ FIRST, EVERY SESSION

### Single source of truth
| Resource | Value |
|----------|-------|
| GitHub repo | `https://github.com/rinkmartina1979/martinarink` |
| Vercel project | `https://vercel.com/martina-rinks-projects/martinarink.com` |
| Vercel project ID | `prj_ILo8RZxss4v5C16fjIDo5S4801FJ` |
| Vercel org ID | `team_sIFjzIPHK3CVVX1Vj6Ei5gdK` |
| Live site | `https://martinarink.com` |
| Production branch | `main` |

### How production deploys work
```
git push origin main
  → GitHub integration webhook fires (Vercel native)
  → Vercel builds on their servers
  → Production updated at martinarink.com
```
No CLI deploy. No GitHub Actions. No manual triggers. One path only.

### PROHIBITED ACTIONS
- `vercel deploy --prod` from local CLI — creates UNKNOWN ghost deployments
- Push to any branch other than `main` for production changes
- Push to any remote other than `https://github.com/rinkmartina1979/martinarink`
- Reference `www.martinarink.com` in canonical URLs, og:url, or JSON-LD
- Hardcode hex colors or prices in components — use tokens and SITE constants
- Add `Co-Authored-By:` trailers — Vercel Hobby blocks deploys from unresolvable co-authors
- Commit `.claude/`, `.next/`, `node_modules/`, `.vercel/`, or `martinarink-next/`

### Git identity rule
Commits must be authored by an email that is a verified address on the `rinkmartina1979` GitHub account. Vercel resolves: `commit email → GitHub account → Vercel owner`. If the chain breaks, all webhook deploys are blocked.

Current commit author: `penupemamo83@gmail.com`
**Required action:** add this email as a verified secondary email on GitHub account `rinkmartina1979` at https://github.com/settings/emails

### Cache-free redeploy
When a deploy goes to production but cached content is suspected:
1. Vercel dashboard → `martinarink.com` → Deployments
2. Latest deployment → `···` → Redeploy
3. Uncheck "Use existing build cache" → Deploy

### Verification before declaring complete
A change is NOT done until:
- [ ] `git push origin main` succeeded
- [ ] Vercel dashboard shows `● Ready` (green) on latest deployment
- [ ] Live URL (`https://martinarink.com`) reflects the change visually
- [ ] No TypeScript errors: `npx tsc --noEmit` returns clean

---

## Source of Truth — ALWAYS use these, never others

| Resource | URL |
|----------|-----|
| **GitHub (source of truth)** | https://github.com/rinkmartina1979/martinarink |
| **Vercel project (production)** | https://vercel.com/martina-rinks-projects/martinarink.com |
| **Live site (canonical)** | https://martinarink.com |

### Git workflow
```bash
# The only remote is origin → rinkmartina1979/martinarink
git push origin main        # triggers Vercel auto-deploy via webhook
```

**NEVER** deploy via `vercel --prod` CLI directly — it targets the wrong project and creates UNKNOWN ghost deployments. Always `git push origin main`.

### Commit rules — Vercel Hobby plan compatibility
**NEVER include `Co-Authored-By` trailers in commit messages.** Vercel's Hobby plan reads all commit trailers and blocks deployments if any co-author (`noreply@anthropic.com`, bot accounts, etc.) cannot be resolved as a Vercel team member. This is a confirmed 2026 bug affecting Claude Code, Cursor, and other AI agents.

```bash
# ✅ CORRECT — clean commit message, no trailer
git commit -m "feat: description of change"

# ❌ WRONG — blocks Vercel deploy on Hobby plan
git commit -m "feat: change
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

**Git identity:** commits must use the email registered on the `rinkmartina1979` GitHub account so Vercel can resolve the author chain. Current working identity: configure via `git config user.email`.

### Canonical URL rule (SEO — never violate)
- **Canonical domain:** `martinarink.com` (no www)
- `www.martinarink.com` is an alias — Vercel serves it but `next.config.ts` 301-redirects all www traffic to the bare domain
- `SITE.url` in `lib/utils.ts` = `https://martinarink.com` — this propagates to all `<link rel="canonical">`, `og:url`, sitemap, JSON-LD, and robots.txt
- **Never change `SITE.url` back to `https://www.martinarink.com`** — that would make every page self-canonicalise to the wrong variant

**Delete the orphaned Vercel project** `martinarink-next` from the dashboard — it has no git connection and causes confusion. URL: https://vercel.com/martina-rinks-projects/martinarink-next

---

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
