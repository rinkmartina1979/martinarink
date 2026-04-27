# Kit / ConvertKit Funnel Setup

## Required Kit Tags (create these first)

Go to Kit > Subscribers > Tags > New Tag for each:

| Tag Name | Environment Variable | Purpose |
|----------|---------------------|---------|
| assessment-completed | KIT_TAG_ASSESSMENT_COMPLETED | Applied to everyone who finishes |
| source-assessment | KIT_TAG_SOURCE_ASSESSMENT | Tracks acquisition channel |
| sequence-assessment | KIT_TAG_SEQUENCE_ASSESSMENT | Triggers the right sequence |
| archetype-reckoning | KIT_TAG_ARCHETYPE_RECKONING | Archetype segment |
| archetype-threshold | KIT_TAG_ARCHETYPE_THRESHOLD | Archetype segment |
| archetype-return | KIT_TAG_ARCHETYPE_RETURN | Archetype segment |
| intent-sober-muse | KIT_TAG_INTENT_SOBER_MUSE | Programme interest |
| intent-empowerment | KIT_TAG_INTENT_EMPOWERMENT | Programme interest |
| intent-both | KIT_TAG_INTENT_BOTH | Programme interest |
| readiness-low | KIT_TAG_READINESS_LOW | Nurture depth |
| readiness-medium | KIT_TAG_READINESS_MEDIUM | Nurture depth |
| readiness-high | KIT_TAG_READINESS_HIGH | Priority follow-up |
| privacy-standard | KIT_TAG_PRIVACY_STANDARD | Copy customisation |
| privacy-high | KIT_TAG_PRIVACY_HIGH | Privacy-first copy |
| applicant-sober-muse | KIT_TAG_APPLICANT_SOBER_MUSE | Applied on form submit |
| applicant-empowerment | KIT_TAG_APPLICANT_EMPOWERMENT | Applied on form submit |

After creating each tag, find its numeric ID in the Kit API or from the tag URL in the Kit dashboard, then add to Vercel environment variables.

---

## Required Custom Fields

Go to Kit > Subscribers > Custom Fields > New Field:

| Field Key | Type | Purpose |
|-----------|------|---------|
| archetype | text | stores: reckoning / threshold / return |
| assessment_result | text | same as archetype (human-readable label in sequences) |
| service_intent | text | sober-muse / empowerment / both |
| readiness_level | text | low / medium / high |
| privacy_need | text | standard / high |
| completed_at | text | ISO timestamp of assessment completion |
| source_page | text | points-of-departure |
| programme | text | from application form |

---

## Required Kit Form

Create one form in Kit > Forms > New Form:
- Name: "Points of Departure Assessment"
- Type: "Inline" (the API uses form subscription)
- Copy the form ID number into `KIT_FORM_ID_ASSESSMENT`

---

## Automation Trigger Rules

Go to Kit > Automations > New Automation for each sequence:

### Trigger 1 — Quiet Reckoning Sequence
```
Trigger: Subscriber is tagged with "archetype-reckoning"
Action: Start "Quiet Reckoning — Private Recognition" sequence
```

### Trigger 2 — Threshold Sequence
```
Trigger: Subscriber is tagged with "archetype-threshold"
Action: Start "Threshold — Decision" sequence
```

### Trigger 3 — Return Sequence
```
Trigger: Subscriber is tagged with "archetype-return"
Action: Start "Return — Consultation Readiness" sequence
```

### Trigger 4 — Sober Muse Interest Segment
```
Trigger: Subscriber is tagged with "intent-sober-muse"
Action: Add to segment "Sober Muse Interest"
```

### Trigger 5 — Empowerment Interest Segment
```
Trigger: Subscriber is tagged with "intent-empowerment"
Action: Add to segment "Empowerment Interest"
```

### Trigger 6 — High Readiness (internal)
```
Trigger: Subscriber is tagged with "readiness-high"
Action: Send internal notification email (or handled via Resend — see ASSESSMENT_RESULT_SECRET)
```

---

## Email Sequence Structure

### Sequence 1: Quiet Reckoning — Private Recognition

Goal: Build trust and recognition. No hard CTA until email 5.

**Email 1** (immediately)
Subject: Your result: The Quiet Reckoning
Body: Result letter echoed. Soft close. No ask.
CTA: READ THE WRITING → /writing

**Email 2** (day 3)
Subject: The life works. That does not mean you are home.
Body: Observational piece on high-functioning women and the quiet cost of performance.
CTA: None — reading only.

**Email 3** (day 7)
Subject: The private cost of being the one who holds everything.
Body: The exhaustion underneath the competence.
CTA: EXPLORE THE PRIVATE LETTERS → /newsletter

**Email 4** (day 14)
Subject: Why this is not a crisis, but a signal.
Body: Reframe: the noticing is intelligence, not weakness.
CTA: None.

**Email 5** (day 21)
Subject: When you are ready, begin here.
Body: Short. Direct. A single invitation — no pressure.
CTA: EXPLORE THE PRIVATE WORK → /sober-muse or /empowerment (based on service_intent field)

---

### Sequence 2: Threshold — Decision

Goal: Move from awareness to decision in 3–4 weeks.

**Email 1** (immediately)
Subject: Your result: The Threshold
Body: Result letter echoed. Recognition of where she is.
CTA: READ THE PROGRAMME → /sober-muse or /empowerment

**Email 2** (day 3)
Subject: When negotiation becomes more exhausting than change.
Body: The specific kind of tired she feels.
CTA: None.

**Email 3** (day 7)
Subject: Why private support matters at this level.
Body: The difference between group support and private work.
CTA: EXPLORE THE PRIVATE WORK → /sober-muse or /empowerment

**Email 4** (day 10)
Subject: What working privately with Martina looks like.
Body: A day in the 90-day programme / what the engagement includes.
CTA: SEE THE PROGRAMME → /sober-muse or /empowerment

**Email 5** (day 14)
Subject: A private consultation, if the fit is right.
Body: Short. Direct. The invitation.
CTA: REQUEST A PRIVATE CONSULTATION → /book

---

### Sequence 3: Return — Consultation Readiness

Goal: Convert high-intent lead into consultation booking. 7–10 days.

**Email 1** (immediately)
Subject: Your result: The Return
Body: Result letter echoed. Acknowledges she's been here before.
CTA: REQUEST A PRIVATE CONSULTATION → /book

**Email 2** (day 2)
Subject: You are not looking for motivation.
Body: Distinguishing motivation from structure. She already knows what she wants.
CTA: BEGIN THE APPLICATION → /apply/sober-muse or /apply/empowerment

**Email 3** (day 4)
Subject: The container matters.
Body: Why the right support structure changes outcomes.
CTA: None.

**Email 4** (day 6)
Subject: What happens inside the private consultation.
Body: Exact description of the 45-minute consultation.
CTA: BOOK THE CONSULTATION → /book

**Email 5** (day 8)
Subject: Request the private conversation.
Body: Minimal. Direct. One clear path.
CTA: REQUEST A PRIVATE CONSULTATION → /book

---

## High-Intent Lead Notification

Configured via:
```
RESEND_API_KEY=
RESEND_NOTIFY_EMAIL=martina@martinarink.com
```

When `readinessLevel === "high"`, the assessment API automatically sends an internal email to `RESEND_NOTIFY_EMAIL` with:
- Archetype
- Programme interest
- Privacy need
- Submitted timestamp
- Result ID reference

This fires in the background and never delays the user redirect.

---

## Cal.com / Calendly Handoff

The `/book` page embeds the Calendly URL from `NEXT_PUBLIC_CALENDLY_URL`.

To switch to Cal.com:
1. Set `NEXT_PUBLIC_CALENDLY_URL` to your Cal.com embed URL
2. Or update `/app/book/page.tsx` directly with the Cal.com `<Cal />` component

Consultation price: €450 (credited to programme if client proceeds)

---

## Stripe (Optional Deposit)

Stripe is installed (`stripe` + `@stripe/stripe-js` in package.json) but NOT active.

To activate:
1. Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
2. Create a Stripe product for the €450 consultation deposit
3. Add a `/api/stripe/checkout` route
4. Link from the booking confirmation page

Do NOT add Stripe to the result page CTA. Add it only on the `/book` page as an optional deposit step.

---

## Production Testing Steps

1. Submit assessment with test email
2. Check Kit subscriber was created with correct tags
3. Check Sanity Studio > Assessment Submissions for the record
4. Check Resend inbox for high-intent notification (if readiness:high)
5. Check Kit automation triggered correct sequence
6. Confirm sequence email 1 arrived in test inbox
7. Confirm result page CTA links are not 404
8. Confirm /apply/* pages load and form submits correctly
9. Confirm application notification arrives in Martina's inbox
