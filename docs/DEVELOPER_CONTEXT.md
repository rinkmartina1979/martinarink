# Martina Rink — Complete Developer Context
## Everything a new developer needs to understand, build, and maintain this project

---

## 1. WHAT THIS PROJECT IS

**martinarink.com** is the premium personal website for Martina Rink — a private mentor, Spiegel Bestseller author, and former personal assistant to Isabella Blow. She runs two high-ticket coaching programmes:

- **The Sober Muse Method** — €5,000 / 90 days — private sobriety mentoring
- **Female Empowerment & Leadership** — from €7,500 / 6–12 months — executive women in transition
- **Private Consultation** — €450 (credited toward programme)

The site is designed to feel like a Vogue editorial, not a coaching website. Every design decision serves the premium positioning. The client (Martina) is German, based across Ibiza, Berlin, and Munich, with an international English-speaking audience of senior/executive women.

**Live URL:** `https://www.martinarink.com`
**Old German site (legacy, do not copy verbatim):** `https://martinarink.de`

---

## 2. TECH STACK — EVERYTHING LOCKED, DO NOT UPGRADE

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.3.9 |
| Runtime | React | 19.2 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS 4 | CSS-first, NO `tailwind.config.ts` |
| Animations | Framer Motion | Latest |
| CMS | Sanity v3 | Studio at `/admin` |
| Hosting | Vercel | Developer project: `andul-ghanis-projects/martinarink` |
| Booking | Cal.com | Embedded at `/book` |
| Email list | Kit (ConvertKit) | Newsletter at `/newsletter` |
| Payments | Stripe | Applications at `/apply/*` |
| Transactional email | Resend | Form submissions |
| Assessment | Tally Pro | Embedded at `/assessment` |
| Fonts | next/font (Google) | Loaded in `app/layout.tsx` |
| Forms | react-hook-form + zod | Application + newsletter forms |
| Analytics | Vercel Analytics + Speed Insights | In layout.tsx |

---

## 3. FILE STRUCTURE

```
martinarink-next/
├── app/                          ← Next.js App Router pages
│   ├── layout.tsx                ← Root layout: fonts, metadata, Nav, Footer, Analytics
│   ├── globals.css               ← ALL design tokens (Tailwind 4 @theme)
│   ├── page.tsx                  ← Homepage (/)
│   ├── about/page.tsx            ← About Martina
│   ├── sober-muse/page.tsx       ← The Sober Muse Method programme page
│   ├── empowerment/page.tsx      ← Female Empowerment & Leadership programme page
│   ├── work-with-me/page.tsx     ← Conversion hub / CTA page
│   ├── assessment/
│   │   ├── page.tsx              ← Assessment entry (Tally embed)
│   │   └── result/[resultId]/    ← Assessment result page
│   ├── writing/
│   │   ├── page.tsx              ← Blog index (Sanity)
│   │   └── [slug]/page.tsx       ← Individual article (Sanity)
│   ├── press/page.tsx            ← Press & Speaking page
│   ├── newsletter/page.tsx       ← Kit email signup
│   ├── contact/page.tsx          ← Press contact only (NOT a general enquiry form)
│   ├── book/page.tsx             ← Cal.com booking embed (noindex)
│   ├── apply/
│   │   ├── sober-muse/page.tsx   ← Application form — Sober Muse (noindex)
│   │   └── empowerment/page.tsx  ← Application form — Empowerment (noindex)
│   ├── thank-you/page.tsx        ← Post-submit (noindex)
│   ├── creative-work/page.tsx    ← Books + cultural work showcase
│   ├── legal/
│   │   ├── imprint/page.tsx      ← Impressum (German legal requirement)
│   │   ├── privacy/page.tsx      ← Privacy policy (GDPR)
│   │   └── terms/page.tsx        ← Terms of service
│   ├── admin/[[...tool]]/        ← Sanity Studio (embedded)
│   ├── opengraph-image.tsx       ← Dynamic OG image
│   ├── loading.tsx               ← Loading state
│   ├── error.tsx                 ← Error boundary
│   └── not-found.tsx             ← 404 page
│
├── components/
│   ├── layout/
│   │   ├── Nav.tsx               ← Fixed top nav (scroll-aware)
│   │   ├── Footer.tsx            ← Dark ink footer, 4-column grid
│   │   ├── MobileMenu.tsx        ← Mobile hamburger menu
│   │   └── NavDropdown.tsx       ← "Work With Me" dropdown in nav
│   ├── brand/
│   │   ├── PlumButton.tsx        ← PRIMARY CTA button (dark aubergine fill)
│   │   ├── GhostButton.tsx       ← Secondary outlined button
│   │   ├── Eyebrow.tsx           ← Small uppercase label above headings
│   │   ├── ScriptAccent.tsx      ← Dancing Script font wrapper
│   │   ├── AuthorityStrip.tsx    ← 4-column credentials bar
│   │   ├── TestimonialCard.tsx   ← Reusable quote card
│   │   └── PortableTextBody.tsx  ← Sanity Portable Text renderer
│   ├── assessment/               ← Multi-step assessment UI components
│   │   ├── AssessmentShell.tsx
│   │   ├── AssessmentIntro.tsx
│   │   ├── AssessmentQuestion.tsx
│   │   ├── AssessmentOption.tsx
│   │   ├── AssessmentProgress.tsx
│   │   ├── AssessmentLoading.tsx
│   │   └── AssessmentEmailGate.tsx
│   ├── forms/
│   │   ├── ApplicationForm.tsx   ← react-hook-form + zod application
│   │   └── NewsletterForm.tsx    ← Kit email signup form
│   └── sanity/
│       └── VisualEditingClient.tsx ← "use client" wrapper for Sanity visual editing
│
├── lib/
│   ├── metadata.ts               ← buildMetadata(), personSchema(), faqSchema()
│   ├── fonts.ts                  ← next/font declarations
│   └── utils.ts                  ← cn(), SITE constants
│
├── sanity/
│   ├── lib/queries.ts            ← All GROQ queries (getHomePage, getSoberMusePage etc.)
│   ├── schemas/                  ← Sanity content schemas
│   └── sanity.config.ts          ← Sanity Studio config
│
├── public/
│   └── images/
│       └── portraits/            ← All portrait photos
│           ├── martina-glam-portrait.jpg    ← HERO image (614×833px, April 29)
│           ├── martina-cafe-editorial.jpg   ← Cultural work section
│           ├── martina-portrait-studio.jpg  ← About teaser
│           ├── martina-ibiza-working.jpg    ← Sober Muse hero
│           ├── martina-cozy-portrait.jpg    ← Investment section
│           └── martina-podcast-studio.jpg   ← Press page hero
│
├── docs/
│   ├── DEVELOPER_CONTEXT.md      ← This file
│   ├── WEBSITE_UPGRADE_PLAN.md   ← 27-item change register from client video
│   └── email-sequences/          ← Kit/Brevo email sequence copy
│
├── next.config.ts                ← transpilePackages + non-www redirect
├── tsconfig.json
└── package.json
```

---

## 4. DESIGN SYSTEM — CRITICAL, READ FULLY

### 4a. How Tailwind 4 works here

**There is NO `tailwind.config.ts`.** Tailwind 4 uses a CSS-first approach. ALL design tokens live in `app/globals.css` inside `@theme { }`.

You use tokens as Tailwind utilities automatically — e.g. `--color-plum` becomes `bg-plum`, `text-plum`, `border-plum`.

```css
/* app/globals.css — partial */
@theme {
  --color-cream:        #F7F3EE;   /* bg-cream, text-cream */
  --color-ink:          #1E1B17;   /* bg-ink, text-ink */
  --color-plum:         #231728;   /* bg-plum, text-plum ← CTA buttons */
  --color-plum-deep:    #180F1E;   /* hover state */
  --color-pink:         #F942AA;   /* accent, hairlines */
  /* ...etc */
}
```

**To add a new color:** add `--color-myname: #hex;` to `@theme` — it becomes `bg-myname` / `text-myname` immediately.

### 4b. Color palette and usage rules

| Token | Hex | Usage |
|-------|-----|-------|
| `cream` | `#F7F3EE` | Primary background — 80% of all pages. NEVER use white. |
| `bone` | `#EDE8E0` | Cards, elevated surfaces, section alternation |
| `blush` | `#F5E8EC` | Testimonial cards — MAX 1 per page |
| `ink` | `#1E1B17` | Primary text, dark section backgrounds |
| `ink-soft` | `#4A3728` | Body copy, subheads |
| `ink-quiet` | `#8A7F72` | Captions, eyebrow labels |
| `sand` | `#C8B8A2` | Hairlines, dividers, borders |
| `plum` | `#231728` | **PRIMARY CTA FILLS ONLY** — buttons, never text/headings |
| `plum-deep` | `#180F1E` | Button hover state only |
| `pink` | `#F942AA` | Script accents + 1px hairlines (max 5% of page) |
| `pink-soft` | `#FDBFE2` | Soft tints, hover states |
| `violet-soft` | `#F3EBF5` | Soft section backgrounds (e.g. qualifier sections) |
| `violet-mid` | `#E6C7EB` | Dividers in violet sections |
| `mint` | `#C9EADE` | ONE mint section per page max |
| `gold` | `#C9A84C` | Dark sections only (on `bg-ink` or `bg-navy`) |
| `navy` | `#1A1A2E` | Dark section backgrounds |

**⚠️ IMPORTANT:** `--color-wine` and `--color-wine-deep` are legacy aliases that point to the same plum values. DO NOT use `wine` in new code — use `plum`.

### 4c. Typography

Three fonts, all loaded via `next/font` in `app/layout.tsx`:

| Variable | Font | CSS var | Use |
|----------|------|---------|-----|
| `playfair` | Playfair Display | `--font-playfair` | Display headings 40px+ |
| `dmSans` | DM Sans | `--font-dm-sans` | Body copy |
| `dancingScript` | Dancing Script | `--font-dancing-script` | Script accents — max 5 per page |

**Usage in JSX:**
```tsx
// Display heading
<h1 className="font-[family-name:var(--font-display)] text-[64px]">

// Body (default — already set on body element)
<p className="text-[17px] leading-[1.7]">

// Script accent — always use the ScriptAccent component
<ScriptAccent>welcome home, love</ScriptAccent>
```

**⚠️ NOTE:** Client has asked Dancing Script to be replaced. A font options page `/dev/fonts` needs to be built showing 6 premium alternatives. Do not change the font globally until client approves a replacement on call.

### 4d. Type scale (from @theme)

| Token | Size | Use |
|-------|------|-----|
| `text-display-xl` | 5.125rem | Hero h1 — homepage only |
| `text-display-lg` | 3.5rem | Major section headings |
| `text-display-md` | 2.5rem | Programme page h1 |
| `text-h3` | 1.5rem | Card headings |
| `text-body-lg` | 1.1875rem | Lead paragraphs |
| `text-body-base` | 1.0625rem | Body copy (17px) |
| `text-body-sm` | 0.9375rem | Secondary copy |
| `text-caption` | 0.8125rem | Captions |
| `text-overline` | 0.6875rem | Eyebrow labels (0.22em tracking) |
| `text-btn` | 0.75rem | Button text (0.18em tracking) |

### 4e. Layout utilities (from @layer components)

```css
.container-content  /* max-width 1280px, centered, px-6 md:px-12 */
.container-read     /* max-width 680px, centered — article/legal pages */
.section-pad        /* py-24 md:py-40 — standard section vertical rhythm */
```

### 4f. Button rules
- `rounded-[1px]` — near-zero radius, editorial, NOT rounded-lg
- CTAs: SENTENCE CASE or ALL CAPS — never Title Case
- Primary: `PlumButton` component — dark aubergine fill
- Secondary: `GhostButton` component — outlined

---

## 5. COMPONENTS REFERENCE

### `PlumButton`
```tsx
<PlumButton href="/assessment">Begin the assessment</PlumButton>
<PlumButton onClick={handleSubmit} type="submit">Submit</PlumButton>
```
- If `href` given → renders as `<Link>`
- If `onClick`/`type` given → renders as `<button>`
- Classes: `bg-plum hover:bg-plum-deep text-cream rounded-[1px] uppercase tracking-[0.18em]`

### `GhostButton`
```tsx
<GhostButton href="/about">Read more</GhostButton>
<GhostButton variant="light" href="/assessment">Begin</GhostButton>
```
- `variant="light"` for use on dark backgrounds (navy, ink)

### `Eyebrow`
```tsx
<Eyebrow withLine>The method</Eyebrow>
<Eyebrow className="justify-center">Centered eyebrow</Eyebrow>
```
Small uppercase label above section headings. `withLine` adds a pink hairline.

### `ScriptAccent`
```tsx
<ScriptAccent className="text-[32px]">— and yet.</ScriptAccent>
<ScriptAccent as="div" className="absolute bottom-4 right-4">welcome home, love</ScriptAccent>
```
Wraps text in Dancing Script font. `as` prop changes element type.

### `AuthorityStrip`
Hardcoded 4-item credential bar. Lives in its own component — edit the `ITEMS` array:
```tsx
const ITEMS = [
  { label: "AUTHOR", credit: "Three Books · Spiegel Bestseller" },
  { label: "CULTURAL WORK", credit: "Isabella Blow · London" },
  { label: "LIVED EXPERIENCE", credit: "Six Years Sober" },
  { label: "CLINICAL PARTNER", credit: "Mrs. Nürnberger · My Way Betty Ford" },
//  ↑ NOTE: "Dr." → "Mrs." — pending Nürnberger approval to use name at all
];
```

### `TestimonialCard`
```tsx
<TestimonialCard
  quote="The work was not a rebuild..."
  attribution="Founder · London"
  nda  // hides the name, shows role only
/>
```

### `Nav`
- Fixed, transparent at top → `bg-cream/90 backdrop-blur` on scroll
- Logo: `MARTINA RINK.` (pink dot)
- Desktop links defined in `NAV_LINKS` array
- **PENDING CHANGE:** Reorder to: About → Work With Me → Press → Writing
- `NavDropdown` component for the "Work With Me" dropdown

### `Footer`
- Dark `bg-ink` background
- 4 columns: Brand | The Work | Writing | Find Me
- Social links come from `SITE.social` (defined in `lib/utils.ts`)
- **PENDING CHANGE:** Add Spotify + Facebook to social column
- **PENDING CHANGE:** Footer location: `Ibiza · Berlin · Munich` → `Ibiza · Berlin · World`
- **PENDING CHANGE:** Email: `contact@martinarink.com` → `coaching@martinarink.com`

---

## 6. SANITY CMS INTEGRATION

### Overview
Sanity v3 is the headless CMS. It powers:
- Homepage hero copy (editable without code deploy)
- Blog/Writing posts
- Testimonials
- Partner logos
- Press items / publications
- Programme page copy overrides

### Studio location
The Sanity Studio is embedded at `/admin` (Next.js App Router route: `app/admin/[[...tool]]/page.tsx`). Martina accesses it at `www.martinarink.com/admin`.

### How Sanity + fallbacks work
Every page that uses Sanity data has **hardcoded fallbacks** for when Sanity isn't configured or returns empty:

```tsx
// Pattern used throughout:
const heroSubheadline = pageData?.heroSubheadline ?? "Hardcoded fallback text here";
```

This means the site works perfectly without Sanity configured. **Never delete the fallback values.**

### Key Sanity queries (all in `sanity/lib/queries.ts`):
- `getHomePage()` — hero copy, assessment CTA, about teaser
- `getFeaturedTestimonials()` — testimonials for homepage
- `getPartnerLogos()` — partner/client logos
- `getSoberMusePage()` — programme copy overrides
- `getEmpowermentPage()` — programme copy overrides
- `getPressPage()` — press hero copy, CTA
- `getPublications()` — book records with covers
- `getPressItems()` — individual press appearances
- `getWritingPosts()` — blog articles

### Visual Editing (Sanity draft mode)
In `app/layout.tsx`:
```tsx
const { isEnabled: isDraftMode } = await draftMode();
// ...
{isDraftMode && <VisualEditingClient />}
```

`VisualEditingClient` is in `components/sanity/VisualEditingClient.tsx` — it MUST be `"use client"` because `@sanity/visual-editing` uses React Context which cannot run on the server.

**CRITICAL:** Do NOT import `@sanity/visual-editing/react` directly in any Server Component. Always use the `VisualEditingClient` wrapper. This was a bug that broke all Vercel builds for weeks.

---

## 7. ALL PAGES — CONTENT REFERENCE

### `/` — Homepage
Sections in order:
1. **Hero** — h1 "You've built a life that looks extraordinary...", portrait photo, "welcome home, love" script overlay
2. **Press bar** — "As featured in" — Der Spiegel, Brigitte, STERN, Vogue Germany, Die Zeit
3. **Authority strip** — 4 credentials: Author, Cultural Work, Lived Experience, Clinical Partner
4. **The Private Cost** — "The outside life is not the whole story." — 3 paragraphs
5. **Two Ways In** — Cards for The Sober Muse Method (€5K) and Female Empowerment (€7.5K)
6. **Cultural Work teaser** — Books, Isabella Blow, editorial photo
7. **Partner logos** — Otto, MCM, Vogue Germany, H&M, Meta, About You, Henkel, Beiersdorf, Telekom, Prestel
8. **About teaser** — Bio snippet, portrait
9. **Assessment CTA** — Dark navy section, "Which of two patterns..."
10. **Testimonials** — 2 cards: Armina (real) + Clara (PLACEHOLDER — must be replaced)

**Pending:** Hero bg → plum. Press logos → marquee animation. "welcome home, love" → review on call.

### `/about` — About Martina
Bio page. Persian origin. Isabella Blow. 6 years sober. Needs enrichment from martinarink.de.

### `/sober-muse` — The Sober Muse Method
Sections: Hero → What this is/not → Three Phases (Ninety Days) → Dark testimonial → Investment → "Who this is not for" → FAQ accordion → TestimonialCard

**Pending:** Phase cards → pink hover effect. Phase names → catchier titles on call. Quote block bg → plum. Programme name already updated to "The Sober Muse" in hero eyebrow.

### `/empowerment` — Female Empowerment & Leadership
Similar structure to sober-muse. Price: from €7,500 — **under review, do not change until strategy call.**

### `/work-with-me` — Conversion Hub
Both programmes side by side with CTAs. Consultation booking link.

### `/assessment` — Tally Assessment
7-question assessment embed. `result/[resultId]` shows personalised letter output.

### `/writing` — Blog index
Sanity-powered. Article cards with excerpts.

### `/writing/[slug]` — Article page
Full Sanity blog post rendered with `PortableTextBody`.

### `/press` — Press & Speaking
Sections: Hero → Media bar → Sanity press items (if any) → Books (3, hardcoded fallback) → Isabella Blow dark section → Speaking topics → Press bios (25/75/200 word) → Literary agent → Press CTA → Footer note

**Important speaking formats line:** currently says "Keynote · Panel chair..." → **Change "Keynote" to "Panel guest"** (client video at 06:23).

### `/book` — Cal.com Booking (noindex)
Cal.com embedded booking page. Noindexed.

### `/apply/sober-muse` and `/apply/empowerment` — Application forms (noindex)
`react-hook-form` + `zod` forms. Submissions go via Resend.

### `/newsletter` — Kit Email Signup
Email list signup form.

### `/contact` — Press Contact Only
NOT a general enquiry. Press/media contact only. Email: contact@martinarink.com (changing to coaching@).

### `/legal/imprint` — Impressum
German legal requirement. Entity: Martina Rink UG (haftungsbeschränkt). **INCOMPLETE — needs full legal text from martinarink.de.** See CHANGE 24 in upgrade plan.

### `/legal/privacy` — Privacy Policy (GDPR)
### `/legal/terms` — Terms of Service
**Both need review** — client flagged they may be incomplete.

### `/creative-work` — Books + cultural work
Published books, partner logos, Isabella Blow background. **CHANGE:** Add real book cover images (JPEG) from martinarink.de — save to `public/images/books/`.

### `/admin` — Sanity Studio
Embedded at this path. Only accessible when logged into Sanity.

---

## 8. SITEWIDE CONSTANTS — `lib/utils.ts`

All sitewide values live in a `SITE` object:
```ts
export const SITE = {
  url: "https://www.martinarink.com",
  email: "contact@martinarink.com",   // ← CHANGING to coaching@martinarink.com
  social: {
    instagram: "https://www.instagram.com/martinarink_/",
    linkedin: "https://www.linkedin.com/in/martinarink/",
    // ADDING: spotify, facebook
  },
};
```

When changing the email, change it HERE — it cascades to the footer, press CTA, all mailto links.

---

## 9. METADATA SYSTEM — `lib/metadata.ts`

Every page exports metadata using `buildMetadata()`:
```ts
export const metadata: Metadata = buildMetadata({
  title: "The Sober Muse Method",
  description: "A 90-day private engagement...",
  path: "/sober-muse",
  noIndex: false,     // true for /book, /apply/*, /thank-you
});
```

The root layout currently has `noIndex: true` (preview mode). **Change to `false` for production launch.**

Also exports:
- `personSchema()` — JSON-LD Person schema (injected in `<body>` in layout.tsx)
- `faqSchema(faqs)` — JSON-LD FAQ schema (used on sober-muse, empowerment)

---

## 10. DEPLOYMENT

### Live setup
- **Developer Vercel project:** `andul-ghanis-projects/martinarink`
- **Deployed URL:** `https://www.martinarink.com` (www)
- **Non-www redirect:** `martinarink.com` → `https://www.martinarink.com` via `next.config.ts` redirect

### Deploy command
```bash
npx vercel --prod --yes
```

### Client's old Vercel project
There is a second Vercel project (`martina-rinks-projects/martinarink`) that Martina originally had — the repository `rinkmartina1979/martinarink` has been **deleted/access revoked**. That project is unreachable. All deployments go through the developer project.

### Important `next.config.ts`
```ts
const nextConfig: NextConfig = {
  transpilePackages: ['sanity', 'next-sanity'],   // Required for Sanity ESM
  async redirects() {
    return [{
      source: '/:path*',
      has: [{ type: 'host', value: 'martinarink.com' }],
      destination: 'https://www.martinarink.com/:path*',
      permanent: true,
    }];
  },
};
```

### Build checks before every deploy
1. `npx tsc --noEmit` — TypeScript must pass clean
2. Banned-word scan (see Section 12)
3. Check no `WineButton` component exists (was deleted — do not re-create)

---

## 11. BRAND VOICE — NON-NEGOTIABLE RULES

This is the most important constraint for copy. Violating it will require rewrites.

### Banned words (never use anywhere on the site)
`unlock` · `transform` · `empower` (as verb) · `journey` · `step into` · `healing` · `recovery` · `addict` · `problem drinker` · `amazing` · `incredible` · `passion` · `authentic` · `authenticity`

### Banned punctuation
**Exclamation marks. Anywhere. Not even in metadata descriptions.**

### Voice rules
- First-person, observational, precise, warm, unhurried
- Max 3 sentences per paragraph before a break
- Questions are allowed (especially unanswered ones)
- "Darling/love" — ONLY once, on the Empowerment page
- Script accent "and yet." — ONLY in the homepage hero
- Paragraphs under 100 words

### Copy case for CTAs
SENTENCE CASE or ALL CAPS — never Title Case.

### When migrating content from martinarink.de
The old site uses banned words extensively. **Never copy paste from martinarink.de.** Always rewrite in the .com voice. Run banned-word scan before commit.

---

## 12. KEY PENDING CHANGES (from client video, May 1 2026)

All 27 changes are detailed in `docs/WEBSITE_UPGRADE_PLAN.md`. Critical ones:

### Can implement NOW (no client input needed)

| File | Change |
|------|--------|
| `app/globals.css` | `--color-plum: #5C2D8E` → `#231728`, `--color-plum-deep: #451F6B` → `#180F1E` |
| `components/layout/Nav.tsx` | NAV_LINKS reorder: About, Work With Me, Press, Writing |
| `components/layout/Footer.tsx` | Location: `Munich` → `World`; add Spotify + Facebook |
| `components/brand/AuthorityStrip.tsx` | `Dr. Nürnberger` → `Mrs. Nürnberger` |
| `app/press/page.tsx` | Change "Keynote" → "Panel Guest" in speaking section |
| `app/page.tsx` | Replace "Clara · Founder" fallback testimonial with placeholder text |
| `app/sober-muse/page.tsx` | Phase cards: add `hover:bg-pink-soft transition-colors` |
| `app/page.tsx` | Press logos section: add infinite CSS marquee animation |

### Waiting for client sign-off

| Change | Waiting for |
|--------|-------------|
| Email → `coaching@martinarink.com` | Confirm inbox exists |
| "welcome home, love" — remove or replace | Copy call |
| Script font replacement | Font options call |
| Phase names (catchier) | Copy call |
| Pricing €7,500 → maybe lower | Strategy call |
| Replace Clara testimonial | Client to provide real quote |
| 4th book — what is it? | Client to confirm |
| Mrs. Nürnberger name usage | Client to get Nürnberger's approval |

---

## 13. LEGAL ENTITY INFORMATION

For legal pages (Imprint, Terms):

```
Martina Rink UG (haftungsbeschränkt)
(also known as: Concept Studio Martina Rink)
Steinkreuzstr. 26b
76228 Karlsruhe, Germany

Phone: +49 (0) 172 174 1499
Email: contact@martinarink.com (changing to coaching@)

Commercial Register: HRB 21885, Amtsgericht Traunstein
VAT: DE 283558251
Tax ID: 34/411/11000 (Finanzamt Karlsruhe)

Literary Agent: Elisabeth Ruge Agentur GmbH
Rosenthaler Str. 34/35, 10178 Berlin
info@elisabeth-ruge-agentur.de · +49 30 2888 406 00
```

---

## 14. RUNNING LOCALLY

```bash
# 1. Clone and install
cd "D:/WEBSITE DESIGN/martinarink-next"
npm install

# 2. Environment variables
# You need .env.local with:
# NEXT_PUBLIC_SANITY_PROJECT_ID=
# NEXT_PUBLIC_SANITY_DATASET=production
# SANITY_API_READ_TOKEN=
# RESEND_API_KEY=
# STRIPE_SECRET_KEY=
# KIT_API_KEY=

# 3. Run dev server
npm run dev       # localhost:3000

# 4. TypeScript check
npx tsc --noEmit

# 5. Deploy to production
npx vercel --prod --yes
```

---

## 15. COMMON MISTAKES / GOTCHAS

1. **Never import from `@sanity/visual-editing/react` in a Server Component.** It uses React Context. Always use the `VisualEditingClient` wrapper with `"use client"`.

2. **Never use `tailwind.config.ts`** — it doesn't exist. All tokens in `globals.css` @theme.

3. **Never use `bg-white` or `#FFFFFF`** — the brand uses `bg-cream` (#F7F3EE) as the lightest surface.

4. **`WineButton` component was deleted.** Do not re-create it. Use `PlumButton`.

5. **The URL `/sober-muse` stays the same** even after renaming the programme to "The Sober Muse" — changing URLs breaks SEO and external links.

6. **`SITE.email` in `lib/utils.ts` drives all email refs** — change it once there, not in 12 places.

7. **Sanity fallbacks must stay** — don't remove hardcoded defaults even if Sanity is set up. They protect against empty CMS states.

8. **`noIndex: true`** is currently set in `app/layout.tsx` (preview mode). Change to `false` when client approves launch.

9. **Testimonials on homepage:** "Clara · Founder · London" is a PLACEHOLDER. Client does not have a client named Clara. Replace before launch.

10. **Two Vercel projects exist** for the same domain. Only deploy to `andul-ghanis-projects` project. The client-side project (`martina-rinks-projects`) has a deleted GitHub repo and cannot deploy.

---

## 16. IMAGE ASSETS NEEDED (not yet in `/public`)

| File path | What it is | Status |
|-----------|-----------|--------|
| `public/images/books/isabella-blow-cover.jpg` | Book cover — Isabella Blow | Need from martinarink.de |
| `public/images/books/people-of-deutschland-cover.jpg` | Book cover | Need from martinarink.de |
| `public/images/books/fashion-germany-cover.jpg` | Book cover | Need from martinarink.de |
| `public/images/books/[4th-book]-cover.jpg` | 4th book cover | Client to confirm what 4th book is |
| `public/downloads/martina-rink-cv.pdf` | Downloadable CV | Client to email PDF |

---

## 17. CONTACT & ACCESS

| What | Details |
|------|---------|
| Client | Martina Rink — penupemamo83@gmail.com (DO NOT use this) |
| Client website | www.martinarink.com |
| Client old site | martinarink.de (German, legacy) |
| Client Instagram | @martinarink_ |
| Client phone | +49 (0) 172 174 1499 |
| Vercel project | andul-ghanis-projects/martinarink |
| Sanity Studio | www.martinarink.com/admin |
| Cal.com | Embedded at /book |

---

*Document created: 2026-05-03*
*Based on: full codebase audit + client video review (2026-05-01) + martinarink.de content audit*
*Keep this document updated as changes are made.*
