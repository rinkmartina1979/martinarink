/**
 * brevo-templates.ts — Vogue editorial email system for all 28 Brevo templates.
 *
 * DESIGN SOURCE: the homepage hero section (components/sections/HeroSection.tsx).
 * Every email is a miniature of the hero's left column:
 *
 *   ┌────────────────────────────────────────────┐
 *   │ HEADER — aubergine #231727                 │
 *   │   pink hairline (#F942AA, 40×1px)          │
 *   │   MARTINA RINK · PRIVATE MENTORSHIP        │  ← hero eyebrow style
 *   │   Headline — Georgia italic, cream         │  ← hero H1 voice
 *   ├────────────────────────────────────────────┤
 *   │ BODY — cream #F8F4F1                       │
 *   │   letter copy — Arial 16px, #4A3728        │
 *   │   [CTA — aubergine fill, cream text, →]    │  ← hero button, inverted
 *   │   signature — Georgia italic               │
 *   ├────────────────────────────────────────────┤
 *   │ FOOTER — cream, sand hairline              │
 *   │   PRIVATE · CONFIDENTIAL · BY APPLICATION  │  ← hero trust micro-copy
 *   │   Spiegel Bestselling author · Vogue …     │  ← hero proof line
 *   │   unsubscribe                              │
 *   └────────────────────────────────────────────┘
 *
 * Email constraints: inline CSS only, table layout, Georgia = Playfair
 * substitute, Arial = DM Sans substitute. No images. No exclamation marks.
 *
 * Brevo template language preserved: {{ contact.FIRSTNAME }},
 * {% if contact.ARCHETYPE == "..." %} blocks, {{ unsubscribe }}.
 */

/* ─── Hero palette (live tokens from app/globals.css) ───────────── */
const AUBERGINE = "#231727"; // hero left column / dark sections
const CREAM = "#F8F4F1"; // primary surface — CI Farbe 1
const PINK = "#F942AA"; // signature hairline — CI Farbe 5
const INK = "#1E1B17"; // primary text
const INK_SOFT = "#4A3728"; // body copy
const INK_QUIET = "#636260"; // captions, metadata
const SAND = "#C8B8A2"; // hairlines on cream

/* cream at reduced opacity over aubergine — precomputed solid hex
   (email clients are unreliable with rgba) */
const CREAM_60 = "#A39CA0"; // hero eyebrow tone (cream/60)
const CREAM_75 = "#C3BDBF"; // hero body tone (cream/75)
const CREAM_45 = "#7E757E"; // hero trust-line tone (cream/40-50)

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

const SITE_URL = "https://martinarink.com";

/* ─── Greeting — conditional so a missing first name never renders
       "Hello ," ─────────────────────────────────────────────────── */
const GREETING =
  `{% if contact.FIRSTNAME %}{{ contact.FIRSTNAME }},{% else %}Hello,{% endif %}`;

/* ═══════════════════════════════════════════════════════════════
   LAYOUT HELPERS
═══════════════════════════════════════════════════════════════ */

function para(text: string): string {
  return `<p style="margin:0 0 22px 0;font-family:${SANS};font-size:16px;line-height:1.8;color:${INK_SOFT};">${text}</p>`;
}

function quietLine(text: string): string {
  return `<p style="margin:0 0 22px 0;font-family:${SANS};font-size:13px;line-height:1.7;letter-spacing:0.04em;color:${INK_QUIET};">${text}</p>`;
}

/** Hero primary button, inverted for the cream body:
    aubergine fill · cream text · square corners · tracked caps · → */
function cta(label: string, url: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0;">
    <tr>
      <td style="background-color:${AUBERGINE};border:1px solid ${AUBERGINE};">
        <a href="${url}" target="_blank"
           style="display:inline-block;padding:18px 36px;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:${CREAM};text-decoration:none;">
          ${label}&nbsp;&nbsp;&#8594;</a>
      </td>
    </tr>
  </table>`;
}

/** Ghost secondary — hero's border-only button translated to cream. */
function ghostCta(label: string, url: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 30px 0;">
    <tr>
      <td style="border:1px solid ${SAND};">
        <a href="${url}" target="_blank"
           style="display:inline-block;padding:16px 34px;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:${INK_SOFT};text-decoration:none;">
          ${label}&nbsp;&nbsp;&#8594;</a>
      </td>
    </tr>
  </table>`;
}

/** Pull-quote block — Georgia italic with a pink hairline, the email
    equivalent of the hero's "and yet." script moment. */
function accentQuote(text: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 30px 0;">
    <tr>
      <td width="2" style="background-color:${PINK};font-size:0;line-height:0;">&nbsp;</td>
      <td width="22" style="font-size:0;line-height:0;">&nbsp;</td>
      <td style="font-family:${SERIF};font-style:italic;font-size:21px;line-height:1.55;color:${INK};">${text}</td>
    </tr>
  </table>`;
}

function signature(closing = "Warmly,"): string {
  return `
  <p style="margin:34px 0 0 0;font-family:${SANS};font-size:15px;line-height:1.7;color:${INK_SOFT};">${closing}</p>
  <p style="margin:6px 0 0 0;font-family:${SERIF};font-style:italic;font-size:26px;line-height:1.3;color:${INK};">Martina</p>
  <p style="margin:10px 0 0 0;font-family:${SANS};font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:${INK_QUIET};">Martina Rink &middot; Private Mentor</p>`;
}

interface WrapOptions {
  /** Georgia-italic headline rendered in the aubergine header */
  headline: string;
  /** small tracked label above the headline; defaults to hero eyebrow */
  eyebrow?: string;
  /** body HTML (use para / cta / accentQuote / signature helpers) */
  body: string;
  /** suppress unsubscribe (internal alerts only) */
  internal?: boolean;
}

/** Full email shell — the hero section as a letter. */
export function vogueWrap({ headline, eyebrow, body, internal }: WrapOptions): string {
  const eyebrowText = eyebrow ?? "Martina Rink &middot; Private Mentorship";

  const footer = internal
    ? `<p style="margin:0;font-family:${SANS};font-size:11px;letter-spacing:0.1em;color:${INK_QUIET};">Internal notification &middot; martinarink.com</p>`
    : `
      <p style="margin:0 0 10px 0;font-family:${SANS};font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:${INK_QUIET};">
        Private &middot; Confidential &middot; By application</p>
      <p style="margin:0 0 18px 0;font-family:${SANS};font-size:11px;letter-spacing:0.06em;color:${INK_QUIET};">
        Spiegel Bestselling author &middot; Featured in Vogue Germany &amp; Der Spiegel</p>
      <p style="margin:0;font-family:${SANS};font-size:11px;color:${INK_QUIET};">
        You are receiving this letter because you asked to hear from me.<br/>
        <a href="{{ unsubscribe }}" style="color:${INK_QUIET};text-decoration:underline;">Unsubscribe</a>
        &nbsp;&middot;&nbsp;
        <a href="${SITE_URL}/legal/privacy" style="color:${INK_QUIET};text-decoration:underline;">Privacy</a>
      </p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<title>Martina Rink</title>
</head>
<body style="margin:0;padding:0;background-color:${CREAM};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${CREAM};">
<tr><td align="center" style="padding:32px 12px;">

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;">

    <!-- ══ HEADER — hero aubergine column ══ -->
    <tr>
      <td style="background-color:${AUBERGINE};padding:44px 48px 40px 48px;">
        <!-- pink hairline — the hero's signature accent -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td width="40" height="1" style="background-color:${PINK};font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
        <p style="margin:18px 0 0 0;font-family:${SANS};font-size:10px;font-weight:bold;letter-spacing:0.34em;text-transform:uppercase;color:${CREAM_60};">
          ${eyebrowText}</p>
        <h1 style="margin:16px 0 0 0;font-family:${SERIF};font-style:italic;font-weight:normal;font-size:30px;line-height:1.25;letter-spacing:-0.01em;color:${CREAM};">
          ${headline}</h1>
      </td>
    </tr>

    <!-- ══ BODY — cream letter ══ -->
    <tr>
      <td style="background-color:${CREAM};border-left:1px solid ${SAND};border-right:1px solid ${SAND};padding:44px 48px 40px 48px;">
        ${body}
      </td>
    </tr>

    <!-- ══ FOOTER — hero trust + proof lines ══ -->
    <tr>
      <td style="background-color:${CREAM};border-top:1px solid ${SAND};border-left:1px solid ${SAND};border-right:1px solid ${SAND};border-bottom:1px solid ${SAND};padding:28px 48px;">
        ${footer}
      </td>
    </tr>

  </table>

</td></tr>
</table>
</body>
</html>`;
}

/* ═══════════════════════════════════════════════════════════════
   ARCHETYPE BLOCKS — Brevo conditional personalisation
   {{ contact.ARCHETYPE }} ∈ founder | executive | re-examiner
═══════════════════════════════════════════════════════════════ */

function archetypeBlock(founder: string, executive: string, reExaminer: string, universal: string): string {
  return `{% if contact.ARCHETYPE == "founder" %}${para(founder)}{% elif contact.ARCHETYPE == "executive" %}${para(executive)}{% elif contact.ARCHETYPE == "re-examiner" %}${para(reExaminer)}{% else %}${para(universal)}{% endif %}`;
}

/* ═══════════════════════════════════════════════════════════════
   THE 28 TEMPLATES
═══════════════════════════════════════════════════════════════ */

export interface BrevoTemplate {
  id: number;
  name: string;
  subject: string;
  html: string;
}

export const BREVO_TEMPLATES: BrevoTemplate[] = [

  /* ── 2 · Default simple confirmation ─────────────────────────── */
  {
    id: 2,
    name: "Default Template Simple confirmation",
    subject: "Confirmed.",
    html: vogueWrap({
      headline: "Confirmed.",
      body:
        para(GREETING) +
        para("This is a short note to say your request went through. Nothing more is needed from you right now.") +
        para("If anything looks wrong, simply reply to this email — it reaches me directly.") +
        signature(),
    }),
  },

  /* ── 5 · Editorial Letter (monthly campaign shell) ───────────── */
  {
    id: 5,
    name: "Martina — Editorial Letter",
    subject: "A letter, from Martina.",
    html: vogueWrap({
      headline: "A letter, from my desk to yours.",
      eyebrow: "Martina Rink &middot; The Letter",
      body:
        para(GREETING) +
        para("[ Replace this block with this month&rsquo;s essay. One idea, carried slowly. Three sentences per paragraph at most, then a break. ]") +
        accentQuote("[ One line from the essay worth sitting with — set here as the quiet centre of the letter. ]") +
        para("[ Closing paragraph. No pitch. If the essay continues on the site, link it below — otherwise delete the line that follows. ]") +
        quietLine(`The full piece lives here: <a href="${SITE_URL}/writing" style="color:${INK_SOFT};">martinarink.com/writing</a>`) +
        signature(),
    }),
  },

  /* ── 6–13 · Assessment sequence, Letters 1–8 (Day 0–14) ─────── */
  {
    id: 6,
    name: "Assessment — Letter 1 (Day 0)",
    subject: "Your letter is being written.",
    html: vogueWrap({
      headline: "Your letter is being written.",
      eyebrow: "Martina Rink &middot; Your Assessment",
      body:
        para(GREETING) +
        para("Thank you for answering the seven questions. Most people move through their week without anyone asking them a single real one — you just answered seven, honestly, in writing.") +
        para("I read every assessment myself. Your letter is being written now, and it will arrive in this same quiet way over the coming days.") +
        para("There is nothing to do in the meantime. That is rather the point.") +
        signature(),
    }),
  },
  {
    id: 7,
    name: "Assessment — Letter 2 (Day 2)",
    subject: "The first thing I noticed.",
    html: vogueWrap({
      headline: "The first thing I noticed.",
      eyebrow: "Martina Rink &middot; Your Assessment",
      body:
        para(GREETING) +
        para("I have read your answers. Before the full letter arrives, one observation.") +
        archetypeBlock(
          "Women who have built and exited something rarely struggle with ambition. They struggle with arrival — with the strange quiet that follows the thing they spent a decade running toward. If the arrival feels nothing like the brochure, you are not ungrateful. You are paying attention.",
          "There is a particular exhaustion that comes from succeeding at the highest level of a career that may be the wrong one. It does not look like burnout. It looks like competence, performed daily, with the volume of everything else turned down.",
          "A re-examination of alcohol that begins with curiosity rather than crisis is the strongest possible starting position. You are not asking because something broke. You are asking because something in you has become precise.",
          "The women who complete this assessment share one thing — a life that resolves beautifully on paper, and a question underneath it that refuses to stay quiet.",
        ) +
        para("Sit with that for a day or two. The next letter goes one layer further down.") +
        signature(),
    }),
  },
  {
    id: 8,
    name: "Assessment — Letter 3 (Day 4)",
    subject: "The question underneath the question.",
    html: vogueWrap({
      headline: "The question underneath the question.",
      eyebrow: "Martina Rink &middot; Your Assessment",
      body:
        para(GREETING) +
        para("Every assessment carries two questions — the one written in the answers, and the one underneath them. The second is the one I read for.") +
        archetypeBlock(
          "For founders, the surface question is usually &ldquo;what now.&rdquo; The one underneath is quieter: who am I when there is nothing left to build that proves anything. That question does not need a new venture. It needs a room where it can be said out loud.",
          "For executives, the surface question is about the next role. The one underneath is whether the mountain itself was chosen — or inherited, assigned, applauded into place. Climbing faster does not answer it.",
          "On the surface, the question sounds like &ldquo;how much is too much.&rdquo; Underneath, it is rarely about the glass at all. It is about what the evening ritual has been quietly holding in place — and what would need attention if it stopped.",
          "The surface question is about circumstances. The one underneath is about identity — who you are when the circumstances stop performing for you.",
        ) +
        accentQuote("The question underneath does not get louder. It gets more patient.") +
        signature(),
    }),
  },
  {
    id: 9,
    name: "Assessment — Letter 4 (Day 6)",
    subject: "What the work actually is.",
    html: vogueWrap({
      headline: "What this work actually is.",
      eyebrow: "Martina Rink &middot; Your Assessment",
      body:
        para(GREETING) +
        para("A few days in, it is fair to ask what working with me actually looks like. Not the website version — the honest one.") +
        para("It is private, one-to-one mentorship. We meet regularly, we go slowly, and we work on the question underneath your circumstances rather than the circumstances themselves. There are no worksheets and no group calls.") +
        para("Between sessions, you have direct access to me. The work happens as much in the Tuesday-afternoon message as in the session itself.") +
        signature(),
    }),
  },
  {
    id: 10,
    name: "Assessment — Letter 5 (Day 8)",
    subject: "On the women who do this work.",
    html: vogueWrap({
      headline: "On the women who do this work.",
      eyebrow: "Martina Rink &middot; Your Assessment",
      body:
        para(GREETING) +
        para("The women I work with have three things in common. They have built something real. They are privately carrying a question they have not said out loud to anyone. And they are done pretending the first thing cancels out the second.") +
        accentQuote("Martina doesn&rsquo;t coach you toward an answer. She asks the question you didn&rsquo;t know you were avoiding — and then she waits.") +
        quietLine("&mdash; Anja, Founder &amp; Digital Business Consultant") +
        para("I work with a small number of women at a time. Privately. That is not scarcity theatre — it is the only way this depth of attention is possible.") +
        signature(),
    }),
  },
  {
    id: 11,
    name: "Assessment — Letter 6 (Day 10)",
    subject: "An hour, if you want it.",
    html: vogueWrap({
      headline: "An hour, if you want it.",
      eyebrow: "Martina Rink &middot; Your Assessment",
      body:
        para(GREETING) +
        para("If the letters so far have been landing, there is a natural next room — a private consultation. One hour, just us, about the question underneath your answers.") +
        para("It is &euro;450, credited in full toward the programme if we go on to work together. It is also, deliberately, a real session — not a sales call wearing a session&rsquo;s clothes.") +
        cta("Book the private consultation", `${SITE_URL}/book`) +
        para("And if the timing is wrong, that is information too. The letters continue either way.") +
        signature(),
    }),
  },
  {
    id: 12,
    name: "Assessment — Letter 7 (Day 12)",
    subject: "A second angle on the decision.",
    html: vogueWrap({
      headline: "A second angle on the decision.",
      eyebrow: "Martina Rink &middot; Your Assessment",
      body:
        para(GREETING) +
        para("Most accomplished women evaluate a decision like this the way they evaluate everything — outcomes, cost, return. Fair enough. Here is the calculation that actually matters.") +
        para("The question you brought to the assessment has already been with you for a while. The honest variable is not whether to address it, but how many more quarters it gets to run unexamined — and what that costs in the meantime.") +
        para("One hour settles whether this is the right room. That is all the consultation is for.") +
        ghostCta("Book the private consultation", `${SITE_URL}/book`) +
        signature(),
    }),
  },
  {
    id: 13,
    name: "Assessment — Letter 8 (Day 14)",
    subject: "The door stays open.",
    html: vogueWrap({
      headline: "The door stays open.",
      eyebrow: "Martina Rink &middot; Your Assessment",
      body:
        para(GREETING) +
        para("This is the last of the assessment letters. I want to close them the way I would close a conversation — without pressure, and without pretending the conversation didn&rsquo;t happen.") +
        para("You answered seven questions honestly. Whatever you do next, do not un-know what you noticed while answering them.") +
        para("When the timing is right — next month, next year — the door is the same one, and it stays open. You can simply reply to this letter.") +
        accentQuote("and yet.") +
        signature(),
    }),
  },

  /* ── 14–17 · Newsletter welcome, Letters 1–4 ─────────────────── */
  {
    id: 14,
    name: "Newsletter — Welcome Letter 1",
    subject: "You’re here.",
    html: vogueWrap({
      headline: "You&rsquo;re here.",
      eyebrow: "Martina Rink &middot; Welcome",
      body:
        para(GREETING) +
        para("You arrived here for a reason. I am not going to pretend I know what it is.") +
        para("What I can tell you is what this is: an occasional letter, written by me, for women who have built lives that look extraordinary from the outside — and who are quietly renegotiating their relationship with that word, extraordinary.") +
        para("No frequency promises. No content calendar. I write when there is something worth your attention, and not otherwise.") +
        signature("Welcome,"),
    }),
  },
  {
    id: 15,
    name: "Newsletter — Welcome Letter 2 (Day 3)",
    subject: "The room I learned in.",
    html: vogueWrap({
      headline: "The room I learned in.",
      eyebrow: "Martina Rink &middot; Welcome",
      body:
        para(GREETING) +
        para("I spent several years working for one of the most extraordinary women of her generation — Isabella Blow, the fashion editor who discovered Alexander McQueen and Philip Treacy.") +
        para("What I learned in that room was not about fashion. It was about what brilliance costs when it has nowhere private to put itself down. I watched the most celebrated woman in the building carry the loneliest interior life in it.") +
        para("Everything I do now traces back to that observation. The work is the private room I wish she had had.") +
        signature(),
    }),
  },
  {
    id: 16,
    name: "Newsletter — Welcome Letter 3 (Day 7)",
    subject: "Where this started.",
    html: vogueWrap({
      headline: "Where this started.",
      eyebrow: "Martina Rink &middot; Welcome",
      body:
        para(GREETING) +
        para("My own re-examination of alcohol began not with a crisis but with a question — about a daily glass of wine that had quietly become a different thing than it pretended to be.") +
        para("I asked the question. I did not like how interesting the answer was. And I discovered that for women like the ones I now work with, precision about that subject is rare, and judgement-free rooms for it are rarer.") +
        para("I have been sober since. Not as an identity — as a decision that keeps earning its place.") +
        signature(),
    }),
  },
  {
    id: 17,
    name: "Newsletter — Welcome Letter 4 (Day 14)",
    subject: "If any of this is landing.",
    html: vogueWrap({
      headline: "If any of this is landing.",
      eyebrow: "Martina Rink &middot; Welcome",
      body:
        para(GREETING) +
        para("Four letters in, you know how I think and where this work comes from. The last thing to say is simple — if any part of this has been landing, the work is here when you are ready.") +
        para("The way in is a private assessment. Seven questions, about four minutes, and at the end a letter written specifically for where you are. Not a quiz. A beginning.") +
        cta("Begin the private assessment", `${SITE_URL}/assessment`) +
        para("And if all you ever do is read the letters — that is a complete relationship too. You are welcome here either way.") +
        signature(),
    }),
  },

  /* ── 18–23 · Consultation flow ──────────────────────────────── */
  {
    id: 18,
    name: "Consultation — Booking Confirmation",
    subject: "Your consultation — confirmed.",
    html: vogueWrap({
      headline: "Confirmed. I&rsquo;m looking forward to this.",
      eyebrow: "Martina Rink &middot; Private Consultation",
      body:
        para(GREETING) +
        para("Your private consultation is confirmed — the time, the link and the calendar invitation are in the booking confirmation that arrived alongside this note.") +
        para("How to prepare: don&rsquo;t. Come as you are, with whatever is actually on your mind rather than what you planned to say. The hour works best unrehearsed.") +
        para("One practical thing only — take the call somewhere genuinely private. The conversation tends to go places that deserve a closed door.") +
        signature("Until then,"),
    }),
  },
  {
    id: 19,
    name: "Consultation — 24h Reminder",
    subject: "Tomorrow — a note.",
    html: vogueWrap({
      headline: "Tomorrow, then.",
      eyebrow: "Martina Rink &middot; Private Consultation",
      body:
        para(GREETING) +
        para("A short note — we speak tomorrow. The joining link is in your calendar invitation.") +
        para("No preparation needed. A closed door and an honest hour are the only requirements.") +
        signature("Until tomorrow,"),
    }),
  },
  {
    id: 20,
    name: "Consultation — 2h Reminder",
    subject: "In two hours.",
    html: vogueWrap({
      headline: "In two hours.",
      eyebrow: "Martina Rink &middot; Private Consultation",
      body:
        para(GREETING) +
        para("We speak in two hours — the link is in your calendar invitation. I&rsquo;m looking forward to it.") +
        signature("Soon,"),
    }),
  },
  {
    id: 21,
    name: "Consultation — Cancellation Received",
    subject: "Received — and no explanation needed.",
    html: vogueWrap({
      headline: "Received. The door stays open.",
      eyebrow: "Martina Rink &middot; Private Consultation",
      body:
        para(GREETING) +
        para("Your cancellation came through — consider it handled, and no explanation is needed.") +
        para("Timing matters in this work, and forcing it serves no one. When the right week arrives, rebooking takes a minute.") +
        ghostCta("Rebook when ready", `${SITE_URL}/book`) +
        signature(),
    }),
  },
  {
    id: 22,
    name: "Consultation — Cancellation Follow-Up (Day 3)",
    subject: "One quiet re-offer.",
    html: vogueWrap({
      headline: "One quiet re-offer.",
      eyebrow: "Martina Rink &middot; Private Consultation",
      body:
        para(GREETING) +
        para("A few days ago you cancelled our consultation. This is not a chase — it is one quiet re-offer, made once.") +
        para("If the cancellation was about logistics, the calendar is below. If it was about readiness, trust that — readiness is data, not failure.") +
        ghostCta("Choose a new time", `${SITE_URL}/book`) +
        para("Either way, this is the last note about it. The letters continue as normal.") +
        signature(),
    }),
  },
  {
    id: 23,
    name: "Consultation — No-Show Recovery",
    subject: "Things happen.",
    html: vogueWrap({
      headline: "Things happen.",
      eyebrow: "Martina Rink &middot; Private Consultation",
      body:
        para(GREETING) +
        para("We had a consultation scheduled and the hour passed without you — which, in a life as full as yours, is the least surprising thing in the world.") +
        para("No apology needed and none expected. The hour is still yours; it just needs a new home in the calendar.") +
        cta("Rebook the consultation", `${SITE_URL}/book`) +
        signature(),
    }),
  },

  /* ── 24 · Internal alert ─────────────────────────────────────── */
  {
    id: 24,
    name: "INTERNAL — High-Intent Lead Alert",
    subject: "High-intent lead — {{ contact.EMAIL }}",
    html: vogueWrap({
      headline: "High-intent lead.",
      eyebrow: "Internal &middot; Lead Alert",
      internal: true,
      body:
        para(`<strong>Contact:</strong> {{ contact.EMAIL }}`) +
        para(`<strong>Name:</strong> {% if contact.FIRSTNAME %}{{ contact.FIRSTNAME }} {% endif %}{% if contact.LASTNAME %}{{ contact.LASTNAME }}{% endif %}`) +
        para(`<strong>Archetype:</strong> {% if contact.ARCHETYPE %}{{ contact.ARCHETYPE }}{% else %}not set{% endif %}`) +
        quietLine("This contact triggered the high-intent event. Review their assessment answers in Brevo and consider a personal note within 24 hours.") +
        ghostCta("Open Brevo contacts", "https://app.brevo.com/contact/list"),
    }),
  },

  /* ── 25–28 · Post-consultation, Letters 1–4 ─────────────────── */
  {
    id: 25,
    name: "Post-Consultation — Letter 1",
    subject: "Thank you for our conversation.",
    html: vogueWrap({
      headline: "Thank you for our conversation.",
      eyebrow: "Martina Rink &middot; After the Consultation",
      body:
        para(GREETING) +
        para("Thank you for the hour — and for the honesty you brought into it. Conversations like that one are the reason this work exists.") +
        para("If you felt what I felt — that the room fits — the next step is a short private application. It takes about ten minutes and is read only by me.") +
        cta("Begin the application", `${SITE_URL}/work-with-me`) +
        para("Your consultation fee is credited in full toward the programme. There is no deadline on this — only the honest question of timing.") +
        signature(),
    }),
  },
  {
    id: 26,
    name: "Post-Consultation — Letter 2 (Day 3)",
    subject: "One thing you said.",
    html: vogueWrap({
      headline: "One thing you said.",
      eyebrow: "Martina Rink &middot; After the Consultation",
      body:
        para(GREETING) +
        para("A few days have passed, which is usually when a conversation like ours settles into its real shape. One observation from my notes, offered lightly.") +
        para("The thing you named most carefully in our hour is almost always the thing most worth working on. Carefulness is how the important subjects announce themselves.") +
        para("No action needed. The application remains where it was, whenever you want it.") +
        signature(),
    }),
  },
  {
    id: 27,
    name: "Post-Consultation — Letter 3 (Day 6)",
    subject: "Still thinking about what you said.",
    html: vogueWrap({
      headline: "I&rsquo;m still thinking about what you said.",
      eyebrow: "Martina Rink &middot; After the Consultation",
      body:
        para(GREETING) +
        archetypeBlock(
          "Founders tend to evaluate this decision like a deal — diligence, downside, return. But what we discussed is not a deal. It is the question of who you get to be now that the building is done, and that question compounds quietly whether or not it is addressed.",
          "Executives tend to schedule this decision for a quieter quarter. You and I both know what the quieter quarter does — it arrives, fills, and forwards the decision to the next one.",
          "What you are re-examining does not need urgency or alarm. It needs exactly what you gave it in our hour — precision, privacy and honesty. That combination is rare enough to act on.",
          "What we discussed in our hour has a particular quality — it does not get worse if you wait, but it does not get answered either.",
        ) +
        para("If the room fit, the application is below. If it did not, I would genuinely rather you trust that.") +
        ghostCta("Begin the application", `${SITE_URL}/work-with-me`) +
        signature(),
    }),
  },
  {
    id: 28,
    name: "Post-Consultation — Letter 4 (Day 10)",
    subject: "Closing this gracefully.",
    html: vogueWrap({
      headline: "Closing this gracefully.",
      eyebrow: "Martina Rink &middot; After the Consultation",
      body:
        para(GREETING) +
        para("This is the last note in this particular sequence. Not because the door closes — it doesn&rsquo;t — but because pressure has no place in work like this, and a fourth letter is where attentiveness starts becoming pressure.") +
        para("So, simply: thank you for the hour, your consultation credit remains yours, and the application stays open for whenever the timing turns honest.") +
        para("You know where I am.") +
        accentQuote("and yet.") +
        signature(),
    }),
  },
];

/* sanity check at import time — full inventory accounted for.
   The Brevo account holds 25 templates spanning ids 2–28
   (ids 1, 3, 4 do not exist). */
if (BREVO_TEMPLATES.length !== 25) {
  throw new Error(`Expected 25 Brevo templates, found ${BREVO_TEMPLATES.length}`);
}
