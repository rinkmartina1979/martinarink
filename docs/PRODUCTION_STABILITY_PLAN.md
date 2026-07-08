# Production Stability & Self-Closing Funnel — Execution Plan

**Status:** Living document. **Owner:** engineering. **Created:** 2026-07-02. **Updated:** 2026-07-08.
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

## Phase 4 — Post-payment welcome moment (1 day)

**Goal:** After the balance charge, land on "your programme begins," not a receipt. Protects the
highest refund-risk minute.

**Files:**
- `app/members/[token]/welcome/page.tsx` (NEW) — reads `session_id`, verifies against Stripe
  (`checkout.sessions.retrieve`) server-side before showing paid copy. Renders `deriveJourney()`'s
  "programme begins" state (trivial now — Phase 2 already computes it). One CTA → `/workbook/becoming`.
- `app/api/checkout/programme/route.ts` (EDIT) — `success_url` → `/members/[token]/welcome?session_id=…`.
- Confirmation email fires from the **webhook**, not the page (pages can be skipped; webhooks can't).

**Race handling:** if webhook hasn't landed but Stripe session `payment_status === 'paid'`, show the
welcome anyway — Stripe is truth, Sanity is mirror.

**Gate:** test-mode paid session renders welcome; unpaid/missing session redirects to billing.
**Rollback:** revert `success_url` to `/billing?paid=1`.

---

## Phase 5 — Design system as source of truth (1 day) · VOGUE GUARDRAIL

**Goal:** Make "Vogue aesthetic" verifiable, not remembered — so no future component drifts.

**Files:**
- `app/style/page.tsx` (NEW, `noindex`) — live reference rendering every token, button variant, card
  shell, and the Playfair/DM Sans/Dancing Script type ramp from the real `@theme`. The canonical
  visual contract.
- Confirm CLAUDE.md colour table still matches after any future token change.

**Gate:** `/style` renders; screenshot review confirms rose (`#C4687D`), not amethyst, everywhere.
**Rollback:** delete the page. Reference-only, no runtime dependency.

---

## Phase 6 — Funnel instrumentation (0.5 day)

**Goal:** Turn the funnel from invisible to measurable.

**Files:**
- `lib/analytics.ts` (NEW) — `track(event, params?)` guarded on `window.gtag`.
- Fire from existing client components only: `assessment_completed`, `application_submitted`,
  `deposit_checkout_opened`, `deposit_paid` (thank-you), `tier_selected` (variantKey),
  `balance_checkout_opened` (paymentMode), `balance_paid` (welcome).
- **Never** send email/name/token — event name + variant key only. GDPR-clean.

**Gate:** GA4 DebugView shows events with correct params, no PII. Server-side webhook payments remain
the revenue source of truth; GA is the drop-off map only. **Rollback:** revert; no-op without gtag.

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
| 4 | Welcome moment | 1 | **Next** — trivial now instalments exist; protects refund-risk minute |
| 5 | Design source-of-truth | 1 | Guardrail before more UI is built |
| 6 | Funnel events | 0.5 | Measurement |
| 7 | Session cookies | 0.5–1 (revised down) | Blocked on one Vercel dashboard check, then Phase B build |

**Remaining core work ≈ 2.5–3 days** (was 9–10 before Phases 0–3 landed and Phase 7 was found
to be half-built already). **Before anything else:** manually click through the instalment flow
once on production to close Phase 3's one open gap.

## Out of scope (later)
Client-facing messaging threads; field-level journal/workbook encryption (DPIA); Postgres
migration beyond the sessions table already in place; public marketing pricing page; Cal.com
native Stripe payment app (deliberately disabled — would trade brand control on the
highest-converting page for a reliability gain not needed at current volume).
