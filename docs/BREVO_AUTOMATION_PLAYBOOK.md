# Brevo Automation Playbook — Complete Setup
> Everything Martina needs to paste into Brevo to activate the 7 automations.
> Total content: 22 emails ready to copy. Setup time: 60–90 min.

---

## 🎯 Overview — 7 automations, 1 per website event

| # | Automation name | Trigger event | Emails | Total time |
|---|---|---|---|---|
| 1 | Assessment — Nurture Sequence | `assessment_completed` | 8 over 14 days | **Most important** |
| 2 | Newsletter — Welcome Drip | `newsletter_subscribed` | 4 over 21 days |  |
| 3 | Popup — Capture Welcome | `popup_email_captured` | 4 over 21 days | (Same content as #2) |
| 4 | High-Intent Lead — Internal Alert | `high_intent_lead` | 1 to Martina | Internal only |
| 5 | Consultation — Booked Confirmation | `consultation_booked` | 3 (immediate + 24h + 2h) |  |
| 6 | Consultation — Canceled Recovery | `consultation_canceled` | 2 (immediate + 3 day) |  |
| 7 | Consultation — No-Show Recovery | `consultation_no_show` | 1 (immediate) |  |
| **Bonus** | Post-Consultation — Application Nurture | manually triggered | 4 over 10 days | Sequence C — see §9 |

---

## 📋 Brevo template setup — do this ONCE before creating automations

Inside Brevo, create one **email template** you'll reuse across all letters. This locks the brand voice visually.

1. Brevo → **Campaigns → Templates → New template → Drag & drop**
2. **Name:** "Martina — Editorial Letter"
3. **Layout:**
   - Single column, max width **600px**
   - **Background color:** `#F8F4F1` (cream)
   - **Body text color:** `#1E1B17` (ink)
   - **Body font:** Georgia (web-safe serif fallback for Bodoni)
   - **Font size:** 17px body, 14px caption
   - **Line height:** 1.7
4. **Structure (top to bottom):**
   - Empty 24px spacer
   - Body block (you'll paste each letter's body here)
   - Empty 32px spacer
   - Footer block with this exact HTML:
     ```html
     <p style="font-size:13px; color:#636260; line-height:1.6;">
       Martina Rink · Ibiza · Berlin · World<br>
       hello@martinarink.com<br><br>
       <a href="{{ unsubscribe }}" style="color:#636260;">Step quietly out of this correspondence</a>
     </p>
     ```
5. **No header image. No logo banner. No social icons. No buttons except inline text links.**
6. **Save template.** Duplicate it for each email — paste content, send.

> **Why no buttons:** Premium editorial brands send text-only emails. Buttons read as marketing. Plain prose reads as personal correspondence — which is what Martina's brand is.

---

## ⚙️ AUTOMATION 1 — Assessment Nurture (THE most important)

### Settings
- **Name:** `Assessment — 8-Letter Nurture Sequence`
- **Trigger:** When a custom event is performed → event name: **`assessment_completed`**
- **Exit conditions (configure under Settings → Exit conditions):**
  - When contact attribute `APPLICATION_STATUS` becomes `submitted`
  - When contact unsubscribes
- **Sender:** Martina Rink `<hello@martinarink.com>` · Reply-to: `hello@martinarink.com`

### Step-by-step flow

```
Step 1  → Send email "Letter 1" (immediate, Day 0)
Step 2  → Wait 2 days
Step 3  → Send email "Letter 2"
Step 4  → Wait 2 days
Step 5  → Send email "Letter 3"
Step 6  → Wait 2 days
Step 7  → Send email "Letter 4"
Step 8  → Wait 2 days
Step 9  → Send email "Letter 5"
Step 10 → Wait 2 days
Step 11 → Send email "Letter 6"
Step 12 → Wait 2 days
Step 13 → Send email "Letter 7"
Step 14 → Wait 2 days
Step 15 → Send email "Letter 8"
```

### EMAIL 1 — Day 0 — Result delivery

**Subject:** `Your result. And a note.`
**Preheader:** `Read it slowly. It is short on purpose.`

**Body:**
```
You completed the assessment. Whatever your result said, take a moment with it before you move on.

The seven questions are not a test. They are a map of where attention currently lives — what you are quietly noticing, what you are quietly not. Most of the women who take it tell me afterwards that the result said something they had been almost-thinking, but had not yet given themselves the room to say.

If that is true for you, I want you to know two things.

The first is that what you are noticing is real. You did not invent it. It is not a phase, and it is not a function of being too sensitive, too privileged, or too lucky to be allowed an interior life that does not match the exterior one.

The second is that there is a way to work with it that is private, precise, and entirely yours. I will write to you a few times over the next two weeks — short letters, nothing for sale yet. If at any point you want to step out of the correspondence, the link at the bottom of every email will do that quietly.

For now: read your result again. See what comes up the second time.

— Martina
```

### EMAIL 2 — Day 2 — Myth bust

**Subject:** `It is not a willpower problem.`
**Preheader:** `It almost never is.`

**Body:**
```
Here is the thing nobody says about the women I work with.

They do not have a willpower problem. They have, in most cases, more discipline than the average person living their life. They have built careers on it. They have raised children, run companies, navigated complex partnerships, written books, completed marathons. Discipline is not what is missing.

What is missing is permission. To examine the thing they have already, quietly, examined. To name what they have already, privately, named. To stop performing the version of themselves that the world has agreed to find competent — and to ask, in a room where it is safe to ask, what the actual cost of that performance has been.

The drinking, in this context, is not the problem. It is what shows up because the original question has been declined for too long. Take away the drinking without addressing the question, and you have a sober woman who is now even more aware of the gap.

This is why most programmes for executive women do not produce permanent results. They treat the symptom. They miss the question.

The work I do with clients begins with the question. The drinking, in most cases, takes care of itself once the question has been honoured.

This is also why I do not call myself a recovery coach. I am a private mentor.

— Martina
```

### EMAIL 3 — Day 4 — Origin / authority

**Subject:** `What I learned at Isabella Blow's side.`
**Preheader:** `A note from London, 2003 to 2007.`

**Body:**
```
I rarely write about the years I spent as personal assistant to Isabella Blow. They are not, on their own, what makes the work I do now possible — but they are part of how I learned to read a room.

Isabella was, by any reasonable measure, the most extraordinary woman I have ever been close to. She placed the careers of Alexander McQueen, Philip Treacy, an entire generation of designers who changed the language of fashion. She did this not by following — by seeing. By refusing to confuse competence with vision.

What I observed working closely with her was the cost of being fully, unapologetically yourself in a world that finds that either inconvenient or consumable. She was both, depending on the year. The cost was real. It was also, in a way I did not understand at the time, the price of the work she came here to do.

Years later, when I began working privately with women — first quietly, then more deliberately — I noticed something. The women who came to me at the height of their careers were carrying a quieter version of the same question Isabella spent her life on. Who am I, given what I am being asked to be? What is the cost of the version of me that has agreed to be legible?

This is the work I do now. It is not coaching. It is something older than that.

— Martina
```

### EMAIL 4 — Day 6 — Client story

**Subject:** `A woman I worked with in Munich.`
**Preheader:** `Three months in, something shifted.`

**Body:**
```
A woman I worked with in Munich, a senior director at a logistics firm — I will say only that — came to me three years ago. She was forty-two. She had not described what she did with alcohol as a problem. She had described it as something she had been managing, intelligently, since her late twenties.

In our first private consultation she said something I have heard variations of many times since. She said: I am not in trouble. I am simply tired of the work it takes to keep this from being trouble.

We began the Sober Muse Method. Three months. Three sessions a month. Written prompts in between. No group, no curriculum, no twelve-step language.

By the end of week three she had stopped drinking. Not because we agreed she would. Because the question she had been managing with the wine had been named, and named accurately, and once it was named the wine became unnecessary. She was surprised by this. So am I, every time it happens.

She is now in her second year of work with me — we moved into the Empowerment programme after the ninety days — and she is leading the company differently. She is also living differently. Both are downstream of the same examination.

I am sharing this not as proof of method. I am sharing it because I want you to know that the work runs the way I am describing it. Not the way the wellness industry describes its outcomes.

— Martina
```

### EMAIL 5 — Day 8 — The first question

**Subject:** `Before we begin, I ask one thing.`
**Preheader:** `It is the question that does the work.`

**Body:**
```
When a woman applies for the Sober Muse Method or the Empowerment programme, and we sit down for the private consultation, I ask her one question before anything else.

I ask: what is the original question?

Not the symptom. Not the situation. Not the thing she would say if she were briefing a friend at dinner. The question underneath all of that. The one she has been almost-asking for months, sometimes years, and has not yet had the room to ask properly.

It is a strange question to begin with. Most women have a moment of pause. Some of them tear up — not because the conversation has been intense, but because they realise no one has ever asked them in this way before. Some of them say: I am not sure I know yet. That is also a real answer, and we work from there.

What I want you to understand is that the work I do is built around this. The original question. Not a framework. Not a curriculum. The actual question your interior life has been asking, in the language you have not yet given yourself permission to use.

If you are reading this and something has just moved in you — that is the question, beginning to surface.

The way to bring it into a room where it can be properly held is the private consultation.

— Martina
```

### EMAIL 6 — Day 10 — Structure

**Subject:** `What ninety days actually looks like.`
**Preheader:** `No mystery. Here is the structure.`

**Body:**
```
I want to be specific with you about what the work itself is.

The Sober Muse Method is ninety days. Three private sessions per month, by video or phone. Written prompts between sessions — short, precise, never homework. Ongoing correspondence by email, when a thought wants more space than a session allows.

The structure is three phases.

Naming, in weeks one to three. Before we can work with a thing, we have to be able to say what it actually is. This phase is dedicated entirely to precision.

Clearing, in weeks four to nine. The middle phase is the work itself. We address what the drinking was managing — directly, methodically, without the softening.

Return, in weeks ten to twelve. The final phase is about building. Not a new identity. A return to a version of yourself that has its own position, its own preferences, its own way of occupying space — that does not need to be softened before it can be tolerated.

The investment is from €5,000. It includes the full ninety days, all sessions, written work, correspondence, and a final integration session. Payment by instalment is available.

The Empowerment programme runs longer — six months to two years, open-ended. The investment is from €7,500. It is the right work for the woman whose question is broader than alcohol.

The way to begin either is the private consultation. €450, applied in full to the programme if you proceed.

— Martina
```

### EMAIL 7 — Day 12 — Invitation

**Subject:** `I am opening the next intake.`
**Preheader:** `Two places. The application closes when they are filled.`

**Body:**
```
I work with a small number of women each year. By design, not by accident.

The reason is simple. The work is private — one woman, one mentor — and the depth required for it to produce real outcomes is only available when the practice itself remains small. I take on between fifteen and twenty new clients across both programmes in a given year. Not more.

I am opening the next intake now. There are two places available across the two programmes. The application closes when they are filled, which historically takes between two and four weeks.

If something in you has been moving as you read these letters, the next step is the application. It is short — five questions, ten minutes, answered honestly. I read every application personally and respond within forty-eight hours. If we are a fit, I send you a private link to book the consultation.

If you are not yet ready, that is genuinely fine. Stay on the letter. Some of the women I have worked with took six months from the first email to the application, and the work was right when it began.

The application links are below. Choose the programme that fits — or, if you are not sure, the assessment will route you correctly.

→ Apply for The Sober Muse Method
  https://martinarink.com/apply/sober-muse

→ Apply for Female Empowerment & Leadership
  https://martinarink.com/apply/empowerment

— Martina
```

### EMAIL 8 — Day 14 — Final close

**Subject:** `Before I close the intake.`
**Preheader:** `A short, last note.`

**Body:**
```
I am sending one more letter before I close the intake for this round.

If you have been reading these and thinking — this is for me, but the timing is not quite right — I want to say one thing about timing. There is rarely a right time for this work. The women who arrive at it are usually arriving in the middle of something, not at the end of it. They are tired and they are accomplished and they are asking the question while the rest of life keeps moving. The work begins inside that. It does not wait for stillness.

If you have been reading and thinking — this is for me, but the investment is significant — I want to be honest about that, too. It is significant. It is meant to be. The investment is part of how the work begins. Women who arrive at it without that level of commitment do not produce the same outcomes, and I will not pretend otherwise.

If neither of those is what is keeping you, and you have been reading because you are quietly considering it — the application is the next step. Five questions. Ten minutes.

If you are not ready this time, the next intake will open in approximately three months. The newsletter will continue, and I will write to you when it does.

Either way: thank you for reading.

— Martina

→ Apply for The Sober Muse Method
  https://martinarink.com/apply/sober-muse

→ Apply for Female Empowerment & Leadership
  https://martinarink.com/apply/empowerment
```

---

## ⚙️ AUTOMATION 2 — Newsletter Welcome Drip

### Settings
- **Name:** `Newsletter — 4-Letter Welcome Drip`
- **Trigger:** When a custom event is performed → event name: **`newsletter_subscribed`**
- **Exit:** Contact unsubscribes
- **Sender:** Martina Rink `<hello@martinarink.com>`

### Flow
```
Step 1  → Send "Letter 1" (immediate, Day 0)
Step 2  → Wait 7 days
Step 3  → Send "Letter 2"
Step 4  → Wait 7 days
Step 5  → Send "Letter 3"
Step 6  → Wait 7 days
Step 7  → Send "Letter 4"
```

After Letter 4, the contact transitions to your live weekly newsletter sends.

### LETTER 1 — The cost of legibility

**Subject:** `On the cost of being easy to read.`
**Preheader:** `A short letter about visibility, and what it asks.`

**Body:**
```
There is a particular skill that high-functioning women develop early, and refine so thoroughly that it eventually becomes invisible to them. The skill is legibility. The ability to read a room and produce the version of yourself that the room can most efficiently process — competent, warm, directive, composed.

It is not dishonesty. In most cases it is also not a conscious choice. It is a survival strategy that worked so consistently, for so long, that the woman who deployed it has forgotten it is a strategy at all.

What I notice, in the women I work with most closely, is not the strategy itself. It is the weight of maintaining it at altitude. The version of yourself that the world finds legible is a performance — and all performances require an audience. What happens to the self that is not performing is the question I am most interested in.

If you are reading this and something has just tightened in your chest — that is not anxiety. That is recognition.

The letter next week is about what I call the original question. It is the question your interior life has been asking, steadily and without much drama, for longer than you have been comfortable admitting.

— Martina

If you found this useful, take the assessment. It is designed to name where you actually are, not where you appear to be.
→ Take the assessment: https://martinarink.com/assessment
```

### LETTER 2 — The original question

**Subject:** `The question underneath all the other questions.`
**Preheader:** `You have been almost-asking it for a long time.`

**Body:**
```
There is a question underneath the one you bring to the surface.

The surface question takes many forms. It might be: is this relationship working for me? Is this the right job, the right city, the right way to be spending the decade I am in? It might be quieter than that — a kind of persistent low-level awareness that something is not quite right, not wrong enough to act on, not legible enough to name.

The surface question is not unimportant. But it is not, usually, the question.

The original question is the one your interior life has been asking since before the career, before the competence, before the version of yourself that learned to perform well under examination. It tends to be simple. It tends to be something like: who am I, without all of this? Or: what did I actually want, before I learned what I was supposed to want? Or sometimes, more quietly: is the cost of this life what I agreed to pay for it?

The women I work with have been almost-asking this question for years. They are intelligent enough to have managed it. They are at a point now where the management costs more than they want to keep spending.

That is what the work is about. Not the symptoms. The question.

— Martina
```

### LETTER 3 — On having arrived

**Subject:** `On arriving somewhere and finding it unfamiliar.`
**Preheader:** `The thing no one tells you about success at this level.`

**Body:**
```
Something happens to a certain kind of woman when she arrives at the thing she was building toward.

She has, by every reasonable measure, done it. The title is right. The income is significant. The professional reputation has been earned carefully, and it holds. The personal life has been constructed with similar intelligence. She is, as people keep reminding her, impressive.

And there is a gap. Not a crisis — nothing so obvious. A gap between the woman she appears to be and the woman she actually is. Between what she has built and what she actually wanted. Between the external architecture of the life and the interior room where she lives.

The gap is not unusual. I see it in almost every woman I work with at this level. What is unusual is the willingness to name it — to say, in a room where it is safe to say it, that the impressive life is not, precisely, the life she intended. That something was lost, or traded, or simply outgrown. That there is a question now that the career cannot answer.

The women who find their way to this conversation are not the ones in trouble. They are the ones whose intelligence has finally caught up with the question they have been almost-asking. That is the beginning of a different kind of work.

— Martina
```

### LETTER 4 — What private work looks like

**Subject:** `A note on what the work actually is.`
**Preheader:** `Not a course. Not a programme. Something older than that.`

**Body:**
```
I want to be specific about what working with me looks like, because the category it belongs to does not quite exist in the wellness or coaching industry.

It is not therapy. I am not a therapist, and I do not work as one. It is not coaching — there are no frameworks, no tools, no goal-setting methodology. It is not a group programme, a curriculum, a workbook, or a content delivery system.

What it is, I have come to think, is mentoring in the older sense. One person, one practitioner, private correspondence, a long and unhurried conversation about the original question. The sessions are structured but not rigid. The written work between sessions is short and precise, not homework. The correspondence is available when a thought wants more space than a session allows.

I work with a small number of women at any time. Between fifteen and twenty across both programmes in a given year. Not more, because the depth required for the work to produce real outcomes is only available when the practice is small.

The way into the work is the application — five questions, ten minutes, answered honestly. If we are a fit, I invite you to a private consultation. The consultation is €450 and the right place to understand, from the inside, what this work is.

The assessment, if you have not yet taken it, is the right place to start.

— Martina

→ Take the assessment: https://martinarink.com/assessment
→ See the work — The Sober Muse Method: https://martinarink.com/sober-muse
→ See the work — Female Empowerment & Leadership: https://martinarink.com/empowerment
```

---

## ⚙️ AUTOMATION 3 — Popup Capture Welcome

### Settings
- **Name:** `Popup — Capture Welcome Drip`
- **Trigger:** When a custom event is performed → event name: **`popup_email_captured`**
- **Exit:** Contact unsubscribes

### Decision
**Easiest option:** Use the exact same 4 letters as Automation 2. The popup captures readers in the same audience as the newsletter signup — same content fits.

**Advanced option:** Slightly more conversion-focused first letter, emphasising the article they were just reading. If you want this version, write me and I'll draft Letter 1 variant.

---

## ⚙️ AUTOMATION 4 — High-Intent Lead Alert (INTERNAL)

### Settings
- **Name:** `High-Intent Lead — Alert Martina`
- **Trigger:** When a custom event is performed → event name: **`high_intent_lead`**
- **No exit conditions** (fires once per qualifying lead)

### Flow
```
Step 1 → Send single email TO rinkmartina1979@gmail.com (NOT to the contact)
```

### EMAIL — High-intent alert

**Recipient:** `rinkmartina1979@gmail.com` (yourself)
**Subject:** `🔔 High-intent lead — {{ contact.EMAIL }}`
**Preheader:** `Just took the assessment with high readiness.`

**Body:**
```
A high-readiness assessment lead just came in.

Email:           {{ contact.EMAIL }}
First name:      {{ contact.FIRSTNAME }}
Archetype:       {{ contact.ARCHETYPE }}
Service intent:  {{ contact.SERVICE_INTENT }}
Readiness:       {{ contact.READINESS }}
Privacy need:    {{ contact.PRIVACY_NEED }}
Completed at:    {{ contact.COMPLETED_AT }}

She enters the standard 8-letter sequence automatically.

If you want to skip the sequence and reach out personally — that's often what produces the best outcome with high-readiness leads — reply to this email or open her Brevo profile.
```

> **Note:** Brevo's "personalisation" picker (the `{{ }}` syntax) is in the email editor's variable dropdown. Click "Insert personalisation" → "Contact attributes" → pick each one.

---

## ⚙️ AUTOMATION 5 — Consultation Booked Confirmation

### Settings
- **Name:** `Consultation — Booked Confirmation + Reminders`
- **Trigger:** When a custom event is performed → event name: **`consultation_booked`**
- **Exit:** When contact attribute `BOOKING_STATUS` becomes `canceled` (stops the reminders)

### Flow
```
Step 1 → Send "Confirmation" (immediate)
Step 2 → Wait until 24 hours before {{ contact.LAST_BOOKING_DATE }}
Step 3 → Send "24h reminder"
Step 4 → Wait until 2 hours before {{ contact.LAST_BOOKING_DATE }}
Step 5 → Send "2h reminder"
```

> **Brevo specifics:** For the time-relative waits, use Brevo's "Wait until a specific date" step → reference attribute `LAST_BOOKING_DATE` → subtract 24h / 2h. If your Brevo plan doesn't support this, replace with absolute waits (e.g. assume bookings are at least 48h out, and use "Wait 24 hours" + a check).

### EMAIL 1 — Confirmation (immediate)

**Subject:** `Your consultation is booked.`
**Preheader:** `A short note before we meet.`

**Body:**
```
Your private consultation is confirmed.

Date and time, plus the video link, will arrive in a separate message from my booking system. Add it to your calendar now if you have not already — the link will not move.

Before we meet, I want to give you one piece of preparation.

The most useful thing you can bring is not a list of what you would like to fix. It is your honest answer to one question: what is the original question that is underneath all of this? Not the presenting situation. The one you have been almost-asking, possibly for years, that you have not yet given yourself the room to name properly.

You do not need to have a clean answer. Most women do not. But spend some time with the question between now and our call, and notice what shifts.

I look forward to meeting you.

— Martina
```

### EMAIL 2 — 24-hour reminder

**Subject:** `Tomorrow.`
**Preheader:** `Our consultation, twenty-four hours out.`

**Body:**
```
A short note to confirm our consultation tomorrow.

The video link is in the original booking confirmation. If you cannot find it, reply to this email and I will resend.

Two things to know before we begin.

The first: there is no preparation required beyond what I wrote you when you booked. If you have a thought, a question, or something you want to bring — bring it. If you have nothing prepared and would rather we work it out in the room — that is also fine.

The second: the consultation is forty-five minutes. We use it to understand whether the work I do is the right work for what you are sitting with. Whether you proceed afterwards is entirely your decision, and there is no follow-up pressure from me either way.

Until tomorrow.

— Martina
```

### EMAIL 3 — 2-hour reminder

**Subject:** `In two hours.`
**Preheader:** `Brief, before we meet.`

**Body:**
```
Our consultation is in approximately two hours.

The video link is in the original booking. Test your microphone and camera now if you have not in the last few days. If anything is not working, reply to this email — I am at my desk.

A short note before we meet: there is nothing you need to be ready for. Come as you are, with whatever you are sitting with. We work from there.

— Martina
```

---

## ⚙️ AUTOMATION 6 — Consultation Canceled Recovery

### Settings
- **Name:** `Consultation — Canceled Recovery`
- **Trigger:** When a custom event is performed → event name: **`consultation_canceled`**
- **Exit:** When contact attribute `BOOKING_STATUS` becomes `booked` (rebooked — stop sending)

### Flow
```
Step 1 → Send "Acknowledge cancellation" (immediate)
Step 2 → Wait 3 days
Step 3 → Send "Gentle re-open" (only if not yet rebooked)
```

### EMAIL 1 — Acknowledge cancellation

**Subject:** `Cancellation received.`
**Preheader:** `A short note, no pressure.`

**Body:**
```
I received your cancellation. No explanation needed.

If you would like to reschedule, the same link in your original confirmation works for that. Pick a different time that suits you — manual approval applies to new times as well.

If something has shifted and you would rather not reschedule, I understand. The work is not for everyone at every moment, and I would rather you arrive when the timing is right than push through a window that no longer fits.

I will leave one more note in a few days in case you want to revisit. Beyond that, you stay on the letter only — no further mentions of the consultation.

— Martina
```

### EMAIL 2 — Gentle re-open (Day 3)

**Subject:** `In case it was timing.`
**Preheader:** `A second window, if you want one.`

**Body:**
```
A short follow-up, in case the cancellation was about timing rather than fit.

If you would still like to have the conversation but the original slot did not work — the booking link from your first email remains open. Pick whatever suits you across the next four weeks.

If you have decided this is not the right work for you right now, that is the right call, and there is no need to write back. The newsletter continues weekly. You are welcome to stay on it for as long as it serves.

— Martina
```

---

## ⚙️ AUTOMATION 7 — Consultation No-Show Recovery

### Settings
- **Name:** `Consultation — No-Show Recovery`
- **Trigger:** When a custom event is performed → event name: **`consultation_no_show`**
- **No exit** (one-time send)

### Flow
```
Step 1 → Send "No-show recovery" (immediate)
```

### EMAIL — No-show recovery

**Subject:** `I held the time.`
**Preheader:** `If something came up, here is what to do.`

**Body:**
```
I was at my desk for our consultation today and did not see you join. I am writing this not to chase, but because it is the kind of thing I would want noted if our positions were reversed.

If something came up — health, family, a meeting that ran late, anything — that is normal, and the way to reset is to reply to this email and I will send a new booking link. The €450 deposit holds for one reschedule within thirty days.

If the timing did not work out, or if you have decided this is not the right work for you, that is also fine. You will not hear from me about the consultation again — only the regular weekly letter, which you can step out of at any time.

I hope whatever pulled you away has resolved itself.

— Martina
```

---

## ⚙️ BONUS — AUTOMATION 8 — Post-Consultation Application Nurture

### Use this when
You manually mark a contact with attribute `CONSULTATION_COMPLETED = true` after the consultation actually took place. (Future improvement: auto-mark from Calendly when she clicks "Completed" on the booking.)

### Settings
- **Name:** `Post-Consultation — 4-Letter Application Nurture`
- **Trigger:** When contact attribute `CONSULTATION_COMPLETED` becomes `true`
- **Exit:** When contact attribute `APPLICATION_STATUS` becomes `submitted`

### Flow
```
Step 1 → Wait 1 day
Step 2 → Send "Letter 1 — After the conversation"
Step 3 → Wait 2 days
Step 4 → Send "Letter 2 — What tends to happen"
Step 5 → Wait 3 days
Step 6 → Send "Letter 3 — On the investment"
Step 7 → Wait 4 days
Step 8 → Send "Letter 4 — Final note"
```

The 4 letter contents are already in `docs/email-sequences/SEQUENCE_C_post_consultation.md`. Copy them directly. Subjects in order:

1. `After our conversation.`
2. `What tends to happen after the consultation.`
3. `On the investment. Plainly.`
4. `The last letter I'll send about this.`

---

## ✅ Activation Checklist (in order)

Before going live, work through this list:

- [ ] Brevo template "Martina — Editorial Letter" created
- [ ] All 9 contact attributes exist (ARCHETYPE, READINESS, SERVICE_INTENT, PRIVACY_NEED, SOURCE, BOOKING_STATUS, LAST_BOOKING_DATE, ASSESSMENT_COMPLETED, COMPLETED_AT)
- [ ] Domain `martinarink.com` authenticated (DKIM + DMARC green)
- [ ] Automation 1 — Assessment Nurture: 8 emails pasted, activated
- [ ] Automation 2 — Newsletter Welcome: 4 emails pasted, activated
- [ ] Automation 3 — Popup Capture Welcome: 4 emails pasted (or aliased to Automation 2), activated
- [ ] Automation 4 — High-Intent Alert: internal alert wired to `rinkmartina1979@gmail.com`, activated
- [ ] Automation 5 — Booked Confirmation: 3 emails + time-relative waits, activated
- [ ] Automation 6 — Canceled Recovery: 2 emails, activated
- [ ] Automation 7 — No-Show Recovery: 1 email, activated
- [ ] Automation 8 — Post-Consultation: 4 emails, activated (manually trigger or use attribute change trigger)

---

## 🧪 How to test before going live

1. Submit the assessment on `martinarink.com/assessment` with `yourname+test1@martinarink.com`
2. Within 5 minutes, Letter 1 should arrive
3. Wait 2 days, verify Letter 2 arrives
4. To speed-test, manually edit the wait times to "5 minutes" instead of "2 days" — verify all 8 fire — then change back

If Letter 1 does NOT arrive within 5 minutes:
- Check Brevo → **Logs → Events** — does `assessment_completed` show up?
  - If yes: the automation trigger isn't matching. Re-check event name spelling.
  - If no: the website isn't firing the event. Write me — I'll check the API route.
- Check Brevo → **Logs → Transactional** — was the email sent but failed?
  - If "delivered" but you don't see it: check spam folder. If in spam → domain authentication isn't complete (loop back to DKIM/DMARC).

---

## 📊 Speed-to-lead expectation

A premium nurture sequence is judged on three numbers:

| Metric | Target | What it tells you |
|---|---|---|
| Time from assessment to Letter 1 | **<5 min** | Speed-to-lead (8x conversion lift at this speed per First Page Sage data) |
| Letter open rate (true) | 25–35% | Subject lines are working |
| Letter → consultation booking | 5–15% | Sequence is converting |

If Letter 1 is taking longer than 5 min:
- Brevo's free plan has a delay floor of 1 minute per step — fine
- Domain authentication issues add delays
- Apple Mail Privacy Protection (MPP) inflates the "open" number — don't optimise for opens above 35%, optimise for replies

---

## 💡 Senior advice — what to expect

1. **Replies are the metric.** Premium audiences reply more than they click. A 2–3% reply rate on Letter 1 is gold-tier for €5K+ tier.
2. **Letter 4 (Munich story) is your conversion letter.** Specific stories convert. Watch reply volume here.
3. **Letter 7 (intake invitation) is your booking driver.** Most consultation bookings will trace back to this letter.
4. **The unsubscribe rate should be 5–10%** across the 14-day sequence. If higher, audience is wrong. If lower (under 2%), audience is too small to draw conclusions.
5. **First 50 leads = warm-up.** Don't scale traffic before the first cohort has flowed through. Watch for spam complaints.

---

> **Once all 7 (or 8) automations are activated and tested with one test lead, you are fully live. The website becomes a 24/7 sales asset that runs while you sleep.**
