# Ecosystem Roadmap

> **Read this before adding any new SaaS to the stack.**

Martina runs a premium private mentoring practice (€5K Sober Muse Method, €7.5K Empowerment & Leadership). The temptation with this kind of business is to build the *appearance* of an ecosystem — five tools, dashboards, "membership portals" — before the *first paying client has even arrived*.

This document exists so that future sessions (and future Claudes) do not over-build. The brand, not the tooling, is what justifies the price. Every additional logo on a "tools we use" diagram is one more visual system the brand has to absorb without fracturing.

---

## Phase 1 — Now → first 5 paid clients

**Stack (no new SaaS spend):**

| Function | Tool | Status |
|---|---|---|
| CMS | Sanity (project `usnktik1`) | live |
| Email funnel & automations | Brevo | live |
| Booking | Cal.com / Calendly | live |
| Assessment intake | Tally Pro (embedded) | live |
| Application forms | Tally Pro (embedded) | live |
| Payments | Stripe | configured |
| Transactional email | Resend | configured |
| Hosting | Vercel | live |

**What must be true before Phase 2 begins:**
- 5 paid clients have completed (or are mid-engagement) with the 1:1 work.
- The Brevo automation has run end-to-end at least 20 times for real visitors.
- We have data on which assessment archetype converts to consultation, and which converts to paid.
- `/api/webhooks/calendly` has fired for at least 10 real bookings.

**Phase 1 KPIs (the only numbers that matter right now):**
1. Organic traffic to `/` and `/sober-muse` (Google Search Console).
2. Assessment completion rate (started → completed).
3. High-intent leads (Brevo `high_intent_lead` events).
4. Consultation bookings (Brevo `consultation_booked` events).
5. Paid enrolment.

If Phase 1 KPIs aren't moving, **adding tools won't fix it.** The bottleneck is positioning, traffic, or authority — not infrastructure.

---

## Phase 2 — 5 → 10 paid clients

Triggered only when Phase 1 exit criteria are met.

**What we add:**
- **Hello Audio** (€39/mo) — private audio drops between sessions for active 1:1 clients only. NOT a public lead magnet. NOT a podcast.
- **Private member route** at `/members/[clientId]` — Sanity-powered, brand-native, behind a signed link. Replaces any temptation to send clients into a third-party "client portal" that breaks the editorial illusion.

**What we still don't add:**
- ❌ Padlet — K-12 classroom whiteboard. Visual aesthetic is incompatible with the brand at any price point.
- ❌ ThingLink — museum / educational interactive-image tool. Same brand mismatch.
- ❌ Spreaker — Martina already co-hosts *People of Deutschland* with Simon Usifo on Spotify. A second podcast splits authority across two shows. Promote the existing one instead.

**Phase 2 KPI gate before Phase 3:**
- 10 clients have completed the full programme arc.
- The 1:1 curriculum has stabilised (we know which prompts and exercises consistently land).

---

## Phase 3 — 10+ enrolled, curriculum stabilised

Triggered only when Phase 2 exit criteria are met.

**What we add:**
- **Thinkific Pro** (€99/mo) — *only after* the curriculum has been validated through 10 real 1:1 engagements. Used for a productised, self-paced version of the programme — a lower-priced, higher-volume tier that *complements* (does not replace) the 1:1 offering.

**Why we don't build this earlier:**
A self-paced course built before the curriculum is stable will be wrong. We'd then be in the position of either (a) running a course we don't believe in for the sake of cost recovery, or (b) abandoning paying course members mid-cohort. Both are reputation-destructive.

---

## Tools we are NEVER adding

| Tool | Why not |
|---|---|
| Padlet | Brand-incompatible aesthetic (K-12 classroom whiteboard). |
| ThingLink | Brand-incompatible aesthetic (museum/edu interactive-image tool). |
| Spreaker | Splits podcast authority — *People of Deutschland* already exists. |
| Kajabi / Teachable | Proprietary brand surfaces — fragments visual identity. |
| Notion as a "client portal" | Public-Notion aesthetic does not justify €5K. |
| ClickFunnels-style funnel builders | Will visibly downgrade the brand within one click. |

---

## How automations actually fire (so future sessions don't break this)

Brevo automations are triggered by **events**, not by contact creation. Adding a contact via `POST /v3/contacts` does **not** fire any automation.

The codebase therefore calls `POST /v3/events` (`trackBrevoEvent` in `lib/brevo.ts`) at the following points:

| Event | Where it fires | Brevo automation listening |
|---|---|---|
| `newsletter_subscribed` | `subscribeNewsletter()` | Welcome letter (1 email) |
| `popup_email_captured` | `subscribeNewsletter({ source: "popup" })` | Popup-specific welcome (optional) |
| `assessment_completed` | `subscribeAssessmentLead()` | 5-letter assessment sequence (branched by `ARCHETYPE`) |
| `high_intent_lead` | `subscribeAssessmentLead()` when `readiness=high` | Pre-consultation warm-up |
| `consultation_booked` | `/api/webhooks/calendly` on `invitee.created` | Confirmation, reminder, prep notes |
| `consultation_canceled` | `/api/webhooks/calendly` on `invitee.canceled` | "Would you like to reschedule?" |
| `consultation_no_show` | `/api/webhooks/calendly` on `invitee_no_show.created` | One-time recovery email |

If an automation isn't firing, check that:
1. `BREVO_API_KEY` is set on Vercel.
2. The `event_name` in the Brevo automation trigger matches the string above **exactly**.
3. The contact's email matches the `email_id` we sent in the event payload.

---

## Sales funnel (current)

```
Cold visitor
    │
    ├─→ Newsletter popup (after 25s / 50% scroll / exit-intent on desktop)
    │       │  POST /api/newsletter { source: "popup" }
    │       └─→ Brevo: contact + newsletter_subscribed event + popup_email_captured event
    │
    ├─→ Footer / blog newsletter signup
    │       └─→ Brevo: contact + newsletter_subscribed event
    │
    └─→ Assessment (/assessment, 7 questions, Tally embed)
            │  POST /api/assessment { answers, email }
            ├─→ Server-side scoring → archetype + readiness
            ├─→ Brevo: contact + assessment_completed event ( + high_intent_lead if readiness=high )
            ├─→ Sanity: assessmentSubmission backup
            ├─→ Resend: high-intent notification to Martina (if readiness=high)
            └─→ /assessment/result/[resultId] → CTA → Calendly booking
                    │
                    └─→ Calendly v2 webhook → /api/webhooks/calendly
                            ├─→ Brevo: consultation_booked event
                            └─→ Resend: booking notification to Martina
```

## Sales funnel — what to build later (in order)

1. **Stripe checkout pages** for the consultation deposit (€450, credited to programme). Currently `/book` is Calendly-only; once Martina is comfortable, switch to Stripe-payment-required-before-booking via Calendly webhooks + Cal.com paid bookings.
2. **One-pager case studies** (NDA-respected) on `/press` once 5 clients have given testimonial permission.
3. **Email digest** of `/writing` posts — every two weeks, automated from Sanity → Brevo via the existing `newsletter_subscribed` list. Build the digest as a Sanity document; do not build a third-party newsletter platform.

---

## TL;DR for future Claudes

- Do not add Padlet, ThingLink, Spreaker, Kajabi, Teachable, Notion-as-portal, or any funnel builder.
- Do not build Hello Audio integration until 5 paid clients exist.
- Do not build Thinkific integration until 10 paid clients have completed the programme.
- The brand is the asset. The stack stays small.
