# Production Stability & Self-Closing Funnel — Execution Plan

**Status:** Living document. **Owner:** engineering. **Created:** 2026-07-02. **Updated:** 2026-07-14 (Phase 6 planned — revised, not a blank slate).
**Principle:** Every step is independently revertable and passes its verification gate
before the next step touches production. No step leaves money or access in a broken
intermediate state.

---

## Ground truth (verified — do not re-derive)

- **Booking:** ✅ DONE. Cal.com is the single booking source. Signed webhook
  `app/api/webhooks/calcom/route.ts` (HMAC `x-cal-signature-256`, ping verified 200 live).
  Writes `clientProfile.nextSessionAt` + `calcomBookingUid`. `SessionCard` shows it, with a
  past-date guard. CSP `frame-src` allows `cal.com`/`app.cal.com` (was still Calendly-only —
  fixed 2026-07-08, was silently blocking every booking embed on production).
  **Cal.com's native Stripe payment app was found accidentally enabled** on the "45 min
  meeting" event type — would have double-charged clients who already paid the site's own
  deposit checkout. Disabled and verified off on the live public booking page.
- **Stripe API version:** ✅ Already pinned — `lib/stripe.ts` uses `2026-04-22.dahlia`.
- **Entitlement:** `lib/members/entitlements.ts` `deriveEntitlement()` — pure, payment-field-derived.
  `portalAccess` from deposit/override; `programmeAccess` from `programmeActiveAt`/`finalFeePaidAt`/override.
  `accessSuspendedAt` overrides all. **Never gate on `portalStage`.**
- **Journey state:** ✅ DONE (Phase 2). `lib/members/journey.ts` `deriveJourney()` computes the
  dashboard "next step" from verified signals — no more manual `nextStepTitle` editing required
  for the funnel to advance. Manual override still wins when Martina sets it.
- **Design tokens (live `@theme` in `app/globals.css`):** ✅ CLAUDE.md reconciled 2026-07-02.
  `plum #C4687D` (warm blush rose — primary CTA), `plum-deep #A85268`, `cream #F8F4F1`,
  `--font-display: Playfair` (40px+ only). Trust `globals.css` over CLAUDE.md if they ever diverge again.
- **Pricing:** `lib/pricing.ts` `PROGRAMME_VARIANTS` is the single source of truth — dynamically
  drives `ProgrammeSelector`, `select-programme`, `checkout/programme`, and the Sanity
  `programmeVariant` enum. Adding a variant here is sufficient; no other code changes needed.
  Currently 6 variants (added `sober-muse-3m-7days` / €6,500 on 2026-07-08, was missing despite
  the Stripe product and apply-form option already existing).
- **Verification gate (all phases):** `npx tsc --noEmit` clean (lint is broken project-wide —
  tsc is the gate) → preview route check → `git push origin main` → Vercel `● Ready` → live URL check.
  Payment phases additionally: Stripe test-mode event replay, idempotent on double-fire.
- **Commit rules:** no `Co-Authored-By` trailers (Vercel Hobby blocks them). Push only to `main`.
- **Never:** log journal/workbook body; put a member token or journal body in any email;
  hardcode hex/prices in components; reference `www.martinarink.com`.

---

## Phase 0 — Pre-flight ✅ DONE (commit `f8edf1b`)

`scripts/check-env.ts` (`npm run check:env`), dev scripts quarantined to gitignored
`scripts/dev/`, secret-rotation runbook + colour table in CLAUDE.md.

---

## Phase 1 — Dead-link recovery surface ✅ DONE (commit `9fe1141`)

`components/portal/LinkExpiredView.tsx` wired into all 11 `/members/[token]/*` pages, reusing
the existing `PortalRecoveryForm`. Fixed 5 pages that were hitting a raw 404 instead of a
recovery form. Verified live on production.

---

## Phase 2 — Automation spine ✅ DONE (commits `6ab4f5f`, `bfa4572`)

`lib/members/journey.ts` `deriveJourney()` — pure function, same discipline as
`deriveEntitlement`. Dashboard next-step now derives from verified signals (deposit, variant,
balance, programme-active, workbook progress, journal entries, next session) instead of a
single hardcoded fallback. Includes the begin-vs-continue journal fix (first-time visit shows
"Begin your journal," not "Continue"). Manual `nextStepTitle` override in Studio still wins
when set.

---

## Phase 3 — Instalment payments ✅ CODE DONE, ⚠️ NEEDS MANUAL LIVE VERIFICATION
(commits `3700407`, `3c8f5c7`, `7dc109c`, `4f50d52`, `1c1e8f1`)

**Shipped:** `getInstalmentPlan()` in `lib/pricing.ts` (uniform monthly amount, ceiling-rounded —
not the asymmetric first/subsequent split originally sketched here, which doesn't fit Stripe
subscription-mode Checkout cleanly). Checkout route accepts `paymentMode: 'full' | 'instalments'`,
creates a subscription-mode session with metadata on `subscription_data` for instalments.
Webhook handles `invoice.paid` for `programme-instalment` subscriptions — grants
`programmeActiveAt` on instalment 1, increments `instalmentsPaid`, dedupes by invoice ID,
cancels the subscription server-side after the final instalment. `ProgrammeSelector` UI ships
the two-radio choice, verified rendering + math correctly in preview.

**Two real bugs caught and fixed before shipping** (see commit `4f50d52` for detail):
1. Initial `subscription_details` metadata extraction used a fabricated top-level `Invoice`
   field that doesn't exist in the installed Stripe SDK — masked by a type-widening cast, would
   have made the entire instalment branch permanently dead code despite `tsc` passing clean.
   Fixed using the real typed path (`invoice.parent.subscription_details`), verified against the
   actual `.d.ts` source, no casts needed after the fix.
2. `checkout.session.completed` fires for subscription-mode sessions too, and instalment
   metadata lives on `subscription_data`, not `session.metadata` — without a guard, an
   instalment purchase would have fallen through into the one-time deposit branch and fired
   incorrect deposit-paid side effects.

**What was NOT possible this session:** a live Stripe test-mode round-trip. The auto-mode
classifier correctly blocks any access to the live `STRIPE_SECRET_KEY`, including read-only
inspection, and this codebase has no separate test-mode key configured. Verified instead via:
cent-math unit tests (all 6 variants sum exactly), `tsc` against the real Stripe SDK types, and
a synthetic simulation of the full 3-payment lifecycle plus duplicate-event replays (idempotency
confirmed mechanically). **Pushed to production with explicit user authorization**, on the
understanding that a manual click-through test (real tier selection → instalments → Stripe
Checkout) happens before any real client is told the feature exists.

**Outstanding for a future session, not urgent:** `invoice.payment_failed` still only fires the
existing generic Martina notification — it doesn't yet say *which* instalment failed. Low
priority since Stripe's smart retries run ~2 weeks before this matters.

---

## Phase 4 — Post-payment welcome moment ✅ CODE DONE, ⚠️ NEEDS MANUAL LIVE VERIFICATION
(commit `8a90aaa`)

**Shipped:** `app/members/[token]/welcome/page.tsx` (NEW) — reads `session_id`, retrieves the
Stripe Checkout Session server-side (`stripe.checkout.sessions.retrieve`, expanding
`subscription` for instalment mode) and cross-checks `clientId` in the session/subscription
metadata against the verified member token before rendering anything. Any mismatch, unpaid
status, missing `session_id`, or invalid token redirects straight to `/billing` — the query
string is never trusted alone, only what Stripe itself reports. Renders "Your programme
begins." with one CTA into `/workbook/becoming`.

`app/api/checkout/programme/route.ts` — `success_url` changed from
`/members/[token]/billing?paid=1` (a silent no-op; confirmed via `grep` that `?paid=1` was
never read anywhere) to `/members/[token]/welcome?session_id={CHECKOUT_SESSION_ID}`, for both
`full` and `instalments` payment modes.

`app/api/webhooks/stripe/route.ts` — added `sendProgrammeConfirmation()`, fired from the
**webhook** (not the page, so it can't be skipped by a closed tab): once on
`programme-balance` `checkout.session.completed`, and once on the *first* instalment's
`invoice.paid` (not on every instalment).

**Verified this session:** `tsc --noEmit` clean; confirmed in the dev preview that an invalid
token on `/welcome` redirects to `/billing`, which correctly renders the expired-link
recovery view (proves the "never trust the query string" guard fires before any paid-state
copy renders); production `● Ready`, `/api/health` 200, live `/welcome` route responds
(200 with the expected redirect payload for an invalid token, matching preview behavior).

**What was NOT possible this session:** a real paid-session round-trip through `/welcome` —
same live-Stripe-key constraint as Phase 3. The redirect-on-invalid path is proven; the
render-on-paid path is not yet confirmed against a real session object shape from Stripe.
Verify by paying a real instalment or balance on production and confirming the welcome copy
renders (not a redirect to billing).

**Gate:** paid session renders welcome; unpaid/missing/mismatched session redirects to billing. ✅ redirect path verified live; ⚠️ paid-render path needs one manual click-through.
**Rollback:** revert `success_url` to `/billing?paid=1`.

---

## Phase 5 — Design system as source of truth ✅ DONE (commit `15a6dcb`) · VOGUE GUARDRAIL

**Goal:** Make "Vogue aesthetic" verifiable, not remembered — so no future component drifts.

**Shipped:** `app/style/page.tsx` (NEW, `noindex`) — live reference rendering every color token
(surfaces, ink, CTA, tints, accents, dark sections), the full type ramp (display XL/LG/MD, H3,
body lg/base/sm, caption, overline, script), button variants, card shells, and the banned-word/
voice guardrails — all via the real Tailwind utility classes (`bg-plum`, `text-ink-soft`, etc.),
never a hardcoded hex. If `globals.css` changes, this page changes with it automatically.

**Verified:** `tsc --noEmit` clean; confirmed live in preview via `preview_inspect` on the
primary CTA — computed `background-color: rgb(196, 104, 125)` = `#C4687D`, an exact match to
`--color-plum` in `globals.css`, proving the token wiring (not just the class names) is correct.
No console or server errors. Live on production: `/style` returns 200 with `noindex` present in
the rendered `<meta>` tags.

**Gate:** `/style` renders; CTA color inspected and matches `--color-plum` exactly. ✅
**Rollback:** delete the page. Reference-only, no runtime dependency.

---

## Phase 6 — Funnel instrumentation (revised — not a blank slate)

**Goal:** Turn the funnel from invisible to measurable.

**Revised finding (2026-07-14):** this is not a from-scratch build. `lib/analytics/events.ts`
already exists — a GDPR-clean event abstraction (`trackAssessment()`) that pushes to both
`@vercel/analytics` and the GA4 `dataLayer`, fails silently if tracking isn't configured, and
never sends PII. The **entire assessment funnel is already instrumented**: `assessment_started`,
`assessment_question_answered`, `assessment_email_submitted`, `assessment_completed` all fire
today from `components/assessment/AssessmentShell.tsx`. GA4 itself is wired in
`app/layout.tsx:58` via `@next/third-parties/google` (`gaId="G-RBXW7LFCD5"`).

**What's actually missing** — the rest of the funnel, past the assessment, has zero tracking:

| Event | Fires from | Trigger point |
|---|---|---|
| `assessment_result_viewed` | `app/assessment/result/[resultId]/page.tsx` | on mount — type already exists in `AssessmentEventName`, just never called |
| `assessment_cta_clicked` | same result page | on the primary/secondary CTA click — `trackAssessment` + `trackHighIntentLead` helper already exist, unused |
| `application_submitted` | `components/forms/ApplicationForm.tsx:134` | right before `router.push("/thank-you/application")` — `programme` prop already in scope |
| `deposit_checkout_opened` | `components/book/DepositCTA.tsx:37` | right before `window.location.href = data.url` |
| `deposit_paid` | `app/book/schedule/page.tsx` (NEW tiny client component) | Server Component already verifies `payment_status === 'paid'` before rendering `CalComEmbed` — add a `<DepositPaidTracker />` (fires once on mount, renders null) inside that already-verified branch only |
| `tier_selected` | `components/portal/ProgrammeSelector.tsx` `choose()` | on successful `/api/members/select-programme` response — `variantKey` already in scope |
| `balance_checkout_opened` | same file, `payBalance()` | right before `window.location.href = data.url` — `paymentMode` already in scope |
| `balance_paid` | `app/members/[token]/welcome/page.tsx` (NEW tiny client component) | same pattern as deposit_paid — page already verifies the Stripe session server-side before rendering; add a client tracker inside the verified branch only |

**Files:**
- `lib/analytics/events.ts` (EDIT, not new) — factor the shared push logic in `trackAssessment`
  into a private `pushEvent(name, props)`, keep `trackAssessment` as a thin typed wrapper so its
  existing call sites in `AssessmentShell.tsx` don't change. Add a second typed wrapper,
  `trackFunnel(name: FunnelEventName, props?)`, for the eight non-assessment events above.
- `components/book/DepositPaidTracker.tsx` (NEW) — one-shot client tracker, same shape as
  `SessionBootstrap.tsx`'s "fires once, renders nothing" pattern already used elsewhere in this
  codebase.
- `components/portal/WelcomePaidTracker.tsx` (NEW) — same pattern, for `balance_paid`.
- Five existing files edited to call `trackAssessment`/`trackFunnel` at the trigger points above.
- **Never** send email, name, token, or answer content — event name + variant key/programme only.

**Gate:** GA4 DebugView (or Vercel Analytics dashboard) shows all 8 new events firing with correct
params and zero PII, verified in preview before deploy. Server-side webhook payments remain the
revenue source of truth — analytics is the drop-off map only, never authoritative.
**Rollback:** each touchpoint is a 1–2 line addition; revert any file independently with no
effect on the surrounding logic. The two new tracker components are additive and can be deleted
outright with zero blast radius.

---

## Phase 7 — Session cookies (0.5–1 day, revised) · BLOCKED ON ONE CONFIG CHECK

**Revised finding (2026-07-08):** this is NOT a from-scratch build. It's already mostly built:
- `components/portal/SessionBootstrap.tsx` — fires a background POST on every dashboard visit.
- `app/api/members/auth/route.ts` — verifies the URL token, calls `createSession()`, sets the
  `mr_session` HttpOnly cookie. Always returns 200 (never leaks auth state).
- `lib/members/session.ts` — DB-backed sessions (Neon Postgres via `lib/db/index.ts`), proper
  revocation (`revokeAllSessions`), sliding 30-day expiry, `sha256(sessionId)` stored not the
  raw value. More mature than a stateless-HMAC design would have been.
- `scripts/setup-db.ts` — idempotent migration, **already run against production** this session
  (`mr_sessions` + `mr_portal_audit` tables now exist, confirmed via Vercel function logs).

**What's actually missing:**
1. **`SESSION_SECRET` is not reaching the running Vercel function**, despite being listed in
   `vercel env ls production`. `createSession()` silently early-returns null when the secret is
   falsy (no error logged — this is why it was invisible). `DATABASE_URL` is confirmed working
   (the migration used it successfully), which rules out a general env-var problem and isolates
   this to the one variable.
   - **Action required (human, not code):** open Vercel dashboard → Settings → Environment
     Variables → `SESSION_SECRET` → confirm it actually holds a non-empty value (not just that
     the name is registered — a known Vercel footgun with Sensitive-type vars saved blank).
     If empty, regenerate (`openssl rand -base64 32` or equivalent) and re-save, then redeploy.
2. **Phase B was never built:** nothing on the member pages actually *reads* the `mr_session`
   cookie yet — `lib/members/portalAuth.ts` and the raw `/api/members/verify` fetches only check
   the URL token. Once (1) is confirmed working, the remaining build is:
   - `lib/members/portalAuth.ts` (EDIT) — `verifyPortalAccess` accepts a cookie value or reads
     `mr_session` via `cookies()`, calls `verifySession()`, falls back to URL-token verification
     if no cookie or cookie invalid. **Additive** — every existing page keeps working.
   - `/api/members/verify` (EDIT) — same fallback logic for the 6 raw-fetch pages.
   - Sliding renewal: `verifySession()` already rolls `expires_at` forward on each read
     (confirmed in the existing code) — no extra work needed here.

**Do NOT:** put the session value in `localStorage` (XSS-readable); skip the DB revocation check
"for perf" — it's already zero-extra-query since `getClientByToken` runs per page anyway.

**Gate:** confirm `Set-Cookie: mr_session=...` header appears on `/api/members/auth` response
(check presence/flags only, never print the value) → `mr_sessions` row count increases in Neon
→ build Phase B → verify a superseded URL token still authenticates via a valid cookie.
**Rollback:** revert Phase B edits; URL-token auth (untouched, still primary) is unaffected —
this is why it stays additive and last.

---

## Cross-cutting items — not phases, but real and unresolved

| Item | Status | Notes |
|---|---|---|
| **Cal.com calendar hygiene** | Not done, low urgency | Buffer time + booking-frequency limit on the "45 min meeting" event type. Five-minute fix in Cal.com's own UI — Martina's call, not a code change. Mitigates the one theoretical weakness of the decoupled payment architecture (a booking-slot race at high volume; currently ~4 consultations/week, so low real risk). |
| **Vercel Hobby → Pro** | Not done, recommended | The commit-author co-author-block already cost real debugging time this project (a confirmed 2026 Hobby-plan bug). Pro also adds log retention useful for exactly the kind of silent failures found in Phase 7. |
| **Repo hygiene** | Not done, no urgency | `public/images/portraits/` has ~15 untracked files from unrelated projects (other clients' testimonial photos, video reels, a stray `.zip`, `bulderslinknz.md`). Not breaking anything; cross-project contamination worth a cleanup pass eventually. |
| **Human visual QA** | Not done | Sanity `partnerLogo`/press-page changes and the `CareTeamBlock` redesign were verified via HTTP content checks and preview-tool snapshots, not a human eye on the live rendered page on a real device. Worth a look before calling those fully closed. |

---

## Sequencing & why

| # | Phase | Days | Status |
|---|-------|------|--------|
| 0 | Pre-flight | 0.5 | ✅ Done |
| 1 | Dead-link recovery | 0.5 | ✅ Done |
| 2 | Automation spine | 2 | ✅ Done |
| 3 | Instalments | 2 | ✅ Code done — ⚠️ needs manual live-payment verification |
| 4 | Welcome moment | 1 | ✅ Code done — ⚠️ needs manual live-payment verification |
| 5 | Design source-of-truth | 1 | ✅ Done |
| 6 | Funnel events | 0.5 | **Next** — measurement |
| 7 | Session cookies | 0.5–1 (revised down) | Blocked on one Vercel dashboard check, then Phase B build |

**Remaining core work ≈ 1.5–2 days** (was 9–10 before Phases 0–3 landed and Phase 7 was found
to be half-built already). **Before anything else:** manually click through the instalment flow
once on production — this single click-through closes both Phase 3's and Phase 4's open
verification gap, since the welcome page is what that flow lands on after payment.

## Out of scope (later)
Client-facing messaging threads; field-level journal/workbook encryption (DPIA); Postgres
migration beyond the sessions table already in place; public marketing pricing page; Cal.com
native Stripe payment app (deliberately disabled — would trade brand control on the
highest-converting page for a reliability gain not needed at current volume).
