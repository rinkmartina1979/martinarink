# Martina — Your Step-by-Step Configuration Guide
> Everything you need to do yourself to get the website fully live.
> **Total time: ~5 hours, spread over 2–3 days.**
> No technical knowledge needed. Each step has screenshots cues and exact buttons to click.

---

## Before you start — gather these accounts

You should have logins for:
- [ ] **Vercel** — vercel.com (hosting)
- [ ] **Brevo** — app.brevo.com (email)
- [ ] **Cal.com** — cal.com (booking)
- [ ] **Stripe** — dashboard.stripe.com (payments)
- [ ] **Google Search Console** — search.google.com/search-console (SEO)
- [ ] **Resend** — resend.com (already wired, no action needed)
- [ ] **Sanity** — already wired, no action needed (the `/admin` part of your site)

If any login is missing, write me before starting.

---

## 🎯 Priority order (do these in this sequence)

1. **DAY 1 (45 min)** — Brevo: load the email sequences + verify your sender domain
2. **DAY 1 (30 min)** — Cal.com: enable €450 deposit + manual approval
3. **DAY 1 (15 min)** — Google Search Console: submit your sitemap
4. **DAY 2 (60 min)** — Stripe: webhook + SEPA + 3 Price IDs
5. **DAY 2 (30 min)** — Vercel: create Postgres database + add 4 env vars
6. **DAY 3 (60 min)** — Smoke test: send yourself a test lead through the whole funnel

---

# 📧 STEP 1 — Brevo Email Setup (45 min)

## 1.1 Authenticate your sending domain (the most important step)

**Why:** Without this, your emails will land in spam folders. Premium clients don't open emails from spam.

1. Open **app.brevo.com**
2. Click your profile (top right) → **Senders, Domains & Dedicated IPs**
3. Click the **Domains** tab
4. If `martinarink.com` is **not** listed, click **+ Add a domain** → type `martinarink.com` → **Save**
5. Brevo will show you **3 DNS records** to add (DKIM, Brevo-code, DMARC). They look like:
   ```
   Record 1: mail._domainkey.martinarink.com → CNAME → mail.smtp-brevo.com
   Record 2: brevo-code.martinarink.com → TXT → [unique code]
   Record 3: _dmarc.martinarink.com → TXT → v=DMARC1; p=quarantine; pct=100
   ```
6. **Copy these 3 records.** Paste them into an email and send to your domain manager (whoever bought `martinarink.com`). Ask them to "add these 3 DNS records to martinarink.com — they are for email authentication."
7. Once your domain manager confirms they've added the records, come back to Brevo and click **Authenticate this domain**.
8. Wait ~30 minutes. Refresh. You should see green ✓ next to all 3 records.

**Done when:** You see "Domain authenticated" with 3 green checkmarks in Brevo.

---

## 1.2 Verify your contact attributes exist

1. In Brevo, go to **Contacts → Settings → Contact attributes**
2. Confirm these attributes exist (create any missing — case-sensitive):

| Attribute name | Type | Purpose |
|---|---|---|
| `ARCHETYPE` | **Text** | Assessment result (Quiet Reckoning / Threshold / Return) |
| `READINESS` | **Text** | How urgent the lead feels (high / medium / low) |
| `SERVICE_INTENT` | **Text** | Which programme they're interested in |
| `PRIVACY_NEED` | **Text** | NDA flag |
| `SOURCE` | **Text** | Where the lead came from (assessment / newsletter / popup) |
| `BOOKING_STATUS` | **Text** | booked / canceled / no-show / completed |
| `LAST_BOOKING_DATE` | **Date** | When they last booked |
| `ASSESSMENT_COMPLETED` | **Boolean** | True if they finished the quiz |
| `COMPLETED_AT` | **Date** | When they completed |

> **Important:** Make sure types are EXACTLY as listed. `ARCHETYPE` must be **Text**, not Category — if it's Category, segmentation silently breaks.

---

## 1.3 Create 7 automations (the email sequences)

Each automation listens for an event from your website. Create them in this order:

### Automation 1 — Newsletter Welcome
- Brevo → **Automations** → **Create a new automation** → start from scratch
- **Name:** "Newsletter — Welcome"
- **Trigger:** "When a custom event is performed" → type event name: `newsletter_subscribed`
- **Steps:**
  1. Wait: immediate
  2. Send email: copy/paste the welcome letter from `docs/email-sequences/SEQUENCE_B_weekly_newsletter.md` (Letter 1)
- **Save → Activate**

### Automation 2 — Assessment 5-Letter Sequence (the most important)
- Create new → Name: "Assessment — 5-letter nurture"
- **Trigger:** Event `assessment_completed`
- **Steps:**
  1. **Day 0** (immediate): Send Letter 1 — see `SEQUENCE_A_assessment_completers.md`
  2. Wait **5 days**
  3. Send Letter 2
  4. Wait **5 days**
  5. Send Letter 3
  6. Wait **4 days**
  7. Send Letter 4
  8. Wait **5 days**
  9. Send Letter 5
- **Optional branching:** if `ARCHETYPE = "Quiet Reckoning"` → use that variant of each letter
- **Save → Activate**

### Automation 3 — High-Intent Alert (internal)
- Create new → Name: "High-intent lead alert"
- **Trigger:** Event `high_intent_lead`
- **Steps:**
  1. Immediate: Send email **to yourself** (`rinkmartina1979@gmail.com`) with subject "🚨 High-intent lead from assessment"
  2. Body: paste contact attributes (Brevo has a dynamic field picker)
- **Save → Activate**

### Automation 4 — Consultation Booked Confirmation
- Create new → Name: "Consultation booked"
- **Trigger:** Event `consultation_booked`
- **Steps:**
  1. Immediate: Send confirmation email — see `SEQUENCE_C_post_consultation.md` Letter 0
  2. Wait until 24 hours before booking date: Send reminder email — Letter R
  3. Wait until 2 hours before: Send "see you soon" email — Letter R2
- **Save → Activate**

### Automation 5 — Consultation Canceled (recovery)
- Create new → Name: "Consultation canceled — recovery"
- **Trigger:** Event `consultation_canceled`
- **Steps:**
  1. Immediate: "Would you like to reschedule?" email
  2. Wait 3 days
  3. If still no rebook: gentle "this offer remains open" email
- **Save → Activate**

### Automation 6 — Consultation No-Show
- Create new → Name: "Consultation no-show"
- **Trigger:** Event `consultation_no_show`
- **Steps:**
  1. Send one-time recovery email: "I was holding space for you — here's what to do next"
- **Save → Activate**

### Automation 7 — Popup Email Captured (optional variant)
- Create new → Name: "Popup capture welcome"
- **Trigger:** Event `popup_email_captured`
- **Steps:** Same as Automation 1 (or a variant focused on the article they were reading)
- **Save → Activate**

> **Brevo gotcha:** The "When a custom event is performed" trigger only appears in the dropdown **after** the event has fired at least once. If you can't find it, ask me — I have a script that fires a test event so the option appears.

---

# 📅 STEP 2 — Cal.com Configuration (30 min)

## 2.1 Open your "Private Consultation" event type

1. Go to **cal.com** → log in
2. Click **Event Types** in the sidebar
3. Find "Private Consultation" (45 min). Click **Edit**

## 2.2 Enable manual approval

1. Click the **Limits** tab inside the event type
2. Find **Require booking confirmation** → toggle **ON**
3. This means every booking will sit in pending state until you click "Approve" in Cal.com (or the email you receive)

## 2.3 Set buffer time

1. Still in Limits tab
2. **Before event:** 15 minutes
3. **After event:** 15 minutes
4. **Maximum bookings per day:** 2

## 2.4 Enable €450 deposit collection (CRITICAL)

1. Click the **Apps** tab inside the event type
2. Find **Stripe** in the list → click **Install**
3. Cal.com will ask you to connect your Stripe account → click **Connect** → log in to Stripe in the popup
4. Once connected, back in the Stripe app inside the event:
   - **Charge amount:** `45000` (this is €450 in cents — Cal.com uses cents)
   - **Currency:** `EUR`
   - **Capture method:** Manual capture (so you can refund if you decide to credit it)
   - Toggle **Enabled** ON
5. **Save**

**Done when:** Booking the consultation now shows "€450 deposit required" before confirming the slot.

## 2.5 Customize confirmation + reminders

1. Click **Workflows** tab (or **Email** → **Confirmation**)
2. **Confirmation email:** keep default but change subject to "Your private consultation with Martina — confirmed"
3. Add a **24-hour reminder** workflow
4. Add a **2-hour reminder** workflow

---

# 🔍 STEP 3 — Google Search Console (15 min)

This tells Google "I have a new website, please index it."

## 3.1 Add your property

1. Open **search.google.com/search-console**
2. Click **Add property** (top left)
3. Choose **URL prefix** (not Domain)
4. Type: `https://martinarink.com` → **Continue**

## 3.2 Verify ownership

Google will offer 5 verification methods. The easiest:

1. Choose **HTML tag** method
2. Copy the meta tag (looks like `<meta name="google-site-verification" content="abc123..." />`)
3. Send the tag to me — I'll add it to your website and ship the update
4. Once I confirm, click **Verify** in Search Console

## 3.3 Submit your sitemap

After verification:

1. In Search Console, click your property → **Sitemaps** (left sidebar)
2. Under "Add a new sitemap," type: `sitemap.xml` → **Submit**
3. Wait 24 hours, then check status — should say "Success"

## 3.4 Request indexing on your top 5 pages

1. Click **URL Inspection** (top of left sidebar)
2. Paste this URL → press Enter: `https://martinarink.com`
3. Click **Request Indexing**
4. Repeat for these 4:
   - `https://martinarink.com/about`
   - `https://martinarink.com/sober-muse`
   - `https://martinarink.com/empowerment`
   - `https://martinarink.com/assessment`

**Done when:** All 5 URLs show "Indexing requested" status.

---

# 💳 STEP 4 — Stripe Setup (60 min)

## 4.1 Switch to Live mode

1. Open **dashboard.stripe.com**
2. Top-right toggle: make sure it says **Live mode** (NOT Test mode)

## 4.2 Enable SEPA Direct Debit (lower fees for EU clients)

1. In Stripe sidebar: **Settings → Payment methods**
2. Find **SEPA Direct Debit** → click **Enable**
3. Stripe may ask for: business name, country (Germany), VAT ID (DE 283558251 — already on file) → fill if asked
4. **Save**

## 4.3 Create your 3 products

If they don't exist already:

1. **Products → + Add product**
2. Create **Product 1:** "Private Consultation"
   - Price: **€450** (45000 cents)
   - One-time payment
   - **Save** → copy the **Price ID** (starts with `price_…`) — send this to me as `STRIPE_CONSULTATION_PRICE_ID`
3. **Product 2:** "Sober Muse Method"
   - Price: **€5,000** (500000 cents)
   - One-time payment (or split into 3 instalments if you prefer)
   - **Save** → copy Price ID → send as `STRIPE_PRICE_SOBER_MUSE`
4. **Product 3:** "Female Empowerment & Leadership"
   - Price: **€7,500** (750000 cents)
   - One-time or instalments
   - **Save** → copy Price ID → send as `STRIPE_PRICE_EMPOWERMENT`

## 4.4 Get your Secret Key

1. **Developers → API keys**
2. Under **Secret key** → click **Reveal live key**
3. Copy the full key (starts with `sk_live_…`)
4. Send to me as `STRIPE_SECRET_KEY`

## 4.5 Set up the webhook (so payments confirm automatically)

1. **Developers → Webhooks**
2. Click **+ Add endpoint**
3. **Endpoint URL:** `https://martinarink.com/api/webhooks/stripe`
4. **Description:** "Production payment confirmation"
5. **Listen to events** → select these 4:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
6. Click **Add endpoint**
7. On the new endpoint page, click **Reveal signing secret**
8. Copy the value (starts with `whsec_…`)
9. Send to me as `STRIPE_WEBHOOK_SECRET`

---

# 🗄️ STEP 5 — Vercel Postgres Database (30 min)

This powers your private client portal at `/portal`.

## 5.1 Create the database

1. Open **vercel.com/dashboard**
2. Click **Storage** in left sidebar
3. Click **Create Database**
4. Choose **Neon Postgres** (the default option)
5. **Database name:** `martinarink-portal`
6. **Region:** select **Frankfurt (eu-central-1)** — closest to your German clients
7. Click **Create**

## 5.2 Connect to your project

1. After creation, Vercel asks "Connect this database to a project?" → choose **martinarink.com**
2. Click **Connect**
3. Vercel automatically adds all the connection environment variables — no manual copying needed

## 5.3 Verify the connection string is set

1. In your `martinarink.com` project → **Settings → Environment Variables**
2. Confirm `POSTGRES_URL` is now listed with "Production" environment
3. If not visible: click on the database in **Storage**, go to **.env.local** tab, copy the `POSTGRES_URL` value, then add it manually via "Add Environment Variable"

---

# 🎉 STEP 6 — Final Smoke Test (60 min — together with me)

After all the above is done, we'll do a live test together. I'll guide you through it on a call, but here's what we'll do:

1. **You open** `martinarink.com/assessment` in an incognito browser
2. **You complete** the 7-question quiz with a test email (yours + a `+test` suffix, e.g. `martina+test@martinarink.com`)
3. **Within 5 minutes**, you should receive Letter 1 of the assessment sequence
4. **You click** the consultation CTA in the email
5. **You book** a test consultation on your own Cal.com
6. **You pay** the €450 deposit (use a real card — you can refund yourself afterwards)
7. **We verify** in Brevo that `BOOKING_STATUS=booked` updated automatically
8. **We verify** in Stripe that the payment shows as "Succeeded"
9. **You cancel** the test booking → we verify `BOOKING_STATUS=canceled` updates
10. **You refund** yourself in Stripe

If all 10 work — your funnel is **live and converting**.

---

# 📋 Quick reference — values you need to send me

After completing the above, send me one email with these values. I'll add them to Vercel and the portal will go live.

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONSULTATION_PRICE_ID=price_...
STRIPE_PRICE_SOBER_MUSE=price_...
STRIPE_PRICE_EMPOWERMENT=price_...
```

(`POSTGRES_URL` adds itself automatically — you don't need to send it.)

---

# ❓ Common questions

**Q: What if I get stuck at any step?**
Take a screenshot of where you are and send it to me. I'll talk you through it.

**Q: Can I do this on my phone?**
Brevo + Stripe + Cal.com all work on mobile. Vercel + Google Search Console are easier on desktop.

**Q: Is any of this dangerous to my live site?**
No. None of these steps touch your live website code. They're all account-level configurations on third-party services.

**Q: How will I know when the portal is live for my clients?**
Once you send me the 5 Stripe values + confirm `POSTGRES_URL` is connected, I'll deploy the portal and send you a video walkthrough. Your first client gets a magic-link email and can log in immediately.

**Q: Can I delegate this to an assistant?**
Brevo, Cal.com, and Google Search Console — yes (with care). Stripe — only you should touch this (it's your business's money). Vercel — only you should touch this (it's the master account).

---

> **You don't have to do this all today.** Spread it across this week — even one step per day is fine. The website is already live and people can already book consultations the old way. These steps just make everything automatic.
