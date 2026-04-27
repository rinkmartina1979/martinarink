# Assessment System — Points of Departure

## Purpose

A private lead-generation diagnostic for Martina Rink's website. Not a quiz. Not a personality test. A premium editorial experience that:

1. Emotionally qualifies the visitor
2. Captures email after Q3 (inline, not a modal)
3. Computes archetype server-side
4. Tags the lead in Kit with 6+ signals
5. Routes to the correct next step
6. Backs up every lead to Sanity
7. Notifies Martina of high-intent leads via Resend

---

## Full Assessment Flow

```
/assessment
  → AssessmentIntro (begin CTA)
  → Q1 → Q2 → Q3 → [Email Gate] → Q4 → Q5 → Q6 → Q7
  → POST /api/assessment
      → Zod validation
      → Server-side scoring (computeResult)
      → HMAC-signed resultId generated
      → Background: Kit subscribe + tag
      → Background: Sanity submission backup
      → Background: Resend notification (if readiness:high)
  → Redirect /assessment/result/[resultId]
      → HMAC verify (returns 404 if tampered)
      → Sanity fetch (with hardcoded fallback)
      → Result letter rendered
      → CTA routed by readiness + serviceIntent
```

---

## Question List

| # | ID | Signal | Gate |
|---|-----|--------|------|
| 1 | q1_arrival | archetype | — |
| 2 | q2_awareness | archetype | — |
| 3 | q3_privacy | archetype + privacyNeed | Email gate after this |
| 4 | q4_stakes | archetype | — |
| 5 | q5_resistance | archetype | — |
| 6 | q6_landscape | archetype + serviceIntent | — |
| 7 | q7_need | archetype + readinessLevel | — |

---

## Scoring Model

Each option carries weights for three archetypes: `reckoning`, `threshold`, `return`.

Scores are summed across all 7 questions. The archetype with the highest total wins.

**Tie-breaker order:** `return > threshold > reckoning`
(Higher-intent archetypes win ties, which is correct for a conversion funnel.)

Secondary signals (first match wins per question):
- `serviceIntent`: sober-muse | empowerment | both — from Q6
- `readinessLevel`: low | medium | high — from Q7
- `privacyNeed`: standard | high — from Q3

---

## Result Logic

| Archetype | Description | Target |
|-----------|-------------|--------|
| reckoning | Early awareness, private, uncertain | Newsletter → build trust |
| threshold | Named the gap, not yet crossed | Programme page → explore |
| return | Been here before, ready this time | Application → convert |

---

## CTA Routing

| Readiness | Primary CTA | Route |
|-----------|-------------|-------|
| low | RECEIVE THE PRIVATE LETTERS | /newsletter |
| medium (sober-muse) | EXPLORE THE PRIVATE WORK | /sober-muse |
| medium (empowerment) | EXPLORE THE PRIVATE WORK | /empowerment |
| medium (both) | EXPLORE THE PRIVATE WORK | /work-with-me |
| high (sober-muse) | REQUEST A PRIVATE CONSULTATION | /apply/sober-muse |
| high (empowerment) | REQUEST A PRIVATE CONSULTATION | /apply/empowerment |
| high (both) | REQUEST A PRIVATE CONSULTATION | /work-with-me |

Secondary CTA always: READ THE WRITING → /writing (low/medium) or BOOK A CONSULTATION DIRECTLY → /book (high)

---

## Privacy High Reassurance

When `privacyNeed === "high"`, the result page shows:
> "No group room. No public record. A private conversation, if and when it is right."

And a longer privacy note in the letter body:
> "A note on privacy: there is no group, no shared room, no public record..."

---

## resultId Security

- HMAC-SHA256 signed with `ASSESSMENT_RESULT_SECRET`
- Encodes only: archetype, serviceIntent, readinessLevel, privacyNeed, iat
- Does NOT encode: email, answers, firstName, or any PII
- Cannot be forged without the secret key
- Verified on result page — returns 404 if tampered

---

## How to Edit Copy in Sanity

1. Log into Sanity Studio at `/admin`
2. Find "Assessment Result" in the content menu
3. Edit the document for the relevant archetype (reckoning / threshold / return)
4. Fields: name, tagline, opening, bodyParagraphs (2–3), closing
5. Save — changes go live immediately
6. The result page fetches from Sanity, falls back to hardcoded copy if Sanity is down

---

## How to Test Locally

```bash
# 1. Copy env vars
cp .env.example .env.local
# Fill in ASSESSMENT_RESULT_SECRET at minimum

# 2. Start dev server
npm run dev

# 3. Visit http://localhost:3000/assessment
# 4. Answer all 7 questions (email gate appears after Q3)
# 5. After submission you should be redirected to /assessment/result/[resultId]
# 6. Verify result letter matches archetype based on answers

# 7. Test API directly
curl -X POST http://localhost:3000/api/assessment \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "q1_arrival": 2,
      "q2_awareness": 2,
      "q3_privacy": 0,
      "q4_stakes": 2,
      "q5_resistance": 0,
      "q6_landscape": 0,
      "q7_need": 2
    },
    "email": "test@example.com",
    "firstName": "Test"
  }'
# Should return: archetype "return", readinessLevel "high"
```

---

## Testing Status

No automated test runner is currently configured. Manual test paths:

**Quiet Reckoning path:**
- Q1: option 0 (not sure), Q2: option 0 (arrived recently), Q3: option 0 (no one knows), Q4: option 0 (low dread), Q5: option 0 (not ready to look), Q6: option 0 (sober-muse), Q7: option 0 (to be seen)
- Expected: reckoning, low, high-privacy, sober-muse

**Threshold path:**
- Q1: option 1 (circling), Q2: option 1 (months), Q3: option 2 (small circle), Q4: option 1 (sense of loss), Q5: option 1 (fear of change), Q6: option 1 (sober-muse), Q7: option 1 (understand options)
- Expected: threshold, medium, standard, sober-muse

**Return path:**
- Q1: option 2 (ready for next layer), Q2: option 2 (years), Q3: option 2, Q4: option 2 (frustration), Q5: option 2 (wrong support), Q6: option 1, Q7: option 2 (ready to begin)
- Expected: return, high, standard, sober-muse
