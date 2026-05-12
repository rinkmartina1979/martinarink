# Martina Rink — Website Upgrade Plan
## Based on: Client Video Review (May 1, 2026) + martinarink.de Content Audit
## Status: MASTER REFERENCE — update as items are completed

---

## VIDEO TRANSCRIPT SUMMARY
*Martina's exact words with page/section context*

| Time | Quote | Page | Section |
|------|-------|------|---------|
| 00:00–00:15 | "Make the main heading bigger. All copy we do together on a big call." | Home | Hero |
| 00:16–00:21 | "Image is missing here. I would like to have it plum purple." | Home | Hero background |
| 00:21–00:47 | "I don't know why Writing is first. Reorder: About → Work With Me → Press → Writing. Press content from old website." | Site-wide | Nav menu |
| 00:48–01:17 | "Welcome home love — not very premium English, not very elegant. We have to think about that." | Home | Tagline |
| 01:18–02:00 | "I've done FOUR books. Dr. Nürnberger — she's not a doctor, so Mrs. Nürnberger. Need to clear if I can use her name." | Home | Credentials strip |
| 02:01–02:45 | "7,000 for 6–12 months, I don't know if that's not too expensive. 5,000 is okay. We can do some research." | Work With Me | Investment |
| 02:46–03:14 | "Please get book covers from old website." | Writing | Published Work |
| 03:15–03:31 | "I would like to call it 'The Sober Muse' — more powerful." | Site-wide | Programme name |
| 03:32–03:45 | "Is it possible to move those like a teleprompter? So they come after each other." | Home | Press logo strip |
| 03:46–04:12 | "I don't have a client called Clara. Are those my real client responses?" | Home | Testimonials |
| 04:13–04:34 | "I like this with the pink. Footer: Ibiza, Berlin, World — probably better." | Site-wide | Footer |
| 04:35–05:12 | "Contact email should be coaching@martinarink.com. Terms/Imprint — is that all my text?" | Site-wide | Legal + Contact |
| 05:13–05:32 | "Website is now in English. We have to do it in German as well, but that's the next step." | Site-wide | Architecture (future) |
| 05:33–06:22 | "Isabella Blow goes first — more successful. Fashion Germany is less successful." | Writing | Books order |
| 06:23–06:35 | "I'm not a keynote speaker yet. Panel guest maybe? How about that?" | Press | Speaking title |
| 06:36–06:58 | "Maybe the three phases can turn pink when we scroll over? Catchier phase names?" | Sober Muse | Process section |
| 06:59–07:10 | "The copy, the captions — we go through together on a call." | Site-wide | Copy review |
| 07:11–07:44 | "I don't like this color anymore. Maybe plum again? I like plum much more — more elegant." | Sober Muse | Quote block bg |
| 07:45–08:14 | "This handwriting doesn't look premium. Other handwritten lookalike options maybe?" | Site-wide | Script font |
| 08:15–08:55 | "I'm gonna send you an email about what is important from the old website. Images from old site." | Site-wide | Assets |

---

## CHANGE REGISTER — 27 ACTION ITEMS

### PRIORITY 1 — DO BEFORE NEXT CLIENT CALL

---

#### CHANGE 01 — Navigation menu reorder
**File:** `components/layout/Nav.tsx`
**Current order:** About | Writing | Press | Work With Me
**New order:** About | Work With Me | Press | Writing
**Notes:** Martina wants Work With Me elevated closer to the brand entry point. Writing demoted to last.

---

#### CHANGE 02 — Programme name: "Sober Muse" → "The Sober Muse" (global)
**Files:** `app/page.tsx`, `app/sober-muse/page.tsx`, `components/layout/Nav.tsx`, `components/layout/Footer.tsx`, `lib/metadata.ts`, `sanity/` schema files
**Find:** `Sober Muse`
**Replace:** `The Sober Muse`
**Exception:** URL slug `/sober-muse` stays the same (changing URLs breaks SEO + links)
**Notes:** Update display text everywhere. Keep the URL path unchanged.

---

#### CHANGE 03 — Hero section: plum purple background
**File:** `app/page.tsx`
**Section:** Hero / above-the-fold area
**Current:** Cream background with ink text
**New:** Dark aubergine / plum purple background (`#231728`) with cream text
**Color token:** `bg-plum` (after the color change in CHANGE 04 below)
**Notes:** Martina said at 00:16–00:21: "I would like to have it plum purple."

---

#### CHANGE 04 — Color token: update plum to dark aubergine
**File:** `app/globals.css`
**Current values:**
```css
--color-plum:      #5C2D8E;
--color-plum-deep: #451F6B;
--color-wine:      #5C2D8E;  /* legacy alias */
--color-wine-deep: #451F6B;  /* legacy alias */
```
**New values:**
```css
--color-plum:      #231728;
--color-plum-deep: #180F1E;
--color-wine:      #231728;
--color-wine-deep: #180F1E;
```
**Why:** Client approved dark aubergine swatch (image shared in chat). She said at 07:11–07:44: "I like plum much more now, it's more elegant."

---

#### CHANGE 05 — Remove / replace "welcome home love" tagline
**File:** `app/page.tsx`
**Current:** Script font tagline "welcome home love" in hero
**Action:** Remove completely OR replace with a short premium alternative
**Suggested alternatives (for client approval on call):**
- *(leave blank — let the hero stand alone)*
- "for the woman who has arrived."
- "privately. by application."
- *(italic em dash — silence as punctuation)*
**Notes:** Martina said: "Not very premium English, not very elegant." This is a brand voice call — do not change copy without her sign-off. Mark as PLACEHOLDER until copy call.

---

#### CHANGE 06 — Credentials strip: fix "Dr. Nürnberger" + add 4th book
**File:** `app/page.tsx`
**Section:** Authority/credentials strip (Der Spiegel, Brigitte... section)
**Changes:**
1. Change `Dr. Nürnberger` → `Mrs. Nürnberger` *(pending her approval to use name at all — see PENDING 01)*
2. Update books count: currently shows "Three Books" → check if 4th book exists and what it is *(see PENDING 02)*
3. Add `LIVED EXPERIENCE: Six years sober` as explicit credential if not already present
**Notes:** Martina flagged this at 01:18–02:00.

---

#### CHANGE 07 — Contact email: coaching@martinarink.com
**Files:** `components/layout/Footer.tsx`, `app/contact/page.tsx`, `app/press/page.tsx`, any mailto: links
**Current:** `contact@martinarink.com`
**New:** `coaching@martinarink.com`
**Notes:** Martina said at 04:35–05:12. Check whether the domain/inbox actually exists before going live. If not set up yet, keep current until confirmed.
**⚠️ CONFIRM:** Does `coaching@martinarink.com` inbox exist?

---

#### CHANGE 08 — Footer location string
**File:** `components/layout/Footer.tsx`
**Current:** `Martina · Author · Mentor · Ibiza · Berlin`
**New:** `Martina · Author · Mentor · Ibiza · Berlin · World`
**Notes:** Martina said at 04:13: "World, I think, probably better."

---

#### CHANGE 09 — Speaking title: Keynote → Panel Guest
**Files:** `app/press/page.tsx`, `lib/metadata.ts`, any schema/bio copy
**Current:** "Keynote · Panel chair · Intimate fireside conversation · Podcast guest"
**New:** Remove "Keynote" — use "Panel guest · Fireside conversation · Podcast guest"
**Notes:** Martina at 06:23: "I'm not a keynote speaker yet. Panel guest maybe?"

---

#### CHANGE 10 — Books section: reorder by success
**File:** `app/writing/page.tsx` or wherever published works are displayed
**New order:**
1. **Isabella Blow** *(Spiegel Bestseller — lead position)*
2. **People of Deutschland** *(national media coverage)*
3. **Fashion Germany**
4. **4th book** *(TBC — see PENDING 02)*
**Notes:** Martina at 05:33–06:22: "Isabella Blow goes there because this is more successful. Fashion Germany is less successful."

---

#### CHANGE 11 — Book covers: pull images from martinarink.de
**Action:** Download/source the three book cover images currently shown on martinarink.de
**Target path:** `public/images/books/`
**Files needed:**
- `isabella-blow-cover.jpg`
- `people-of-deutschland-cover.jpg`
- `fashion-germany-cover.jpg`
**Source:** `https://martinarink.de` (visible in press/creative-work section)
**Notes:** Martina at 02:46: "Please get book covers from old website." Use `next/image` with explicit width/height.

---

#### CHANGE 12 — Press logos: add scrolling marquee animation
**File:** `app/page.tsx` or dedicated `PressLogos` component
**Current:** Static horizontal row of logos (Der Spiegel, Brigitte, STERN, Vogue Germany, Die Zeit...)
**New:** Infinite horizontal scroll / "teleprompter" marquee — logos slide from right to left continuously, loops seamlessly
**Implementation notes:**
- Use CSS `@keyframes marquee` with `translateX` — no JS required
- Duplicate the logo list so the loop appears seamless
- Pause on hover (`animation-play-state: paused`)
- Speed: ~30s per full loop (adjust to taste)
- Add ELLE Germany and Süddeutsche Zeitung to the logo list (present on press page, missing from homepage)
**Notes:** Martina at 03:32–03:45: "Is it possible to move those so it's kind of like a teleprompter?"

---

#### CHANGE 13 — Testimonials: verify / replace placeholders
**File:** `app/page.tsx`
**Current testimonials to verify:**
- "Clara · Founder · London" — Martina: "I don't have a client called Clara"
- "Armina · Patent Engineer" — this IS a real client (same in martinarink.de)
**Action:**
- Keep Armina testimonial ✓
- Replace Clara testimonial with a real client quote, OR remove entirely until real quotes are approved
- Mark as PLACEHOLDER in code with comment until client provides real quotes
**Notes:** Martina at 03:46: "Are those my real client responses? Let me know."
**⚠️ PENDING:** Client to provide real testimonial to replace Clara.

---

#### CHANGE 14 — Phase hover effect: pink on hover
**File:** `app/sober-muse/page.tsx`
**Section:** "Three Phases. Ninety Days." process cards
**Current:** Static cards — Phase One, Phase Two, Phase Three
**New:** On hover, card background transitions to `bg-pink-soft` (#FDBFE2) or `border-pink` — with `transition-colors duration-300`
**Notes:** Martina at 06:36: "Maybe this can kind of turn pink when we scroll over it?"

---

#### CHANGE 15 — Phase names: catchier titles
**File:** `app/sober-muse/page.tsx`
**Current names:**
- Phase One — Weeks 1–3: **Naming**
- Phase Two — Weeks 4–9: **Clearing**
- Phase Three — Weeks 10–12: **Return**
**Suggested alternatives (for client approval on call):**
- **The Inventory** / **The Archaeology** / **The Recognition**
- **The Unravelling** / **The Work** / **The Clearing**
- **The Return** / **The Reclamation** / **The Arrival**
**Notes:** Martina at 06:36: "Catchier names, titles?" — finalize on copy call.

---

#### CHANGE 16 — Quote block background: pink → plum
**File:** `app/sober-muse/page.tsx` (and empowerment page)
**Section:** Pull-quote / testimonial blocks with colored backgrounds
**Current:** Pink / blush (`bg-blush` or `bg-pink-soft`) background
**New:** Plum / dark aubergine (`bg-plum`) with cream text
**Notes:** Martina at 07:11: "I don't like this color anymore. Maybe it could just be this plum again? I like plum much more — more elegant."

---

#### CHANGE 17 — Script font: Dancing Script → premium alternative
**File:** `app/globals.css`, `lib/fonts.ts`
**Current:** Dancing Script (Google Fonts)
**Issue:** Martina at 07:45: "Doesn't look premium. Other handwritten lookalike options."
**Candidate replacements to present to client (all via next/font Google):**
1. **Cormorant SC** — ultra-elegant, editorial, fashion-adjacent
2. **Playfair Display** italic — already loaded, zero cost, refined
3. **Bodoni Moda** italic — Vogue-adjacent, high fashion
4. **Italiana** — thin, sophisticated
5. **Pinyon Script** — calligraphic, not childish
6. **Alex Brush** — refined, thin strokes
**Action:** Build a font-preview page `/dev/fonts` showing all candidates with "welcome home love" and real copy samples. Present to Martina on call.

---

#### CHANGE 18 — Pricing: empowerment programme review
**File:** `app/empowerment/page.tsx`, `app/work-with-me/page.tsx`, `CLAUDE.md` pricing reference
**Current:** from €7,500 (6–12 months)
**Martina's concern:** Her own coach charges €7,000 with more experience — she feels €7,500 may be too high
**Options to discuss on call:**
- Drop to from €5,000 (matches Sober Muse, simpler messaging)
- Drop to from €6,000 (compromise, still premium)
- Keep €7,500 but reframe value (positioning work)
- Research: comparable executive coaches in DE/Europe at this level
**Action:** Do NOT change until call. Flag in code with `// TODO: pricing TBC`

---

---

### PRIORITY 2 — CONTENT FROM MARTINARINK.DE TO MIGRATE

---

#### CHANGE 19 — Add Spotify podcast link
**File:** `components/layout/Footer.tsx`, `app/about/page.tsx`
**Source:** martinarink.de has Spotify linked: `open.spotify.com/show/4ibhGsWMIZMTBBPNQqlmTv`
**Action:** Add Spotify icon/link to footer social row alongside Instagram and LinkedIn

---

#### CHANGE 20 — Add Facebook link
**File:** `components/layout/Footer.tsx`
**Source:** `facebook.com/profile.php?id=100036393132922`
**Action:** Add Facebook icon/link to footer (currently only Instagram + LinkedIn)
**Note:** Check if Martina still actively uses it — if the page is inactive, may omit

---

#### CHANGE 21 — Phone number on Press/Contact page
**File:** `app/press/page.tsx`, `app/contact/page.tsx`
**Value:** +49 (0) 172 174 1499
**Source:** martinarink.de contact page (already showing on martinarink.com/press — verify it's live)

---

#### CHANGE 22 — CV download
**File:** `app/about/page.tsx` or new dedicated section
**Source:** martinarink.de offers a CV download
**Action:** Add downloadable CV PDF — source the PDF from Martina (she will send)
**Path:** `public/downloads/martina-rink-cv.pdf`

---

#### CHANGE 23 — Literary agent details (more prominent)
**File:** `app/press/page.tsx`
**Content:** Elisabeth Ruge Agentur GmbH · Rosenthaler Str. 34/35 · 10178 Berlin · info@elisabeth-ruge-agentur.de · +49 30 2888 406 00
**Current:** Already on press page. Make more visually prominent — dedicated "Literary Representation" card/block.

---

#### CHANGE 24 — Legal pages: sync with martinarink.de data
**Files:** `app/legal/imprint/page.tsx`, `app/legal/terms/page.tsx`
**Missing/check items from martinarink.de:**
- Legal entity: **Martina Rink UG (haftungsbeschränkt)** (also known as Concept Studio Martina Rink)
- Commercial register: HRB 21885, Amtsgericht Traunstein
- VAT: DE 283558251
- Tax ID: 34/411/11000 (Finanzamt Karlsruhe)
- IBAN / bank: Sparkasse Karlsruhe — only in Imprint if legally required (usually omit for privacy)
- Address: Steinkreuzstr. 26b, 76228 Karlsruhe
**Notes:** Martina at 04:35: "Is that all of the text? I think it's not yet." — complete legal text needs review.

---

#### CHANGE 25 — Press page: add media outlet logos + article screenshots
**File:** `app/press/page.tsx`
**Missing outlets from martinarink.com press page (present on .de):**
- ELLE Germany *(logo + any article)*
- Süddeutsche Zeitung *(logo + any article)*
- Manager Magazin *(logo + any article)*
**Action:** Source logos + any article screenshots from martinarink.de; add to press grid.

---

#### CHANGE 26 — About page: enrich personal background
**File:** `app/about/page.tsx`
**Missing detail from martinarink.de (in Martina's voice, no banned words):**
- Persian roots / adopted by German parents / grew up in Germany and London
- Boarding school background and how substance use entered her world early
- The specific Isabella Blow detail: working with Alexander McQueen's mentor gave her a particular lens
- "What was your favourite trip? And when was the last time you were on the road to yourself?" *(reflective question — very powerful)*
- "Sobriety activist" as a credential / identity marker
**Note:** Copy must be rewritten in martinarink.com voice — NO "transformation", "journey", "healing", "amazing", or "!" — before going live.

---

#### CHANGE 27 — German language version (FUTURE PHASE)
**Scope:** Full site translation into German
**Architecture options:**
1. Next.js i18n routing — `/de/` prefix for German pages
2. Separate subdomain `de.martinarink.com` or path `/de`
3. Language toggle in Nav
**Martina's note:** "That's the next step. I'm thinking aloud." — not urgent.
**Action:** Plan the architecture now. Use Next.js App Router i18n with `[locale]` segment. Do not implement until English version is finalised and approved.

---

## PENDING — WAITING FOR CLIENT INPUT

| # | What's needed | Who provides it | Blocking what |
|---|--------------|-----------------|---------------|
| PENDING 01 | Approval to use Mrs. Nürnberger's name on site | Martina (she said "hopefully today") | CHANGE 06 |
| PENDING 02 | What is the 4th book? | Martina | CHANGE 06, CHANGE 10 |
| PENDING 03 | Real testimonial to replace "Clara · Founder" | Martina | CHANGE 13 |
| PENDING 04 | CV PDF file | Martina (she will email) | CHANGE 22 |
| PENDING 05 | Pricing decision: €7,500 vs lower for empowerment | Martina + strategy call | CHANGE 18 |
| PENDING 06 | Script font sign-off | Martina (show options on call) | CHANGE 17 |
| PENDING 07 | "Welcome home love" replacement / removal | Martina (copy call) | CHANGE 05 |
| PENDING 08 | Full copy review — all page text | Martina + scheduled call | Site-wide |
| PENDING 09 | coaching@martinarink.com inbox confirmation | Martina / hosting | CHANGE 07 |
| PENDING 10 | Assets from martinarink.de — images Martina will email | Martina | CHANGE 11 + CHANGE 26 |

---

## CONTENT GAP TABLE — martinarink.de vs martinarink.com

| Content Item | martinarink.de | martinarink.com | Action |
|---|---|---|---|
| Isabella Blow book cover | ✓ image | Text only | Add image (CHANGE 11) |
| People of Deutschland cover | ✓ image | Text only | Add image (CHANGE 11) |
| Fashion Germany cover | ✓ image | Text only | Add image (CHANGE 11) |
| Spotify podcast | ✓ linked | ✗ missing | Add (CHANGE 19) |
| Facebook | ✓ linked | ✗ missing | Add (CHANGE 20) |
| Phone number | ✓ +49 172 174 1499 | Press page only | Verify visible (CHANGE 21) |
| CV download | ✓ available | ✗ missing | Add (CHANGE 22) |
| Literary agent | ✓ detailed | Press page (light) | Expand (CHANGE 23) |
| Full legal text | ✓ complete | Incomplete | Fix (CHANGE 24) |
| ELLE Germany / SZ logos | ✓ shown | ✗ missing | Add (CHANGE 25) |
| Persian origin / boarding school story | ✓ detailed | Brief mention | Enrich (CHANGE 26) |
| "Sobriety activist" credential | ✓ | ✗ | Add to bio (CHANGE 26) |
| Reflective question copy | ✓ "What was your favourite trip?" | ✗ | Consider for About (CHANGE 26) |
| Partner logos | ✓ | ✓ (already on .com) | — |
| German language version | ✗ | ✗ | Future (CHANGE 27) |

---

## IMPLEMENTATION SEQUENCE

```
WEEK 1 — Foundation
  ✦ CHANGE 04  Color tokens (dark aubergine)
  ✦ CHANGE 03  Hero background plum
  ✦ CHANGE 01  Nav reorder
  ✦ CHANGE 02  "The Sober Muse" global rename
  ✦ CHANGE 07  Email → coaching@martinarink.com (after inbox confirmed)
  ✦ CHANGE 08  Footer location → World
  ✦ CHANGE 09  Speaking title → Panel Guest
  ✦ CHANGE 06  Mrs. Nürnberger fix (after approval)
  ✦ CHANGE 24  Legal pages complete

WEEK 2 — Design & Interaction
  ✦ CHANGE 12  Press logos marquee animation
  ✦ CHANGE 14  Phase hover effect (pink)
  ✦ CHANGE 16  Quote block bg → plum
  ✦ CHANGE 11  Book cover images (once sourced from .de)
  ✦ CHANGE 10  Book order (Isabella Blow first)
  ✦ CHANGE 17  Font options page → client review

WEEK 3 — Content migration from martinarink.de
  ✦ CHANGE 19  Spotify link in footer
  ✦ CHANGE 20  Facebook link in footer
  ✦ CHANGE 21  Phone number verified
  ✦ CHANGE 22  CV download (once PDF received)
  ✦ CHANGE 23  Literary agent card
  ✦ CHANGE 25  Press logos + article screenshots
  ✦ CHANGE 26  About page: enriched bio

WEEK 4 — Copy call with Martina
  ✦ CHANGE 05  Resolve "welcome home love"
  ✦ CHANGE 13  Real testimonials
  ✦ CHANGE 15  Phase names finalised
  ✦ CHANGE 17  Font signed off
  ✦ CHANGE 18  Pricing decision
  ✦ All pending items resolved

FUTURE
  ✦ CHANGE 27  German language version
```

---

## BRAND VOICE WARNING — when migrating .de copy

The following phrases appear on martinarink.de but are **BANNED** on martinarink.com per `CLAUDE.md`:

| Found on .de | Rule | Fix |
|---|---|---|
| "life-changing" | Banned: "amazing/incredible" equivalents | Rewrite |
| "transformation" | Banned word | Rewrite |
| "empowerment" (as verb) | Banned word | Rewrite |
| "drug-free, bad-habit-free lifestyle" | Off-brand clinical tone | Soften to martinarink.com voice |
| "My goal as a coach is to help women..." | Banned: "help" in salesy sense | Rewrite |
| Any `!` marks | Banned punctuation | Remove |
| Passive/vague copy | Not first-person precise | Rewrite |

**Rule:** Never copy .de text verbatim into .com. All migrated content must pass a banned-word scan and be rewritten in Martina's `.com` voice before commit.

---

*Last updated: 2026-05-03 · Based on video review 2026-05-01 + martinarink.de audit*
*Next action: Begin WEEK 1 items — start with CHANGE 04 (color tokens)*
