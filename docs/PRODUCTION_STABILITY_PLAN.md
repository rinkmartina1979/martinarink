# Production Stability & Self-Closing Funnel — Execution Plan

**Status:** Living document. **Owner:** engineering. **Created:** 2026-07-02.
**Principle:** Every step is independently revertable and passes its verification gate
before the next step touches production. No step leaves money or access in a broken
intermediate state.

---

## Ground truth (verified this session — do not re-derive)

- **Booking:** ✅ DONE. Cal.com is the single booking source. Signed webhook
  `app/api/webhooks/calcom/route.ts` (HMAC `x-cal-signature-256`, ping verified 200 live).
  Writes `clientProfile.nextSessionAt` + `calcomBookingUid`. `SessionCard` shows it,
  with a past-date guard.
- **Stripe API version:** ✅ Already pinned — `lib/stripe.ts` uses `2026-04-22.dahlia`.
- **Entitlement:** `lib/members/entitlements.ts` `deriveEntitlement()` — pure, payment-field-derived.
  `portalAccess` from deposit/override; `programmeAccess` from `programmeActiveAt`/`finalFeePaidAt`/override.
  `accessSuspendedAt` overrides all. **Never gate on `portalStage`.**
- **Journey state gap:** `portalStage` + `nextStep*` are **manual Studio fields**. No webhook
  advances them. This is why the funnel does not close itself.
- **Design tokens (live `@theme` in `app/globals.css`) — CLAUDE.md is STALE:**
  - `plum #C4687D` (warm blush rose — primary CTA), `plum-deep #A85268`, `plum-soft #FAE8EC`
  - `cream #F8F4F1` (primary surface)
  - `--font-display: Playfair` (40px+ only)
  - CLAUDE.md still says `plum = #5C2D8E` amethyst → any component built "to spec" gets the wrong colour.
- **Verification gate (all phases):** `npx tsc --noEmit` clean (lint is broken project-wide —
  tsc is the gate) → preview route check → `git push origin main` → Vercel `● Ready` → live URL check.
  Payment phases additionally: Stripe test-mode event replay, idempotent on double-fire.
- **Commit rules:** no `Co-Authored-By` trailers (Vercel Hobby blocks them). Push only to `main`.
- **Never:** log journal/workbook body; put a member token or journal body in any email;
  hardcode hex/prices in components; reference `www.martinarink.com`.

---

## Phase 0 — Pre-flight (0.5 day, no feature code, do once up front)

Removes the two operational hazards that have already bitten this project.

0.1 **Env-var drift guard.** `scripts/check-env.ts` — reads required key *names* (never values),
    compares against `.env.local` and a required-list, prints missing/empty. Add npm script
    `check:env`. Runbook line into `CLAUDE.md`: *"A local secret change is not real until mirrored
    in Vercel AND redeployed."*
    - Gate: run it, confirm it flags a deliberately-blanked key.
    - Rollback: delete the file. Zero runtime impact.

0.2 **Test-script hygiene.** Move `scripts/{find-client,create-client-profile,grant-test-access}.ts`
    → `scripts/dev/` and add `scripts/dev/` to `.gitignore`. Keep `send-portal-link.ts` (operational tool).
    - Gate: `git status` shows them untracked; portal link script still runs.
    - Rollback: `git mv` back.

0.3 **Secret-rotation runbook** into `CLAUDE.md`: rotating `MEMBERS_TOKEN_SECRET` invalidates
    URL tokens *and* (after Phase 6) session cookies. Procedure: rotate in Vercel → redeploy →
    same day re-issue links for every client where `portalStage != 'completed'` via
    `send-portal-link.ts`. Never rotate on a Friday.

0.4 **Reconcile CLAUDE.md colour table** to the live `@theme`. Single edit. Prevents every
    future colour-drift mistake. (Full design source-of-truth is Phase 5; this is the urgent one line.)

**Phase 0 DoD:** check:env runs, dev scripts gitignored, two runbook sections in CLAUDE.md,
colour table matches globals.css. One commit.

---

## Phase 1 — Dead-link recovery surface (0.5 day) · DO FIRST

**Goal:** A stranded email link becomes a one-step recovery, not a dead end. Retires the exact
brand-damage already experienced.

**Files:**
- `components/portal/RecoverLinkForm.tsx` (NEW, `"use client"`) — extract the working form from
  `app/portal/page.tsx`. POSTs to existing `/api/members/request-link` (honeypot + rate-limit +
  generic response already there — **no API change**).
- `components/portal/LinkExpiredView.tsx` (NEW, server) — calm copy + `<RecoverLinkForm />`.
  First sentence varies by `reason` (`superseded` | `revoked` | `Invalid token`) but **never leaks
  mechanics**. Brand voice: no exclamation marks. Copy: *"This link has been replaced. Enter your
  email and a fresh one will arrive within a minute."*
- Wire into the invalid-token branch of every `/members/[token]/*` page: dashboard, billing, journal,
  workbook, schedule, resources, learn. Replace the "visit /portal" paragraph with `<LinkExpiredView reason={…} />`.

**Steps (commit boundaries):**
1. Build both components + verify in preview against a deliberately-bad token → shows form.
2. Wire all seven pages. tsc → preview each → one commit.

**Gate:** preview each route with an invalid token shows the inline form; submitting a known email
enqueues a link (check Sanity `portalLinkRequest` + Resend). **Rollback:** revert the commit; the
old dead-end copy returns. Zero data/attack-surface change.

---

## Phase 2 — Automation spine (2 days) · THE KEYSTONE

**Goal:** The dashboard journey derives from verified events, so the funnel self-advances. Martina
never has to edit `nextStep*` to move a client forward.

**Files:**
- `lib/members/journey.ts` (NEW) — `deriveJourney(profile, signals)` → `{ portalStage, nextStep:
  { title, description, ctaLabel, ctaHref, dueAt } }`. **Pure, server-only, same discipline as
  `deriveEntitlement`.** Inputs: `depositPaidAt`, `programmeActiveAt`, `programmeCompletedAt`,
  `finalFeePaidAt`/`manualFinalFeePaidAt`, `programmeVariant` (chosen?), workbook progress count,
  `nextSessionAt`. Output is the single ordered "what's next" for the client.
- `app/members/[token]/page.tsx` (EDIT) — read `deriveJourney()` for the NextActionCard instead of
  raw `nextStep*`. **Preserve an override:** if `nextStepOverrideTitle` is set in Sanity, it wins
  (Martina keeps manual control when she wants it).
- `sanity/schema/clientProfile.ts` (EDIT) — rename intent: keep `nextStep*` as `nextStepOverride*`
  (or add `nextStepOverrideTitle` and leave legacy fields read-only-deprecated). Additive; no data loss.
- `sanity/lib/membersQueries.ts` + `app/api/members/verify/route.ts` (EDIT) — return the workbook
  progress count + override fields already returned or add them.

**State machine `deriveJourney` encodes (display only — NOT access):**
```
no deposit                         → "Reserve your consultation"        → /book
deposit, no variant chosen         → "Choose your programme"            → /billing
variant chosen, balance unpaid     → "Complete your enrolment"          → /billing
programmeActive, workbook 0/16     → "Begin your foundation"            → /workbook/becoming
programmeActive, workbook partial  → "Continue your foundation (N/16)"  → /workbook
nextSessionAt upcoming             → "Your session is booked"           → /schedule
completed                          → archived view
```

**Steps:**
1. Write `deriveJourney` + unit-reason table in a comment. tsc.
2. Wire dashboard to it behind the override. Preview each stage by toggling test-client fields in Sanity.
3. One commit. (Webhook unchanged — it still only writes payment timestamps; journey derives on render.)

**Gate:** flip a test client through each field combination in Studio → dashboard next-step updates
with **no manual `nextStep*` edit**. **Rollback:** revert; dashboard falls back to manual fields
(kept intact). No webhook/access change.

---

## Phase 3 — Instalment payments (2 days) · REVENUE LEVER

**Goal:** Offer 3× alongside pay-in-full on the €4,650 balance. Higher close rate without discounting.

**Files:**
- `lib/pricing.ts` (EDIT) — per variant `instalments: { count: 3, perCents, firstCents }` where
  `per = Math.floor(balanceCents/3)`, `first = balanceCents - 2*per` (remainder in first charge —
  integer cents, no float drift). Add a `getInstalmentPlan(variant)` helper.
- `app/api/checkout/programme/route.ts` (EDIT) — accept `paymentMode: 'full' | 'instalments'`.
  Instalments → Stripe Checkout `mode: 'subscription'`, monthly `unit_amount: perCents`,
  `subscription_data.metadata: { clientId, variantKey, type: 'programme-instalment', totalInstalments: '3' }`.
  Attach existing `stripeCustomerId`. **Persist the chosen variant first** (never trust body for access).
- `app/api/webhooks/stripe/route.ts` (EDIT) — branch on `invoice.paid` with
  `subscription metadata.type === 'programme-instalment'`:
  - Dedupe by `invoice.id` (store in `instalmentInvoiceIds[]`, skip if present — **replay-safe**).
  - First paid invoice → `setIfMissing({ programmeActiveAt })` + `set({ programmeVariant })` + `instalmentsPaid = 1`.
  - Subsequent → increment `instalmentsPaid`.
  - Final (`instalmentsPaid === totalInstalments`) → `setIfMissing({ finalFeePaidAt })` +
    `stripe.subscriptions.update(id, { cancel_at_period_end: true })` (server-side, never client).
  - `invoice.payment_failed` → extend existing Martina email (commit `aa09ce0`) with which instalment
    failed. **Do NOT auto-suspend** — Stripe smart-retries ~2 weeks; `accessSuspendedAt` stays manual.
- `sanity/schema/clientProfile.ts` (EDIT) — add `instalmentsPaid` (number), `instalmentInvoiceIds`
  (array of string), `stripeSubscriptionId` (string). All webhook-written, `readOnly` in Studio.
- `components/portal/ProgrammeSelector.tsx` (EDIT) — under the chosen tier, two quiet radio lines
  ("€4,650 today" / "3 monthly payments of €1,550"), then ONE CTA. One decision per screen.

**Entitlement invariant (enforce in review):** `programmeAccess` from instalment 1 (that's what makes
instalments convert — she's in immediately); `finalFeePaidAt` only when fully paid. `deriveEntitlement`
needs no change (`programmeActiveAt` already grants). Journey (Phase 2) shows "enrolled" automatically.

**Steps:**
1. Pricing math + helper + tsc. Commit.
2. Checkout route instalment branch. Test-mode: create a subscription checkout, confirm cents.
3. Webhook branch + dedupe. **Replay the test `invoice.paid` twice — confirm idempotent.**
4. ProgrammeSelector UI. Preview.
5. Full test-mode run: select tier → instalments → 3 test invoices → access on #1, finalFeePaid on #3,
   subscription cancelled. Confirm cheapest-tier selection alone grants NOTHING. Commit per step.

**Gate:** Stripe test-mode end-to-end + double-fire idempotency. **Rollback:** revert; `paymentMode`
defaults to `full`, existing single-charge path untouched. Webhook branch is additive.

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
- Audit the Cal.com booking surfaces + `SessionCard` against the rose palette (class names resolve
  correctly; confirm visually via preview screenshot).
- Confirm CLAUDE.md colour table (fixed in Phase 0) still matches after any token change.

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

## Phase 7 — Session cookies (2–3 days) · STRUCTURAL FIX

**Goal:** The emailed link needs to work only once. After first visit, a browser session survives
secret rotation, tokenVersion bump, and 120-day expiry.

**Files:**
- `app/api/members/session/route.ts` (NEW) — POST `{ token }` → `verifyMemberToken` + Sanity
  revocation/tokenVersion checks → set HttpOnly cookie:
  `mr_session=<HMAC, scope:'session', 30d>; HttpOnly; Secure; SameSite=Lax; Path=/`.
  Reuse `lib/members/token.ts` primitives; distinct `scope:'session'` so URL and cookie tokens are
  never interchangeable.
- `lib/members/portalAuth.ts` (EDIT) — accept token from URL param OR `mr_session` cookie (cookie
  wins). **Additive** — every existing page keeps working.
- `app/members/[token]/layout.tsx` (EDIT) — tiny client component fires the exchange once
  (`useEffect`, idempotent).
- Sliding renewal: re-issue cookie when within 7 days of expiry.
- Kill-switch preserved: cookie validation checks `revokedAt` + `accessSuspendedAt` on every render
  (`getClientByToken` already runs per page — zero extra queries).

**Do NOT:** `SameSite=Strict` (breaks email-click first visit); session in `localStorage`
(XSS-readable); skip the Sanity check "for perf."

**Gate:** first visit sets cookie; then a superseded URL token still authenticates via cookie;
`revokedAt`/`accessSuspendedAt` still deny immediately. **Rollback:** revert; URL-token auth (still
present) is unaffected. This is why it's additive and last — the system is fully functional without it.

---

## Sequencing & why

| # | Phase | Days | Rationale |
|---|-------|------|-----------|
| 0 | Pre-flight | 0.5 | Kills the two operational hazards that already bit us |
| 1 | Dead-link recovery | 0.5 | Retires active brand harm today, zero attack surface |
| 2 | Automation spine | 2 | Keystone — everything else plugs into derived journey |
| 3 | Instalments | 2 | Direct revenue; plugs into spine |
| 4 | Welcome moment | 1 | Trivial once spine exists; protects refund-risk minute |
| 5 | Design source-of-truth | 1 | Guardrail before more UI is built |
| 6 | Funnel events | 0.5 | Measurement |
| 7 | Session cookies | 2–3 | Structural; additive; safe to do last |

**Self-closing-funnel core (Phases 1–4) ≈ 5 days.** Full plan ≈ 9–10 days.

## Out of scope (later)
Client-facing messaging threads; field-level journal/workbook encryption (DPIA); Postgres migration;
public marketing pricing page; Cal.com native Stripe payment app (would trade brand control on the
highest-converting page for a reliability gain not needed at current volume).
