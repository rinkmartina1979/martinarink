# Funnel CRO/UX Fix Plan — Execution Plan

**Status:** Living document. **Owner:** engineering. **Created:** 2026-07-11. **Updated:** 2026-07-11 (Phases 1–2 shipped).
**Source:** CRO/UX audit of the conversion funnel (assessment → result → apply →
consultation → intake), conducted this session. Full findings in chat history;
this doc tracks execution only.
**Principle:** Same discipline as `docs/PRODUCTION_STABILITY_PLAN.md` — every
step is independently revertable and passes its verification gate before the
next step touches production. Copy-only changes still get the full gate; a
wrong word in this funnel costs a €5,000+ enrolment, not a typo.

---

## Ground truth (verified — do not re-derive)

- **Audit method:** read the actual funnel pages and components end-to-end
  (`app/page.tsx`, `app/work-with-me/page.tsx`, `app/assessment/page.tsx`,
  `app/assessment/result/[resultId]/page.tsx`, `app/apply/sober-muse/page.tsx`,
  `app/thank-you/application/page.tsx`, `components/forms/ClientIntakeForm.tsx`,
  `components/funnel/FunnelProgress.tsx`, `components/brand/StickyMobileCTA.tsx`,
  `components/brand/PackageTiers.tsx`), cross-referenced copy via `grep` across
  the whole repo including `docs/*` and `lib/brevo-templates.ts`. Findings below
  are grounded in file:line, not guesswork.
- **What's already strong (do not touch, do not "improve" away):**
  `FunnelProgress` 4-step stepper on every conversion page; readiness-branched
  copy/CTA on the assessment result page; real-capacity scarcity ("I hold four
  each week") instead of fake urgency; consistent 48-hour reply promise;
  deposit-credited-toward-programme framing repeated at every price mention;
  `StickyMobileCTA`'s accessibility-correct hidden state; Stripe-redirect
  reassurance copy in `ProgrammeSelector`.
- **Verification gate (all phases):** `npx tsc --noEmit` clean → preview-render
  the changed page(s) → confirm no other page silently regressed (grep for the
  old copy across the repo before declaring a phase done — this audit exists
  because copy drifted silently once already) → `git push origin main` →
  Vercel `● Ready` → live URL check.
- **Commit rules:** no `Co-Authored-By` trailers (Vercel Hobby blocks them).
  Push only to `main`.
- **Never:** invent new duration/price claims not confirmed against the actual
  form/checkout behaviour; touch `StickyMobileCTA`, `FunnelProgress`, or the
  readiness-branching logic in the course of a copy fix — those are the parts
  of this funnel that are working.

---

## Phase 1 — Fix intake-form thank-you page (CRITICAL) ✅ DONE (commit `2c15c08`)

**Goal:** Stop telling already-accepted, already-paid clients that their
"application" is still under review. This is live, ongoing client-facing harm —
every client who completes intake today sees acceptance-uncertainty language
about a decision that was already made when she signed the contract.

**Files:**
- `app/thank-you/intake/page.tsx` (NEW) — confirmation copy appropriate to
  someone who has already been accepted and paid. No "I read every application
  personally," no "within 48 hours," no "if I don't think it's the right fit."
  Instead: acknowledge intake received, state what happens next (first session
  logistics — reuse whatever the client already knows from
  `app/thank-you/application/page.tsx`'s tone/voice, not its content), one
  quiet next step (e.g. a link back to `/members/[token]` if the token is
  available, or simply "I'll see you at our first session").
- `components/forms/ClientIntakeForm.tsx:224` (EDIT) — change
  `router.push("/thank-you/application")` to `router.push("/thank-you/intake")`.

**Verification:**
1. `npx tsc --noEmit` clean.
2. Preview-render `/thank-you/intake` directly — confirm no acceptance-pending
   language appears anywhere on it.
3. Grep the repo for any other caller of `/thank-you/application` to confirm
   only the true pre-acceptance application form (`ApplicationForm.tsx`) still
   points there — `ClientIntakeForm.tsx` must be the only redirect changed.
4. Confirm `/thank-you/application` itself is untouched (first-time applicants
   still need that exact copy — it is correct for them).

**Gate:** both thank-you pages render; grep confirms each form points to the
page matching its actual funnel stage.
**Rollback:** revert the one-line redirect change; delete the new page. Zero
risk to any other route — this is fully isolated to one form's success path.

**Shipped:** `app/thank-you/intake/page.tsx` created (confirms receipt,
confidentiality, and the already-known booking link — no acceptance-pending
language). `ClientIntakeForm.tsx:224` redirect updated. Verified live in
preview and on production: `curl` of the live page confirmed no occurrence of
"48 hours" or "read every application" on the new page, and `/thank-you/application`
was confirmed unchanged (still correct for genuine first-time applicants —
`ApplicationForm.tsx` is its only remaining caller).

---

## Phase 2 — Standardize the application-form time estimate ✅ DONE (commit `2c15c08`)

**Goal:** One claim, everywhere: "about ten minutes" (matches the real
`apply/sober-muse` page copy and the majority of existing docs/email copy).
Currently two spots say "six minutes" for the same form.

**Files:**
- `components/funnel/WhatHappensNext.tsx:38` — `"about six minutes"` →
  `"about ten minutes"`.
- `app/assessment/result/[resultId]/page.tsx:171` — `"Six minutes."` →
  `"Ten minutes."`.

**Verification:**
1. `npx tsc --noEmit` clean.
2. `grep -rn "six minutes\|Six minutes" app/ components/` returns nothing.
3. Preview-render the assessment result page (all three readiness branches —
   low/medium/high change which block of copy shows, so check each) and
   confirm the medium-readiness CTA subline now reads "Ten minutes."
4. Preview-render `WhatHappensNext` wherever it's mounted (assessment result
   page) and confirm the updated line.

**Gate:** grep for the old strings is clean; both call sites render "ten
minutes" correctly across all readiness branches.
**Rollback:** two-line text revert, no structural risk.

**Shipped:** both strings changed. Verified live in preview by generating a
valid signed `resultId` (medium-readiness branch, the one that renders both
changed strings on one page) and confirming the rendered page reads "Takes
about ten minutes" (`WhatHappensNext`) and "FIVE QUESTIONS. TEN MINUTES."
(CTA subline) simultaneously. `grep -rn "six minutes"` across `app/` and
`components/` returns nothing.

**Found in passing, not fixed (separate, pre-existing, low-priority):**
`components/brand/NewsletterPopup.tsx`'s `SUPPRESSED_PATH_PREFIXES` list does
not include `/intake` — the newsletter popup could technically interrupt a
client mid-way through the sensitive medical intake form. A stale comment in
`app/layout.tsx:52` suggests this suppression was intended but never added to
the actual array. Low risk in practice (popup triggers require 25s dwell / 50%
scroll / exit-intent, all unlikely mid-form), but worth a one-line fix in a
future pass: add `/intake` to `SUPPRESSED_PATH_PREFIXES`.

---

## Phase 3 — Verify consultation price in live Brevo campaigns (MANUAL — human action) ✅ DONE

**Goal:** Confirm the live Brevo email sequences charge the same €350 the site
and Stripe checkout actually charge — not the €450 quoted in
`docs/BREVO_AUTOMATION_PLAYBOOK.md:383`.

**This is not a code change.** `docs/BREVO_AUTOMATION_PLAYBOOK.md` is
reference documentation, not the live campaign content — I cannot verify what
is actually configured inside Brevo's dashboard from this repo.

**Action required (Martina, 5 minutes):**
1. Open Brevo → the campaign/automation that quotes the consultation price
   (search sent/draft campaigns for "consultation" or "€").
2. Confirm every instance says **€350**, matching the live site
   (`lib/pricing.ts` `DEPOSIT = 350`) and Stripe checkout.
3. If any campaign says €450 (or any other figure), correct it in Brevo
   directly and note the campaign name here so it doesn't get re-audited.

**Gate:** Martina confirms in chat (or updates this doc) that live Brevo copy
matches €350 everywhere.
**Rollback:** n/a — this phase only reads and corrects Brevo, no site code
touched.

**Confirmed 2026-07-11:** Martina checked the live Brevo campaigns directly —
€350 everywhere, matching the site and Stripe checkout. No mismatch in
production email copy. The €450 figure was stale/incorrect only inside
`docs/BREVO_AUTOMATION_PLAYBOOK.md:383` (a reference doc, never live), fixed
in the same pass so it doesn't mislead a future read of that playbook.

---

## Phase 4 — Featured-tier visual treatment on `/work-with-me` (OPTIONAL, lower priority)

**Goal:** `PackageTiers.tsx` already has a `featured: true` flag on "The open
line" tier (`components/brand/PackageTiers.tsx:25`) but nothing in the render
currently uses it to visually distinguish that card — reduce two-axis
(programme × format) decision paralysis by giving the visitor one clear
default.

**Files:**
- `components/brand/PackageTiers.tsx` (EDIT) — use the existing `tier.featured`
  boolean to apply a subtle distinguishing treatment (e.g. a pink top border,
  or a small "Most chosen" eyebrow tag) consistent with the existing dark-card
  aesthetic. No new color tokens — pull only from the approved palette
  (`plum`/`pink` accents already used elsewhere on this same component).

**Verification:**
1. `npx tsc --noEmit` clean.
2. Preview-render `/work-with-me#programmes` in both `surface="cream"` and
   `surface="ink"` contexts (component supports both — confirm the featured
   treatment reads correctly on each background).
3. Confirm the two non-featured tiers are visually unchanged.

**Gate:** featured tier is visually distinct without introducing a new color
or breaking either surface variant.
**Rollback:** revert the one component file.

**Not scheduled yet:** homepage's two competing hero CTAs (finding #2 in the
audit) — deliberately deferred until Phase 6 of `PRODUCTION_STABILITY_PLAN.md`
(GA4 funnel instrumentation) ships. Guessing which CTA to de-emphasize without
click data risks removing the one that's actually converting. Revisit once
event data exists.

---

## Sequencing & why

| # | Phase | Risk if skipped | Effort | Status |
|---|-------|------------------|--------|--------|
| 1 | Intake thank-you fix | Ongoing — every paying client sees acceptance-anxiety copy today | 30 min | ✅ Done |
| 2 | Time-estimate consistency | New trust wobble each time a lead notices the mismatch | 10 min | ✅ Done |
| 3 | Brevo price verification | Possible price confusion between email and checkout | 5 min (manual) | ✅ Done — confirmed €350 |
| 4 | Featured-tier treatment | Missed conversion lift, not a bug | 20 min | **Next** — optional |

Phases 1–3 are closed. The whole application → intake → consultation price
chain is now consistent end to end: site copy, Stripe checkout, live Brevo
campaigns, and reference docs all say €350 / ten minutes. Only Phase 4
(optional visual polish) remains.

## Out of scope (tracked separately)
Homepage hero CTA prioritization — blocked on GA4 data (see
`docs/PRODUCTION_STABILITY_PLAN.md` Phase 6). Broader pricing-anchor redesign
on `/work-with-me` beyond the featured-tier tweak — a bigger design pass, not
a safe incremental fix, and not requested.
