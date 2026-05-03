# Resend — Notification Setup Guide

Resend sends two types of internal notifications:

1. **High-intent lead alert** — fires when a visitor scores `readiness:high` on the assessment
2. **Application notification** — fires when a visitor submits an application via `/apply/*`

Neither email goes to the visitor. Both go to Martina's internal address.

---

## Environment variables

| Variable | Required | Value |
|----------|----------|-------|
| `RESEND_API_KEY` | Required | Get from Resend → API Keys |
| `RESEND_FROM_EMAIL` | Required | `hello@martinarink.com` |
| `RESEND_REPLY_TO` | Optional | `martina@martinarink.com` |
| `RESEND_NOTIFY_EMAIL` | Required | `martina@martinarink.com` |

All four go in Vercel → Project → Settings → Environment Variables.

---

## Step 1 — Create a Resend account and API key

1. Go to **https://resend.com** and sign in / create account
2. Resend → API Keys → **Create API Key**
3. Name: `martinarink-production`
4. Permission: **Full access**
5. Copy the key immediately (shown once)
6. Paste into `RESEND_API_KEY` in Vercel

---

## Step 2 — Verify the sending domain

Emails sent from `hello@martinarink.com` require DNS verification.

1. Resend → **Domains** → **Add Domain**
2. Enter: `martinarink.com`
3. Resend will provide DNS records — typically:
   - SPF record (TXT)
   - DKIM records (CNAME × 2–3)
   - Optional DMARC record
4. Add these records in your DNS provider (Cloudflare, Namecheap, etc.)
5. Click **Verify** in Resend — usually propagates within 5–30 minutes

> Until the domain is verified, all sends will fail silently. The assessment still works — notifications are fire-and-forget and never block the redirect.

---

## High-intent lead notification

### When it fires

- `readinessLevel === "high"` on any assessment submission
- `RESEND_API_KEY` is set
- `RESEND_NOTIFY_EMAIL` is set

### What it sends

**Subject:** `[High Intent] Assessment lead — The Return` (or whichever archetype)

**Body includes:**
- Archetype label
- Service intent (programme interest)
- Readiness level
- Privacy need (if `high`, flagged clearly)
- Email address (with `[PRIVACY HIGH]` note if applicable)
- First name (if provided)
- Timestamp
- Direct link to Kit subscriber search

### What it does NOT send

- Raw answer map
- IP address
- User agent
- Result token

### Code location

`lib/assessment/notify.ts` — `notifyHighIntentLead()`

---

## Application notification

### When it fires

- Visitor submits `/apply/sober-muse` or `/apply/empowerment`
- `RESEND_API_KEY` is set

### What it sends

**Subject:** `[Application] Sober Muse Method — [name]`

**Body includes:**
- Programme applied for
- Name, email, current situation, desired outcome
- How they found Martina
- Readiness question answer
- Timestamp

### Code location

`app/api/apply/route.ts`

---

## Testing notifications

### Option A — Test via the live assessment

1. Add all four Resend vars to `.env.local`
2. `npm run dev`
3. Complete the assessment at `http://localhost:3000/assessment`
4. Answer questions in a way that scores high readiness (select options that describe someone ready to act now)
5. Check `martina@martinarink.com` inbox — notification should arrive within 60 seconds

To reliably trigger `readiness:high`, answer Q7 ("What would it mean to finally act on this?") with the most decisive option.

### Option B — Test via application form

1. Submit `/apply/sober-muse` with test data
2. Check inbox for application notification

### Option C — Check Resend logs

Resend → **Emails** shows all sent, delivered, and failed messages with full content preview. Use this to verify delivery without needing inbox access.

---

## What happens when Resend is not configured

If `RESEND_API_KEY` is missing:
- High-intent leads receive their result normally
- No internal notification is sent
- A `console.warn` is logged server-side
- The visitor experience is unaffected

This is intentional — notifications are not required for the funnel to function. Kit handles tagging regardless of Resend status.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| No notification received | Domain not verified in Resend | Complete DNS verification |
| Notification arrives but from wrong address | `RESEND_FROM_EMAIL` not set | Add var to Vercel + redeploy |
| Notification arrives for medium/low leads too | Bug — should not happen | Check `notify.ts` readiness guard |
| Notifications delayed > 5 minutes | Resend queue / ISP delay | Check Resend logs for delivery status |

---

## GDPR note

Notification emails contain the visitor's email address. This email is:
- Sent only to Martina's internal address
- Not stored by Resend beyond standard log retention (30 days on free plan)
- Covered under your privacy policy's "we use your data to follow up with you" basis

Resend is GDPR-compliant as a data processor. See: https://resend.com/legal/privacy-policy
