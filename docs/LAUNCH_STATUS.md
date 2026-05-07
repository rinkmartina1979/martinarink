# Launch Status — Production Ready

> Last updated: 2026-05-07
>
> This document is the single source of truth for what's live, what's blocked, and what Martina has to do herself.

---

## ✅ Live in production right now

### Site & SEO
- ✅ `martinarink.com` deployed via GitHub Actions → Vercel on every push to `main`
- ✅ `www.martinarink.com` redirects to apex (canonical)
- ✅ `PREVIEW_MODE = false` — Google can crawl
- ✅ `/robots.txt` allows everything except `/book`, `/apply`, `/thank-you`, `/api/`, `/assessment/result`
- ✅ `/sitemap.xml` auto-includes 14 static pages + Sanity blog posts
- ✅ Per-page OG images (homepage, sober-muse, empowerment) — programme-specific social cards
- ✅ Reading time + Article structured data on `/writing/[slug]`
- ✅ Related Articles on `/writing/[slug]` (reduces blog bounce)

### Sanity Studio
- ✅ Studio at `martinarink.com/admin`
- ✅ Martina (`rinkmartina1979@gmail.com`) is administrator
- ✅ All page singletons editable: Homepage, About, Sober Muse, Empowerment, Work With Me, Press, Contact, Newsletter, Assessment, Creative Work
- ✅ Document collections: Writing/Articles, Testimonials, FAQs, Press Items, Publications, Partner Logos
- ✅ Visual Editing + Draft Mode wired up

### Sales funnel
- ✅ Newsletter popup — triggers on 25s dwell / 50% scroll / desktop exit-intent. 30-day suppression cookie. Self-suppresses on `/assessment`, `/apply/*`, `/book`, `/thank-you`, `/admin/*`.
- ✅ Newsletter API (`/api/newsletter`) → Brevo contact + `newsletter_subscribed` event + `popup_email_captured` event (when source=popup)
- ✅ Assessment API (`/api/assessment`) → Sanity backup + Brevo contact + `assessment_completed` event + `high_intent_lead` event (when readiness=high) + Resend notification to Martina
- ✅ Calendly webhook handler (`/api/webhooks/calendly`) — code complete, see "Blocked" below
- ✅ Application forms (`/apply/sober-muse`, `/apply/empowerment`) → Brevo + Resend
- ✅ Booking gate at `/book` — application-only, with `?token=approved` issued in acceptance email

### Legal & compliance
- ✅ Impressum populated with Karlsruhe legal data (Steinkreuzstr. 26b, 76228 Karlsruhe; HRB 21885; VAT DE 283558251)
- ✅ Coaching disclaimer on `/sober-muse` and `/empowerment`
- ✅ Privacy + Terms pages live
- ✅ No banned-word content; no fake testimonials

### Imagery
- ✅ Homepage: studio portrait (hero), library portrait (Creative Work), Ibiza salon portrait (About)
- ✅ Sober Muse: B&W studio (hero), event plum dress (Investment)
- ✅ Empowerment: Ibiza sunset (hero), starry night sky (full-width strip)

---

## 🚨 Blocked — requires Martina action

### 1. Calendly Standard plan upgrade ($10/mo) — REQUIRED for booking automation

**Status:** Free plan does not include webhooks. The `/api/webhooks/calendly` endpoint is built and signed, but Calendly's API returns:

```
HTTP 403 — Permission Denied
"Please upgrade your Calendly account to Standard"
```

**Why this matters:** Without the webhook, every consultation booking is silent. Martina has to manually check Calendly, manually email confirmation, manually tag the lead in Brevo. With it, the entire chain runs automatically:

- Brevo `consultation_booked` event fires → confirmation email auto-sends
- Martina gets a Resend notification with the booking details
- Brevo automation can run "prep questions" email 24h before the call
- `consultation_canceled` and `consultation_no_show` fire recovery emails

**To unlock:**
1. Go to **calendly.com/account/billing**
2. Upgrade to **Standard** ($10/mo or $96/year)
3. Tell me — I'll re-run the webhook setup script (token already on file) in 30 seconds

**Cost/value read:** $10/mo to recover even one missed booking pays for itself many times over. This is not premature SaaS spend — Calendly is already core infrastructure.

### 2. Add `CALENDLY_WEBHOOK_SIGNING_KEY` to Vercel env vars

Once the upgrade is done, Calendly returns a signing key when we register the webhook. I'll handle it via the Vercel API — but you'll need to paste me a Vercel CLI token if the current one has expired again.

### 3. Configure Brevo automations in the UI

Events are firing into Brevo correctly, but you have to create the automations that listen for them:

| Event name (must match exactly) | Suggested automation |
|---|---|
| `newsletter_subscribed` | 1 welcome letter, 7 days delay |
| `popup_email_captured` | (optional) popup-specific welcome variant |
| `assessment_completed` | 5-letter sequence, branched by `ARCHETYPE` attribute |
| `high_intent_lead` | Pre-consultation warm-up to Martina (internal alert) |
| `consultation_booked` | Confirmation, 24h reminder, prep notes |
| `consultation_canceled` | "Would you like to reschedule?" |
| `consultation_no_show` | One-time recovery email |

**To configure:** Open brevo.com → Automations → Create new → Trigger = "When a custom event is performed" → enter the event name exactly as written above.

### 4. Submit `sitemap.xml` to Google Search Console

1. Open **search.google.com/search-console**
2. Add property `martinarink.com` if not already
3. Verify ownership (DNS TXT record or HTML file — Vercel can serve it)
4. Sitemaps → Add new sitemap → enter `sitemap.xml`

Without this, Google will eventually find the site organically — but submission cuts the discovery time from ~4 weeks to ~3 days.

---

## ⏸️ Phase 2 — planned, not built (intentionally)

See **`docs/PHASE_2_ARCHITECTURE.md`** for the full plan. Phase 2 includes:

- Members area at `/members/[token]` (signed HMAC tokens, no login)
- Hello Audio integration for between-session audio drops
- Stripe €450 deposit before Calendly booking
- Bi-weekly email digest of `/writing` posts
- Case studies on `/press`
- Internal analytics dashboard at `/admin/analytics`

**Trigger to start Phase 2 build:** All 7 conditions in `docs/PHASE_2_ARCHITECTURE.md#phase-2-trigger-checklist` must be ✅. Most importantly:

1. **5 paid clients enrolled** (so we know what they need)
2. **Martina has explicitly asked for a members area** (so we know we're solving a real problem)
3. **Monthly programme revenue ≥ €5K** (so the ~€50/mo new tooling is sustainable)

Until these are met, the senior-architect read is: **don't build it.** The Phase 1 funnel is the priority — adding Phase 2 too early dilutes focus.

---

## ❌ Tools we are NEVER adding

From the briefing-sheet review:

| Tool | Why not |
|---|---|
| Padlet | K-12 classroom whiteboard — brand-incompatible aesthetic |
| ThingLink | Museum / educational image tool — brand-incompatible |
| Spreaker | Splits podcast authority — *People of Deutschland* already exists on Spotify with Simon Usifo |
| Kajabi / Teachable | Proprietary brand surfaces — fragments visual identity |
| Notion as "client portal" | Public-Notion aesthetic does not justify €5K |
| ClickFunnels-style funnel builders | Visibly downgrade the brand within one click |

---

## What I built this session

1. **`lib/brevo.ts`** — Added `trackBrevoEvent()` for `POST /v3/events`. Without this, no Brevo automation ever fired. Wired into newsletter and assessment flows. **This was the silent break.**
2. **`app/api/webhooks/calendly/route.ts`** — Calendly v2 webhook handler with HMAC-SHA256 signature verification, 5-minute replay protection, fail-closed if signing key missing.
3. **`components/brand/NewsletterPopup.tsx`** — Editorial email-capture popup, brand-compliant copy, exit-intent + dwell + scroll triggers, 30-day cookie.
4. **`app/sober-muse/opengraph-image.tsx`** + **`app/empowerment/opengraph-image.tsx`** — Programme-specific social cards.
5. **`lib/posts.ts`** — Reading time + Article structured data builders.
6. **`app/writing/[slug]/page.tsx`** — Now shows reading time, Article JSON-LD, and 2 Related Articles.
7. **`docs/ECOSYSTEM_ROADMAP.md`** — Phase 1/2/3 plan with triggers; protects future sessions from premature SaaS spend.
8. **`docs/PHASE_2_ARCHITECTURE.md`** — Detailed Phase 2 plan (schemas, routes, auth, trigger checklist).
9. **`docs/LAUNCH_STATUS.md`** — This file.
