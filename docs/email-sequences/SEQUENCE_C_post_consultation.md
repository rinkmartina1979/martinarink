# Sequence C — Post-Consultation (4 emails over 10 days)

**Trigger:** Contact attribute `CONSULTATION_COMPLETED = true` added to Brevo list `BREVO_LIST_ID_CONSULTATION` (id 5)
**Use:** Sent to women who completed the private €450 consultation but have not yet applied to a programme
**Sender:** Martina Rink `<hello@martinarink.com>`
**Reply-to:** hello@martinarink.com
**Format:** Plain HTML, single column. Warmer and more direct than Sequence A — these women have already spoken with Martina.
**Schedule:** Day 1, Day 3, Day 6, Day 10

**Voice rules enforced:**
- No exclamation marks
- No banned words: unlock · transform · empower (verb) · journey · step into · healing · recovery · addict · problem drinker · amazing · incredible · passion · authentic · authenticity
- Max 3 sentences per paragraph
- 250 words maximum per email
- First-person, direct — address the woman as someone already known

**Note:** These emails assume the consultation took place. They do NOT re-sell the consultation. They follow up on the specific question the woman brought, speak to what was named in the room, and offer a clear next step.

---

## EMAIL 1 — Day 1 — After the conversation

**Subject:** After our conversation.

**Preheader:** A short note for the day after.

---

I wanted to write to you the day after.

Not to say anything that was not already said in the room — but because I know from experience that the conversation tends to land differently once you have slept with it. Things that seemed precise at the time can shift slightly. Things that felt abstract can become more concrete. And sometimes the question that seemed like the main one turns out to be the one beside it.

If any of that is happening for you, write to me. I read every reply.

What I want to say, simply, is this: what you brought to the consultation was real. You were not performing. The question you are sitting with is not a product of being too sensitive or too introspective or too privileged to have problems. It is the question. And it has been asking for your attention for longer than it should have had to.

The work I described — the Sober Muse Method or the Empowerment programme, depending on what we discussed — is the right container for it. Not the only possible container, but the one I can offer, and the one I can stand behind fully.

When you are ready, the application is the next step. It is short, and you already know enough to answer it honestly.

— Martina

→ Apply for The Sober Muse Method
→ Apply for Female Empowerment & Leadership

---

## EMAIL 2 — Day 3 — What tends to happen

**Subject:** What tends to happen after the consultation.

**Preheader:** In my experience, a few things.

---

In my experience, women go through one of three things in the days after a consultation.

The first is clarity. Something that had been a blur becomes legible — a decision gets made, the application goes in, the work begins. These women are usually the ones who had already been living with the question for some time and needed only a room in which to say it.

The second is the wobble. The conversation was right, the work feels right, but then the practical questions arrive. The investment. The timing. Whether this is, really, the moment. I understand this. It is worth naming: the wobble is usually not about whether the work is right. It is about whether you believe you deserve to put yourself first in this way.

The third is the delay that becomes the decision not to proceed — not from lack of wanting, but from waiting for a readiness that never quite arrives on its own.

I am not in a position to tell you which of these you are in. You know.

What I can tell you is that the women I have worked with who produced the most significant outcomes were not the most ready when they began. They were the most honest about where they were.

If you have questions before you apply, you can reply to this email.

— Martina

---

## EMAIL 3 — Day 6 — The investment, plainly

**Subject:** On the investment. Plainly.

**Preheader:** I would rather be honest than tactful about this.

---

I want to say something plainly about the investment, because I think tactfulness on this point tends to be unkind.

The Sober Muse Method begins at €5,000 for the ninety-day engagement. The Empowerment programme begins at €7,500 for the open-ended work. Payment by instalment is available for both. The consultation fee of €450 is applied in full toward the programme if you enrol.

This is significant. I know it is significant. It is designed to be.

What I have observed, over years of this work, is that women who arrive without financial commitment of this kind tend not to produce the same outcomes. Not because the money is magic — but because the investment is the first act of putting yourself first in a way that costs something real. Women who are willing to make it tend to be the women who are willing to do the rest of the work.

If the investment is genuinely not possible right now, I will say so, and I will not waste your time. If it is possible, but the hesitation is about whether you are worth it — that is a different question, and one the work will address from the inside.

The application is five questions and takes ten minutes. I respond within forty-eight hours.

— Martina

→ Apply for The Sober Muse Method
→ Apply for Female Empowerment & Leadership

---

## EMAIL 4 — Day 10 — Final note

**Subject:** The last letter I'll send about this.

**Preheader:** One more, and then I'll leave it with you.

---

This is the last letter I will send specifically about the application.

I am aware that some women need more time than a week or ten days. If you are one of them, I want you to know that the next intake will open in approximately three months, and I will write to you when it does. You do not need to decide today, and you do not need to explain anything to me.

What I want to leave you with is this.

The question you brought to our conversation — the thing underneath the presenting situation, the one you had been almost-asking before we named it properly — that question does not go away on its own. I have seen women manage it for years with considerable skill and at considerable cost. The management is not the same as the examination. The examination is what the work is for.

If you are ready, the application is below.

If you are not ready, stay on the newsletter. I write every week. Some of the women I have worked with took six months or more from the consultation to the application, and the work was right when it began.

Either way: it was good to be in the room with you.

— Martina

→ Apply for The Sober Muse Method
→ Apply for Female Empowerment & Leadership
→ Return to the newsletter

---

# IMPLEMENTATION NOTES FOR BREVO

1. Create automation: "Sequence C — Post-Consultation"
2. Trigger: Contact added to list ID 5 (Post-Consultation) with attribute `CONSULTATION_COMPLETED = true`
3. Add 4 email steps with day delays: 1, 3, 6, 10
4. Exit condition: contact submits application (`APPLICATION_STATUS = submitted`) OR removes consent
5. Tone note: these emails are warmer and more direct than Sequence A. The woman has met Martina. Use "you" more freely. Subject lines are shorter and more intimate.
6. Personalisation option: if Brevo supports it, insert `{{ contact.PROGRAMME_INTEREST }}` to reference the specific programme discussed in consultation (set this attribute in your CRM when logging the consultation outcome)
7. Test by manually adding a test contact with `CONSULTATION_COMPLETED = true` and verifying send schedule
