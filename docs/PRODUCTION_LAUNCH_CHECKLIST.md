# Production Launch Checklist

## Status key: ✅ Done | ⏳ Needs action | 🔴 Blocking

---

## 1. Vercel Environment Variables

Add ALL of these in Vercel dashboard > Project > Settings > Environment Variables:

| Variable | Status | Notes |
|----------|--------|-------|
| NEXT_PUBLIC_SITE_URL | ⏳ | Set to https://martinarink.com |
| ASSESSMENT_RESULT_SECRET | 🔴 | Run: openssl rand -hex 32 |
| NEXT_PUBLIC_SANITY_PROJECT_ID | ⏳ | From sanity.io/manage |
| NEXT_PUBLIC_SANITY_DATASET | ⏳ | production |
| SANITY_WRITE_TOKEN | ⏳ | Editor token from Sanity > API |
| KIT_API_KEY | ⏳ | From Kit developer settings |
| KIT_FORM_ID_ASSESSMENT | ⏳ | Numeric ID from Kit Forms |
| KIT_FORM_ID_NEWSLETTER | ⏳ | Numeric ID from Kit Forms |
| KIT_TAG_ASSESSMENT_COMPLETED | ⏳ | Numeric tag ID |
| KIT_TAG_SOURCE_ASSESSMENT | ⏳ | Numeric tag ID |
| KIT_TAG_SEQUENCE_ASSESSMENT | ⏳ | Numeric tag ID |
| KIT_TAG_ARCHETYPE_RECKONING | ⏳ | Numeric tag ID |
| KIT_TAG_ARCHETYPE_THRESHOLD | ⏳ | Numeric tag ID |
| KIT_TAG_ARCHETYPE_RETURN | ⏳ | Numeric tag ID |
| KIT_TAG_INTENT_SOBER_MUSE | ⏳ | Numeric tag ID |
| KIT_TAG_INTENT_EMPOWERMENT | ⏳ | Numeric tag ID |
| KIT_TAG_INTENT_BOTH | ⏳ | Numeric tag ID |
| KIT_TAG_READINESS_LOW | ⏳ | Numeric tag ID |
| KIT_TAG_READINESS_MEDIUM | ⏳ | Numeric tag ID |
| KIT_TAG_READINESS_HIGH | ⏳ | Numeric tag ID |
| KIT_TAG_PRIVACY_HIGH | ⏳ | Numeric tag ID |
| KIT_TAG_APPLICANT_SOBER_MUSE | ⏳ | Numeric tag ID |
| KIT_TAG_APPLICANT_EMPOWERMENT | ⏳ | Numeric tag ID |
| RESEND_API_KEY | ⏳ | From resend.com |
| RESEND_FROM_EMAIL | ⏳ | hello@martinarink.com |
| RESEND_NOTIFY_EMAIL | ⏳ | martina@martinarink.com |
| NEXT_PUBLIC_CALENDLY_URL | ⏳ | Your Calendly booking URL |

**Minimum viable set (assessment works without Kit/Resend):**
- ASSESSMENT_RESULT_SECRET — BLOCKING. Site 503s in production without this.

---

## 2. Sanity Setup

| Task | Status |
|------|--------|
| Create Sanity account and project | ⏳ |
| Get project ID → NEXT_PUBLIC_SANITY_PROJECT_ID | ⏳ |
| Create Editor API token → SANITY_WRITE_TOKEN | ⏳ |
| Run `npx sanity deploy` to deploy Studio | ⏳ |
| Open /admin on live site and verify Studio loads | ⏳ |
| Create 3 Assessment Result documents (reckoning, threshold, return) | ⏳ |
| Verify result pages fetch from Sanity (not just fallback) | ⏳ |

---

## 3. Kit Setup

| Task | Status |
|------|--------|
| Create Kit account (kit.com) | ⏳ |
| Create assessment form → KIT_FORM_ID_ASSESSMENT | ⏳ |
| Create newsletter form → KIT_FORM_ID_NEWSLETTER | ⏳ |
| Create all 16 tags listed in FUNNEL_SETUP.md | ⏳ |
| Create all 8 custom fields listed in FUNNEL_SETUP.md | ⏳ |
| Create 3 email sequences (Reckoning / Threshold / Return) | ⏳ |
| Set up automation triggers for each archetype tag | ⏳ |
| Test: submit assessment → verify subscriber + tags in Kit | ⏳ |
| Test: verify sequence email 1 arrives | ⏳ |

---

## 4. Domain

| Task | Status |
|------|--------|
| Add martinarink.com in Vercel > Domains | ⏳ |
| Update DNS at registrar (Vercel provides exact records) | ⏳ |
| Verify SSL certificate issued | ⏳ |
| Verify www redirect to non-www (or vice versa) | ⏳ |

---

## 5. SEO Checks

| Task | Status |
|------|--------|
| /assessment is indexable (sitemap.ts includes it) | ✅ |
| /assessment/result/* is noindexed | ✅ |
| /apply/* is noindexed (robots.ts disallows /apply) | ✅ |
| /book is noindexed | ✅ |
| OG image exists at /og-default.jpg | ⏳ Create this image |
| Verify sitemap.xml loads at /sitemap.xml | ✅ |
| Verify robots.txt loads at /robots.txt | ✅ |
| Person schema in layout.tsx | ✅ |

---

## 6. Legal / GDPR

| Task | Status |
|------|--------|
| Privacy policy exists at /legal/privacy | ✅ |
| Terms exist at /legal/terms | ✅ |
| Imprint exists at /legal/imprint | ✅ |
| Update imprint with real USt-IdNr | ⏳ |
| Privacy policy mentions Kit/ConvertKit data processing | ⏳ |
| Privacy policy mentions Resend email | ⏳ |
| Assessment consent text is accurate | ✅ |
| Unsubscribe link in all Kit emails | ⏳ Set in Kit sequence settings |
| Cookie consent banner (if analytics enabled) | ⏳ |

---

## 7. Analytics

| Task | Status |
|------|--------|
| @vercel/analytics installed and active | ✅ |
| Custom assessment events fire | ✅ |
| GA4 tracking (optional) — set NEXT_PUBLIC_GA4_MEASUREMENT_ID | ⏳ |
| No PII sent to analytics | ✅ |

---

## 8. Mobile QA

| Task | Status |
|------|--------|
| /assessment loads correctly on iPhone | ⏳ Test |
| Answer options have large tap targets (min 44px) | ✅ |
| Email gate form is usable on mobile | ✅ |
| Result page is readable on iPhone | ⏳ Test |
| /apply/* forms are usable on mobile | ⏳ Test |
| Navigation works on mobile | ⏳ Test |

---

## 9. Funnel QA

| Task | Status |
|------|--------|
| Complete assessment from start to result | ⏳ |
| Result page shows correct archetype | ⏳ |
| CTA on result page links to correct route | ⏳ |
| /apply/sober-muse loads | ✅ |
| /apply/empowerment loads | ✅ |
| Application form submits and shows success | ⏳ |
| Application notification arrives in Martina's inbox | ⏳ |
| Kit subscriber created with correct tags | ⏳ |
| Sanity submission record created | ⏳ |
| High-intent Resend notification works | ⏳ |

---

## 10. Final Smoke Test (run before announcing launch)

```
1. Visit https://martinarink.com
2. Visit https://martinarink.com/assessment
3. Answer all 7 questions
4. Submit email at gate
5. Verify redirect to /assessment/result/[resultId]
6. Verify result letter is correct for answers given
7. Click primary CTA — verify it does not 404
8. Visit https://martinarink.com/apply/sober-muse
9. Submit application form — verify notification arrives
10. Visit https://martinarink.com/book — verify Calendly loads
11. Visit https://martinarink.com/sitemap.xml — verify it renders
12. Visit https://martinarink.com/robots.txt — verify /apply and /book are disallowed
13. Check Vercel deployment logs — verify no errors
14. Check Kit — verify test subscriber has correct tags
15. Check Sanity Studio /admin — verify submission record exists
```

---

## Remaining Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| ASSESSMENT_RESULT_SECRET not set | BLOCKING | Checked at runtime — returns 503 |
| Kit form ID not set | High | Kit skipped gracefully, lead stored in Sanity |
| Sanity write token not set | Medium | Warning logged, Kit still runs |
| Resend not configured | Medium | Notification skipped, does not affect user |
| OG image missing | Low | Default text fallback |
| Real photography missing | Low | Placeholder images work — UX slightly weaker |
| No automated test suite | Medium | Manual test paths documented above |
