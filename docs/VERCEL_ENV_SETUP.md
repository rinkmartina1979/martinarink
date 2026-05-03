# Vercel Environment Variables — Setup Guide

Add all variables in:
**Vercel → Project → Settings → Environment Variables**

Set scope to: **Production + Preview + Development** unless noted.

---

## STEP 1 — Do this before anything else

| Variable | Required | Where to get it | What breaks if missing |
|----------|----------|-----------------|------------------------|
| `ASSESSMENT_RESULT_SECRET` | 🔴 BLOCKING | Run: `openssl rand -hex 32` | `/api/assessment` returns **503** in production. No assessment submissions possible. |

```bash
# Generate the value on your machine:
openssl rand -hex 32
# Example output: a3f8e2d1b4c5...
# Paste that value into Vercel.
```

---

## STEP 2 — Site URL

| Variable | Required | Value | What breaks if missing |
|----------|----------|-------|------------------------|
| `NEXT_PUBLIC_SITE_URL` | Required | `https://martinarink.com` | Canonical URLs and OG metadata point to wrong domain |

---

## STEP 3 — Kit / ConvertKit

Get all Kit values from: **https://app.kit.com/account_settings/developer_settings**

| Variable | Required | Where to get it | What breaks if missing |
|----------|----------|-----------------|------------------------|
| `KIT_API_KEY` | Required for funnel | Kit > Developer Settings > API Key | Kit subscriptions silently skipped |
| `KIT_API_SECRET` | Optional | Kit > Developer Settings > API Secret | Only needed for advanced Kit operations |
| `KIT_FORM_ID_ASSESSMENT` | Required for funnel | Kit > Forms > [your form] > embed code | Subscribers not added to assessment form |
| `KIT_FORM_ID_NEWSLETTER` | Required for newsletter | Kit > Forms > [your form] | Newsletter signup returns 503 |

### Kit Tag IDs

After creating each tag in Kit (see `KIT_SETUP_GUIDE.md`), find the numeric ID and add here.

| Variable | Tag name to create in Kit | Purpose |
|----------|--------------------------|---------|
| `KIT_TAG_ASSESSMENT_COMPLETED` | `assessment:completed` | Applied to everyone who finishes |
| `KIT_TAG_SOURCE_ASSESSMENT` | `source:assessment` | Tracks acquisition channel |
| `KIT_TAG_SEQUENCE_ASSESSMENT` | `sequence:assessment` | Triggers correct sequence automation |
| `KIT_TAG_ARCHETYPE_RECKONING` | `archetype:quiet-reckoning` | Archetype segment |
| `KIT_TAG_ARCHETYPE_THRESHOLD` | `archetype:threshold` | Archetype segment |
| `KIT_TAG_ARCHETYPE_RETURN` | `archetype:return` | Archetype segment |
| `KIT_TAG_INTENT_SOBER_MUSE` | `intent:sober-muse` | Programme interest |
| `KIT_TAG_INTENT_EMPOWERMENT` | `intent:empowerment` | Programme interest |
| `KIT_TAG_INTENT_BOTH` | `intent:both` | Programme interest |
| `KIT_TAG_READINESS_LOW` | `readiness:low` | Nurture depth signal |
| `KIT_TAG_READINESS_MEDIUM` | `readiness:medium` | Nurture depth signal |
| `KIT_TAG_READINESS_HIGH` | `readiness:high` | Priority follow-up signal |
| `KIT_TAG_PRIVACY_STANDARD` | `privacy:standard` | Copy personalisation |
| `KIT_TAG_PRIVACY_HIGH` | `privacy:high` | Privacy-first copy |
| `KIT_TAG_APPLICANT_SOBER_MUSE` | `applicant:sober-muse` | Applied when form submitted |
| `KIT_TAG_APPLICANT_EMPOWERMENT` | `applicant:empowerment` | Applied when form submitted |

**How to find a tag ID:**
1. Go to Kit > Subscribers > Tags
2. Click the tag
3. The numeric ID is in the URL: `app.kit.com/tags/XXXXXXX`
4. That number goes into Vercel

---

## STEP 4 — Sanity CMS

Get from: **https://sanity.io/manage** → select your project

| Variable | Required | Where to get it | What breaks if missing |
|----------|----------|-----------------|------------------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Required for CMS | Sanity > Project > Settings > API | Writing and assessment copy served from code fallbacks only |
| `NEXT_PUBLIC_SANITY_DATASET` | Required | `production` (default) | Sanity queries fail |
| `SANITY_API_TOKEN` | Optional | Sanity > API > Tokens > Read-only | Public dataset works without this |
| `SANITY_WRITE_TOKEN` | Required for lead backup | Sanity > API > Tokens > **Editor role** | Assessment submissions NOT backed up. If Kit fails, lead is lost. |
| `SANITY_WEBHOOK_SECRET` | Optional | Sanity > API > Webhooks | Draft mode preview broken |

**Creating the write token:**
1. Sanity → Project → API → Tokens → Add API Token
2. Name: `assessment-write`
3. Role: **Editor**
4. Copy the token value immediately (shown once only)
5. Paste into `SANITY_WRITE_TOKEN` in Vercel

---

## STEP 5 — Resend (transactional email)

Get from: **https://resend.com/api-keys**

| Variable | Required | Value | What breaks if missing |
|----------|----------|-------|------------------------|
| `RESEND_API_KEY` | Required for notifications | Resend > API Keys | No internal notifications; no application emails |
| `RESEND_FROM_EMAIL` | Required | `hello@martinarink.com` | Notifications fail (unverified sender) |
| `RESEND_REPLY_TO` | Optional | `martina@martinarink.com` | Reply-to missing from emails |
| `RESEND_NOTIFY_EMAIL` | Required for alerts | `martina@martinarink.com` | High-intent leads and applications never notify Martina |

**Important:** The `RESEND_FROM_EMAIL` domain (`martinarink.com`) must be verified in Resend before emails send.
Go to Resend > Domains > Add Domain > follow DNS instructions.

---

## STEP 6 — Calendly / Cal.com

| Variable | Required | Value | What breaks if missing |
|----------|----------|-------|------------------------|
| `NEXT_PUBLIC_CALENDLY_URL` | Required | Your Calendly booking page URL | `/book` page shows blank iframe |

---

## STEP 7 — Stripe (optional — not active in current build)

| Variable | Required | Where | What breaks if missing |
|----------|----------|-------|------------------------|
| `STRIPE_SECRET_KEY` | Optional | Stripe > Developers > API Keys | No payment processing |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Stripe > Developers > API Keys | Client Stripe SDK not initialised |
| `STRIPE_WEBHOOK_SECRET` | Optional | Stripe > Webhooks | Webhook verification fails |

Stripe is installed but not wired to any live routes yet. No feature breaks without these.

---

## STEP 8 — Analytics (optional)

| Variable | Required | Where |
|----------|----------|-------|
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Optional | Google Analytics > Admin > Data Streams |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional | Meta Events Manager |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Optional | Microsoft Clarity > Settings |

Assessment events (`assessment_started`, `assessment_completed` etc.) are already wired.
They fire to dataLayer automatically when GA4 ID is present.

---

## Minimum viable production set

The site functions (assessment works) with only:

```
ASSESSMENT_RESULT_SECRET=...   ← BLOCKING without this
NEXT_PUBLIC_SITE_URL=https://martinarink.com
```

The funnel starts converting with:
```
+ KIT_API_KEY
+ KIT_FORM_ID_ASSESSMENT
+ KIT_TAG_* (16 tags)
```

The system is fully hardened with:
```
+ SANITY_WRITE_TOKEN
+ NEXT_PUBLIC_SANITY_PROJECT_ID
+ RESEND_API_KEY
+ RESEND_NOTIFY_EMAIL
```

---

## After adding variables

**Redeploy is required** after adding or changing any environment variable.

Vercel → Deployments → Redeploy (or push a new commit to trigger automatic deployment).
