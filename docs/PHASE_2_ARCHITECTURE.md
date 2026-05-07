# Phase 2 Architecture

> **Status:** Plan only. Do not build until the Phase 2 Trigger Checklist (bottom of this doc) is fully satisfied.
>
> **Why this exists:** Designing the schemas, routes, and auth model on paper now means that the moment client #5 enrolls, building is mechanical — no architecture decisions blocking ship.

---

## What Phase 2 actually adds

Phase 2 is **not** "rebuild the website." It's three small, disciplined additions that solve real problems Phase 1 cannot:

1. **A private members surface** — so paid clients receive between-session audio drops and milestones inside the brand, not a third-party "client portal" that breaks the editorial illusion.
2. **A consultation deposit gate** — so the €450 Stripe charge happens *before* the Calendly slot, filtering out tire-kickers and signalling high-intent.
3. **An evergreen warming system** — so cold subscribers from the popup and newsletter get a bi-weekly digest of `/writing` posts, without Martina manually composing campaigns.

Everything else (case studies, analytics) is supporting infrastructure that Phase 2 enables but doesn't require.

---

## 1. Members area — `/members/[token]`

### Auth model

Reuse the same HMAC-SHA256 signing model already proven for assessment `resultId`. No login, no password, no third-party auth.

```ts
// lib/members/token.ts
function makeMemberToken(clientId: string, scope: 'audio' | 'milestones' | 'all' = 'all') {
  // Encodes only: clientId, scope, issuedAt, version. NEVER email or PII.
  // Signed with MEMBERS_TOKEN_SECRET (env, 32+ chars).
  // No expiry — Martina rotates the secret to revoke all tokens at once.
}
```

The link is delivered to the client by Resend transactional email (`audio_drop_ready`, `milestone_recorded`). The email itself is the access mechanism. If the client forwards it to someone, that's a trust-relationship problem, not a security one.

### Sanity schemas to add

```ts
// sanity/schema/clientProfile.ts — SINGLETON per active client
{
  name: 'clientProfile',
  fields: [
    { name: 'clientId', type: 'string' },                // stable id used in token
    { name: 'firstName', type: 'string' },
    { name: 'archetype', type: 'string' },               // reckoning | threshold | return
    { name: 'programme', type: 'string' },               // sober-muse | empowerment
    { name: 'enrolledAt', type: 'datetime' },
    { name: 'expectedCompletionAt', type: 'datetime' },
    { name: 'status', type: 'string' },                  // active | paused | completed
    { name: 'privateNotes', type: 'text' },              // Martina's notes — NEVER rendered to client
  ],
}

// sanity/schema/audioDrop.ts
{
  name: 'audioDrop',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'description', type: 'text' },               // 1–2 sentences, editorial voice
    { name: 'audioUrl', type: 'url' },                   // Hello Audio private feed URL OR signed Vercel Blob URL
    { name: 'durationSeconds', type: 'number' },
    { name: 'releasedAt', type: 'datetime' },
    { name: 'visibleTo', type: 'array', of: [{ type: 'reference', to: [{ type: 'clientProfile' }] }] },
    { name: 'transcriptText', type: 'text' },            // optional, for accessibility
  ],
}

// sanity/schema/clientMilestone.ts
{
  name: 'clientMilestone',
  fields: [
    { name: 'client', type: 'reference', to: [{ type: 'clientProfile' }] },
    { name: 'title', type: 'string' },                   // "First sober dinner — declined the wine"
    { name: 'achievedAt', type: 'datetime' },
    { name: 'note', type: 'text' },                      // Martina's reflection, visible to client
  ],
}
```

### Routes

| Route | Purpose |
|---|---|
| `/members/[token]` | Client landing — name, archetype, latest 3 audio drops, latest 5 milestones |
| `/members/[token]/audio/[dropId]` | Single audio player + transcript |
| `/members/[token]/all-audio` | Full audio library for this client |
| `/api/members/verify` | Server-only token verification + clientProfile fetch |

### Brand rules for members surface

- Same Tailwind theme tokens. No "client portal" aesthetic.
- No progress bars. No gamification. No streak counters.
- Audio player is custom (HTML `<audio>` styled to brand) — never the default browser chrome.
- Page top: cream + sand hairline. Page background: same as `/about`.
- Copy voice is identical to public site. No "Welcome back, [Name]!" — just `Good morning, Hannah.` with the script accent.

---

## 2. Stripe €450 deposit before Calendly

### Current state

`/book` embeds Calendly directly. Anyone can book, no commitment, no friction. Resulting in occasional tire-kicker bookings that consume Martina's time.

### Phase 2 state

```
/book (paid) page
  │
  ├─→ Stripe Checkout Session (€450 deposit, applied toward programme if enrolled)
  │     │
  │     └─→ Stripe success_url = /book/calendly?session_id=cs_xxx
  │              │
  │              ├─→ Server verifies Stripe session paid=true
  │              ├─→ Generates pre-filled Calendly URL with email + DEPOSIT_PAID=true UTM
  │              └─→ Renders Calendly embed
  │
  └─→ Stripe cancel_url = /book (with note: "deposit not completed")
```

### What changes in code

| File | Change |
|---|---|
| `/app/book/page.tsx` | Replace direct Calendly embed with "Reserve your consultation" CTA → POST `/api/checkout/consultation` |
| `/app/api/checkout/consultation/route.ts` | NEW. Creates Stripe Checkout Session, returns redirect URL |
| `/app/book/calendly/page.tsx` | NEW. Verifies Stripe session, renders Calendly embed with prefill |
| `/app/api/webhooks/stripe/route.ts` | NEW. Handles `checkout.session.completed` → fires Brevo `consultation_deposit_paid` event |
| `/app/api/webhooks/calendly/route.ts` | EXTEND. Detect `DEPOSIT_PAID=true` UTM, set `DEPOSIT_PAID=true` Brevo attribute |

### New env vars

```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONSULTATION_PRICE_ID=     # €450 product/price configured in Stripe dashboard
```

### New Brevo event

`consultation_deposit_paid` — fires from Stripe webhook. Brevo automation listening on this can send the "thank you, see you on [date]" letter that includes prep questions and a small reading.

---

## 3. Bi-weekly email digest of `/writing`

### Why now

Newsletter signups from the popup will accumulate quickly. A welcome letter (Phase 1, already wired) is not enough to keep them warm — by week 3 they have forgotten Martina exists. A bi-weekly digest of new `/writing` posts is the cheapest possible warming mechanism that respects the brand voice.

### Architecture

```
Vercel Cron (every 14 days, Sunday 09:00 Berlin)
  │
  └─→ POST /api/cron/digest
        │
        ├─→ Sanity: fetch posts published in last 14 days
        ├─→ If 0 posts: skip silently (do not send empty digest)
        ├─→ If ≥1 post: render Brevo campaign HTML server-side using existing brand tokens
        ├─→ Brevo Campaigns API: create campaign, schedule for immediate send to newsletter list
        └─→ Log to Sanity: `emailDigestLog` document with sentAt, postIds, recipientCount
```

### What we DO NOT do here

- ❌ Don't build a "newsletter dashboard" UI. Brevo's UI handles editing if needed.
- ❌ Don't send if zero new posts. Silence is preferable to filler.
- ❌ Don't add open-tracking pixels beyond Brevo's defaults. Privacy-respecting brand.
- ❌ Don't include the popup form in the digest email. They're already subscribed.

---

## 4. Case studies on `/press` (NDA-respected)

### Sanity schema

```ts
// sanity/schema/caseStudy.ts
{
  name: 'caseStudy',
  fields: [
    { name: 'pseudonym', type: 'string' },               // "Hannah" — never real name
    { name: 'industry', type: 'string' },                // "Founder · Tech · DACH"
    { name: 'programme', type: 'string' },               // sober-muse | empowerment
    { name: 'problemSnapshot', type: 'text' },           // 2–3 sentences
    { name: 'workNarrative', type: 'array', of: [{ type: 'block' }] },  // PortableText
    { name: 'outcomeMarker', type: 'text' },             // 1 sentence — never numeric/clinical
    { name: 'permissionGrantedAt', type: 'datetime' },
    { name: 'visibleOnSite', type: 'boolean' },
    { name: 'order', type: 'number' },
  ],
}
```

### Render rule

A case study is **not** a testimonial. Testimonials are quotes. Case studies are narrative.

- No metrics ("lost 12kg"), no clinical language ("rehabilitation"), no banned words.
- No photos of clients. Optional: an editorial mood image (architecture, landscape).
- The pseudonym + industry combo is the whole identity. No first names that match real first names of any past client.

### Page layout

`/press` already exists. Add a section **"Selected work"** below the press logos, max 3 case studies visible. Click expands to a `/press/case/[slug]` page with the full narrative.

---

## 5. Internal analytics dashboard at `/admin/analytics`

### Why now

By Phase 2, Martina will have ~50 newsletter signups, ~30 assessment completions, ~10 consultation bookings. Without a dashboard, she has no idea which channel is working. The default Vercel + Brevo dashboards are not enough — they don't show the funnel end-to-end.

### Architecture

```
/admin/analytics (Sanity Studio admin tool, NOT a public page)
  │
  ├─→ Pulls assessmentSubmission documents from Sanity
  ├─→ Pulls Brevo contacts list via /v3/contacts (paginated, server-side cached 1h)
  └─→ Renders 4 panels:
        1. Funnel (popup view → email → assessment → consultation → enrolment)
        2. Archetype distribution (pie or bar — Reckoning / Threshold / Return)
        3. Top sources (popup, footer, blog post slug, paid ad UTM)
        4. Cancellation/no-show rate
```

### What this is NOT

- ❌ Not a third-party tool (Mixpanel, Amplitude, PostHog). Their dashboards are for SaaS founders, not coaches.
- ❌ Not a custom React dashboard at `/dashboard`. Lives inside Sanity Studio so Martina has one login.
- ❌ Not real-time. Daily refresh is sufficient.

---

## Phase 2 Trigger Checklist

**Do not start Phase 2 build work until ALL of the following are true:**

- [ ] **5 paid clients** have signed contracts (Sober Muse Method or Empowerment).
- [ ] **20+ Brevo automation runs** completed end-to-end (signup → welcome → followups). Verifiable in Brevo Automations → Run history.
- [ ] **10+ `/api/webhooks/calendly` invocations** logged successfully. Verifiable in Vercel Logs.
- [ ] **Conversion data exists**: at least 3 of the 5 paid clients came through the assessment funnel (so we can confidently say archetype X converts at Y%).
- [ ] **Martina has explicitly asked for a members area** because clients are asking for between-session support. (We do NOT build this until clients are asking. Building it speculatively is the trap.)
- [ ] **GSC is showing organic impressions** for the brand name + at least 3 long-tail queries (signal that SEO is working and Phase 2 isn't masking a Phase 1 traffic problem).
- [ ] **Cash flow validates spend**: Hello Audio €39/mo + Stripe fees + Vercel Blob storage = ~€50/mo. Phase 2 is sustainable if monthly programme revenue ≥ €5K (one Sober Muse client). Don't add tooling cost without revenue cover.

If even one of these is unchecked, the answer is "not yet — keep running Phase 1, file the lesson learned for Phase 2."

---

## Phase 1.5 polish (do NOW, before Phase 2)

These are gap-closers that make Phase 1 actually robust before we add complexity. Estimated 1 day total.

| Task | Why | Effort |
|---|---|---|
| Submit `sitemap.xml` to Google Search Console | Without this, Google may take 2–4 weeks to discover the site organically. | 5 min, Martina |
| Configure Brevo automations (`newsletter_subscribed`, `assessment_completed`, `high_intent_lead`, `consultation_booked`) in Brevo UI | Events are firing but no automation listens yet — the funnel is silent until this is done. | 30 min, Martina |
| Add `CALENDLY_WEBHOOK_SIGNING_KEY` to Vercel env + register webhook | Currently `/api/webhooks/calendly` returns 503. | 10 min, Martina + Claude |
| Add OG image variants per page (homepage, sober-muse, empowerment) | Currently all pages share one `/opengraph-image`. Each programme deserves its own social card. | 2 hours, Claude |
| Add reading time + structured data (Article schema) to `/writing/[slug]` | Better SEO + better UX on blog posts. | 1 hour, Claude |
| Add Related Articles section to `/writing/[slug]` | Reduces bounce rate from blog → homepage. | 1 hour, Claude |
| Add `/assessment` dropoff recovery email | Started-but-didn't-complete after 24h is the highest-intent lost lead. Currently we have no retrieval. | 2 hours, Claude |
| Improve 404 page with editorial copy + 3 most-popular pages | Default Next.js 404 is brand-violating. | 30 min, Claude |
