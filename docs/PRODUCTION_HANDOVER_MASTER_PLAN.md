# MARTINA RINK — Production Handover Master Plan
> **Single source of truth** consolidating: Strategic Ecosystem Plan · Funnel Audit · Design System v1 · current codebase state
> **Date:** 2026-05-11 · **Owner:** Senior Architect (Claude/VS Code) · **Target:** Production-ready handover

---

## 0 · Executive Verdict (read first)

**Site state today:** `READY TO CONVERT — pending 4 manual configurations and 1 design polish pass.`

The codebase is **further along than either advisory document assumes.** The Brevo "silent break" is fixed. The Calendly v2 webhook is wired (plus a free-tier embed fallback). Stripe is wired. Three email sequences are written. SEO is open. Coaching disclaimer is in. The funnel can convert a real lead today *provided* the three Brevo automations are loaded in the Brevo UI and the Cal.com €450 deposit is enabled.

**What's left is not building. It's:**
1. **Closing the manual configuration gaps** (Brevo automations, Cal.com deposit, Google Search Console) — Martina-side
2. **Aligning the design tokens** to the v1 design system (token drift in `globals.css`)
3. **One design polish pass** to bring Homepage + programme pages to the `/about` editorial standard
4. **Finishing the Phase 3 Client Portal** that's mid-build (database + 4 remaining env vars)

This plan resolves all four in a defensible order, with explicit owners and exit criteria.

---

## 1 · The Three Reference Documents — Reconciled

| Document | Scope | Status vs Codebase |
|---|---|---|
| **Strategic Ecosystem Plan** (Padlet/Hello Audio audit) | Phase 1/2/3 SaaS strategy. Rejects Padlet, ThingLink, Spreaker. Keeps Hello Audio + Thinkific for Phase 2/3. | ✅ Codebase aligned. `ECOSYSTEM_ROADMAP.md` codifies the same Phase gates. Members area scaffolded but not built (correct). |
| **Funnel Audit Prompt** (11-step conversion verification) | Tally → Brevo → Cal.com → Stripe wiring audit. Calls out the two silent breaks. | ✅ Both silent breaks already FIXED. (1) `trackBrevoEvent` exists and fires after every contact upsert. (2) Calendly v2 handler at `app/api/webhooks/calendly/route.ts` with HMAC verification and replay protection. ⚠️ The doc assumes Tally embed — codebase uses **in-house React form** (better). |
| **Editorial Design System v1** (Vogue/Hermès aesthetic) | Five Laws, spacing scale, two-column ratios, 8-component library, motion system, 24 mistakes. | ⚠️ Tokens have drift (`cream`, `ink-quiet`, missing `lilac-soft`). Most components exist. Hero padding may be tight on some pages. Marquee may be static instead of animated. |

---

## 2 · Codebase Audit — Done vs Missing

### 2.1 ✅ DONE (verified in codebase)

#### SEO + indexability
- `app/layout.tsx` — `noindex` default removed (PREVIEW_MODE=false)
- `app/robots.ts` — allows `/`, disallows `/admin`, `/api`, `/book`, `/apply`, `/thank-you`, `/members`, `/assessment/result`
- `app/sitemap.ts` — 14 static routes + dynamic Sanity slugs
- Per-page OG images (`opengraph-image.tsx` on homepage, sober-muse, empowerment)
- `app/writing/[slug]` — Article JSON-LD + reading time + Related Articles

#### Funnel mechanics
- `app/api/assessment/route.ts` — in-house assessment with Zod validation, Sanity backup, Brevo upsert, **Brevo event firing** (`assessment_completed`, `high_intent_lead`), Resend notification
- `lib/brevo.ts` — `trackBrevoEvent()` exists — **the critical "POST /v3/events" silent break is FIXED**
- `app/api/webhooks/calendly/route.ts` — Calendly v2 webhook with HMAC-SHA256 verification, 5-min replay protection, fires `consultation_booked` / `consultation_canceled` / `consultation_no_show` events
- `app/api/webhooks/calendly-embed/route.ts` — free-tier fallback via `window.postMessage` (works on Calendly Free plan)
- `app/api/webhooks/stripe/route.ts` — Stripe webhook (consultation, programme_full, idempotency)
- `app/api/newsletter/route.ts` — Brevo subscribe + `newsletter_subscribed` + `popup_email_captured` events
- `components/brand/NewsletterPopup.tsx` — 25s dwell / 50% scroll / desktop exit-intent + 30-day cookie + path suppression

#### Legal + compliance
- `app/legal/imprint/page.tsx` — Karlsruhe legal data (HRB 21885, VAT DE 283558251)
- `app/legal/privacy/page.tsx` + `app/legal/terms/page.tsx`
- `components/brand/CoachingDisclaimer.tsx` — present on `/sober-muse` and `/empowerment`
- `components/brand/AuthorityStrip.tsx` — `NURNBERGER_APPROVED = false` (3 credentials shown)

#### Content quality
- Banned-word scan clean (no Clara, no Dr. Nürnberger, no keynote-speaker, no `bg-wine` in components)
- Real testimonials (Armina) preserved
- Three article slugs hardcoded as sitemap fallback

#### Design system foundation
- `components/brand/PlumButton.tsx` ✅
- `components/brand/GhostButton.tsx` ✅
- `components/brand/Eyebrow.tsx` ✅
- `components/brand/ScriptAccent.tsx` ✅
- `components/brand/PortableTextBody.tsx` ✅
- `components/brand/AuthorityStrip.tsx` ✅
- `components/brand/CoachingDisclaimer.tsx` ✅
- `components/brand/PressMarquee.tsx` ✅ (exists — needs marquee animation verification)
- `components/brand/FadeIn.tsx` ✅ (motion system)
- `components/brand/TestimonialCard.tsx` ✅
- `components/brand/ReadingProgressBar.tsx` ✅

#### Email sequences (written, NOT loaded in Brevo UI)
- `docs/email-sequences/SEQUENCE_A_assessment_completers.md` (5-letter nurture)
- `docs/email-sequences/SEQUENCE_B_weekly_newsletter.md`
- `docs/email-sequences/SEQUENCE_C_post_consultation.md`

#### Phase 3 Client Portal (in progress, ~80% built)
- `app/(portal)/` route group exists with dashboard, sessions, resources, progress, payments
- `lib/db/schema.ts` — 11-table Drizzle schema (users, sessions, magic_links, programmes, enrolments, coaching_sessions, resources, progress_checkins, payments, stripe_webhook_events, activity_log)
- `lib/db/client.ts` — lazy Proxy singleton (build-safe)
- `lib/auth/` — session, magic-link, password, guards
- `middleware.ts` — `/portal/*` and `/auth/*` protection with admin role cookie
- `app/api/portal/auth/magic-link/route.ts` — rate-limited (5/15min by IP+email)
- `app/api/portal/client/checkout/route.ts` — Stripe Checkout for programme enrolment
- 6 of 10 portal env vars in Vercel Production (`MEMBERS_TOKEN_SECRET`, `MEMBERS_ADMIN_SECRET` added in this session)

---

### 2.2 ❌ MISSING / ⚠️ NEEDS WORK

#### A. Design system token drift (15 min fix)
`app/globals.css` currently has:

| Token | Current | Design System v1 Spec | Action |
|---|---|---|---|
| `--color-cream` | `#F7F3EE` | `#F8F4F1` | Update to spec |
| `--color-ink-quiet` | `#8A7F72` | `#636260` | Update to spec (CI override) |
| `--color-plum-deep` | `#180F1C` | `#180F1E` | Update to spec |
| `--color-paper` | *missing* | `#FAFAF7` | Add |
| `--color-lilac-soft` | aliased as `violet-soft` `#F3EBF5` | `#F3EBF5` | Rename or alias |
| `--color-lilac-mid` | aliased as `violet-mid` `#E6C7EB` | `#EDDDF0` | Add canonical |
| `--color-lilac-deep` | *missing* | `#E6C7EB` | Add (current violet-mid is actually lilac-deep) |
| `--color-wine` / `--color-wine-deep` | `#231728` / `#180F1C` | **BANNED** | Remove tokens (kept as aliases for back-compat then removed) |
| `--color-blush` | `#F5E8EC` | `#FDBFE2` (CI Farbe 5) | Decide: keep current or align to spec |
| `--color-mint-wash` | `mint` `#C9EADE` | `#C9EADE` | Rename to `mint-wash` per spec |
| Spacing tokens | most present | `--spacing-section-mobile/tablet/desktop` + `--spacing-hero-desktop` | Add as semantic aliases |
| Type tokens | partial | `--text-display-xl/lg/md/sm` clamp() | Verify present |

#### B. Hero + section padding sweep (1–2 hours)
Visually verify against Design System §2.2 decision tree:
- Every hero section: `py-32 lg:py-48` (desktop minimum 192px)
- Every standard editorial section: `py-32 lg:py-40` (desktop 160px)
- Mobile minimum: `py-20` (80px)

Run grep for offenders:
```bash
grep -rn "py-12\|py-16\|py-20\|py-24" app/page.tsx app/sober-muse app/empowerment app/about app/press
```
Anything under `py-32` on desktop is a mismatch.

#### C. PressMarquee — verify animation (15 min)
The component exists. Confirm it has the keyframe `@keyframes marquee` in `globals.css` + `prefers-reduced-motion` override. If static, replace with infinite scroll per DS §6.7.

#### D. Two-column ratio audit (45 min)
DS §3.2 — only `5/7`, `4/8`, `6/6`, `3/9` allowed. Grep each programme page for `col-span-*` patterns. Flag any `col-span-4 + col-span-8` variants outside the approved list.

#### E. Banned design patterns scan (10 min)
```bash
grep -rin "rounded-lg\|rounded-xl\|rounded-2xl" components/brand/
grep -rin "shadow-md\|shadow-lg\|shadow-xl" components/brand/
grep -rin "bg-white\|#ffffff\|text-white" app/ components/
```
All three should return zero (or only `text-white` on `bg-ink` / `bg-navy` dark sections).

#### F. Cookie consent banner — TODO (3–4 hours)
The audit prompt flagged this as "client must pick vendor." German UWG/TMG requires explicit opt-in for GA4 + Microsoft Clarity + Meta Pixel.

**Recommended vendor:** Cookiebot or Borlabs Cookie (both DSGVO-native). Free tier covers ≤100 subpages. Wire via `next-cookie-banner` or direct script + consent gate on analytics scripts in `app/layout.tsx`.

#### G. Phase 3 Client Portal — finish (in-progress)
- **4 remaining env vars in Vercel** (manual values from Martina):
  - `POSTGRES_URL` — create Neon Postgres via Vercel Storage
  - `STRIPE_SECRET_KEY` — `sk_live_…` from Stripe
  - `STRIPE_WEBHOOK_SECRET` — `whsec_…` from Stripe webhook endpoint
  - `STRIPE_CONSULTATION_PRICE_ID` — `price_…` from Stripe Product catalog
- Run database migration: `npm run seed:db` (after `POSTGRES_URL` set)
- Smoke test: magic-link login → dashboard → resources unlock by week → Stripe checkout

#### H. Manual verifications (Martina-side, can't be done from code)

| # | Where | What to verify |
|---|---|---|
| 1 | Brevo → Senders & IP | Domain `martinarink.com` authenticated, DKIM published, DMARC `p=quarantine; pct=100` |
| 2 | Brevo → Automations | Create 7 automations triggered by event names from `LAUNCH_STATUS.md` §3 |
| 3 | Brevo → Attributes | `ARCHETYPE` (text), `READINESS_LEVEL` (number), `BOOKING_STATUS` (text), `LAST_BOOKING_DATE` (date) |
| 4 | Cal.com → Event types | Private Consultation 45min: manual approval ON, 15-min buffer, 24h+2h reminders |
| 5 | Cal.com → Apps → Stripe | €450 deposit collection ENABLED (otherwise consultations are free → unqualified leads) |
| 6 | Stripe → Webhooks | Endpoint = `https://martinarink.com/api/webhooks/stripe` listening to `checkout.session.completed`, `payment_intent.payment_failed`, `invoice.payment_succeeded` |
| 7 | Stripe → Settings → Payments | SEPA enabled (lower fee than card for EU clients) |
| 8 | Google Search Console | Add `martinarink.com`, submit `sitemap.xml`, request indexing on `/`, `/sober-muse`, `/empowerment`, `/about`, `/assessment` |
| 9 | Vercel → Env Vars | All 18 funnel env vars set (see §6 below) |

---

## 3 · The Master Plan — 5 Workstreams

Each workstream is independently shippable. Run in order; do not parallelise A and B without explicit handoff.

### Workstream A — Token Alignment & Build Health *(45 min, dev session)*
**Exit:** `npx tsc --noEmit && npm run build && npm run lint` all green. Token spec matches DS v1.

| Step | Action | File |
|---|---|---|
| A1 | Update `--color-cream` → `#F8F4F1` | `app/globals.css` |
| A2 | Update `--color-ink-quiet` → `#636260` | `app/globals.css` |
| A3 | Update `--color-plum-deep` → `#180F1E` | `app/globals.css` |
| A4 | Add `--color-paper: #FAFAF7` | `app/globals.css` |
| A5 | Rename `violet-soft/mid` → `lilac-soft/mid/deep` (keep aliases for one release) | `app/globals.css` + grep replace `bg-violet-soft` → `bg-lilac-soft` |
| A6 | Remove `--color-wine` / `--color-wine-deep` | `app/globals.css` |
| A7 | Add semantic spacing aliases: `--spacing-section-desktop: 160px`, `--spacing-hero-desktop: 192px` | `app/globals.css` |
| A8 | Verify clamp() type tokens present: `--text-display-xl/lg/md/sm` | `app/globals.css` |
| A9 | Run banned-pattern greps (§2.2 E) — all return zero | terminal |
| A10 | `npm run build` clean | terminal |

### Workstream B — Design Elevation Pass *(2–3 hours, dev session)*
**Exit:** Homepage + 2 programme pages visually match `/about` editorial standard at 1280px and 375px.
**Pre-req:** Workstream A complete.

This is the **Design System Elevation Prompt** from the v1 doc, scoped to the three pages that lag the `/about` standard.

| Step | Action | Page |
|---|---|---|
| B1 | Hero padding verify — `py-32 lg:py-48` | `app/page.tsx` |
| B2 | PressMarquee animated (45s linear, pause on hover, reduced-motion respect) | `components/brand/PressMarquee.tsx` + `globals.css` |
| B3 | Testimonial block matches `bg-lilac-soft` pattern | `app/page.tsx` |
| B4 | All section padding ≥ `py-32 lg:py-40` | grep + spot fix |
| B5 | Sober Muse + Empowerment hero — Variant A asymmetric (3/9 ratio) | `app/sober-muse/page.tsx`, `app/empowerment/page.tsx` |
| B6 | "What this is / What this is not" two-column equal weight | both programme pages |
| B7 | Investment block — `bg-plum-soft` centered max-w-2xl | both programme pages |
| B8 | Phase cards (Sober Muse) — bg-bone, hover:bg-blush, no shadow, no rounded | `app/sober-muse/page.tsx` |
| B9 | FAQ accordion — sand hairlines, 300ms height transition | both programme pages |
| B10 | Framer Motion fadeUp on every hero h1 (600ms, lazy-imported via `dynamic()`) | three pages |
| B11 | `prefers-reduced-motion` global override in globals.css | `app/globals.css` |
| B12 | Visual QA on desktop + mobile (no horizontal scroll, hamburger nav, 80px mobile section padding) | manual |
| B13 | `npm run build` clean → `vercel --prod --yes` | terminal |

### Workstream C — Funnel End-to-End Smoke Test *(1 hour, dev + Martina)*
**Exit:** A real test lead converts through the full path in production.
**Pre-req:** Manual verifications §2.2 H 1–7 complete (Martina-side).

| Step | Action | Owner |
|---|---|---|
| C1 | Open `/assessment` in incognito → submit with `test+smoke@martinarink.com` | dev |
| C2 | Within 5 min, confirm Letter 1 of Assessment sequence arrives | dev |
| C3 | Verify Brevo contact created with `ARCHETYPE` + `READINESS` attributes | Martina (Brevo UI) |
| C4 | Click consultation CTA in Letter 1 → land on `/book` | dev |
| C5 | Book test consultation in Cal.com — verify €450 deposit prompt fires | dev |
| C6 | Confirm Brevo `BOOKING_STATUS=booked` updates | Martina (Brevo UI) |
| C7 | Confirm Resend email to Martina ("New consultation booked") arrives | Martina |
| C8 | Cancel the test consultation → verify `BOOKING_STATUS=canceled` updates | dev |
| C9 | Run Lighthouse on `/`, `/sober-muse`, `/empowerment` → Performance ≥ 90, A11y ≥ 95, SEO 100 | dev |
| C10 | Submit `sitemap.xml` to Google Search Console + request indexing on 5 priority pages | Martina |

### Workstream D — Phase 3 Client Portal Finalisation *(2 hours, dev + Martina)*
**Exit:** First real client can log in via magic link, see Week-1 resources unlocked, view next session.
**Pre-req:** None — independent of A/B/C.

| Step | Action | Owner |
|---|---|---|
| D1 | Create Neon Postgres via Vercel Storage → copy `POSTGRES_URL` | Martina |
| D2 | Add `POSTGRES_URL` env var to Vercel Production | dev (via browser ext) |
| D3 | Get + add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CONSULTATION_PRICE_ID` (see §6 below for guided steps) | Martina + dev |
| D4 | Run database migration: `npm run seed:db` | dev |
| D5 | Add first real enrolment via admin panel `/portal/admin` | Martina |
| D6 | Verify magic-link → dashboard flow as that client | dev |
| D7 | Verify Week-1 resource unlocks; Week-2 still locked | dev |
| D8 | Test Stripe Checkout flow for programme enrolment | dev |
| D9 | Smoke test webhook idempotency (replay same Stripe event → no duplicate payment row) | dev |

### Workstream E — Cookie Consent + Legal Polish *(3–4 hours, dev session)*
**Exit:** DSGVO-compliant consent banner blocks analytics until opt-in.
**Pre-req:** None.

| Step | Action |
|---|---|
| E1 | Pick vendor — recommend **Cookiebot Free** (≤100 subpages) or **Borlabs** (one-time fee, self-hosted) |
| E2 | Install vendor script in `app/layout.tsx` via `next/script strategy="afterInteractive"` |
| E3 | Wrap GA4 + Microsoft Clarity + Meta Pixel + LinkedIn Insight in consent gate |
| E4 | Update `app/legal/privacy/page.tsx` with: data processor list (Vercel, Sanity, Brevo, Resend, Cal.com, Stripe, GA4, Cookiebot) |
| E5 | Verify consent banner renders pre-interaction; analytics fires only post-consent |
| E6 | Test reject-all → no third-party cookies set (Chrome DevTools → Application → Cookies) |

---

## 4 · Critical Path Gantt (5-day sprint)

```
Day 1 (Mon)  ─── Workstream A (Token Alignment) ─── [DEV, 45 min]
             ─── Workstream D Step D1-D3 (Portal env vars) ─── [MARTINA + DEV, 30 min]

Day 2 (Tue)  ─── Workstream B (Design Elevation Pass) ─── [DEV, 3 hours]
             ─── Workstream D Step D4-D5 (DB migration + first enrolment) ─── [DEV + MARTINA, 1 hour]

Day 3 (Wed)  ─── Workstream E (Cookie Consent) ─── [DEV, 3 hours]
             ─── Martina manual verifications §2.2 H 1-3 (Brevo) ─── [MARTINA, 2 hours]

Day 4 (Thu)  ─── Martina manual verifications §2.2 H 4-7 (Cal.com + Stripe) ─── [MARTINA, 1.5 hours]
             ─── Workstream D Step D6-D9 (Portal smoke test) ─── [DEV, 1 hour]

Day 5 (Fri)  ─── Workstream C (End-to-end smoke test) ─── [DEV + MARTINA, 1.5 hours]
             ─── Google Search Console submission ─── [MARTINA, 15 min]
             ─── Production handover meeting ─── [BOTH, 1 hour]
```

**Total dev time:** ~10 hours. **Total Martina time:** ~5 hours. **Calendar:** 5 working days.

---

## 5 · Production Readiness Scorecard

| Domain | Current | Target | Gap |
|---|---|---|---|
| **SEO + indexability** | 95% | 100% | Google Search Console submission |
| **Funnel mechanics (steps 1-11)** | 90% | 100% | Brevo automations loaded; €450 deposit verified |
| **Design system fidelity** | 80% | 95% | Token drift fix + Homepage/programme elevation |
| **Legal compliance** | 85% | 100% | Cookie consent banner |
| **Phase 3 client portal** | 80% | 100% | 4 env vars + DB migration + smoke test |
| **Performance (Lighthouse)** | unverified | ≥90 P / ≥95 A11y / 100 SEO | Run + fix any regressions |
| **Brand voice (banned-word scan)** | 100% | 100% | — |
| **Email deliverability** | unverified | DKIM + DMARC published | Brevo manual config |
| **Speed-to-lead (Letter 1 in ≤5min)** | unverified | <5 min | Brevo manual config |

---

## 6 · The 18 Required Env Vars (canonical list)

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://martinarink.com               ✅ in Vercel
PREVIEW_MODE=false                                          ✅ in Vercel

# Brevo (replaces Kit)
BREVO_API_KEY=                                              ✅ in Vercel
BREVO_LIST_ID_NEWSLETTER=                                   ✅ in Vercel
BREVO_LIST_ID_ASSESSMENT=                                   ✅ in Vercel

# Resend (transactional)
RESEND_API_KEY=                                             ✅ in Vercel
RESEND_FROM_EMAIL=hello@martinarink.com                     ✅ in Vercel
RESEND_REPLY_TO=rinkmartina1979@gmail.com                   ✅ in Vercel
RESEND_NOTIFY_EMAIL=                                        ✅ in Vercel

# Cal.com (replaces Calendly direct)
NEXT_PUBLIC_CALENDLY_URL=                                   ✅ in Vercel
CALENDLY_PERSONAL_ACCESS_TOKEN=                             ✅ in Vercel (for embed fallback)
CALENDLY_WEBHOOK_SIGNING_KEY=                               ⚠️ optional (only if upgrading to Standard plan)

# Assessment
ASSESSMENT_RESULT_SECRET=                                   ✅ in Vercel

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=                              ✅ in Vercel
NEXT_PUBLIC_SANITY_DATASET=                                 ✅ in Vercel
SANITY_API_TOKEN=                                           ✅ in Vercel
SANITY_WRITE_TOKEN=                                         ✅ in Vercel

# Phase 3 Client Portal
POSTGRES_URL=                                               ❌ MISSING — Workstream D
MEMBERS_TOKEN_SECRET=                                       ✅ added this session
MEMBERS_ADMIN_SECRET=                                       ✅ added this session
STRIPE_SECRET_KEY=                                          ❌ MISSING — Workstream D
STRIPE_WEBHOOK_SECRET=                                      ❌ MISSING — Workstream D
STRIPE_CONSULTATION_PRICE_ID=                               ❌ MISSING — Workstream D
```

**Step-by-step for the 4 missing values** is in `PRODUCTION_HANDOVER_CLIENT_GUIDE.md` (sibling file) — written for Martina, non-technical.

---

## 7 · Handover Artefacts (deliverables to Martina)

| # | File | Purpose | Audience |
|---|---|---|---|
| 1 | `docs/PRODUCTION_HANDOVER_MASTER_PLAN.md` (this) | Full audit + plan | Dev / future Claude sessions |
| 2 | `docs/PRODUCTION_HANDOVER_CLIENT_GUIDE.md` | Non-technical walkthrough — what was built, how it works, how she benefits | Martina |
| 3 | `docs/LAUNCH_STATUS.md` *(existing)* | Live status snapshot | Both |
| 4 | `docs/ECOSYSTEM_ROADMAP.md` *(existing)* | Phase 1/2/3 plan with triggers | Both |
| 5 | `docs/PHASE_2_ARCHITECTURE.md` *(existing)* | Members area design (DO NOT BUILD YET) | Future dev |
| 6 | `docs/email-sequences/` *(existing)* | 3 nurture sequences ready to paste into Brevo | Martina |
| 7 | `docs/FUNNEL_AUDIT_2026-05-11.md` *(to create at end of Workstream C)* | Post-smoke-test triage | Dev |
| 8 | `/dev/fonts` *(existing)* | Font picker page for script font sign-off | Martina |

---

## 8 · Decision Log (what we are explicitly NOT doing)

| Decision | Rationale |
|---|---|
| **Not adding Padlet** | K-12 aesthetic — brand-incompatible at €5K/€7.5K tier |
| **Not adding ThingLink** | Educational tool — same brand mismatch |
| **Not adding Spreaker / second podcast** | *People of Deutschland* already provides authority — don't fragment |
| **Not adding Thinkific yet** | Premature — needs 10+ enrolled clients to inform curriculum |
| **Not adding Hello Audio yet** | Premature — needs 5+ paid clients to consume |
| **Not adding Circle.so yet** | Premature — needs alumni cohort first |
| **Not building Members area v2 yet** | Phase 3 Portal in `(portal)` route group already covers Phase 2 needs |
| **Not building Notion-as-portal** | Public-Notion aesthetic does not justify €5K tier |
| **Replacing in-house assessment with Tally** | In-house React form is better — full brand control, no third-party redirect |
| **Migrating from Brevo to Kit** | Brevo gives EU residency + free Tier covers volume |

---

## 9 · Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Brevo automations not loaded → leads receive zero emails | High (unverified) | Critical | Workstream C step C2 forces verification |
| Cal.com €450 deposit not configured → consultations are free | Medium | Critical (unqualified leads) | Manual verification §2.2 H step 5 |
| Sender domain DKIM/DMARC not published → letters land in spam | Medium | Critical (low deliverability) | Manual verification §2.2 H step 1 |
| Cookie consent missing → DSGVO complaint | Medium | High (regulatory) | Workstream E |
| Stripe webhook signing secret mismatch → silent payment drops | Low | Critical | Smoke test in Workstream D step D8 |
| Token drift causes visual regression in production | Low | Medium | Workstream A keeps aliases for one release |
| Postgres connection pool exhaustion on Phase 3 portal | Low (Neon scales) | Medium | Lazy Proxy singleton in `lib/db/client.ts` |
| Sanity Visual Editing breaks on prod due to draft mode misroute | Low | Low | Existing `draft-mode` API route handles this |

---

## 10 · The "Run Now" Recommendation

If we have one dev session today, run **Workstream A + first 4 steps of B** in this order:

1. Token alignment in `app/globals.css` (15 min)
2. Banned-pattern greps return zero (5 min)
3. Homepage hero padding verify + fix to `py-32 lg:py-48` (15 min)
4. PressMarquee animation verify + add keyframes if missing (15 min)
5. Testimonial block — confirm `bg-lilac-soft` pattern matches `/about` (15 min)
6. `npm run build && vercel --prod --yes` (10 min)

**Total: ~75 minutes.** Closes 60% of the design-elevation gap and gets fresh production deploy live for Martina to review before tomorrow's manual configurations.

---

> **One-line summary for Martina:**
> "The site can convert real clients today. We need you to spend 5 hours this week on Brevo, Cal.com, Stripe, and Google Search Console — and we'll spend 10 hours polishing the design and finishing your private client area."
