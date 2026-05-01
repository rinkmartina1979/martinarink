# Kit / ConvertKit — Complete Setup Guide

Platform: **https://app.kit.com**

This guide walks through every Kit asset that must exist before the assessment funnel is live.

---

## 1. Create the Assessment Form

**Kit → Forms → New Form → Inline**

| Setting | Value |
|---------|-------|
| Name | `Points of Departure — Assessment` |
| Type | Inline |
| Redirect after subscribe | Leave blank (API handles this) |

After creating, find the form ID:
- Go to Kit → Forms → click the form → check the URL or embed code
- The numeric ID (e.g. `7654321`) goes into `KIT_FORM_ID_ASSESSMENT` in Vercel

---

## 2. Create the Newsletter Form

**Kit → Forms → New Form → Inline**

| Setting | Value |
|---------|-------|
| Name | `Martina Rink — Private Letters` |
| Type | Inline |

Form ID → `KIT_FORM_ID_NEWSLETTER` in Vercel.

---

## 3. Create Custom Fields

**Kit → Subscribers → Custom Fields → New Field**

Create all 7 fields exactly as listed. The `key` must match exactly — it is what the API sends.

| Field Label | Key (exact) | Type | Purpose |
|-------------|-------------|------|---------|
| Archetype | `archetype` | Text | reckoning / threshold / return |
| Assessment Result | `assessment_result` | Text | Human-readable archetype label |
| Service Intent | `service_intent` | Text | sober-muse / empowerment / both |
| Readiness Level | `readiness_level` | Text | low / medium / high |
| Privacy Need | `privacy_need` | Text | standard / high |
| Completed At | `completed_at` | Text | ISO timestamp |
| Source Page | `source_page` | Text | points-of-departure |

---

## 4. Create Tags

**Kit → Subscribers → Tags → New Tag**

Create every tag in this table. After creating, note the numeric tag ID from the URL or API.

| Tag Name (create exactly as shown) | Env Variable | Purpose |
|------------------------------------|-------------|---------|
| `assessment:completed` | `KIT_TAG_ASSESSMENT_COMPLETED` | Applied to all assessment finishers |
| `source:assessment` | `KIT_TAG_SOURCE_ASSESSMENT` | Acquisition tracking |
| `sequence:assessment` | `KIT_TAG_SEQUENCE_ASSESSMENT` | Automation trigger |
| `archetype:quiet-reckoning` | `KIT_TAG_ARCHETYPE_RECKONING` | Archetype segment |
| `archetype:threshold` | `KIT_TAG_ARCHETYPE_THRESHOLD` | Archetype segment |
| `archetype:return` | `KIT_TAG_ARCHETYPE_RETURN` | Archetype segment |
| `intent:sober-muse` | `KIT_TAG_INTENT_SOBER_MUSE` | Programme interest |
| `intent:empowerment` | `KIT_TAG_INTENT_EMPOWERMENT` | Programme interest |
| `intent:both` | `KIT_TAG_INTENT_BOTH` | Programme interest |
| `readiness:low` | `KIT_TAG_READINESS_LOW` | Nurture signal |
| `readiness:medium` | `KIT_TAG_READINESS_MEDIUM` | Nurture signal |
| `readiness:high` | `KIT_TAG_READINESS_HIGH` | Priority — triggers alert |
| `privacy:standard` | `KIT_TAG_PRIVACY_STANDARD` | Standard copy |
| `privacy:high` | `KIT_TAG_PRIVACY_HIGH` | Privacy-first copy |
| `applicant:sober-muse` | `KIT_TAG_APPLICANT_SOBER_MUSE` | Applied on /apply/sober-muse submit |
| `applicant:empowerment` | `KIT_TAG_APPLICANT_EMPOWERMENT` | Applied on /apply/empowerment submit |

**Finding tag IDs:**
1. Kit → Subscribers → Tags → click a tag
2. URL pattern: `app.kit.com/tags/XXXXXXX` — the number is the ID
3. Alternatively use the Kit API: `GET https://api.kit.com/v4/tags` with your API key

---

## 5. Create Email Sequences

**Kit → Sequences → New Sequence**

### Sequence 1 — Quiet Reckoning: Private Recognition

**Name:** `Quiet Reckoning — Private Recognition`
**Trigger:** (set via automation — see step 6)

| Email | Delay | Subject | CTA |
|-------|-------|---------|-----|
| 1 | Immediately | Your result: The Quiet Reckoning | Read the writing → /writing |
| 2 | Day 3 | The life works. That does not mean you are home. | (none) |
| 3 | Day 7 | The private cost of being the one who holds everything. | Explore the private letters → /newsletter |
| 4 | Day 14 | Why this is not a crisis, but a signal. | (none) |
| 5 | Day 21 | When you are ready, begin here. | Explore the private work → (use service_intent field to personalise) |

**Email 1 body structure:**
- Open with the result letter text (same as result page)
- Acknowledge that something has shifted
- No ask. No pressure.
- CTA: READ THE WRITING (soft, lowercase)

**Email 5 body structure:**
- Short. Three paragraphs.
- Direct invitation — no urgency
- Link to `/sober-muse` if `service_intent = sober-muse`, else `/empowerment`

---

### Sequence 2 — Threshold: Decision

**Name:** `Threshold — Decision`
**Trigger:** (set via automation — see step 6)

| Email | Delay | Subject | CTA |
|-------|-------|---------|-----|
| 1 | Immediately | Your result: The Threshold | Explore the programme |
| 2 | Day 3 | When negotiation becomes more exhausting than change. | (none) |
| 3 | Day 7 | Why private support matters at this level. | Explore the private work |
| 4 | Day 10 | What working privately with Martina looks like. | See the programme |
| 5 | Day 14 | A private consultation, if the fit is right. | REQUEST A PRIVATE CONSULTATION → /book |

**Email 5 body structure:**
- Name the invitation directly: a 45-minute private conversation
- Price: €450, applied to programme if she proceeds
- One clear CTA: `/book`

---

### Sequence 3 — The Return: Consultation Readiness

**Name:** `The Return — Consultation Readiness`
**Trigger:** (set via automation — see step 6)

| Email | Delay | Subject | CTA |
|-------|-------|---------|-----|
| 1 | Immediately | Your result: The Return | REQUEST A PRIVATE CONSULTATION |
| 2 | Day 2 | You are not looking for motivation. | Begin the application |
| 3 | Day 4 | The container matters. | (none — trust-building) |
| 4 | Day 6 | What happens inside the private consultation. | BOOK THE CONSULTATION → /book |
| 5 | Day 8 | Request the private conversation. | /book (minimal copy, one link) |

**Notes:**
- This sequence moves faster (8 days vs 21) — she is ready
- Email 5 should be the shortest email in the entire funnel
- One sentence, one link

---

## 6. Create Automation Rules

**Kit → Automations → New Automation**

Create one automation per archetype tag. Kit fires these when a tag is applied.

### Automation 1
```
Trigger: Subscriber is tagged → archetype:quiet-reckoning
Action:  Start sequence → Quiet Reckoning — Private Recognition
```

### Automation 2
```
Trigger: Subscriber is tagged → archetype:threshold
Action:  Start sequence → Threshold — Decision
```

### Automation 3
```
Trigger: Subscriber is tagged → archetype:return
Action:  Start sequence → The Return — Consultation Readiness
```

### Automation 4 (optional — segment)
```
Trigger: Subscriber is tagged → intent:sober-muse
Action:  Add to segment → Sober Muse Interest
```

### Automation 5 (optional — segment)
```
Trigger: Subscriber is tagged → intent:empowerment
Action:  Add to segment → Empowerment Interest
```

---

## 7. Add Tag IDs to Vercel

After creating all 16 tags, find each numeric ID and add to Vercel:

1. Vercel → Project → Settings → Environment Variables
2. Add each `KIT_TAG_*` variable with its numeric value
3. **Redeploy** after adding all vars

---

## 8. Test the integration end-to-end

1. Submit the assessment at `/assessment` with a real test email
2. Open Kit → Subscribers — the email should appear within 30 seconds
3. Check the subscriber record:
   - Tags: should include `assessment:completed`, correct archetype, correct intent, correct readiness
   - Custom fields: `archetype`, `service_intent`, `readiness_level`, `privacy_need`, `completed_at` should all be populated
4. Check Kit → Sequences — the subscriber should be in the correct sequence
5. Check the sequence email 1 — it should have arrived in the test inbox

---

## 9. Verify no double-subscriptions

Kit handles duplicate email submissions gracefully — if the same email submits again, it updates the subscriber rather than creating a duplicate. Tags are additive (not replaced).

If a returning subscriber completes the assessment with a different result, they will accumulate multiple archetype tags. This is expected and useful for segmentation.

---

## CTA personalisation using custom fields

In Kit sequence emails, use liquid variables to personalise CTAs based on `service_intent`:

```
{% if subscriber.service_intent == "empowerment" %}
  <a href="https://martinarink.com/empowerment">Explore the programme</a>
{% elsif subscriber.service_intent == "sober-muse" %}
  <a href="https://martinarink.com/sober-muse">Explore the programme</a>
{% else %}
  <a href="https://martinarink.com/work-with-me">Explore the private work</a>
{% endif %}
```
