# Sequence B — Weekly Newsletter (4 sample letters)

**List:** Brevo list `BREVO_LIST_ID_NEWSLETTER` (id 4) — organic subscribers, not assessment leads
**Trigger:** Manual weekly send, or automation on subscribe
**Sender:** Martina Rink `<hello@martinarink.com>`
**Reply-to:** hello@martinarink.com
**Format:** Plain HTML, single column, no headers/dividers/buttons. Cream background, ink text.
**Frequency:** Weekly, Thursday at 08:00 CET recommended

**Voice rules enforced:**
- No exclamation marks
- No banned words: unlock · transform · empower (verb) · journey · step into · healing · recovery · addict · problem drinker · amazing · incredible · passion · authentic · authenticity
- Max 3 sentences per paragraph
- First-person, observational, precise
- No hard sell — one soft link to assessment maximum per letter

---

## LETTER 1 — The cost of legibility

**Subject:** On the cost of being easy to read.

**Preheader:** A short letter about visibility, and what it asks.

---

There is a particular skill that high-functioning women develop early, and refine so thoroughly that it eventually becomes invisible to them. The skill is legibility. The ability to read a room and produce the version of yourself that the room can most efficiently process — competent, warm, directive, composed.

It is not dishonesty. In most cases it is also not a conscious choice. It is a survival strategy that worked so consistently, for so long, that the woman who deployed it has forgotten it is a strategy at all.

What I notice, in the women I work with most closely, is not the strategy itself. It is the weight of maintaining it at altitude. The version of yourself that the world finds legible is a performance — and all performances require an audience. What happens to the self that is not performing is the question I am most interested in.

If you are reading this and something has just tightened in your chest — that is not anxiety. That is recognition.

The letter next week is about what I call the original question. It is the question your interior life has been asking, steadily and without much drama, for longer than you have been comfortable admitting.

— Martina

*If you found this useful, take the assessment. It is designed to name where you actually are, not where you appear to be.*
→ [Take the assessment]

---

## LETTER 2 — The original question

**Subject:** The question underneath all the other questions.

**Preheader:** You have been almost-asking it for a long time.

---

There is a question underneath the one you bring to the surface.

The surface question takes many forms. It might be: is this relationship working for me? Is this the right job, the right city, the right way to be spending the decade I am in? It might be quieter than that — a kind of persistent low-level awareness that something is not quite right, not wrong enough to act on, not legible enough to name.

The surface question is not unimportant. But it is not, usually, the question.

The original question is the one your interior life has been asking since before the career, before the competence, before the version of yourself that learned to perform well under examination. It tends to be simple. It tends to be something like: who am I, without all of this? Or: what did I actually want, before I learned what I was supposed to want? Or sometimes, more quietly: is the cost of this life what I agreed to pay for it?

The women I work with have been almost-asking this question for years. They are intelligent enough to have managed it. They are at a point now where the management costs more than they want to keep spending.

That is what the work is about. Not the symptoms. The question.

— Martina

---

## LETTER 3 — On having arrived

**Subject:** On arriving somewhere and finding it unfamiliar.

**Preheader:** The thing no one tells you about success at this level.

---

Something happens to a certain kind of woman when she arrives at the thing she was building toward.

She has, by every reasonable measure, done it. The title is right. The income is significant. The professional reputation has been earned carefully, and it holds. The personal life has been constructed with similar intelligence. She is, as people keep reminding her, impressive.

And there is a gap. Not a crisis — nothing so obvious. A gap between the woman she appears to be and the woman she actually is. Between what she has built and what she actually wanted. Between the external architecture of the life and the interior room where she lives.

The gap is not unusual. I see it in almost every woman I work with at this level. What is unusual is the willingness to name it — to say, in a room where it is safe to say it, that the impressive life is not, precisely, the life she intended. That something was lost, or traded, or simply outgrown. That there is a question now that the career cannot answer.

The women who find their way to this conversation are not the ones in trouble. They are the ones whose intelligence has finally caught up with the question they have been almost-asking. That is the beginning of a different kind of work.

— Martina

---

## LETTER 4 — What private work looks like

**Subject:** A note on what the work actually is.

**Preheader:** Not a course. Not a programme. Something older than that.

---

I want to be specific about what working with me looks like, because the category it belongs to does not quite exist in the wellness or coaching industry.

It is not therapy. I am not a therapist, and I do not work as one. It is not coaching — there are no frameworks, no tools, no goal-setting methodology. It is not a group programme, a curriculum, a workbook, or a content delivery system.

What it is, I have come to think, is mentoring in the older sense. One person, one practitioner, private correspondence, a long and unhurried conversation about the original question. The sessions are structured but not rigid. The written work between sessions is short and precise, not homework. The correspondence is available when a thought wants more space than a session allows.

I work with a small number of women at any time. Between fifteen and twenty across both programmes in a given year. Not more, because the depth required for the work to produce real outcomes is only available when the practice is small.

The way into the work is the application — five questions, ten minutes, answered honestly. If we are a fit, I invite you to a private consultation. The consultation is €450 and the right place to understand, from the inside, what this work is.

The assessment, if you have not yet taken it, is the right place to start.

— Martina

→ [Take the assessment]
→ [See the work — The Sober Muse Method]
→ [See the work — Female Empowerment & Leadership]

---

# IMPLEMENTATION NOTES FOR KIT

1. Create broadcast template: "The Letter" — single column, cream `#F7F3EE` background, ink `#1E1B17` text
2. Font: Georgia serif fallback (renders across all email clients)
3. No header image — letter format only
4. Footer: unsubscribe link + "You are receiving this because you subscribed at martinarink.com"
5. Send day/time recommendation: Thursday, 08:00 CET (high open rates for executive audience)
6. Sequence setup: tag new subscribers with `NEWSLETTER_SUBSCRIBER = true`; these 4 letters can run as welcome sequence on days 0, 7, 14, 21 before transitioning to live weekly sends
7. A/B test subject lines — the above subjects are control variants; test shorter one-line subjects vs. the current two-part format
