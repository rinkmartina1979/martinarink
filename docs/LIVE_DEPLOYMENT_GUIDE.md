# GO LIVE — Step-by-Step Deployment Guide
### Martina Rink Website · April 2026

Do these steps in order. Each step builds on the last. Do not skip ahead.

---

## STEP 1 · Get your Sanity Project ID (5 minutes)

1. Go to **https://sanity.io/manage**
2. Click your project "Martina Rink Website"
3. You will see your **Project ID** — it looks like: `abc12def`
4. Copy it. You will need it in Step 4.

**Then create a write token:**
1. Still in sanity.io/manage → your project
2. Click **API** in the left menu
3. Click **Tokens** → **Add API Token**
4. Name it: `Website Write Token`
5. Role: **Editor**
6. Click **Save** → copy the token immediately (it will not be shown again)

---

## STEP 2 · Get your Brevo List IDs (5 minutes)

You created two lists: **Assessment Leads** and **Newsletter**.

1. Go to **https://app.brevo.com**
2. Click **Contacts** → **Lists**
3. Click on **Newsletter** list — look at the URL. The number at the end is your list ID.
   Example: `app.brevo.com/contact/list/edit/id/7` → ID is `7`
4. Do the same for **Assessment Leads** list.
5. Write both numbers down.

**Then get your API key:**
1. In Brevo → top right → your name → **Profile**
2. Click **SMTP & API** → **API Keys**
3. Click **Generate a new API key**
4. Name it: `Website`
5. Copy the key.

---

## STEP 3 · Get your Resend API Key (5 minutes)

1. Go to **https://resend.com**
2. Click **API Keys** → **Create API Key**
3. Name: `Martina Rink Website`
4. Permission: **Full access**
5. Copy the key.

**Then verify your domain (important — do this now):**
1. In Resend → **Domains** → **Add Domain**
2. Type: `martinarink.com`
3. Resend will show you 3–4 DNS records to add
4. Go to wherever your domain is registered (GoDaddy / IONOS / Namecheap etc.)
5. Add the DNS records exactly as shown
6. Come back to Resend and click **Verify** — can take up to 24 hours

---

## STEP 4 · Get your Calendly Link (2 minutes)

1. Go to **https://calendly.com**
2. Click on your **Private Consultation** event
3. Click **Share** → copy the full URL
   It will look like: `https://calendly.com/yourusername/private-consultation`
4. Write it down.

---

## STEP 5 · Generate the Assessment Security Secret (2 minutes)

This is a security key that signs the assessment results. You must generate it — do not skip.

1. Go to **https://generate.plus/en/base64** — OR open any terminal and run:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Copy the output (a long string of random letters and numbers, 64 characters)
3. Write it down.

---

## STEP 6 · Deploy to Vercel (15 minutes)

This is where all the credentials come together.

### Connect the code to Vercel

1. Go to **https://vercel.com** and log in
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. If the repository is not visible, click **Adjust GitHub App Permissions** and grant access
5. Find `martinarink-next` and click **Import**

### Set Environment Variables (the critical step)

Before clicking Deploy, click **Environment Variables** and add each of these:

| Variable Name | Value | Where to get it |
|---------------|-------|-----------------|
| `NEXT_PUBLIC_SITE_URL` | `https://martinarink.com` | Type this exactly |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID | Step 1 |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Type this exactly |
| `SANITY_WRITE_TOKEN` | Your Sanity write token | Step 1 |
| `ASSESSMENT_RESULT_SECRET` | Your 64-char secret | Step 5 |
| `BREVO_API_KEY` | Your Brevo API key | Step 2 |
| `BREVO_LIST_ID_NEWSLETTER` | Newsletter list ID (number) | Step 2 |
| `BREVO_LIST_ID_ASSESSMENT` | Assessment list ID (number) | Step 2 |
| `RESEND_API_KEY` | Your Resend API key | Step 3 |
| `RESEND_FROM_EMAIL` | `hello@martinarink.com` | Type this exactly |
| `RESEND_REPLY_TO` | `martina@martinarink.com` | Type this exactly |
| `RESEND_NOTIFY_EMAIL` | `martina@martinarink.com` | Your private email |
| `NEXT_PUBLIC_CALENDLY_URL` | Your Calendly link | Step 4 |

**How to add each one:**
1. Type the variable name in the **Name** field
2. Paste the value in the **Value** field
3. Leave environment as **Production, Preview, Development** (all three)
4. Click **Add**
5. Repeat for each row

### Deploy

1. After all variables are added, click **Deploy**
2. Vercel will build the site — takes about 2–3 minutes
3. When it says **Congratulations, your deployment is live** — the site is up on a `*.vercel.app` URL

---

## STEP 7 · Connect Your Domain (10 minutes)

1. In Vercel → your project → **Settings** → **Domains**
2. Type `martinarink.com` → click **Add**
3. Also add `www.martinarink.com` → click **Add**
4. Vercel will show you DNS records to add. You need two:
   - An **A record**: `@` → `76.76.21.21`
   - A **CNAME record**: `www` → `cname.vercel-dns.com`

**Go to your domain registrar** (wherever you manage martinarink.com):
- Log in → DNS settings / Zone editor
- Add the A record and CNAME exactly as Vercel shows

**After adding DNS:**
- Come back to Vercel → Domains
- Wait up to 30 minutes for DNS to propagate
- When Vercel shows a green checkmark, the site is live at martinarink.com

---

## STEP 8 · Set Up Sanity CMS (10 minutes)

1. Go to **https://martinarink.com/admin** (once the domain is live)
   Or use the Vercel URL: `https://martinarink-[xxx].vercel.app/admin`
2. Log in with the Sanity account you created
3. You should see the full CMS interface

**First things to set up in Sanity:**
- Pages → Homepage → update the SEO tab (paste from `docs/UPGRADE_MASTER_v2.md` Section 7)
- Pages → each page → SEO tab → paste the correct title and description
- Do NOT change content yet — the fallback copy is correct and it is already live

---

## STEP 9 · Test Everything (15 minutes)

Run through each item:

### Test the assessment
1. Go to `martinarink.com/assessment`
2. Complete the 7 questions with a real email address (use your own for testing)
3. You should land on a result page at `/assessment/result/[id]`
4. Check Brevo → Contacts → Assessment Leads list — your email should appear
5. Check Brevo → Contacts → click your email → you should see ARCHETYPE, READINESS etc. filled in

### Test the newsletter
1. Go to `martinarink.com/newsletter`
2. Submit your email
3. Check Brevo → Contacts → Newsletter list — your email should appear

### Test the booking page
1. Go to `martinarink.com/book`
2. The Calendly calendar should load and show available times

### Test notifications (requires Resend domain verified)
1. Complete the assessment again with HIGH readiness answers (questions about being ready to invest)
2. Check your email at `martina@martinarink.com` — you should receive a high-intent lead notification

---

## STEP 10 · Set Up Brevo Email Automation (30 minutes — do after testing)

This is the 5-email nurture sequence from `docs/UPGRADE_MASTER_v2.md` Section 8.

1. In Brevo → **Automations** → **Create a new automation**
2. Trigger: **Contact is added to a list** → select **Assessment Leads**
3. Add a **Send email** action for each of the 5 letters:
   - Day 0: "Your letter — and what the page did not quite say"
   - Day 5: "The sentence I hear most often"
   - Day 10: "What I told a client last winter"
   - Day 14: "What another year of this quietly costs"
   - Day 19: "If the timing is right, darling"
4. Between emails, add **Wait** steps: 5 days, 5 days, 4 days, 5 days
5. Activate the automation

**For each email:**
- Template type: **Plain text** (no HTML design — this is intentional)
- Sender name: `Martina`
- Subject: exactly as written in the guide
- Copy-paste the body text from `docs/UPGRADE_MASTER_v2.md`

---

## WHAT DOES NOT NEED SETUP RIGHT NOW

These are optional and can be added after launch:
- **Stripe** — only needed if taking paid deposits online
- **GA4 / Meta Pixel** — add after launch; the site works without them
- **Sanity read token** — not needed for public datasets
- **Sanity webhook secret** — not needed until you set up preview mode

---

## IF SOMETHING DOES NOT WORK

| Problem | What to check |
|---------|--------------|
| Site shows "500 error" | Check Vercel → Deployments → the failing build → click "View logs" |
| Assessment does not save to Brevo | Check `BREVO_API_KEY` and `BREVO_LIST_ID_ASSESSMENT` in Vercel env vars |
| Booking page shows blank | Check `NEXT_PUBLIC_CALENDLY_URL` in Vercel env vars — must be your exact Calendly link |
| Sanity CMS shows "Invalid project ID" | Check `NEXT_PUBLIC_SANITY_PROJECT_ID` — must match exactly what's in sanity.io/manage |
| Domain not connecting | DNS changes can take up to 48 hours. Use https://dnschecker.org to watch progress |
| Email notifications not arriving | Resend domain must be fully verified before emails work |

---

*Guide written April 2026 · martinarink-next project*
