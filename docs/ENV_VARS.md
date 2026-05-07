# Environment Variables — Complete Reference

> **How to add:** Vercel dashboard → Project → Settings → Environment Variables
> Set each to **Production** (and Preview if you want preview deployments to work).

---

## Phase 1 — Already set ✅

| Variable | Value / notes |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `usnktik1` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | Read-write token from sanity.io/manage |
| `SANITY_REVALIDATION_SECRET` | Random string, used for on-demand ISR |
| `BREVO_API_KEY` | From brevo.com → SMTP & API → API Keys |
| `BREVO_LIST_ID_NEWSLETTER` | Numeric list ID for newsletter signups |
| `BREVO_LIST_ID_ASSESSMENT` | Numeric list ID for assessment leads |
| `RESEND_API_KEY` | From resend.com → API Keys |
| `RESEND_FROM_EMAIL` | `hello@martinarink.com` |
| `RESEND_NOTIFY_EMAIL` | `rinkmartina1979@gmail.com` |
| `RESEND_REPLY_TO` | `rinkmartina1979@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://martinarink.com` |
| `NEXT_PUBLIC_CALENDLY_URL` | `https://calendly.com/martinarink/let-s-make-a-change` |
| `CALENDLY_PERSONAL_ACCESS_TOKEN` | Calendly PAT (eyJraWQi...) — used by embed route |

---

## Phase 2 — Add these now

### Members portal
| Variable | How to generate | Notes |
|---|---|---|
| `MEMBERS_TOKEN_SECRET` | `openssl rand -base64 32` or any password manager | 32+ chars. Rotate to revoke ALL member links at once. |
| `MEMBERS_ADMIN_SECRET` | `openssl rand -base64 24` | Martina's admin password for sending links + uploading audio. Keep private. |

### Stripe (€450 deposit)
| Variable | Source | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | stripe.com → Developers → API Keys | Use `sk_live_...` in production. |
| `STRIPE_WEBHOOK_SECRET` | stripe.com → Developers → Webhooks → Add endpoint → signing secret | Endpoint URL: `https://martinarink.com/api/webhooks/stripe` — events: `checkout.session.completed` |
| `STRIPE_CONSULTATION_PRICE_ID` | stripe.com → Products → Create product "Private Consultation" → Add price €450 | Copy the `price_XXXX` ID. To change the amount, create a new price — no code change needed. |

### Cron digest
| Variable | Notes |
|---|---|
| `CRON_SECRET` | Vercel sets this **automatically** for cron jobs on Pro plan. On Hobby plan, set it manually to any random string and add the same value here. |

---

## Upgrade paths (add when ready)

### When upgrading from Vercel Blob → Hello Audio
Replace `VERCEL_BLOB_READ_WRITE_TOKEN` usage in `/api/members/audio-upload` with the Hello Audio API key. The `audioUrl` field shape in Sanity stays the same — just the source changes.

### When upgrading Calendly Free → Standard ($10/mo)
Add `CALENDLY_WEBHOOK_SIGNING_KEY` after running the webhook registration script. The existing `/api/webhooks/calendly` handler is production-ready and will start receiving `consultation_canceled` and `consultation_no_show` events immediately.

---

## Quick setup checklist

1. [ ] `MEMBERS_TOKEN_SECRET` — generate and add to Vercel
2. [ ] `MEMBERS_ADMIN_SECRET` — generate and add to Vercel
3. [ ] Stripe: create product + price, copy `STRIPE_CONSULTATION_PRICE_ID`
4. [ ] Stripe: add webhook endpoint, copy `STRIPE_WEBHOOK_SECRET`
5. [ ] Stripe: add `STRIPE_SECRET_KEY` (live key for production)
6. [ ] `CRON_SECRET` — if on Hobby plan, add manually

After step 5, the full funnel is live:
Assessment → Brevo events → Consultation deposit → Stripe → Calendly → Members portal
