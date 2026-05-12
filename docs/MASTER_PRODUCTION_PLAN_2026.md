# Martina Rink — Master Production Plan 2026
## Version: FINAL · Compiled: May 2026
## Source: Client video (May 1) + DOCX v3 + Codebase audit + 2026 Vogue design standards

> This is the single source of truth. It supersedes all previous documents.
> Every item has a file target, exact instructions, and a done-state check.

---

## ⚡ CRITICAL — READ FIRST

The site is **live at www.martinarink.com but currently invisible to Google**.
`noIndex: true` is set globally in `app/layout.tsx`. Every SEO advantage is being wasted.
**This is the first fix. Do it today.**

---

## PART A — PRIORITY MATRIX

### 🔴 LEGAL & LAUNCH BLOCKERS — Do today, no discussion needed

| # | Change | File | Risk if skipped |
|---|--------|------|-----------------|
| L1 | **Remove global noIndex** — site invisible to Google | `app/layout.tsx` | Zero organic traffic forever |
| L2 | **Remove "Clara" fake testimonial** — client has no client named Clara | `app/page.tsx` | Published lie — reputational damage |
| L3 | **Complete Impressum** with full legal data | `app/legal/imprint/page.tsx` | German TMG §5 — up to €100K fine |
| L4 | **Add coaching disclaimer** to /sober-muse + /empowerment | Both programme pages | German UWG liability |
| L5 | **Fix Dr. → Mrs. Nürnberger** (or hide pending approval) | `components/brand/AuthorityStrip.tsx` | Misrepresentation of medical title |

### 🟡 CLIENT-CONFIRMED — This week

| # | Source | Change | File |
|---|--------|--------|------|
| C1 | Video 00:21 | Nav reorder: About → Work With Me → Press → Writing | `Nav.tsx` |
| C2 | Video 03:15 | "Sober Muse" → "The Sober Muse" in all display text (NOT the URL) | Multiple |
| C3 | Video 03:32 | Press logos → infinite CSS marquee animation | `app/page.tsx` |
| C4 | Video 06:36 | Phase cards hover → bg-pink-soft | `app/sober-muse/page.tsx` |
| C5 | Video 07:11 | Quote block bg → plum/violet-soft | `app/sober-muse/page.tsx` |
| C6 | Video 04:13 | Footer location: Ibiza · Berlin · Munich → Ibiza · Berlin · World | `Footer.tsx` |
| C7 | Video 04:35 | Email → coaching@martinarink.com (after confirming inbox) | `lib/utils.ts` |
| C8 | Video 06:23 | "Keynote Speaker" → "Panel Guest" | `app/press/page.tsx` |
| C9 | Video 05:33 | Books order: Isabella Blow → People of Deutschland → Fashion Germany | `creative-work/page.tsx` |
| C10 | Video 01:18 | Authority strip: "LIVED EXPERIENCE · Six Years Sober" present | `AuthorityStrip.tsx` |
| C11 | Video 00:00 | Hero H1: make larger — clamp-based fluid sizing | `app/page.tsx` |
| C12 | Video 00:16 | Hero background → dark plum `#231728` | `app/page.tsx` |
| C13 | Video 00:48 | "welcome home, love" → flag for copy call, do NOT delete yet | `app/page.tsx` |
| C14 | Color swatch | Color tokens update: `#5C2D8E` → `#231728` globally | `app/globals.css` |

### 🔵 WAITING FOR MARTINA — Hold, do not build yet

| # | What | Blocked by |
|---|------|------------|
| W1 | Real testimonial | Client to email real client quote |
| W2 | Script font replacement | Font options call at /dev/fonts |
| W3 | Phase names (catchier) | Copy call |
| W4 | Empowerment pricing | Strategy call |
| W5 | Mrs. Nürnberger on site | Written permission from Nürnberger |
| W6 | 4th book title | Client to confirm |
| W7 | Book cover images | Download from Wix CDN (URLs in Prompt 7) |
| W8 | CV PDF | Client to email |
| W9 | "Welcome home love" decision | Copy call |
| W10 | Full copy review | Scheduled call |

---

## PART B — 2026 VOGUE AESTHETIC UPGRADES

*These go beyond the client video. They are the difference between "looks good" and "feels like a €7,500 brand."*

### B1 — Fluid Typography System
Replace all fixed `text-[64px]` sizes with `clamp()`-based fluid type.
This makes text feel expensive on every screen size — exactly how Vogue editorial reads.

```css
/* Add to app/globals.css @theme */
--text-hero:        clamp(2.75rem, 7vw + 0.5rem, 6rem);
--text-heading-xl:  clamp(2rem, 4.5vw + 0.5rem, 3.5rem);
--text-heading-lg:  clamp(1.75rem, 3vw + 0.5rem, 2.5rem);
--text-heading-md:  clamp(1.375rem, 2vw + 0.5rem, 1.875rem);
```

Usage:
```tsx
<h1 className="font-[family-name:var(--font-display)]" style={{ fontSize: "var(--text-hero)" }}>
```

### B2 — Scroll-Reveal Animations (Framer Motion)
Every content section should animate in as it enters the viewport. This is standard on Vogue.com, Net-a-Porter, and all premium editorial sites in 2026.

**Create: `components/ui/FadeIn.tsx`**
```tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "none";
  className?: string;
}

export function FadeIn({ children, delay = 0, direction = "up", className }: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 24 : 0,
      x: direction === "left" ? -24 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

Apply to all major section headings and paragraph blocks across every page.

### B3 — Grain Texture Overlay (Premium Depth)
Top luxury fashion and editorial sites in 2026 use a subtle grain overlay to add depth and prevent the "flat web" look.

```css
/* Add to app/globals.css @layer base */
.grain-overlay {
  position: relative;
}
.grain-overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
  opacity: 0.035;
  mix-blend-mode: multiply;
}
```

Apply `.grain-overlay` to: hero section, dark sections (bg-ink, bg-navy, bg-plum), bone sections.

### B4 — Premium Cursor (desktop only)
A custom cursor is standard at Chanel.com, Net-a-Porter, and premium fashion editorial. Subtle, refined.

**Create: `components/ui/PremiumCursor.tsx`** (`"use client"`)
- Default: 8px circle, `#1E1B17` fill, opacity 0.7
- On hover over links/buttons: expands to 32px circle, fill → `#F942AA` (brand pink), opacity 0.3
- Smooth spring animation (Framer Motion `useSpring`)
- Only renders on `(pointer: fine)` media — tablets and touch stay default

### B5 — Horizontal Reading Lines
The secret detail that separates €500 websites from €50,000 ones: vertical rhythm.

```css
/* Add to @layer base in globals.css */
@media (min-width: 768px) {
  .reading-column {
    columns: 1;
    column-gap: 3rem;
    max-width: 680px;
  }
  .reading-column p {
    widows: 3;
    orphans: 3;
  }
}
```

### B6 — Image Treatment: Subtle Ken Burns on Hover
Portrait images throughout the site should have a slow scale on hover — 1.0 → 1.04 over 600ms. This is used on every major fashion site.

```tsx
<div className="overflow-hidden group">
  <Image
    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    ...
  />
</div>
```

Apply to ALL portrait images: hero, about teaser, creative work, sober-muse hero.

### B7 — Section Dividers
Replace `<hr>` and `border-t border-sand/40` with a designed divider using the pink hairline:

```tsx
// components/ui/Divider.tsx
export function Divider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-sand/60" />
      <div className="w-1 h-1 rounded-full bg-pink" />
      <div className="flex-1 h-px bg-sand/60" />
    </div>
  );
}
```

### B8 — Staggered List Animations
The "what this is / what this is not" lists on the Sober Muse page, and any bullet lists, should animate in with a 50ms stagger per item.

```tsx
// In app/sober-muse/page.tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};
const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

// Wrap list in:
<motion.ul variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map(item => (
    <motion.li variants={item} key={item}>...</motion.li>
  ))}
</motion.ul>
```

### B9 — Active Navigation Indicator
The current page link in the nav should have a subtle `text-pink` color + a 1px underline using `decoration-pink`. Use Next.js `usePathname()` hook.

```tsx
// In Nav.tsx
import { usePathname } from "next/navigation";
const pathname = usePathname();

// On each nav link:
className={cn(
  "text-[13px] uppercase tracking-[0.12em] font-medium transition-colors duration-200",
  pathname === link.href
    ? "text-ink underline decoration-pink decoration-1 underline-offset-[5px]"
    : "text-ink hover:text-pink"
)}
```

### B10 — Reading Progress Bar
On long pages (/sober-muse, /empowerment, /about, /press), show a 2px pink line at the very top of the viewport that fills as the user scrolls. Used on The Guardian, Vogue, and all major editorial sites.

```tsx
// components/ui/ReadingProgress.tsx — "use client"
"use client";
import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 h-[2px] bg-pink z-[100] transition-none"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
    />
  );
}
```

Add to programme pages and about page.

---

## PART C — PERFORMANCE (Core Web Vitals — 2026 Standard)

Premium brands need 90+ Lighthouse scores. Current risks:

### C1 — Image Optimization Audit
```tsx
// Every Image must have:
<Image
  src="/images/portraits/martina-glam-portrait.jpg"
  alt="Martina Rink — private mentor and author"
  fill                    // or explicit width/height
  sizes="(max-width: 768px) 100vw, 40vw"
  className="object-cover"
  priority                // Above-fold only
  fetchPriority="high"    // Hero only
/>
// Below fold: remove priority, add loading="lazy" (Next.js default)
```

### C2 — Font Preloading
In `app/layout.tsx`, next/font already handles this. Verify `display: "swap"` is set on all font declarations in `lib/fonts.ts`.

### C3 — Remove Unused CSS
Tailwind 4 purges by default. Verify no large inline SVGs or unused animation keyframes.

### C4 — Scroll Jank Prevention
For the marquee animation (Prompt 5):
```css
.marquee-track {
  will-change: transform;          /* Promote to GPU layer */
  backface-visibility: hidden;     /* Prevent repaint */
  transform: translateZ(0);        /* Force GPU compositing */
}
```

### C5 — Critical CSS
The hero section (above the fold) must never flash unstyled content. Since Tailwind 4 inlines critical CSS automatically with Next.js, verify the hero section renders correctly with JS disabled.

---

## PART D — MOBILE EXPERIENCE (2026 Standard)

60%+ of traffic will be mobile. Premium brands treat mobile as the primary design surface, not an afterthought.

### D1 — Touch Targets
Every button/link: minimum 44×44px touch target. Check:
- Nav hamburger menu — must be at least 44×44
- Assessment CTAs — verify they're full-width on mobile
- "Or explore the work →" link — add `min-h-[44px] flex items-center`

### D2 — Mobile Typography
Hero H1 at 44px on mobile feels premium. Current `sm:text-[56px]` — verify the clamp scale doesn't feel cramped.

### D3 — Mobile Nav
`MobileMenu.tsx` — verify:
- Full-screen overlay, not a side drawer
- Closes on link click
- Background: bg-ink / bg-cream options — cream is more premium
- Font: Playfair Display for menu items on mobile

### D4 — Mobile Phase Cards (Sober Muse)
On mobile, phase cards stack vertically. The hover effect should become a tap effect (`active:bg-pink-soft`).

### D5 — Mobile Footer
4-column footer should collapse to 2×2 grid on mobile, then 1-column on small screens. Verify the current grid handles this.

---

## PART E — SEO & STRUCTURED DATA (2026)

### E1 — Sitemap
Create `app/sitemap.ts`:
```ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.martinarink.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://www.martinarink.com/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://www.martinarink.com/sober-muse", lastModified: new Date(), changeFrequency: "monthly", priority: 0.95 },
    { url: "https://www.martinarink.com/empowerment", lastModified: new Date(), changeFrequency: "monthly", priority: 0.95 },
    { url: "https://www.martinarink.com/work-with-me", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://www.martinarink.com/press", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.martinarink.com/assessment", lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: "https://www.martinarink.com/writing", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://www.martinarink.com/newsletter", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://www.martinarink.com/legal/imprint", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: "https://www.martinarink.com/legal/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: "https://www.martinarink.com/legal/terms", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
```

### E2 — robots.txt
Create `app/robots.ts`:
```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/apply/", "/book", "/thank-you", "/dev/"] },
    ],
    sitemap: "https://www.martinarink.com/sitemap.xml",
  };
}
```

### E3 — Open Graph Images
`app/opengraph-image.tsx` exists — verify it renders correctly.
OG image spec: 1200×630px, brand cream background, Martina portrait right side, Playfair heading left side.

### E4 — Canonical Tags
`lib/metadata.ts`'s `buildMetadata()` should set `alternates.canonical` for every page:
```ts
alternates: {
  canonical: `https://www.martinarink.com${path}`,
},
```

---

## PART F — THE 10 CLAUDE CODE PROMPTS (Production Ready)

*Each prompt is a standalone session. Run `npx tsc --noEmit` before starting each.*
*Book cover image CDN URLs from martinarink.de Wix (confirmed working):*
- People of Deutschland: `https://static.wixstatic.com/media/71100e_383d20655d194d07a1c00321ad7aa308~mv2.png`
- Fashion Germany: `https://static.wixstatic.com/media/71100e_20942f3d30fa461ab4d33047a3246205~mv2.png`
- Isabella Blow: `https://static.wixstatic.com/media/71100e_f56aff568f194909890039b625db7983~mv2.png`

---

### PROMPT 1 — Launch Gate: noIndex + Impressum + Disclaimers
**Time: 45 min · Highest impact of all 10 prompts**

```
TASK 1 — noIndex OFF
File: app/layout.tsx
Find the root metadata export — currently has noIndex: true (preview mode flag)
Change to: robots: { index: true, follow: true }
Do NOT touch individual page metadata. /book, /apply/*, /thank-you keep their noIndex: true.
Verify: grep -rn "noIndex.*true" app/ --include="*.tsx"
Root layout must return zero. Programme pages should return zero. /book should return 1.

TASK 2 — COMPLETE IMPRESSUM
File: app/legal/imprint/page.tsx
noIndex for this page: false (indexed, required by law)
Page class: container-read, section-pad
H1: "Imprint" then subtitle "Impressum"
Full legal data (confirmed):
  Martina Rink UG (haftungsbeschränkt)
  also: Concept Studio Martina Rink
  Steinkreuzstr. 26b, 76228 Karlsruhe, Germany
  Phone: +49 (0) 172 174 1499
  Email: coaching@martinarink.com
  Commercial Register: HRB 21885, Amtsgericht Traunstein
  VAT: DE 283558251
  Tax ID: 34/411/11000 (Finanzamt Karlsruhe)
Literary agent section:
  Elisabeth Ruge Agentur GmbH
  Rosenthaler Str. 34/35, 10178 Berlin
  info@elisabeth-ruge-agentur.de · +49 30 2888 406 00
Style: plain, DM Sans 17px, no decorative elements, ink color
Legal pages are clean and functional.

TASK 3 — COACHING DISCLAIMER COMPONENT
Create: components/brand/CoachingDisclaimer.tsx (Server Component, no "use client")
Content:
  "This programme is a private mentoring service.
   It does not constitute medical advice, clinical addiction treatment,
   or a substitute for professional care.
   If you are in a medical emergency, please contact emergency services."
Style: text-[13px] text-ink-quiet/80, text-center, max-w-[560px] mx-auto
Border-top: 1px solid rgba(200,184,162,0.4) — sand/40
pt-10 mt-16
Add to bottom of: app/sober-muse/page.tsx AND app/empowerment/page.tsx

TASK 4 — SITEMAP + ROBOTS (PART E1/E2 above)
Create app/sitemap.ts with all indexed pages.
Create app/robots.ts disallowing /admin/, /apply/, /book, /thank-you, /dev/

TASK 5 — BUILD + DEPLOY
npx tsc --noEmit → must pass
npm run build → must pass
npx vercel --prod --yes
```

---

### PROMPT 2 — Color System + Testimonials + Authority Strip
**Time: 30 min**

```
TASK 1 — UPDATE COLOR TOKENS
File: app/globals.css
Inside @theme { }
Find these lines:
  --color-plum:      #5C2D8E;
  --color-plum-deep: #451F6B;
  --color-wine:      #5C2D8E;   (legacy alias)
  --color-wine-deep: #451F6B;   (legacy alias)
Replace with:
  --color-plum:      #231728;
  --color-plum-deep: #180F1E;
  --color-wine:      #231728;
  --color-wine-deep: #180F1E;
Save. This cascades everywhere — every bg-plum, text-plum, hover:bg-plum-deep updates.
Verify: no other hex values for the old purple exist in any file.

TASK 2 — REMOVE FAKE TESTIMONIAL
File: app/page.tsx
Find FALLBACK_TESTIMONIALS array.
Find the testimonial with name: "Clara" or attribution "Founder · London"
Replace with:
  {
    name: "Client",
    role: "Private",
    quote: "Testimonial in progress. Real client words being obtained.",
    nda: true,
  }
The Armina testimonial (Patent Engineer) is REAL — do not touch.
Add code comment above Clara replacement:
  // TODO: Replace with real client quote — Martina to provide

TASK 3 — AUTHORITY STRIP
File: components/brand/AuthorityStrip.tsx
Change:
  { label: "CLINICAL PARTNER", credit: "Dr. Nürnberger · My Way Betty Ford" }
To:
  { label: "CLINICAL PARTNER", credit: "Mrs. Nürnberger · My Way Betty Ford" }
Add constant at top of file:
  const NURNBERGER_APPROVED = false; // Set true when written permission received
Conditionally include the 4th item:
  ...(NURNBERGER_APPROVED ? [{ label: "CLINICAL PARTNER", credit: "Mrs. Nürnberger · My Way Betty Ford" }] : [])
Add "LIVED EXPERIENCE" if not present:
  { label: "LIVED EXPERIENCE", credit: "Six Years Sober" }
Final order: AUTHOR · CULTURAL WORK · LIVED EXPERIENCE · (CLINICAL PARTNER if approved)

TASK 4 — BUILD TEST + DEPLOY
npx tsc --noEmit && npm run build && npx vercel --prod --yes
```

---

### PROMPT 3 — Navigation + Footer + Social Links
**Time: 45 min**

```
Read all of: components/layout/Nav.tsx, Footer.tsx, NavDropdown.tsx, lib/utils.ts

TASK 1 — NAV REORDER
In Nav.tsx, find the NAV_LINKS array (or equivalent link definitions).
New order:
  { label: "About", href: "/about" }
  { label: "Work With Me", href: → NavDropdown component }
  { label: "Press", href: "/press" }
  { label: "Writing", href: "/writing" }
CTA PlumButton: "Begin the assessment" → /assessment (sentence case)

Active state: import usePathname from next/navigation
Add to each link:
  className={cn(
    "text-[13px] uppercase tracking-[0.12em] font-medium transition-colors duration-200",
    pathname === link.href
      ? "text-ink underline decoration-pink decoration-1 underline-offset-[5px]"
      : "text-ink hover:text-pink"
  )}

TASK 2 — lib/utils.ts EMAIL UPDATE
Find SITE.email
Change: contact@martinarink.com → coaching@martinarink.com
ONLY do this if the inbox has been confirmed to exist.
If unconfirmed: add comment // TODO: coaching@ inbox must be confirmed before changing

TASK 3 — FOOTER UPDATES
In Footer.tsx:
  Location line: change "Ibiza · Berlin · Munich" → "Ibiza · Berlin · World"
  Remove "Munich" entirely
  Remove Facebook (client said remove on video — they'll add back if they want)

In Footer.tsx "Find me" social column:
  Keep: Instagram (@martinarink_) — https://www.instagram.com/martinarink_/
  Keep: LinkedIn — https://www.linkedin.com/in/martinarink/
  Keep: email — coaching@martinarink.com (or contact@ until confirmed)
  ADD: Spotify — https://open.spotify.com/show/4ibhGsWMIZMTBBPNQqlmTv
    aria-label: "People of Deutschland Podcast on Spotify"
    Label text: "Podcast"

In Footer.tsx "The Work" column:
  Change "Sober Muse" link text → "The Sober Muse" (keep href /sober-muse)

TASK 4 — NAVDROPDOWN VERIFY/UPDATE
File: components/layout/NavDropdown.tsx
Verify the dropdown shows TWO panels with EXACT text:

Panel I:
  Numeral: "I." — font-[family-name:var(--font-display)] italic, text-pink-soft, text-[42px]
  Heading: "The Sober Muse Method" — Playfair 22px text-ink
  Meta: "90 days · private · from €5,000" — DM Sans 13px text-ink-quiet
  Link: "Explore →" → /sober-muse

Panel II:
  Numeral: "II."
  Heading: "Female Empowerment & Leadership"
  Meta: "6–12 months · private · from €7,500"
  Link: "Explore →" → /empowerment

Bottom of dropdown:
  Link: "Or begin the assessment →" → /assessment
  Style: text-[12px] uppercase tracking-[0.16em] text-ink-quiet

Animation (Framer Motion):
  AnimatePresence
  initial: { opacity: 0, y: -6 }
  animate: { opacity: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } }
  exit: { opacity: 0, y: -4, transition: { duration: 0.1 } }

TASK 5 — BUILD TEST + DEPLOY
npx tsc --noEmit && npm run build && npx vercel --prod --yes
Test: Nav in order. Dropdown opens/closes. Footer email, location, Spotify correct.
```

---

### PROMPT 4 — Homepage Hero Upgrade (Dark Plum + Scale + 2026 Design)
**Time: 45 min · Most visible change on the site**

```
Read the ENTIRE app/page.tsx before any change.

TASK 1 — HERO BACKGROUND → DARK PLUM
Hero section container:
  Remove: bg-cream
  Add: bg-plum (which is now #231728 after Prompt 2)
  Add subtle radial gradient for depth:
    style={{ background: "radial-gradient(ellipse at 30% 70%, #3a2545 0%, #231728 55%, #180F1E 100%)" }}

TASK 2 — H1 SIZE: FLUID CLAMP
H1 "You've built a life that looks extraordinary from the outside"
  DO NOT CHANGE THE TEXT
  Change font size to:
    style={{ fontSize: "clamp(2.5rem, 7vw + 0.5rem, 6rem)" }}
  Ensure line-height: leading-[0.95] stays
  Text color: text-cream (on dark bg)
  "extraordinary" italic: stays italic

TASK 3 — EYEBROW
The Eyebrow above H1: "For the woman who already has it all"
  Change text to: "FOR THE WOMAN WHO HAS BUILT THE OUTSIDE LIFE"
  On dark bg, eyebrow needs: text-pink-soft (#FDBFE2) color
  Eyebrow component prop: if it accepts a className, use className="text-pink-soft"

TASK 4 — ALL TEXT COLORS IN HERO
Hero is now dark — ALL text inside must switch:
  h1: text-cream
  p (heroSubheadline): text-cream/80
  "Or explore the work →" link: text-cream/70, hover: text-cream
  decoration-pink stays

TASK 5 — CTA BUTTON ON DARK BG
PlumButton on dark plum bg → looks invisible (same color family)
Switch hero CTA to GhostButton with variant="light":
  <GhostButton variant="light" href="/assessment">Begin the assessment</GhostButton>
"light" variant: transparent bg, cream border, cream text, hover: bg-cream text-plum

TASK 6 — HERO PORTRAIT: NO CHANGE TO IMAGE
Keep: src="/images/portraits/martina-glam-portrait.jpg"
On dark plum bg, the photo container bg (bg-bone) will look wrong.
Change portrait container background: bg-plum-deep (#180F1E)
The photo will float on darkness — very editorial.

TASK 7 — "WELCOME HOME LOVE" FLAG
Keep ScriptAccent as-is on the photo.
Wrap in comment — do NOT delete:
  {/* TODO: Review on copy call — client said "not very premium English" (video 00:48) */}
  <ScriptAccent ...>welcome home, love</ScriptAccent>

TASK 8 — HERO IMAGE HOVER (2026 aesthetic)
Portrait image container: add "group" class
Image: add "transition-transform duration-700 ease-out group-hover:scale-[1.03]"
Container: overflow-hidden is already there

TASK 9 — PRESS LOGOS SECTION ON DARK BG
If the press logos section immediately follows the hero, check its bg.
It uses bg-cream currently — that's fine (natural break to light).
But if visually jarring, switch to bg-bone for gentler transition.

TASK 10 — BUILD TEST + DEPLOY
npx tsc --noEmit && npm run build && npx vercel --prod --yes
Verify: hero is dark plum, h1 is cream and large, portrait shows on dark bg.
```

---

### PROMPT 5 — Press Logos Marquee + FadeIn System
**Time: 30 min**

```
TASK 1 — CREATE FadeIn COMPONENT (2026 standard animation)
File: components/ui/FadeIn.tsx
"use client"
Content:
  import { motion, useInView } from "framer-motion";
  import { useRef } from "react";

  export function FadeIn({ children, delay = 0, direction = "up", className }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: direction === "up" ? 24 : 0 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

Apply FadeIn to: every h2, every major p block across all pages. Use delay={0.1} for second items.

TASK 2 — CREATE PressMarquee COMPONENT
File: components/sections/PressMarquee.tsx
"use client"

Publications (confirmed from audit + press page):
const OUTLETS = [
  "Der Spiegel", "British Vogue", "Brigitte", "STERN", "Vogue Germany",
  "ELLE Germany", "Die Zeit", "Schön Magazine", "Evening Standard",
  "Glamour", "Gala", "Süddeutsche Zeitung", "Manager Magazin"
];

Behaviour:
  Infinite scroll, left-to-right, 45 seconds per loop
  Pause on hover
  Duplicate list for seamless loop
  prefers-reduced-motion: disable animation, show static grid instead

Implementation:
  Outer: overflow-hidden, relative
  Inner track: flex items-center gap-16, w-max
  CSS animation: translateX(0) → translateX(-50%), 45s linear infinite
  On hover: animation-play-state: paused

Each item: font-[family-name:var(--font-display)] italic, text-[16px], text-ink/45
Spacing between items: 64px gap
Divider dot between items: · in text-sand

Accessibility:
  <section aria-label="Press coverage">
  Inner: aria-hidden="true"

TASK 3 — INTEGRATE INTO HOMEPAGE
In app/page.tsx, find the static press logos section.
Replace the inner div with <PressMarquee />.
Section container stays: bg-cream border-t border-sand/40 py-8

TASK 4 — BUILD TEST + DEPLOY
npm run build. Check marquee renders.
Test hover pause. Test at 375px mobile — marquee continues but fits.
npx vercel --prod --yes
```

---

### PROMPT 6 — Sober Muse Page Complete Upgrade
**Time: 60 min**

```
Read the ENTIRE app/sober-muse/page.tsx first.

TASK 1 — DISPLAY NAME UPDATE
Change all display text: "Sober Muse" → "The Sober Muse"
Change: "Sober Muse Method" → "The Sober Muse Method"
DO NOT change any href="/sober-muse" — URL stays
Run first: grep -n "Sober Muse" app/sober-muse/page.tsx
Update each non-URL occurrence manually.

TASK 2 — PHASE CARDS HOVER EFFECT
Find the three phase cards array with: Naming, Clearing, Return.
For each card <div>:
  Add: className="group/card" to outer div (or use parent container)
  Add to card div: "transition-all duration-300 cursor-default"
  Default bg: bg-bone
  Hover bg: hover:bg-pink-soft
  Border: add border border-transparent hover:border-pink/30
  Phase label (text-[10px] uppercase): group-hover/card:text-pink transition-colors
  Phase title italic: group-hover/card:text-ink (no change needed — already dark)

TASK 3 — QUOTE BLOCK: BACKGROUND UPDATE
Find any section with bg-blush or bg-pink-soft that contains a testimonial/quote.
Change to: bg-violet-soft (#F3EBF5)
  Check globals.css: if --color-violet-soft exists as a token, use bg-violet-soft
  If not: add to @theme in globals.css: --color-violet-soft: #F3EBF5;
  Then use: bg-violet-soft

TASK 4 — "CLARITY PROBLEM" QUOTE: MOVE TO AFTER HERO
Find the testimonial: "I came in thinking I had a drinking problem.
I left understanding I had a clarity problem..."
Remove it from its current location.
Insert IMMEDIATELY after the hero section (below the fold, first thing after hero).
Style as a centred pull-quote:
  bg: bg-bone
  section padding: py-16
  Opening quote: Playfair italic text-[80px] text-pink/30, leading-none
  Quote text: Playfair italic text-[24px] md:text-[28px] text-ink-soft, max-w-3xl mx-auto text-center
  Attribution: "— Client · Identity private" text-[11px] uppercase tracking-[0.22em] text-ink-quiet mt-8

TASK 5 — ADD FADEINS
Wrap each major section's headline + first paragraph with:
  <FadeIn> ... </FadeIn>
  <FadeIn delay={0.15}> first paragraph </FadeIn>
Import FadeIn from "@/components/ui/FadeIn"

TASK 6 — READING PROGRESS BAR
Import and add ReadingProgress component at top of the page JSX (below the nav, above first section):
  <ReadingProgress />
This needs ReadingProgress component created first (see Part B10 above).
Create: components/ui/ReadingProgress.tsx (code in Part B10 of this document)

TASK 7 — BUILD TEST + DEPLOY
npx tsc --noEmit && npm run build && npx vercel --prod --yes
Test hover on all 3 phase cards. Progress bar visible on scroll. Clarity quote is first.
```

---

### PROMPT 7 — Press Page + Books + Book Cover Downloads
**Time: 60 min**

```
Read: app/press/page.tsx, app/creative-work/page.tsx

TASK 1 — DOWNLOAD BOOK COVERS
Run these commands to download from Wix CDN:
  mkdir -p public/images/books
  curl -L -o "public/images/books/people-of-deutschland-cover.png" "https://static.wixstatic.com/media/71100e_383d20655d194d07a1c00321ad7aa308~mv2.png"
  curl -L -o "public/images/books/fashion-germany-cover.png" "https://static.wixstatic.com/media/71100e_20942f3d30fa461ab4d33047a3246205~mv2.png"
  curl -L -o "public/images/books/isabella-blow-cover.png" "https://static.wixstatic.com/media/71100e_f56aff568f194909890039b625db7983~mv2.png"
Verify each downloaded correctly (should be ~100KB+ each, not 0 bytes).
If a download fails, note it — the Wix CDN may have expired.

TASK 2 — UPDATE CREATIVE WORK PAGE: BOOK ORDER + IMAGES
File: app/creative-work/page.tsx
Books must appear in this order: 1. Isabella Blow  2. People of Deutschland  3. Fashion Germany
For each book article:
  Replace the placeholder aspect-ratio div with:
    <div className="relative aspect-[3/4] overflow-hidden group">
      <Image
        src="/images/books/[book]-cover.png"
        alt="[Book Title] by Martina Rink — cover"
        fill
        sizes="(max-width: 768px) 100vw, 28vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
    </div>
If image downloaded fine → use it.
If image is broken → keep the existing text-on-bg-ink placeholder but fix the order.

TASK 3 — SPOTIFY LINK IN PEOPLE OF DEUTSCHLAND SECTION
In the People of Deutschland book section:
  Add below the description:
    <a
      href="https://open.spotify.com/show/4ibhGsWMIZMTBBPNQqlmTv"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 mt-4 text-[14px] text-plum underline decoration-pink underline-offset-[5px]"
    >
      Listen to the companion podcast →
    </a>

TASK 4 — PRESS PAGE: SPEAKING SECTION
File: app/press/page.tsx
Find all occurrences of "Keynote" in the speaking section.
  grep -n "keynote\|Keynote" app/press/page.tsx
Change speaking formats line from:
  "Keynote · Panel chair · Intimate fireside conversation · Podcast guest"
To:
  "Panel guest · Fireside conversation · Podcast guest"
Remove "Keynote" from credential pills in the hero section too.

TASK 5 — PRESS CREDENTIALS PILLS UPDATE
Find the credential pill array in app/press/page.tsx:
  Remove: "Keynote speaker"
  Keep: "Spiegel Bestseller author", "Former PA to Isabella Blow", "Private mentor · by application"
  Add: "Sobriety activist" (from martinarink.de — this is her self-description)

TASK 6 — ADD ELLE GERMANY + SÜDDEUTSCHE ZEITUNG TO HOMEPAGE PRESS
In app/page.tsx, find the static press list ["Der Spiegel", "Brigitte"...]:
  Replace with: ["Der Spiegel", "Brigitte", "STERN", "Vogue Germany", "Die Zeit", "ELLE Germany"]
  (PressMarquee in Prompt 5 already has the full expanded list)

TASK 7 — BUILD TEST + DEPLOY
npx tsc --noEmit && npm run build && npx vercel --prod --yes
Check: books in correct order, images load, Spotify link works, no "Keynote" anywhere.
```

---

### PROMPT 8 — Font Options Page for Client Review
**Time: 30 min · Internal page only**

```
TASK 1 — LOAD 5 NEW FONTS
File: lib/fonts.ts
Add alongside existing fonts:
  import { Pinyon_Script, Italianno, Corinthia, Allura, Great_Vibes } from "next/font/google"
  export const pinyonScript = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--font-pinyon" })
  export const italianno = Italianno({ weight: "400", subsets: ["latin"], variable: "--font-italianno" })
  export const corinthia = Corinthia({ weight: ["400","700"], subsets: ["latin"], variable: "--font-corinthia" })
  export const allura = Allura({ weight: "400", subsets: ["latin"], variable: "--font-allura" })
  export const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-great-vibes" })

Add these variables to the <html> element in app/layout.tsx:
  import { ..., pinyonScript, italianno, corinthia, allura, greatVibes } from "@/lib/fonts"
  className={`${playfair.variable} ${dmSans.variable} ${dancingScript.variable} ${pinyonScript.variable} ${italianno.variable} ${corinthia.variable} ${allura.variable} ${greatVibes.variable} antialiased`}

TASK 2 — CREATE FONT OPTIONS PAGE
File: app/dev/fonts/page.tsx
noIndex: true
Title metadata: "Font Options — Client Review"

Page content:
  bg-cream, container-content, py-20
  H1: "Script Font Options" — Playfair 48px
  Subline: "Review these options. Choose one on our next call." — DM Sans 17px text-ink-soft
  Note: "Your current font is Option E — Dancing Script." — DM Sans 15px text-ink-quiet

  For each of 5 options, render a card (bg-bone border border-sand/40 p-10):

    Option A — Pinyon Script
      CSS var: var(--font-pinyon)
      Description: "English copperplate. Formal, Vogue-adjacent. The most editorial of all options."
      Samples (in pink #F942AA):
        "Martina" at 52px
        "The Sober Muse" at 38px
        "— and yet." at 32px

    Option B — Italianno
      CSS var: var(--font-italianno)
      Description: "Italian calligraphy. Flowing, poetic, light weight."
      Same samples.

    Option C — Corinthia
      CSS var: var(--font-corinthia)
      Description: "Tall, narrow, old-world European elegance. Very refined."
      Same samples.

    Option D — Allura
      CSS var: var(--font-allura)
      Description: "Balanced between formal and romantic. Highly legible."
      Same samples.

    Option E — Dancing Script (CURRENT)
      CSS var: var(--font-dancing-script)
      Label: red badge "CURRENT" — bg-pink text-cream text-[10px] uppercase px-3 py-1
      Description: "Current choice. Client has flagged it may not feel premium enough."
      Same samples.

TASK 3 — BUILD TEST
npm run build. Visit /dev/fonts.
Confirm all 5 fonts render in correct color and size.
Share URL with Martina for next call.
```

---

### PROMPT 9 — Email + API Audit
**Time: 60 min · Research only — do not change things that work**

```
AUDIT PHASE — document findings, do not rebuild what works.

STEP 1 — IDENTIFY PROVIDERS
Run:
  grep -r "brevo\|kit\|convertkit\|resend\|sendgrid" app/ lib/ --include="*.ts" -l -i
  grep -r "BREVO\|KIT\|RESEND" .env.local 2>/dev/null || echo "check Vercel env"
Document: which file uses which provider.

STEP 2 — ASSESSMENT FLOW
File: app/api/assessment/route.ts (if exists)
Document:
  a) Does it capture email address?
  b) Does it assign an archetype tag?
  c) Does it trigger an automation/sequence in the ESP?
  d) Does it fire POST /events (not just POST /contacts)?
  Note: contact upsert alone does NOT trigger Kit/Brevo automations.

STEP 3 — KIT SEQUENCE STATUS
Email sequences in docs/email-sequences/:
  - SEQUENCE_A_assessment_followup.md
  - SEQUENCE_B_weekly_newsletter.md
  - SEQUENCE_C_post_consultation.md
Check: are these loaded in Kit UI (app.kit.com) as Automations, or only as docs?
If not loaded: this is a UI task, not a code task.
Document the gap.

STEP 4 — WRITE AUDIT REPORT
Create: docs/EMAIL_AUDIT.md
Include:
  - What's wired (working end-to-end)
  - What's gaps (code or UI)
  - Recommended next steps
  - Do NOT make changes based on assumptions
```

---

### PROMPT 10 — Pre-Launch QA + Final Deploy
**Time: 60 min · Only run when all previous prompts complete**

```
AUTOMATED CHECKS — ALL MUST PASS WITH ZERO ERRORS

npx tsc --noEmit
npm run build
npm run lint (if configured)

BANNED CONTENT SCAN — ALL MUST RETURN ZERO
grep -rn "Clara" app/ components/ --include="*.tsx"
grep -rn "Dr\. Nürnberger" app/ components/ --include="*.tsx"
grep -rni "keynote speaker" app/ components/ --include="*.tsx"
grep -rni "noIndex.*true" app/layout.tsx
grep -rni "transform\|unlock\|healing journey\|recovery journey" app/ components/ --include="*.tsx"

LAST LINE ABOVE MUST RETURN ZERO — global noIndex is off.

PAGES TO VERIFY (visit each at 1280px and 375px):
  / — plum hero, large cream H1, marquee animating, no Clara, FadeIns working
  /about — full bio, no placeholder text
  /sober-muse — phase cards hover pink, "The Sober Muse Method" title, clarity quote first, disclaimer at bottom
  /empowerment — pricing shows, disclaimer at bottom
  /work-with-me — both programmes linked, consultation booking works
  /press — "Panel Guest" not Keynote, Isabella Blow in books section, literary agent card
  /creative-work — Isabella Blow FIRST, book covers load, Spotify link present
  /assessment — Tally embed loads, no broken iframe
  /legal/imprint — full legal data, IS indexed
  /legal/privacy — present and indexed
  /book — Cal.com loads, IS noindexed
  /dev/fonts — all 5 options render, IS noindexed
  /newsletter — Kit form loads

LAUNCH GATE — ALL BOXES MUST BE CHECKED
[ ] noIndex: false in root layout confirmed
[ ] "Clara" testimonial removed / replaced with placeholder
[ ] Impressum has full legal data
[ ] Coaching disclaimer on /sober-muse + /empowerment
[ ] Dr. → Mrs. Nürnberger or hidden
[ ] Nav: About → Work With Me → Press → Writing
[ ] Press logos marquee animating
[ ] Phase cards hover pink on /sober-muse
[ ] Footer: Ibiza · Berlin · World
[ ] Footer: coaching@martinarink.com (or confirmed contact@)
[ ] Spotify in footer
[ ] Panel Guest on press page
[ ] Isabella Blow FIRST in books
[ ] Book covers display (real images or premium text-on-dark fallbacks)
[ ] Plum is #231728 (dark aubergine) everywhere
[ ] FadeIn animations working on key sections
[ ] Font options at /dev/fonts
[ ] Sitemap at /sitemap.xml
[ ] robots.txt at /robots.txt
[ ] OG image renders correctly
[ ] npm run build passes clean
[ ] npx tsc --noEmit passes clean

DEPLOY
npx vercel --prod --yes

POST-DEPLOY CHECKS (60 seconds after deploy):
  curl -s https://www.martinarink.com | grep -i "noindex" → must return nothing
  curl -s https://www.martinarink.com/sitemap.xml | head -5 → must show XML
  curl -s https://www.martinarink.com/book | grep -i "noindex" → must return something
  https://www.martinarink.com loads → hero is dark plum
  https://www.martinarink.com/legal/imprint → full legal content
  No 500 errors in Vercel dashboard
```

---

## PART G — EXECUTION TIMELINE

| Day | Prompt | What gets done | Time |
|-----|--------|---------------|------|
| **Today** | P1 — Launch Gate | noIndex OFF · Impressum · Disclaimers · Sitemap | 45 min |
| **Today** | P2 — Colors + Trust | Dark aubergine tokens · Clara removed · Authority strip | 30 min |
| **Today** | P3 — Navigation | Nav reorder · Footer · Spotify · Dropdown | 45 min |
| Day 2 | P4 — Hero | Dark plum bg · Fluid H1 · GhostButton on dark | 45 min |
| Day 2 | P5 — Marquee + FadeIn | Press logos infinite scroll · FadeIn system | 30 min |
| Day 2 | P6 — Sober Muse | Hover cards · Quote block · Clarity quote · Progress bar | 60 min |
| Day 3 | P7 — Press + Books | Panel Guest · Books order · Book cover downloads | 60 min |
| Day 3 | P8 — Font Options | /dev/fonts page for client call | 30 min |
| Day 4 | P9 — Email Audit | Document gaps · Do not rebuild | 60 min |
| Day 5 | P10 — QA + Launch | Final scan · All checks · Deploy · Announce | 60 min |

**Total: ~8.5 hours of execution across 5 days**

---

## PART H — ITEMS ONLY MARTINA CAN UNBLOCK

| # | What she must do | Blocking |
|---|-----------------|---------|
| 1 | Email a real client quote to replace Clara | Homepage credibility |
| 2 | Get written permission from Mrs. Nürnberger to use her name | Authority strip |
| 3 | Confirm 4th book title (or confirm there are only 3) | About/authority |
| 4 | Review /dev/fonts and choose a script font on call | Global font update |
| 5 | Decide on Empowerment pricing: €7,500 or lower | Empowerment page |
| 6 | Live copy call — go through all text together | Every page copy |
| 7 | Email CV PDF for About page download | About page |
| 8 | Confirm coaching@martinarink.com inbox exists and she has access | All contact |
| 9 | Approve or replace "welcome home, love" on copy call | Hero tagline |
| 10 | Review and approve phase name alternatives | Sober Muse page |

---

## PART I — TAILWIND 4 CHEAT SHEET (quick reference)

```
NO tailwind.config.ts — all tokens in app/globals.css @theme { }

ADD COLOR:    --color-myname: #hex;    → use as bg-myname, text-myname, border-myname
ADD SPACING:  --spacing-20: 5rem;      → use as p-20, m-20, gap-20
ADD ANIMATE:  --animate-myname: ...;   → use as animate-myname

COLORS (current):
  bg-cream #F7F3EE    — primary surface (80% of pages)
  bg-bone  #EDE8E0    — cards, sections
  bg-blush #F5E8EC    — testimonials only (1/page)
  bg-ink   #1E1B17    — dark sections, footer
  bg-plum  #231728    — CTA buttons, hero bg, dark accents ← NOW DARK AUBERGINE
  bg-plum-deep #180F1E — hover state
  bg-pink  #F942AA    — script accents, hairlines only
  bg-violet-soft #F3EBF5 — soft tinted sections
  bg-navy  #1A1A2E    — assessment dark section

FONTS:
  font-[family-name:var(--font-display)]   — Playfair Display (40px+ headings)
  font-[family-name:var(--font-body)]      — DM Sans (body copy, default)
  font-[family-name:var(--font-script)]    — Dancing Script (max 5/page — pending replacement)

COMPONENTS:
  <PlumButton href="/path">CTA</PlumButton>
  <GhostButton href="/path">Secondary</GhostButton>
  <GhostButton variant="light" href="/path">On dark bg</GhostButton>
  <Eyebrow withLine>label above heading</Eyebrow>
  <ScriptAccent className="text-[32px]">accent text</ScriptAccent>
  <FadeIn delay={0.1}>content</FadeIn>
  <PressMarquee />
  <ReadingProgress />
  <CoachingDisclaimer />

LAYOUT:
  container-content  — max-w-[1280px] mx-auto px-6 md:px-12
  container-read     — max-w-[680px] mx-auto px-6
  section-pad        — py-24 md:py-40

CRITICAL RULES:
  NEVER bg-white — always bg-cream
  NEVER WineButton — use PlumButton
  NEVER import @sanity/visual-editing/react in Server Components
  NEVER change URL /sober-muse — only display text changes
  NEVER remove Sanity fallback values
  NEVER ! exclamation marks in copy
  NEVER copy text from martinarink.de verbatim — rewrite in .com voice
```

---

*Martina Rink — Master Production Plan · May 2026 · Confidential*
*Compiled from: client video review (May 1), DOCX v3 plan, full codebase audit, martinarink.de content audit, 2026 Vogue editorial design standards*
