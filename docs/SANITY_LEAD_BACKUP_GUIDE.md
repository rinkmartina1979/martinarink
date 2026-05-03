# Sanity Lead Backup — Setup Guide

Every assessment submission is written to Sanity as a private `assessmentSubmission` document. This is a safety net: if Kit fails for any reason, the lead is not lost.

---

## How it works

When a visitor completes the assessment:

1. The API route scores answers and creates a signed `resultId`
2. In the background (non-blocking), it calls `storeSubmission()` in `lib/assessment/storage.ts`
3. That function writes to Sanity via the REST API using the write token
4. The visitor is redirected immediately — the Sanity write never delays the response

If `SANITY_WRITE_TOKEN` or `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing, the write is silently skipped. No error is shown to the visitor.

---

## Required Sanity setup

### 1. Create a Sanity project

Go to **https://sanity.io/manage** → New Project

| Setting | Value |
|---------|-------|
| Project name | `martinarink` (or any name) |
| Dataset | `production` |
| Plan | Free tier is sufficient |

### 2. Get the Project ID

Sanity → Project → Settings → API → **Project ID**

This is a short alphanumeric string, e.g. `abc12345`

Add to Vercel:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=abc12345
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Create the write token

**This token must have Editor (write) permissions.**

1. Sanity → Project → API → Tokens → **Add API Token**
2. Name: `assessment-write`
3. Role: **Editor**
4. Click **Save** — the token is shown **once only**
5. Copy immediately and add to Vercel:

```
SANITY_WRITE_TOKEN=sk...
```

> ⚠️ If you close the page without copying, you must delete the token and create a new one.

---

## What gets stored

Each `assessmentSubmission` document contains:

| Field | Example | Notes |
|-------|---------|-------|
| `resultId` | `eyJhcmNoZXR5cGU...` | Signed token only — no raw PII |
| `email` | `visitor@example.com` | The email entered at the gate |
| `firstName` | `Sarah` | Optional — may be empty |
| `archetype` | `threshold` | Scoring result |
| `serviceIntent` | `sober-muse` | Programme signal |
| `readinessLevel` | `high` | Nurture depth signal |
| `privacyNeed` | `standard` | Copy personalisation signal |
| `kitStatus` | `ok` / `failed` | Whether Kit tagging succeeded |
| `kitError` | `...` | Kit error message if failed |
| `sourcePage` | `points-of-departure` | Always this value |
| `createdAt` | `2025-01-01T12:00:00Z` | ISO timestamp |
| `answersJson` | `{"q1":2,"q2":1,...}` | Raw answer map |
| `userAgent` | `Mozilla/5.0...` | Browser string |
| `referrer` | `https://...` | Referring URL |

---

## Verifying a lead was stored

### In Sanity Studio

1. Go to `https://your-sanity-project.sanity.studio` (or run `npx sanity dev` locally)
2. Navigate to **Assessment Submissions** in the sidebar
3. Each submission appears as a document — sorted by `createdAt` descending

### Via Sanity API

```bash
curl "https://your-project-id.api.sanity.io/v2024-01-01/data/query/production?query=*[_type==%22assessmentSubmission%22]|order(createdAt%20desc)[0..4]" \
  -H "Authorization: Bearer YOUR_READ_TOKEN"
```

Or use the Sanity Vision tool at `/admin/vision` to run GROQ queries directly.

---

## ⚠️ Privacy warning — do not expose submissions publicly

Assessment submissions contain real email addresses and behavioural data from real people.

**Never do any of the following:**
- Make `assessmentSubmission` documents publicly queryable (no public GROQ filter for this type)
- Display submission data in any frontend page
- Share the `SANITY_WRITE_TOKEN` or any read token that has access to submissions
- Export the dataset without filtering out `assessmentSubmission` documents

**The Sanity schema enforces this:**
- All fields on `assessmentSubmission` are marked `readOnly: true` in the Studio
- The document type is intentionally absent from the public-facing Next.js queries

If you ever need to audit submissions externally, use the Sanity management dashboard or a trusted server-side script — never expose this data through a public API route.

---

## What happens when Kit fails

If Kit returns an error or times out:

1. `kitStatus` in the Sanity document is set to `"failed"`
2. `kitError` contains the error message
3. The visitor is **not** told — they still see their result

To recover a lost Kit subscriber from a backup:

1. Find submissions where `kitStatus = "failed"` in Sanity
2. For each: manually subscribe in Kit using the stored email, apply the correct archetype/intent/readiness tags
3. Or: write a recovery script that reads from Sanity and calls Kit via the API

---

## Local development

In development, Sanity writes use the same token. If you want to skip writes locally, simply leave `SANITY_WRITE_TOKEN` out of `.env.local`. The system skips silently.

To test a real write locally:
1. Add `SANITY_WRITE_TOKEN` and `NEXT_PUBLIC_SANITY_PROJECT_ID` to `.env.local`
2. Submit the assessment at `http://localhost:3000/assessment`
3. Check Sanity Studio for the new `assessmentSubmission` document
