# Production Launch Checklist

Assessment code: **READY** — build passes, QA passed, all routes confirmed.
This checklist covers everything outside the code that must be done before launch.

---

## REQUIRED BEFORE LAUNCH
*The site will not function correctly without these items.*

### Security (BLOCKING)
- [ ] Generate `ASSESSMENT_RESULT_SECRET` — run `openssl rand -hex 32`, add to Vercel
  → **Without this: `/api/assessment` returns 503. No assessment is possible.**

### Vercel
- [ ] All environment variables added — see `docs/VERCEL_ENV_SETUP.md` for full table
- [ ] Redeployed after adding variables (Vercel → Deployments → Redeploy)
- [ ] `NEXT_PUBLIC_SITE_URL=https://martinarink.com` set

### Domain
- [ ] `martinarink.com` connected in Vercel → Project → Domains
- [ ] DNS records updated at registrar (Vercel provides the exact records)
- [ ] HTTPS certificate confirmed (Vercel provisions automatically)
- [ ] `www` redirect configured

### Kit — minimum for funnel to tag leads
- [ ] Kit account created at app.kit.com
- [ ] Assessment form created → `KIT_FORM_ID_ASSESSMENT` added to Vercel
- [ ] Newsletter form created → `KIT_FORM_ID_NEWSLETTER` added to Vercel
- [ ] 7 custom fields created with exact keys — see `docs/KIT_SETUP_GUIDE.md` §3
- [ ] All 16 tags created with exact names → IDs added as `KIT_TAG_*` vars — see §4
- [ ] `KIT_API_KEY` added to Vercel
- [ ] 3 email sequences created (Quiet Reckoning / Threshold / The Return) — see §5
- [ ] 3 automation rules created (archetype tag → sequence trigger) — see §6

### Legal
- [ ] Privacy policy at `/legal/privacy` is accurate and live
- [ ] Imprint at `/legal/imprint` updated with real USt-IdNr
- [ ] Terms at `/legal/terms` are live
- [ ] Privacy policy mentions Kit/ConvertKit as data processor
- [ ] Unsubscribe link in all Kit sequence emails (set in Kit sequence settings)

---

## REQUIRED BEFORE PAID TRAFFIC
*Without these, leads may be lost and Martina won't know high-intent visitors arrived.*

### Lead backup (Sanity)
- [ ] Sanity project created at sanity.io/manage
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` added to Vercel
- [ ] `NEXT_PUBLIC_SANITY_DATASET=production` added to Vercel
- [ ] Write token created (Editor role) → `SANITY_WRITE_TOKEN` added to Vercel
- [ ] Test submission verified in Sanity Studio
- [ ] See `docs/SANITY_LEAD_BACKUP_GUIDE.md`

### Internal notifications (Resend)
- [ ] Resend account created, API key added → `RESEND_API_KEY`
- [ ] Domain `martinarink.com` verified in Resend (DNS records added)
- [ ] `RESEND_FROM_EMAIL=hello@martinarink.com` added to Vercel
- [ ] `RESEND_NOTIFY_EMAIL=martina@martinarink.com` added to Vercel
- [ ] Test: submit assessment with high-readiness answers → notification received
- [ ] See `docs/RESEND_NOTIFICATION_GUIDE.md`

### End-to-end funnel smoke test
- [ ] Submit assessment with real email — result page loads
- [ ] Kit subscriber appears within 30 seconds
- [ ] Correct archetype tag on subscriber
- [ ] Correct intent tag on subscriber
- [ ] Correct readiness tag on subscriber
- [ ] `archetype`, `service_intent`, `readiness_level`, `privacy_need`, `completed_at` fields populated
- [ ] Sequence email 1 received in test inbox
- [ ] For high-readiness submission: internal notification received
- [ ] Sanity backup document visible in Studio
- [ ] Submit `/apply/sober-muse` → application notification received in inbox
- [ ] `/book` loads with Calendly iframe working

### Cal.com / Calendly
- [ ] Booking page created
- [ ] `NEXT_PUBLIC_CALENDLY_URL` set to correct URL
- [ ] Tested in `/book` — iframe loads and booking completes

---

## OPTIONAL — AFTER LAUNCH
*Not required for the funnel to function. Add when ready.*

### Analytics
- [ ] Google Analytics 4 property created → `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- [ ] `assessment_started` / `assessment_completed` / `assessment_result_viewed` verified in GA4 DebugView
- [ ] Meta Pixel (if running Meta ads) → `NEXT_PUBLIC_META_PIXEL_ID`
- [ ] Microsoft Clarity (session recordings) → `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- [ ] Cookie consent banner added if any of the above analytics are active

### Sanity CMS content
- [ ] Result copy for all 3 archetypes entered in Sanity Studio
  - Quiet Reckoning: opening letter, body paragraphs, what this means, what becomes possible, closing
  - Threshold: same structure
  - The Return: same structure
- [ ] Writing/blog posts entered (fallback state shows without them)
- [ ] Site settings (site name, OG image) filled in Sanity

### Email sequences — full copy
- [ ] All 5 emails written and active for Quiet Reckoning sequence
- [ ] All 5 emails written and active for Threshold sequence
- [ ] All 5 emails written and active for The Return sequence
- [ ] Liquid personalisation tested: `service_intent` field drives CTA links correctly

### SEO
- [ ] Submit `/sitemap.xml` to Google Search Console
- [ ] Confirm `martinarink.com` (not Vercel subdomain) is the verified property
- [ ] OG image created and placed at `/public/og-default.jpg`
- [ ] Run Lighthouse on `/`, `/assessment`, `/sober-muse` — LCP < 2.5s

### Stripe
- [ ] Stripe keys added to Vercel when payment routes are wired
- [ ] Currently installed but not connected to live routes — no action needed at launch

---

## Remaining risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| `ASSESSMENT_RESULT_SECRET` not set in production | **CRITICAL** | 503 on all assessment submissions — set this first |
| Kit form/tag IDs not set | High | Kit tagging skipped; Sanity backup captures lead |
| Sanity write token not set | Medium | Warn logged; Kit still runs as primary |
| Resend domain not verified | Medium | Notifications silently fail; leads still in Kit |
| No automated test suite | Medium | Manual test paths in §10 of this doc |
| OG image missing | Low | Text fallback in place |
| Calendly URL not set | Low | `/book` shows blank iframe |

---

## Reference docs

| Task | Guide |
|------|-------|
| Vercel environment variables | `docs/VERCEL_ENV_SETUP.md` |
| Kit forms, tags, sequences, automations | `docs/KIT_SETUP_GUIDE.md` |
| Sanity lead backup | `docs/SANITY_LEAD_BACKUP_GUIDE.md` |
| Resend notifications | `docs/RESEND_NOTIFICATION_GUIDE.md` |
| Assessment system internals | `docs/ASSESSMENT_SYSTEM.md` |
| Full funnel reference | `docs/FUNNEL_SETUP.md` |
