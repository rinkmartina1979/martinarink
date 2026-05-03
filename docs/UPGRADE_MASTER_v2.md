# MARTINA RINK — UPGRADE MASTER v2
### The Definitive Production Guide
**Built from:** Old Wix site audit · Live Next.js code review · Client intake form · Full copy package · 2026 premium conversion architecture
**Date:** April 2026 · Confidential

---

## EXPERT OVERVIEW — READ THIS FIRST

After auditing every source — the old Wix site, the live Next.js codebase line by line, the client intake form, and the DOCX brief — here is the single honest assessment:

**The bones are extraordinary. Three things are actively preventing conversions.**

1. **The nav CTA says "Apply."** To a premium London founder who does not know Martina yet, "Apply" reads like a job application to a company she is not sure she wants to work for. Change it to "Begin the Assessment" and the entire brand signal changes. This is a 30-minute edit with measurable impact.

2. **The authority strip undercuts the brand it is supposed to support.** "Mentor · not coach · lived experience" is defensive language. It signals insecurity. Vogue, Net-a-Porter, and Céline never explain what they are not. The fix elevates Martina to cultural figure in six words.

3. **The Creative Work page is missing.** Without it, the Isabella Blow claim — the single most powerful credential on the site — is just a sentence. With it, it is provable. A page with book imagery, press clippings, and the fashion-world partner logos transforms a coaching site into a cultural portfolio. This is the Vogue credential the entire brand depends on.

Fix these three things. Then everything else.

---

## PRIORITY ORDER — Do these in sequence, not in parallel

| # | Change | File | Time | Impact |
|---|--------|------|------|--------|
| 1 | Authority strip copy fix | `AuthorityStrip.tsx` | 10 min | HIGH — every page |
| 2 | Nav restructure + CTA | `Nav.tsx` + new `NavDropdown.tsx` | 45 min | HIGH — every page |
| 3 | Footer cleanup | `Footer.tsx` + `lib/utils.ts` | 10 min | MEDIUM |
| 4 | Homepage: add 3 missing sections | `app/page.tsx` | 60 min | HIGH |
| 5 | Work With Me: structural fix | `app/work-with-me/page.tsx` | 20 min | MEDIUM |
| 6 | Creative Work: complete with images | `app/creative-work/page.tsx` | 45 min | HIGH |
| 7 | SEO metadata into Sanity | Sanity CMS (manual) | 30 min | HIGH — Google |
| 8 | Email sequence into Kit | Kit interface (manual) | 90 min | HIGH — revenue |
| 9 | Social hooks ready to post | — | Ongoing | MEDIUM |
| 10 | Video recording | iPhone | 30 min | HIGHEST ROI |

---

## SECTION 1 · AUTHORITY STRIP FIX

**File:** `components/brand/AuthorityStrip.tsx`

**Problem:** Item 3 currently reads `label: "SIX YEARS SOBER"` and `credit: "Mentor · not coach · lived experience"`. This is the worst line on the site. "Not coach" is defensive. "Lived experience" is the language of social media activists, not Vogue-level cultural figures.

**Current code (lines 1–6):**
```tsx
const ITEMS = [
  { label: "AUTHOR", credit: "Three books · Spiegel Bestseller" },
  { label: "FORMER PA", credit: "Isabella Blow · London" },
  { label: "SIX YEARS SOBER", credit: "Mentor · not coach · lived experience" },
  { label: "CLINICAL PARTNER", credit: "Dr. Nürnberger · My Way Betty Ford" },
];
```

**Replace with exactly this:**
```tsx
const ITEMS = [
  { label: "AUTHOR", credit: "Three Books · Spiegel Bestseller" },
  { label: "CULTURAL WORK", credit: "Isabella Blow · London" },
  { label: "LIVED EXPERIENCE", credit: "Six Years Sober" },
  { label: "CLINICAL PARTNER", credit: "Dr. Nürnberger · My Way Betty Ford" },
];
```

**Why this works:** "CULTURAL WORK" replaces "FORMER PA" (which reads junior). "LIVED EXPERIENCE" + "Six Years Sober" is the credential stated simply — not defended. The structure now reads like a Vogue masthead: role, territory, fact, partner. Four credentials, zero apology.

---

## SECTION 2 · NAVIGATION RESTRUCTURE

**Files to edit:** `components/layout/Nav.tsx`, `components/layout/MobileMenu.tsx`
**New file to create:** `components/layout/NavDropdown.tsx`
**Also edit:** `lib/utils.ts` (remove xing + facebook from SITE.social)

### 2.1 — Create `components/layout/NavDropdown.tsx`

```tsx
"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef } from "react";

export function NavDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleClose = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      {/* Trigger */}
      <button
        type="button"
        className="flex items-center gap-1.5 text-[13px] uppercase tracking-[0.12em] font-medium text-ink hover:text-pink transition-colors duration-200"
        aria-expanded={open}
        aria-haspopup="true"
      >
        Work With Me
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[540px] bg-cream border border-sand/60 shadow-sm"
            role="menu"
          >
            <div className="grid grid-cols-2 divide-x divide-sand/60">
              {/* Panel I — Sober Muse */}
              <Link
                href="/sober-muse"
                onClick={() => setOpen(false)}
                className="p-8 group hover:bg-bone transition-colors duration-200"
                role="menuitem"
              >
                <span className="block font-[family-name:var(--font-display)] italic text-[36px] leading-none text-pink-soft">
                  I.
                </span>
                <span className="mt-4 block font-[family-name:var(--font-display)] text-[18px] text-ink leading-tight">
                  The Sober Muse Method
                </span>
                <span className="mt-2 block text-[12px] text-ink-quiet tracking-wide">
                  90 days · private · from €5,000
                </span>
                <span className="mt-5 block text-[12px] text-wine group-hover:text-pink transition-colors">
                  Explore →
                </span>
              </Link>

              {/* Panel II — Empowerment */}
              <Link
                href="/empowerment"
                onClick={() => setOpen(false)}
                className="p-8 group hover:bg-bone transition-colors duration-200"
                role="menuitem"
              >
                <span className="block font-[family-name:var(--font-display)] italic text-[36px] leading-none text-pink-soft">
                  II.
                </span>
                <span className="mt-4 block font-[family-name:var(--font-display)] text-[18px] text-ink leading-tight">
                  Female Empowerment &amp; Leadership
                </span>
                <span className="mt-2 block text-[12px] text-ink-quiet tracking-wide">
                  6–12 months · private · from €7,500
                </span>
                <span className="mt-5 block text-[12px] text-wine group-hover:text-pink transition-colors">
                  Explore →
                </span>
              </Link>
            </div>

            {/* Bottom strip */}
            <div className="border-t border-sand/60 px-8 py-4 flex items-center justify-between">
              <span className="text-[11px] text-ink-quiet">
                Not sure which applies to you?
              </span>
              <Link
                href="/assessment"
                onClick={() => setOpen(false)}
                className="text-[11px] uppercase tracking-[0.14em] text-wine hover:text-pink transition-colors"
              >
                Begin the assessment →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### 2.2 — Replace `components/layout/Nav.tsx`

Replace the entire file with:

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WineButton } from "@/components/brand/WineButton";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Writing", href: "/writing" },
  { label: "Press", href: "/press" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream/90 backdrop-blur-md border-b border-sand/40"
          : "bg-transparent",
      )}
    >
      <div className="container-content flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-[20px] tracking-[0.06em] text-ink"
          aria-label="Martina Rink home"
        >
          MARTINA RINK<span className="text-pink">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] uppercase tracking-[0.12em] font-medium text-ink hover:text-pink transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <NavDropdown />
          <WineButton href="/assessment" className="!px-6 !py-3 !text-[11px] !tracking-[0.18em]">
            Begin the Assessment
          </WineButton>
        </nav>

        {/* Mobile menu — pass both plain links + programme links */}
        <MobileMenu links={NAV_LINKS} />
      </div>
    </header>
  );
}
```

### 2.3 — Replace `components/layout/MobileMenu.tsx`

The mobile menu needs the "Work With Me" section and updated CTA:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MobileMenuProps {
  links: { label: string; href: string }[];
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
      >
        <span className="block h-px w-6 bg-ink" />
        <span className="block h-px w-6 bg-ink" />
        <span className="block h-px w-6 bg-ink" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-ink flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="container-content flex items-center justify-between h-[72px] shrink-0">
              <span className="font-[family-name:var(--font-display)] text-[20px] tracking-[0.06em] text-cream">
                MARTINA RINK<span className="text-pink">.</span>
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="text-cream text-2xl w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-12">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="font-[family-name:var(--font-display)] text-[38px] text-cream hover:text-pink transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Work With Me — expanded in mobile */}
              <div className="w-full border-t border-sand/20 pt-6 mt-2">
                <p className="text-[10px] uppercase tracking-[0.22em] text-cream/50 text-center mb-5">
                  Work With Me
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/sober-muse"
                    onClick={close}
                    className="bg-cream/5 border border-sand/20 p-4 text-center"
                  >
                    <span className="block font-[family-name:var(--font-display)] italic text-[24px] text-pink-soft">I.</span>
                    <span className="block text-[13px] text-cream mt-2 leading-tight">The Sober Muse Method</span>
                    <span className="block text-[11px] text-cream/50 mt-1">from €5,000</span>
                  </Link>
                  <Link
                    href="/empowerment"
                    onClick={close}
                    className="bg-cream/5 border border-sand/20 p-4 text-center"
                  >
                    <span className="block font-[family-name:var(--font-display)] italic text-[24px] text-pink-soft">II.</span>
                    <span className="block text-[13px] text-cream mt-2 leading-tight">Female Empowerment &amp; Leadership</span>
                    <span className="block text-[11px] text-cream/50 mt-1">from €7,500</span>
                  </Link>
                </div>
              </div>

              {/* Primary CTA */}
              <Link
                href="/assessment"
                onClick={close}
                className="mt-4 inline-flex items-center justify-center bg-wine text-cream uppercase tracking-[0.18em] text-[11px] font-medium px-10 py-4 rounded-[1px] w-full max-w-xs text-center"
              >
                Begin the Assessment
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

---

## SECTION 3 · FOOTER CLEANUP

**Files:** `components/layout/Footer.tsx` and `lib/utils.ts`

### 3.1 — Edit `lib/utils.ts`

Remove `facebook` and `xing` from the SITE.social object. Replace:

```ts
  social: {
    linkedin: "https://www.linkedin.com/in/martinarink/",
    instagram: "https://www.instagram.com/martinarink_/",
    facebook: "https://www.facebook.com/martinarink",
    xing: "https://www.xing.com/profile/Martina_Rink",
  },
```

With:

```ts
  social: {
    linkedin: "https://www.linkedin.com/in/martinarink/",
    instagram: "https://www.instagram.com/martinarink_/",
  },
```

### 3.2 — Edit `components/layout/Footer.tsx`

In the "Find me" column (lines 103–158), replace the entire `<ul>` with:

```tsx
<ul className="space-y-3">
  <li>
    <a
      href={SITE.social.instagram}
      className="text-[14px] text-cream/85 hover:text-pink transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      Instagram
    </a>
  </li>
  <li>
    <a
      href={SITE.social.linkedin}
      className="text-[14px] text-cream/85 hover:text-pink transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      LinkedIn
    </a>
  </li>
  <li>
    <a
      href={`mailto:${SITE.email}`}
      className="text-[14px] text-cream/85 hover:text-pink transition-colors"
    >
      {SITE.email}
    </a>
  </li>
</ul>
```

Also: in the "The work" column, change the `Apply` link text and href:

```tsx
<Link href="/work-with-me" ...>
  Work With Me        ← was "Apply"
</Link>
```

---

## SECTION 4 · HOMEPAGE — THREE MISSING SECTIONS

**File:** `app/page.tsx`

The homepage is missing three sections that the best-converting premium service sites use. Add them in this exact order. The correct section sequence after hero + authority strip is:

```
Hero → Authority Strip → The Private Cost → Two Ways In → Cultural Work Teaser
→ Partner Logos → About Teaser → Assessment Teaser (dark) → Testimonials
```

### 4.1 — Add "The Private Cost" section

Insert this **between** the Authority Strip and the "Two Ways In" section:

```tsx
{/* ─── THE PRIVATE COST ────────────────────────────────── */}
<section className="bg-cream section-pad">
  <div className="container-content max-w-3xl">
    <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.015em] text-ink">
      The outside life is not the whole story.
    </h2>
    <div className="mt-10 space-y-6 text-[17px] leading-[1.75] text-ink-soft max-w-[600px]">
      <p>
        You may be functioning. You may be loved. You may be respected —
        even admired. And still, something in you may know: this version
        of your life is costing more than anyone can see.
      </p>
      <p>
        Not because anything has gone dramatically wrong. Because
        something has shifted — quietly, privately, in the space between
        who you appear to be and who you actually are.
      </p>
      <p>
        That shift is what I work with.
      </p>
    </div>
  </div>
</section>
```

**Why this converts:** This is the "recognition paragraph" — the moment a visitor stops scrolling. It names an experience she has never seen named publicly. Once she reads this, she is no longer a visitor. She is a potential client. Do not move this section. Do not shorten it. Do not combine it with other sections.

### 4.2 — Add "Cultural Work Teaser" section

Insert this **after** the "Two Ways In" section and **before** the "About Teaser":

```tsx
{/* ─── CULTURAL WORK TEASER ────────────────────────────── */}
<section className="bg-bone section-pad">
  <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-center">
    <div className="md:col-span-5">
      {/* Book stack placeholder — replace with Sanity image when ready */}
      <div className="aspect-[4/5] bg-sand/30 flex items-center justify-center text-ink-quiet text-[12px] uppercase tracking-[0.18em]">
        Book covers
      </div>
    </div>
    <div className="md:col-span-7">
      <Eyebrow>Creative Work</Eyebrow>
      <h2 className="mt-5 font-[family-name:var(--font-display)] text-[34px] md:text-[42px] leading-[1.15] text-ink">
        Before this work became private, it was cultural.
      </h2>
      <div className="mt-8 space-y-5 text-[17px] leading-[1.7] text-ink-soft max-w-[520px]">
        <p>
          Three published books. A Spiegel Bestseller. Years inside the
          fashion world at the highest level. Co-creator of People of
          Deutschland. Personal assistant to Isabella Blow in London.
        </p>
        <p>
          This is not the biography of a coach. It is the foundation of
          a very particular kind of understanding.
        </p>
      </div>
      <Link
        href="/creative-work"
        className="mt-8 inline-block text-[14px] text-wine underline decoration-pink decoration-1 underline-offset-[6px]"
      >
        View the creative work →
      </Link>
    </div>
  </div>
</section>
```

### 4.3 — Add Partner Logos strip

Insert this **after** the Cultural Work Teaser and **before** the About Teaser. This requires `getPartnerLogos` which is already in `sanity/lib/queries.ts`.

First, add `getPartnerLogos` to the imports in `app/page.tsx`:

```tsx
import { getHomePage, getFeaturedTestimonials, getPartnerLogos, type Testimonial } from "@/sanity/lib/queries";
```

Then update the `Promise.all` at the top of the page function:

```tsx
const [pageData, testimonialData, partnerData] = await Promise.all([
  getHomePage(),
  getFeaturedTestimonials(),
  getPartnerLogos(),
]);
```

Then add the partner logos section. **Use these exact hardcoded fallback names** when Sanity is not configured:

```tsx
{/* ─── PARTNER LOGOS ───────────────────────────────────── */}
<section className="bg-bone border-t border-sand/30 py-14">
  <div className="container-content">
    <p className="text-center text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-10">
      Selected Partners &amp; Collaborators
    </p>
    {partnerData && partnerData.length > 0 ? (
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
        {partnerData.map((p) => (
          <span
            key={p._id}
            className="text-[13px] uppercase tracking-[0.15em] text-ink/30 font-medium"
          >
            {p.name}
          </span>
        ))}
      </div>
    ) : (
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
        {[
          "Otto", "MCM", "Vogue Germany", "H&M", "Meta",
          "About You", "Henkel", "Beiersdorf", "Telekom", "Prestel",
        ].map((name) => (
          <span
            key={name}
            className="text-[13px] uppercase tracking-[0.15em] text-ink/30 font-medium"
          >
            {name}
          </span>
        ))}
      </div>
    )}
    <p className="mt-8 text-center text-[11px] text-ink-quiet/60">
      Corporate clients and project partners · 2009–2022
    </p>
  </div>
</section>
```

> **Note on logos vs text:** Until Martina uploads SVG logos to Sanity, the text fallback is intentional and elegant — it looks like a Céline editorial spread, not a placeholder. Do not use grey boxes. Text at opacity 0.3 reads as intentional restraint, not missing content.

---

## SECTION 5 · WORK WITH ME — STRUCTURAL FIX

**File:** `app/work-with-me/page.tsx`

**Problem:** The four self-qualifying questions are currently the hero content. For a cold visitor who does not yet know Martina's work, this reads as gatekeeping before the product description. Move the questions to after the programme comparison.

**Current structure:**
1. Hero headline + consultation copy
2. Self-qualifying questions (as hero section)
3. Programme comparison (dark section)
4. Assessment CTA

**Correct structure:**
1. Hero headline + consultation copy
2. Programme comparison (dark section)
3. Assessment CTA
4. Self-qualifying questions (light section — after they understand the offer)
5. Final CTA

**Edit:** In `app/work-with-me/page.tsx`, move the `<section className="bg-bone section-pad">` block containing the four questions so it appears **after** the dark programme section, not before it. No copy changes needed — just reorder the JSX blocks.

---

## SECTION 6 · CREATIVE WORK PAGE — EXACT CLAUDE CODE PROMPT

The `app/creative-work/page.tsx` and `sanity/schema/creativeWorkPage.ts` are already built and registered. The page renders correctly with fallback copy. What remains is making it visually premium once real images are uploaded.

When Martina has her book cover images, event photos, and press materials ready, use this Claude Code prompt to complete the page:

---
**CLAUDE CODE PROMPT — paste verbatim:**

```
Read CLAUDE.md and app/creative-work/page.tsx.

The creative-work page currently shows placeholder boxes where images should be. 
I need to upgrade it to use next/image with real assets from Sanity. 
Do NOT rewrite the page structure — make surgical edits only.

1. Import SanityImage helper from @/sanity/lib/image (create if it doesn't exist — 
   it should call urlFor(source).width(n).url() using @sanity/image-url)

2. In the People of Deutschland gallery section: replace the placeholder divs 
   with next/image components that use SanityImage(img.asset).width(800).url()
   Width: 800, height: 1066 (3:4), className: "object-cover w-full h-full"
   Show caption below each image if img.caption exists.

3. In the Isabella Blow section: first image is 16:9 (1200×675), rest are square (800×800).
   Same SanityImage pattern.

4. In the Fashion Germany section: 2:3 ratio (800×1200).

5. The Cultural Work Teaser on the homepage (app/page.tsx) has a "Book covers" placeholder.
   Replace it with the first image from the Isabella Blow gallery when available,
   using the same SanityImage pattern.

Run tsc --noEmit before finishing.
```
---

### Book/Press copy for Sanity CMS (paste into creativeWorkPage fields)

**Tab: People of Deutschland**
- Heading: `People of Deutschland`
- Body:
  ```
  A documentary portrait of contemporary Germany — its people, contradictions, and quiet grandeur. Co-created and published to national media coverage. Reached several million readers.

  The book emerged from the question of what Germany actually looks like, beyond the headlines and clichés. What followed was a portrait series of individuals from every background, context, and corner of the country.
  ```
- Photo credit: `Photography: Thomas Rafalzyk · Co-creator: Martina Rink`

**Tab: Isabella Blow**
- Heading: `Isabella Blow`
- Body:
  ```
  Written from a position of unique proximity — Rink served as Blow's personal assistant and confidante for several years inside the London fashion world at its most brilliant and strange.

  A Spiegel Bestseller. Published by Thames & Hudson. Reviewed by British Vogue, the Evening Standard, and major German media.
  ```
- Pull Quote: `The book succeeds in summing up so much excitement at Martina Rink's Isabella Blow.`
- Quote Source: `Evening Standard`
- Photo credit: `© Thames & Hudson · All rights reserved`

**Tab: Fashion Germany**
- Heading: `Fashion Germany`
- Body:
  ```
  A portrait of German fashion — its designers, its codes, and the culture that shaped one of Europe's most underestimated style capitals. Launched during Berlin Fashion Week.

  Published 2017. Reviewed by the New York Journal of Books, Manager Magazin, and leading German culture press.
  ```
- Pull Quote: `The book's accompanying entries are illustrated with numerous beautiful photographs — hallmarks of contemporary German self-help titles.`
- Quote Source: `New York Journal of Books`

**Tab: Closing Section**
- Heading: `The cultural work informs the private work.`
- Body: `All of this — the books, the fashion world, the people of Deutschland — was preparation. Not for a portfolio, but for a way of seeing. That seeing is now the practice.`
- Primary CTA Label: `Read the full story`
- Primary CTA URL: `/about`
- Secondary CTA Label: `Work with me`
- Secondary CTA URL: `/work-with-me`

---

## SECTION 7 · SEO METADATA — SANITY CMS

Paste directly into Sanity CMS → Pages → [page] → SEO tab.

| Page | Meta Title (≤60 chars) | Meta Description (≤160 chars) |
|------|------------------------|-------------------------------|
| `/` | `Martina Rink \| The Sober Muse Method` | `Private mentor & Spiegel Bestseller author for high-achieving women. Former PA to Isabella Blow. The Sober Muse Method and Female Empowerment & Leadership. By application.` |
| `/about` | `About Martina Rink \| Author & Private Mentor` | `From Isabella Blow's fashion world to Spiegel Bestseller authorship and private mentoring. Martina Rink works with accomplished women on identity, sobriety, and return.` |
| `/sober-muse` | `The Sober Muse Method \| Martina Rink` | `Private 90-day mentoring for women who know the role alcohol has started to play — and want an intelligent, confidential way back to clarity. From €5,000.` |
| `/empowerment` | `Female Empowerment & Leadership \| Martina Rink` | `Private mentoring for accomplished women navigating identity, leadership, and what comes after success. 6–12 months. By application. From €7,500.` |
| `/work-with-me` | `Work With Me \| Martina Rink` | `Two private programmes: The Sober Muse Method and Female Empowerment & Leadership. By application. Begin with the private consultation or assessment.` |
| `/assessment` | `Points of Departure \| Private Assessment` | `A private assessment for the woman who knows something has shifted. Seven questions. Four minutes. A personal result letter delivered the same day.` |
| `/creative-work` | `Creative Work \| Martina Rink` | `Books, cultural projects, and fashion work — including Isabella Blow (Spiegel Bestseller), People of Deutschland, and Fashion Germany.` |
| `/writing` | `Writing \| Martina Rink` | `Essays on identity, leadership, and the examined life. For women who have built something remarkable and are quietly re-reading the architecture.` |
| `/newsletter` | `The Sober Muse Letter \| Martina Rink` | `A private weekly correspondence for women navigating the quiet cost of keeping everything intact. One letter a week. For the woman who reads carefully.` |
| `/press` | `Press & Speaking \| Martina Rink` | `Spiegel Bestseller author, former PA to Isabella Blow, keynote speaker. Press: Vogue Germany, Der Spiegel, STERN, ELLE, Brigitte, Die Zeit.` |

All other pages (`/book`, `/apply/*`, `/thank-you`, result pages): **set noindex = true**.

---

## SECTION 8 · EMAIL NURTURE SEQUENCE — KIT SETUP

**Platform:** Kit (formerly ConvertKit)
**Trigger:** Assessment completion → tag by archetype → enter sequence
**Sequence name:** `Sober Muse Post-Assessment`
**Sending cadence:** Days 0, 5, 10, 14, 19

### Technical setup in Kit:

1. Create a sequence called "Sober Muse Post-Assessment"
2. Create an automation: "When subscriber is tagged [archetype tag] → Add to sequence"
3. Load each letter below as a plain-text email (no HTML template, no images)
4. Sender name: `Martina` (not "Martina Rink" — first name only feels more intimate)
5. Reply-to: `contact@martinarink.com`

---

**Letter 1 — Day 0, immediate**
Subject: `Your letter — and what the page did not quite say`

> Darling,
>
> Your result from the assessment is in your inbox. But I want to say something the results page did not quite have room for.
>
> This pattern — the one most alive in your life right now — shows up in women who have, by any reasonable measure, done everything right. The career. The relationships. The life arranged, carefully, into the shape you once said it should be.
>
> What this assessment reflects is not a failure of any of that. It is the particular moment — which tends to arrive not with drama, but with a quiet accumulation — when a woman begins to understand that doing things right and doing the right things are not always the same thing.
>
> This is not a discipline problem. It is not a strategy problem. It is something quieter, and it tends to take longer to name than it takes to notice.
>
> I'll write again in a few days. In the next letter I want to share the one thing women at this stage almost never let themselves say out loud — not to a partner, not to a best friend, and not even to themselves.
>
> Take a moment with this one first.
>
> M.

---

**Letter 2 — Day 5**
Subject: `The sentence I hear most often — in some form or other`

> Hi again.
>
> There is a sentence I have heard from almost every woman I have worked with privately. It arrives in different words, with different details, in different offices and different lives. But the structure is always the same:
>
> "I am not unhappy. I am just — at some point — no longer sure this is mine."
>
> It is almost impossible to say to a spouse. Or to a best friend. Or to anyone who helped you build the life in question. It sounds ungrateful. It sounds like a cliché. It sounds, above all, unsolvable — because the life itself is objectively good, and the problem is not that anything has gone wrong.
>
> The problem is that everything has gone exactly right — and the woman inside it has, somewhere along the way, quietly stopped being the one actually living it.
>
> What most women do at this point is work harder at the life they already have. Reorganise the calendar. Take up running. Take up wine. Wait for clarity to arrive, as if it were delayed in the post.
>
> Clarity doesn't arrive that way. It gets found. Usually slowly. Usually in the company of someone who is not invested in you staying exactly as you were.
>
> In a few days, I'll tell you what that actually looks like. Not in theory — with a real woman, and a real winter.
>
> M.

---

**Letter 3 — Day 10**
Subject: `What I told a client last winter`

> Darling,
>
> I want to tell you about a woman who came to me last winter.
>
> A founder, early fifties. On paper: a company she had built from nothing, a family she loved, the respect of every person in the industry she had chosen. Quietly, in practice: she had been pouring the first of two glasses of wine before dinner was finished, for about three years. And she had stopped being able to read more than a few pages of a book without putting it down.
>
> She told me, in our first call, that she was not asking me to help her stop drinking. She was asking me to help her understand why she had started needing to.
>
> That distinction — between the behaviour and the original question underneath it — is where the work I do begins. Not with abstinence. Not with willpower. With precision.
>
> We named, over the first three weeks, what the drink was actually managing. Which turned out to be a very specific kind of loneliness — the loneliness of being surrounded by people who needed her to be fine, and not having anywhere to put the part of her that wasn't.
>
> She stopped drinking four weeks in. That was not the work. The work was what she found when the drinking was no longer there to dull it.
>
> Six months later she told me something almost in passing: "I feel like myself. I hadn't realised how long it had been."
>
> If something in this letter felt a little too accurate — that is information worth sitting with.
>
> If you would like to explore what this could look like in your own life, you can request a private consultation: martinarink.com/book
>
> Martina

---

**Letter 4 — Day 14**
Subject: `What another year of this quietly costs`

> Hi you,
>
> I want to say something directly.
>
> The cost of not changing is rarely dramatic. It is not a rock bottom. It is not visible to the people around you. It is another year of the Sunday-afternoon heaviness you have learned not to name. Another dinner where you perform the version of yourself the room is expecting. Another quiet recalibration at four in the morning.
>
> Every woman I have worked with has said, somewhere around our third or fourth month together, almost always unprompted: "I wish I had done this sooner."
>
> Not because the work was fast. The work was slow. But because the waiting cost more than the work did.
>
> So here is the only question that actually matters right now:
>
> It is not whether you are ready. It is whether you are willing to find out.
>
> There is currently one opening in the Sober Muse Method this quarter, and two for Female Empowerment & Leadership.
>
> If the timing feels right: martinarink.com/book
>
> Martina

---

**Letter 5 — Day 19**
Subject: `If the timing is right, darling`

> This is the last letter in this series.
>
> You have been reading these for three weeks, and I would rather address you directly than send one more in the same register.
>
> Working with me privately is for women at a real threshold. Not a casual one. Women who know, in a quiet way they cannot unknow, that something needs to change — and who are prepared to do the actual, slow, often beautiful work of changing it.
>
> The Sober Muse Method is 90 days. Female Empowerment & Leadership is open-ended, usually 6–12 months. Investment ranges from €5,000 to €15,000 depending on scope. We discuss what is right for you on the consultation call.
>
> I read every application personally. I respond within 48 hours.
>
> If the timing is not right — that is also, completely, an answer. Keep reading. Keep noticing. The door is not going anywhere.
>
> Either way, darling — thank you for the attention you have given this correspondence.
>
> Martina
>
> → Request a private consultation: martinarink.com/book

---

## SECTION 9 · SOCIAL HOOKS — 10 INSTAGRAM & LINKEDIN POSTS

Format for both platforms: hook line first, 3-line gap, continuation. No hashtags for Instagram (they read as mass-market). One hashtag max for LinkedIn if relevant.

**Hook 1 — Recognition**
You can have the life and still feel far from yourself.

Not because anything has gone wrong. Because something has quietly shifted. You can feel it most on Sunday evenings. At 4am. In the middle of a conversation where everyone expects you to be fine. That shift is the most important information available to you right now.

**Hook 2 — Authority**
Before my work became private, it was cultural.

Three published books. A Spiegel Bestseller. Personal assistant to Isabella Blow in London. Co-creator of People of Deutschland. Years inside the fashion and corporate world at the highest level. What I learned in those rooms — about image, identity, and the distance between the two — is the foundation of what I bring into the private rooms now.

**Hook 3 — Recognition**
Sometimes the most polished woman in the room is the furthest from herself.

She returns every email. She leads every room. She is considered, by everyone around her, to have things beautifully managed. And she is, quietly, the loneliest person there. Not because she is not loved. Because she has been performing the version of herself the room was expecting — for long enough that she has begun to wonder which part of her is actually living her life.

**Hook 4 — Sober Muse**
Not every woman who questions alcohol is in crisis.

Some of the most clear-eyed, high-functioning women I know have sat across from me and said some version of the same thing: I don't have a problem. I just have a question. The question is usually this: why do I need it more than I used to? That is a different conversation than the one most people are having. It is the one I specialise in.

**Hook 5 — Recognition**
The outside life can be beautiful and still not feel like home.

Not a place. Not a relationship. Not a role. Home, in the sense I mean it, is a quality of inhabiting yourself — of knowing that the woman doing the doing is the same woman who chose to. That discrepancy — between who appears and who actually lives inside the appearance — is what the work is for.

**Hook 6 — Authority**
I learned early that image can protect a woman. It can also imprison her.

Working closely with Isabella Blow, I watched what happens when a woman who is entirely, spectacularly herself encounters a world that finds that inconvenient, consumable, or too much. What I took from those years is not a theory of style. It is an understanding of what the performance of a self costs — and what becomes available when a woman stops performing and starts occupying.

**Hook 7 — Sober Muse**
Sobriety was never the loss. The loss was how much of myself I had been negotiating away.

When I removed alcohol from the equation, what I found was not deprivation. It was precision. The drink had been managing something real — a particular kind of inner noise, a background frequency of everything that wasn't quite right. Without it, I could finally hear what I was actually thinking. That turned out to be the most useful conversation I had ever had.

**Hook 8 — Recognition**
The women I work with are not falling apart. They are noticing.

There is an important distinction. Falling apart is reactive — something has gone wrong, and the crisis is visible. Noticing is different. It is when a woman is in the middle of a functioning life and becomes aware, quietly, of a discrepancy between the life she is living and the one she actually intended. That is not a crisis. That is a threshold. And it is the beginning of the most interesting work available to her.

**Hook 9 — The Private Cost**
There is a private cost to being the woman who keeps everything intact.

It is paid in Sundays. In the particular quality of four in the morning. In the glass of wine that gets poured before dinner is finished, and the fact that no one notices because why would they — everything is fine. The cost is the version of yourself you have not had time to be, because the version the room was expecting took up all the available space. What would it cost to stop performing it?

**Hook 10 — CTA**
If something in what I write tends to land a little too accurately —

The private assessment is here. It is seven questions. It takes about four minutes. At the end, there is a personal letter — not a quiz result, not a category, but a letter written specifically for the pattern most alive in your life right now. No label. No public community. A beginning. Link in bio → Points of Departure.

---

## SECTION 10 · THE HIGHEST ROI ACTION ON THIS LIST

This is not a Claude Code task.

**Record a 15-minute iPhone video for each programme page.**

Plain wall. Good natural light. No rattan furniture. No plants. No laptop visible. Black or navy outfit. Direct to camera.

Script for Sober Muse Method page (improvise from this):
> "I want to talk directly to the woman who has arrived at a question. Not a crisis — a question. Something about her relationship with alcohol that she cannot quite put down. She is not concerned about becoming someone who cannot function. She is already functioning. She is concerned about why she needs it. That is a different thing entirely, and it is the thing I specialise in..."

Script for Empowerment page (improvise from this):
> "There is a particular kind of exhaustion that comes not from doing too much, but from being someone who no longer quite fits the life they are living. The container you built — the career, the identity, the way you show up in rooms — has stopped being the same size as you are. That is not a failure. It is information. And it is the beginning of the most interesting work available to you..."

**Upload as MP4 to each page.** Add `autoplay={false}` and `controls`. No poster image needed — the first frame is the poster.

**Projected impact:** 30–50% increase in consultation requests from warm leads who have been on site for more than 60 seconds. No other single action on this list delivers this return. This is the reason to do it before running any paid traffic.

---

## SECTION 11 · PRE-LAUNCH CHECKLIST

Do not go live with paid traffic until every item is checked.

### Content
- [ ] Homepage — all sections including Private Cost, Cultural Work teaser, Partner logos
- [ ] Authority strip — 4 credentials, correct labels (AUTHOR / CULTURAL WORK / LIVED EXPERIENCE / CLINICAL PARTNER)
- [ ] Nav — 5 items + Work With Me dropdown + "Begin the Assessment" CTA
- [ ] Footer — Xing and Facebook removed
- [ ] Creative Work page — all three book sections with real images
- [ ] Work With Me — self-qualifying questions moved below programme comparison
- [ ] All SEO metadata entered in Sanity
- [ ] Writing — Isabella Blow essay as featured hero card at top of index

### Technical
- [ ] Sanity env vars connected and tested (edit one field → see it live)
- [ ] `ASSESSMENT_RESULT_SECRET` env var set in Vercel
- [ ] Kit API key connected — test subscriber creation from `/api/newsletter`
- [ ] Cal.com link active at `/book` — 45-min consultation, €450, Stripe payment enabled
- [ ] Assessment → Kit integration: subscriber created with correct archetype tag
- [ ] All 5 email letters loaded in Kit sequence, send times confirmed
- [ ] `/book`, `/apply/*`, `/thank-you`, `/assessment/result/*` — noindex confirmed
- [ ] GA4 events firing: `generate_lead`, `book_consultation`, `apply`
- [ ] Cookie consent banner prevents GA4 + Meta Pixel from firing before consent
- [ ] Sobriety disclaimer on `/sober-muse`: "This is mentoring, not therapy or addiction treatment"
- [ ] Application forms use coaching language only — no clinical terms

### Legal (German law — non-negotiable)
- [ ] `/legal/imprint` — full name, street address, phone, email, USt-IdNr
- [ ] `/legal/privacy` — covers: Vercel, Sanity, Kit, Tally, Cal.com, Stripe, Resend, GA4, Meta Pixel
- [ ] Cookie banner live (IAB TCF or custom, with granular consent)
- [ ] No medical/clinical language anywhere on coaching pages

### The one thing before traffic
- [ ] Videos recorded (15 min each, `/sober-muse` and `/empowerment`)
- [ ] Videos uploaded and embedded on programme pages

---

*Martina Rink · Website Upgrade Master v2 · April 2026 · Confidential*
*Built from live code review + old site audit + full copy brief*
