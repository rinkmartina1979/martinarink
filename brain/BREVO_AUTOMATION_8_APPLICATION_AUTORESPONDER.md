# Brevo Automation 8 — Application Autoresponder

**Status:** Code shipped. Brevo automation NOT yet built. Build it in the Brevo UI.

**Why this exists:** When a woman submits an application via `/apply/sober-muse` or `/apply/empowerment`, she currently waits 48 hours in silence. This is the single largest conversion leak in the funnel — applicants second-guess themselves, lose momentum, or assume the form broke.

This automation sends her a personal-feeling confirmation within 60 seconds of submission, bridging the silent wait with weight-appropriate acknowledgement.

---

## What the code now does

When the application form is submitted, the `/api/apply` route fires a Brevo event:

```
event_name: application_submitted
identifiers: { email_id: <applicant email> }
event_properties:
  programme:        "sober-muse" | "empowerment"
  programme_label:  "The Sober Muse Method" | "Female Empowerment & Leadership"
  budget_readiness: "READY" | "READY-PAYMENT-PLAN" | "NOT-YET"
contact_properties:
  FIRSTNAME
  APPLICATION_PROGRAMME
  APPLICATION_STATUS = "submitted"
  BUDGET_READINESS
```

Trigger this Brevo automation from `application_submitted`.

---

## Build steps (Brevo UI)

1. **Automations → Create automation → Custom event**
2. Name: `Automation 8 — Application Autoresponder`
3. Trigger: `application_submitted` event
4. Entry condition: none (every submitter receives it once per submission)
5. Step 1 — Send email (using the template below)
6. Activate

**Important:** Do NOT add a long wait step. The whole point is immediacy — the email should land within 60 seconds of submission.

---

## Email template

**From:** Martina Rink \<martina@martinarink.com\>
**Reply-to:** Same (replies should reach Martina's inbox)
**Subject:** I have your application

**Body (plain-text-feeling HTML):**

```
{{contact.FIRSTNAME|default:"Hello"}},

Your application is in front of me.

I want to say this plainly so you don't sit in uncertainty: I read every
application myself, not in a queue, and not by an assistant. You will hear
from me — personally — within 48 hours.

This is a short note to confirm it arrived. The longer letter, the one that
actually responds to what you wrote, follows from me directly.

While you wait, if you'd like to read more — about the work, about the
women I write for, about why I built this practice the way I did — three
pieces are below.

  → What high-functioning women use alcohol for
    https://martinarink.com/writing/what-high-functioning-women-use-alcohol-for

  → The identity underneath the title
    https://martinarink.com/writing/the-identity-underneath-the-title

  → On elegance and edges — Isabella Blow
    https://martinarink.com/writing/on-elegance-and-edges-isabella-blow

If, after reading what you wrote, I don't think the work is the right fit —
I will say so, plainly and warmly. The fit matters as much to me as it does
to you.

Until shortly,
Martina

—
Martina Rink
{{ "https://martinarink.com" }}
This email was sent because you submitted an application at martinarink.com.
```

---

## Brand voice checklist (verify before activating)

- [ ] No exclamation marks
- [ ] No banned words: unlock, transform, empower (verb), journey, step into, healing, recovery, addict, problem drinker, amazing, incredible, passion, authentic
- [ ] First-person, observational, precise, warm, unhurried
- [ ] Max 3 sentences per paragraph
- [ ] Reads like Martina, not like marketing automation

---

## QA — how to test before activating

1. Activate the automation in **test mode** (Brevo lets you trigger with a manual contact).
2. Submit a real application at `https://martinarink.com/apply/sober-muse` using a test email you control.
3. Confirm the email lands within 60 seconds.
4. Confirm `{{contact.FIRSTNAME}}` is correctly substituted.
5. Confirm reply-to opens Martina's inbox (not a no-reply address).

---

## Why no payment/booking link in this email?

Because this is a confirmation, not a sales step. The booking link is sent
**by Martina personally** after she reviews the application — that personal
touch is core to the brand. Pre-empting it with an automated booking link
would dilute exactly the thing that differentiates this from generic
coaching funnels.
