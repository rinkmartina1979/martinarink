# Martina Rink — Email & Funnel System (2026, Free-Tier, Production)

> Last verified: 2026-06-19. Stack tested live: Resend ✓, Brevo ✓, domain auth ✓, build ✓.
> This is the single source of truth for how email works on the site. Read before changing any `/api/*` route.

---

## 1. The architecture (why two services, on free tiers)

The system uses **two email services with one job each**. This is the 2026 expert-standard split, and it is what makes the system stable on free plans.

| Service | Job | Why | Free limit |
|---------|-----|-----|------------|
| **Resend** | **Instant / triggered emails** — fired directly from code the moment something happens | You control the send 100%. It does not depend on any automation being wired correctly. If the code runs, the email goes. | 3,000 / month · 100 / day · 1 domain |
| **Brevo** | **Scheduled multi-day drip sequences** + contact/CRM list | Best-in-class visual automation for "send letter 2 on day 4, letter 3 on day 6…". Holds the list. | 300 / day · unlimited contacts · automations included |

**The rule:** if an email must arrive *immediately* (a confirmation, a contract, a notification to Martina) → **Resend, from code**. If an email is part of a *timed nurture sequence over days* → **Brevo automation**.

This means: **even if every Brevo automation were broken, every critical first-touch email still sends.** That is the definition of a stable system.

---

## 2. Every flow, end to end

Legend: 🟢 instant via Resend (code-guaranteed) · 🔵 Brevo drip (scheduled) · 👤 notifies Martina

### Newsletter signup → `/api/newsletter`
1. 🟢 **Instant welcome email** to subscriber (Resend) — *now wired, deployed 2026-06-19*
2. 🔵 Added to Brevo list 2 + `newsletter_subscribed` event → drip letters 2–4 (Brevo automation)

> ⚠️ **De-dup step required in Brevo** — see §4.1. The Brevo newsletter automation must start with a WAIT so it does not also send an instant welcome (subscriber would get two).

### Assessment completed → `/api/assessment`
1. Result shown instantly on `/assessment/result/{resultId}` (signed, server-scored)
2. 🔵 Brevo list 3 + `assessment_completed` event → 8-letter nurture sequence (IDs 6–13 / 29–36)
3. 👤 If readiness = high → `high_intent_lead` event → internal alert to Martina (Resend, via `notifyHighIntentLead`)

### Application submitted → `/api/apply`
1. 🟢 **Instant confirmation** to applicant (Resend) — bridges the 48h wait
2. 👤 🟢 **Instant notification to Martina** (Resend) with a one-click **Accept** button
3. 🔵 Brevo list 3 + `application_submitted` event → applicant bridge sequence (IDs 44–45)

### Martina clicks "Accept" → `/api/accept` (one click, everything fires)
1. 🟢 Acceptance email → client (booking link)
2. 🟢 Coaching contract → client (HMAC-signed, programme template pre-filled)
3. 🔵 Brevo `application_accepted` + `contract_sent` events
4. Contract draft stored in **Vercel Blob** *(requires `BLOB_READ_WRITE_TOKEN` — see §3)*

### Client signs contract → `/api/contract/sign`
1. 🟢 Signed copy → client · 👤 🟢 signed copy → Martina
2. 🟢 **Intake form invite** fires automatically → client
3. 🔵 Brevo `contract_signed` event

### Client submits intake → `/api/intake`
1. 👤 🟢 Full confidential intake → Martina (Resend)
2. 🔵 Brevo `intake_submitted` event

### Consultation booked (Calendly) → `/api/webhooks/calendly`
1. 👤 🟢 Booking notification → Martina (Resend)
2. 🔵 Brevo `consultation_booked` event → confirmation + reminders (IDs 18–20, 39)
   *(requires `CALENDLY_WEBHOOK_SIGNING_KEY` — see §3)*

---

## 3. Required Vercel environment variables (production)

These MUST be set in Vercel → `martinarink.com` project → Settings → Environment Variables (Production + Preview). Without them, the marked flows fail silently.

| Variable | Status | Without it |
|----------|--------|-----------|
| `BREVO_API_KEY` | ✅ set | No list/drip |
| `RESEND_API_KEY` | ✅ set (verify it's the NEW key in Vercel) | No instant emails |
| `RESEND_FROM_EMAIL` = `hello@martinarink.com` | ✅ | — |
| `RESEND_NOTIFY_EMAIL` = `hello@martinarink.com` | ✅ | Martina not notified |
| `NEXT_PUBLIC_SITE_URL` = `https://martinarink.com` | ✅ | Wrong links in emails |
| `ASSESSMENT_RESULT_SECRET` | ❌ **placeholder** | Assessment result page → 503 |
| `BLOB_READ_WRITE_TOKEN` | ❌ **missing** | Contracts can't be stored/signed |
| `CALENDLY_WEBHOOK_SIGNING_KEY` | ❌ **missing** | Booking webhook → 503 |
| `ACCEPT_SECRET` / `CONTRACT_SECRET` | ✅ set | Accept/contract links invalid |

**`ASSESSMENT_RESULT_SECRET`:** generate a fresh 32-byte value — `openssl rand -hex 32` — and paste it into Vercel. Never commit it to git. (A value was generated and shared privately during setup.)
**`BLOB_READ_WRITE_TOKEN`:** Vercel Dashboard → Storage → Blob → Create Store ("contracts") → Connect to project. Token auto-appears.
**`CALENDLY_WEBHOOK_SIGNING_KEY`:** Calendly Developer → Webhook Subscriptions → create one pointing to `https://martinarink.com/api/webhooks/calendly` for `invitee.created`, `invitee.canceled`, `invitee_no_show.created` → copy the `signing_key` from the response.

---

## 4. Required manual steps in Brevo

### 4.1 De-dup the newsletter welcome (CRITICAL — do this now)
Now that the code sends an instant Resend welcome, the Brevo newsletter automation must **not** also send one immediately.
- Brevo → Automations → the newsletter (`newsletter_subscribed`) workflow
- Make the **first step a WAIT** (e.g. "Wait until next Sunday" or "Wait 2 days")
- Its first email becomes **Letter 2** of the relationship, not a second welcome

### 4.2 Fix template 44 (blocked from auto-fixing — do manually)
Brevo → Campaigns → Templates → **ID 44** ("Application submitted — applicant bridge_step_#2"):
- **Subject** is empty → set to: `Your application — what happens next.`
- **Sender** is empty → set to: `Martina Rink <coaching@martinarink.com>` (sender ID 1)
- An email with no subject/sender is rejected or spam-filed.

### 4.3 Verify each automation is ACTIVE
Templates existing ≠ automation running. For each of the 8, confirm the toggle is **ON** and the trigger is the matching custom event:

| Automation | Trigger event (must match exactly) |
|-----------|-----------------------------------|
| Newsletter welcome/drip | `newsletter_subscribed` |
| Popup capture | `popup_email_captured` |
| Assessment nurture | `assessment_completed` |
| High-intent alert | `high_intent_lead` |
| Application bridge | `application_submitted` |
| Consultation confirm/reminders | `consultation_booked` |
| Cancellation recovery | `consultation_canceled` |
| No-show recovery | `consultation_no_show` |

Event names are case-sensitive and defined in [`lib/brevo.ts`](lib/brevo.ts) (`BrevoEventName`). If a workflow's trigger doesn't match, it never fires.

---

## 5. Free-tier limits & when to upgrade

| Signal | Limit (free) | Upgrade trigger |
|--------|-------------|-----------------|
| Brevo daily sends | 300 / day | If >30 new leads/day enter drips → Brevo Starter (€9–25/mo, removes daily cap) |
| Resend volume | 100/day · 3,000/mo | If transactional >100/day → Resend Pro ($20/mo, 50k/mo) |
| Vercel Blob | 1 GB | Contracts are tiny JSON — years of headroom |

**Current Brevo balance: 293 credits.** Fine for soft launch. Watch the daily counter once traffic starts; drips multiply fast (one assessment lead = 8 emails over 14 days).

---

## 6. Deliverability (already strong — keep it that way)
- ✅ `martinarink.com` authenticated on both Brevo (DKIM/SPF via IONOS) and Resend
- **Add DMARC** if not present: TXT record `_dmarc.martinarink.com` → `v=DMARC1; p=none; rua=mailto:hello@martinarink.com` (start at `p=none`, tighten to `quarantine` after 2 weeks of clean reports)
- Keep one consistent sending identity per service: Resend = `hello@`, Brevo = `coaching@`. Don't mix.
- Every template already has an unsubscribe link — required by law (GDPR/CAN-SPAM). Keep it.

---

## 7. Live test results (2026-06-19)
| Test | Result |
|------|--------|
| `npx tsc --noEmit` | ✅ clean |
| `npm run build` | ✅ full tree, 0 errors |
| Resend send → owner inbox | ✅ HTTP 200, delivered (ID `17310462…`) |
| Brevo contact create | ✅ HTTP 201 (#273) |
| Brevo event track | ✅ HTTP 204 |
| Resend domain | ✅ verified, sending enabled |
| Brevo domain | ✅ authenticated + verified |

**Ongoing health check:** `https://martinarink.com/api/health` returns live status of Brevo, Resend, and all required env vars. Check it after setting the missing vars in §3 — it should flip from `degraded` to `ok`.

---

## 8. Definition of done (production checklist)
- [ ] Set `ASSESSMENT_RESULT_SECRET` (value in §3) in Vercel
- [ ] Set `BLOB_READ_WRITE_TOKEN` in Vercel
- [ ] Set `CALENDLY_WEBHOOK_SIGNING_KEY` in Vercel + create the Calendly webhook
- [ ] Confirm the NEW Resend key is in Vercel (not the dead one)
- [ ] Brevo: add WAIT to newsletter automation (§4.1)
- [ ] Brevo: fix template 44 subject + sender (§4.2)
- [ ] Brevo: confirm all 8 automations are ON with correct triggers (§4.3)
- [ ] Add DMARC record (§6)
- [ ] Hit `/api/health` → expect `ok`
- [ ] End-to-end: submit a real newsletter signup, assessment, and application with your own email; confirm each email arrives
