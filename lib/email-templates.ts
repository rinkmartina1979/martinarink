/**
 * Martina Rink — Branded Email Templates
 *
 * All Resend transactional emails use these templates.
 * Brevo automation sequences use the Brevo template editor with the same
 * visual vocabulary (colours, typography, spacing) defined here for reference.
 *
 * Design system:
 *   - Max width: 600px, centred
 *   - Background: #F7F3EE (cream) on white page wrapper
 *   - Headings: Georgia (email-safe serif, stands in for Playfair Display)
 *   - Body: Arial, 16px, #4A3728 (ink-soft)
 *   - Hairline: #C8B8A2 (sand)
 *   - Accent: #F942AA (pink) for lines/rules
 *   - CTA buttons: #5C2D8E (plum) on cream text
 *   - Eyebrow labels: #8A7F72 (ink-quiet), 10px, UPPERCASE, letter-spacing
 *   - Script signature: font-style italic, larger, Georgia
 *
 * Inline styles only — email clients strip <style> blocks.
 */

/* ── Base shell ───────────────────────────────────────────────── */

const WRAP = `
  margin:0;padding:0;background-color:#FFFFFF;
  font-family:Arial,Helvetica,sans-serif;
  -webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;
`.trim();

const INNER = `
  max-width:600px;margin:0 auto;background:#F7F3EE;
`.trim();

const HEADER_DARK = `
  background:#2B1A3A;padding:40px 48px 36px;
`.trim();

const HEADER_CREAM = `
  background:#F7F3EE;padding:32px 48px 0;border-bottom:1px solid #C8B8A2;
`.trim();

const BODY_SECTION = `
  padding:40px 48px;background:#F7F3EE;
`.trim();

const FOOTER = `
  padding:28px 48px 36px;background:#F7F3EE;border-top:1px solid #C8B8A2;
`.trim();

const HAIRLINE = `
  border:none;border-top:1px solid #C8B8A2;margin:28px 0;
`.trim();

const PINK_RULE = `
  display:block;width:32px;height:1px;background:#F942AA;margin-bottom:16px;
`.trim();

function eyebrow(text: string) {
  return `<p style="margin:0 0 12px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">${text}</p>`;
}

function h1(text: string, color = "#EDE8E0") {
  return `<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:32px;font-weight:normal;line-height:1.15;color:${color};">${text}</h1>`;
}

function h2(text: string, color = "#1E1B17") {
  return `<h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;font-weight:normal;line-height:1.25;color:${color};">${text}</h2>`;
}

function body(text: string, color = "#4A3728") {
  return `<p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:${color};font-family:Arial,sans-serif;">${text}</p>`;
}

function small(text: string, color = "#8A7F72") {
  return `<p style="margin:0 0 12px;font-size:13px;line-height:1.65;color:${color};font-family:Arial,sans-serif;">${text}</p>`;
}

function ctaButton(label: string, href: string) {
  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
      <tr>
        <td style="background:#5C2D8E;padding:14px 32px;">
          <a href="${href}" style="font-family:Arial,sans-serif;font-size:12px;font-weight:normal;text-transform:uppercase;letter-spacing:0.18em;color:#F7F3EE;text-decoration:none;display:inline-block;">${label}</a>
        </td>
      </tr>
    </table>
  `.trim();
}

function ghostButton(label: string, href: string) {
  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0 0;">
      <tr>
        <td style="border:1px solid #C8B8A2;padding:12px 28px;">
          <a href="${href}" style="font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;color:#4A3728;text-decoration:none;display:inline-block;">${label}</a>
        </td>
      </tr>
    </table>
  `.trim();
}

function signature(name = "Martina") {
  return `
    <p style="margin:32px 0 0;font-family:Georgia,serif;font-style:italic;font-size:24px;color:#4A3728;">
      ${name}
    </p>
  `.trim();
}

function footer() {
  return `
    <div style="${FOOTER}">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">
        Martina Rink &mdash; Private Mentoring
      </p>
      <p style="margin:0 0 6px;font-size:12px;color:#8A7F72;font-family:Arial,sans-serif;">
        <a href="https://martinarink.com" style="color:#8A7F72;text-decoration:none;">martinarink.com</a>
        &nbsp;&middot;&nbsp;coaching@martinarink.com
      </p>
      <p style="margin:16px 0 0;font-size:11px;color:#C8B8A2;font-family:Arial,sans-serif;">
        Martina Rink UG (haftungsbeschr&auml;nkt), Karlsruhe, Germany.
        You are receiving this because you subscribed or submitted an application.
        <a href="{{unsubscribeLink}}" style="color:#C8B8A2;">Unsubscribe</a>
      </p>
    </div>
  `.trim();
}

function wrap(innerContent: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Martina Rink</title>
</head>
<body style="${WRAP}">
  <div style="${INNER}">
    ${innerContent}
    ${footer()}
  </div>
</body>
</html>`;
}

/* ═══════════════════════════════════════════════════════════════
   1. APPLICATION CONFIRMATION — sent to the applicant immediately
   ═══════════════════════════════════════════════════════════════ */

export interface ApplicationEmailData {
  firstName: string;
  programme: "sober-muse" | "empowerment";
  programmeLabel: string;
}

export function applicationConfirmationEmail(data: ApplicationEmailData): {
  subject: string;
  html: string;
} {
  const { firstName, programmeLabel } = data;

  const html = wrap(`
    <div style="${HEADER_DARK}">
      <span style="${PINK_RULE}"></span>
      ${eyebrow("Application received")}
      ${h1(`Your application is<br>in front of me.`)}
      <p style="margin:0;font-size:15px;color:#EDE8E0;opacity:0.7;font-family:Arial,sans-serif;">
        ${programmeLabel}
      </p>
    </div>

    <div style="${BODY_SECTION}">
      ${body(`Dear ${firstName},`)}
      ${body(`Thank you for applying. I read every application myself — not in a queue, not by an assistant. You will hear from me personally within 48 hours.`)}
      ${body(`What happens next: if the fit is right, I will write to you directly with a private link to book our first conversation. That call is 45 minutes, &euro;350, and it is credited in full to the programme if you proceed.`)}
      ${body(`In the meantime, if you would like to read more about the work — about how I think about these questions — three essays are below.`)}
      <hr style="${HAIRLINE}">
      ${h2("While you wait.")}
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
        ${[
          ["What high-functioning women use alcohol for", "what-high-functioning-women-use-alcohol-for"],
          ["The identity underneath the title", "the-identity-underneath-the-title"],
          ["On elegance and edges — Isabella Blow", "on-elegance-and-edges-isabella-blow"],
        ].map(([title, slug]) => `
          <tr>
            <td style="padding:16px 0;border-bottom:1px solid #C8B8A2;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Essay</p>
              <a href="https://martinarink.com/writing/${slug}" style="font-family:Georgia,serif;font-size:18px;color:#1E1B17;text-decoration:none;line-height:1.35;">${title}</a>
              <br>
              <a href="https://martinarink.com/writing/${slug}" style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#5C2D8E;text-decoration:none;font-family:Arial,sans-serif;">Read &rarr;</a>
            </td>
          </tr>
        `).join("")}
      </table>
      ${signature()}
      ${small("If, after reading what you wrote, I don&rsquo;t think the work is the right fit — I will say so, plainly and warmly. The fit matters as much to me as it does to you.")}
    </div>
  `);

  return {
    subject: `Your application — ${programmeLabel}`,
    html,
  };
}

/* ═══════════════════════════════════════════════════════════════
   2. APPLICATION NOTIFICATION — internal alert to Martina
   ═══════════════════════════════════════════════════════════════ */

export interface ApplicationNotificationData {
  firstName: string;
  email: string;
  programme: string;
  programmeLabel: string;
  budgetTag: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  submittedAt: string;
  /** HMAC-signed URL for one-click acceptance — generated in /api/apply */
  acceptUrl?: string;
}

export function applicationNotificationEmail(
  data: ApplicationNotificationData,
): { subject: string; html: string } {
  const { firstName, email, programmeLabel, budgetTag, q1, q2, q3, q4, q5, submittedAt, acceptUrl } = data;

  const budgetColor =
    budgetTag === "READY"
      ? "#5C2D8E"
      : budgetTag === "READY-PAYMENT-PLAN"
      ? "#4A3728"
      : "#8A7F72";

  function qaRow(question: string, answer: string) {
    return `
      <tr>
        <td colspan="2" style="padding:20px 0 8px;">
          <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">${question}</p>
          <p style="margin:0;font-size:15px;line-height:1.7;color:#1E1B17;font-family:Arial,sans-serif;white-space:pre-wrap;">${answer}</p>
        </td>
      </tr>
      <tr><td colspan="2" style="padding:0;"><hr style="${HAIRLINE}"></td></tr>
    `;
  }

  const html = wrap(`
    <div style="${HEADER_CREAM}padding-bottom:24px;">
      <span style="${PINK_RULE}"></span>
      ${eyebrow("New application")}
      ${h1(`${firstName} — ${programmeLabel}`, "#1E1B17")}
      <p style="margin:0 0 8px;font-size:13px;color:#8A7F72;font-family:Arial,sans-serif;">${submittedAt}</p>
    </div>

    <div style="${BODY_SECTION}">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;width:38%;">
            <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Name</p>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">
            <p style="margin:0;font-size:15px;color:#1E1B17;font-family:Arial,sans-serif;">${firstName}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">
            <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Email</p>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">
            <a href="mailto:${email}" style="font-size:15px;color:#5C2D8E;font-family:Arial,sans-serif;text-decoration:none;">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">
            <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Budget</p>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">
            <p style="margin:0;font-size:15px;color:${budgetColor};font-weight:bold;font-family:Arial,sans-serif;">${budgetTag}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#8A7F72;font-family:Arial,sans-serif;">${q5}</p>
          </td>
        </tr>
        ${qaRow("What brought you here?", q1)}
        ${qaRow("What have you tried before?", q2)}
        ${qaRow("Current situation", q3)}
        ${qaRow("What success looks like", q4)}
      </table>

      <hr style="${HAIRLINE}">
      <p style="margin:0 0 20px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Your decision</p>

      ${acceptUrl ? `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
        <tr>
          <td style="background:#5C2D8E;padding:14px 32px;">
            <a href="${acceptUrl}" style="font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:0.18em;color:#F7F3EE;text-decoration:none;display:inline-block;">✓ Accept — send booking link to ${firstName}</a>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 20px;font-size:11px;color:#8A7F72;font-family:Arial,sans-serif;">One click. The booking link email fires automatically. No further action needed.</p>
      ` : ""}

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
        <tr>
          <td style="border:1px solid #C8B8A2;padding:12px 28px;">
            <a href="mailto:${email}?subject=Re%3A%20Your%20application&body=Dear%20${encodeURIComponent(firstName)}%2C%0A%0AThank%20you%20for%20applying.%20I%20have%20read%20your%20application%20carefully.%0A%0AAfter%20reflection%2C%20I%20don%E2%80%99t%20think%20this%20is%20the%20right%20fit%20for%20either%20of%20us%20right%20now.%20%5BAdd%20your%20honest%20reason%20here.%5D%0A%0AThis%20is%20not%20a%20reflection%20of%20you%20or%20the%20work%20you%20are%20doing%20%E2%80%94%20it%20is%20simply%20a%20matter%20of%20fit.%0A%0AI%20wish%20you%20well%20with%20what%20comes%20next.%0A%0AMartina" style="font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;color:#4A3728;text-decoration:none;display:inline-block;">✗ Not a fit — open decline draft</a>
          </td>
        </tr>
      </table>
      <p style="margin:0;font-size:11px;color:#8A7F72;font-family:Arial,sans-serif;">Opens your email client with a pre-written decline. Edit before sending.</p>
    </div>
  `);

  return {
    subject: `[Application] ${firstName} — ${programmeLabel}`,
    html,
  };
}

/* ═══════════════════════════════════════════════════════════════
   3. NEWSLETTER WELCOME — first letter to new subscribers
      Note: Brevo automations send this on newsletter_subscribed event.
      This template is for reference / Brevo editor parity.
   ═══════════════════════════════════════════════════════════════ */

export function newsletterWelcomeEmail(firstName?: string): {
  subject: string;
  html: string;
} {
  const salutation = firstName ? `Dear ${firstName},` : "Dear reader,";

  const html = wrap(`
    <div style="${HEADER_DARK}">
      <span style="${PINK_RULE}"></span>
      ${eyebrow("The Sober Muse Letter")}
      ${h1(`Welcome.`)}
    </div>

    <div style="${BODY_SECTION}">
      ${body(salutation)}
      ${body(`Your first letter will arrive on Sunday. Every letter is written directly to you — not to an audience, not to a brand. To the woman who reads carefully and thinks carefully and is somewhere in the middle of figuring something out.`)}
      ${body(`You are on a small list. I keep it that way deliberately. What I write here does not live anywhere else.`)}
      ${body(`Until Sunday &mdash;`)}
      ${signature()}
      <hr style="${HAIRLINE}">
      ${h2("While you wait.")}
      ${body(`Three things I have written that might be useful right now:`)}
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:8px 0 0;">
        ${[
          ["What high-functioning women use alcohol for", "what-high-functioning-women-use-alcohol-for"],
          ["The identity underneath the title", "the-identity-underneath-the-title"],
          ["The gap between excellence and inhabiting your own life", "the-gap-between-excellence"],
        ].map(([title, slug]) => `
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid #C8B8A2;">
              <a href="https://martinarink.com/writing/${slug}" style="font-family:Georgia,serif;font-size:17px;color:#1E1B17;text-decoration:none;line-height:1.35;display:block;margin-bottom:6px;">${title}</a>
              <a href="https://martinarink.com/writing/${slug}" style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#5C2D8E;text-decoration:none;font-family:Arial,sans-serif;">Read &rarr;</a>
            </td>
          </tr>
        `).join("")}
      </table>
    </div>
  `);

  return {
    subject: `Welcome to The Sober Muse Letter`,
    html,
  };
}

/* ═══════════════════════════════════════════════════════════════
   3b. ACCEPTANCE EMAIL — sent to the applicant when Martina accepts
   ═══════════════════════════════════════════════════════════════ */

export interface AcceptanceEmailData {
  firstName: string;
  programme: "sober-muse" | "empowerment" | "consultation";
  programmeLabel: string;
}

export function acceptanceEmail(data: AcceptanceEmailData): {
  subject: string;
  html: string;
} {
  const { firstName, programmeLabel } = data;
  const bookingLink = "https://martinarink.com/book?token=approved";

  const html = wrap(`
    <div style="${HEADER_DARK}">
      <span style="${PINK_RULE}"></span>
      ${eyebrow("Your application")}
      ${h1(`Dear ${firstName}.`)}
    </div>

    <div style="${BODY_SECTION}">
      ${body(`Thank you for your patience. I have read your application carefully, and I would like to speak with you.`)}
      ${body(`The next step is a private 45-minute conversation. It is not a sales call — it is how I understand where you are and whether the work I do is what you actually need. You leave with clarity, regardless of what comes next.`)}
      ${body(`The consultation is &euro;350, applied in full to the programme if we decide to proceed together.`)}
      <hr style="${HAIRLINE}">
      ${h2("Your booking link.")}
      ${body(`The link below is private and issued only to you. It opens the payment and booking calendar directly.`)}
      ${ctaButton("Confirm your consultation — &euro;350", bookingLink)}
      ${small(`Or copy this link: <a href="${bookingLink}" style="color:#5C2D8E;text-decoration:none;">${bookingLink}</a>`)}
      <hr style="${HAIRLINE}">
      ${body(`If the timing is not right — if something has changed since you applied — please simply write back. There is no pressure. I hold this space for you until you are ready, within reason.`)}
      ${signature()}
    </div>
  `);

  return {
    subject: `Your application — next step`,
    html,
  };
}

/* ═══════════════════════════════════════════════════════════════
   4. CONSULTATION BOOKING NOTIFICATION — internal alert to Martina
   ═══════════════════════════════════════════════════════════════ */

export interface ConsultationBookingData {
  inviteeName: string;
  inviteeEmail: string;
  eventName: string;
  startTime: string;
  joinUrl?: string;
  utmSource?: string;
  qaRows?: Array<{ question: string; answer: string }>;
}

export function consultationBookingEmail(
  data: ConsultationBookingData,
): { subject: string; html: string } {
  const { inviteeName, inviteeEmail, eventName, startTime, joinUrl, utmSource, qaRows = [] } = data;

  const html = wrap(`
    <div style="${HEADER_DARK}">
      <span style="${PINK_RULE}"></span>
      ${eyebrow("New consultation booked")}
      ${h1(`${inviteeName}`, "#EDE8E0")}
      <p style="margin:0;font-size:14px;color:#EDE8E0;opacity:0.7;font-family:Arial,sans-serif;">
        ${eventName} &middot; ${startTime}
      </p>
    </div>

    <div style="${BODY_SECTION}">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;width:38%;">
            <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Email</p>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">
            <a href="mailto:${inviteeEmail}" style="font-size:15px;color:#5C2D8E;font-family:Arial,sans-serif;text-decoration:none;">${inviteeEmail}</a>
          </td>
        </tr>
        ${utmSource ? `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">
            <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Source</p>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">
            <p style="margin:0;font-size:15px;color:#1E1B17;font-family:Arial,sans-serif;">${utmSource}</p>
          </td>
        </tr>` : ""}
        ${joinUrl ? `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">
            <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Join link</p>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #C8B8A2;">
            <a href="${joinUrl}" style="font-size:15px;color:#5C2D8E;font-family:Arial,sans-serif;text-decoration:none;word-break:break-all;">${joinUrl}</a>
          </td>
        </tr>` : ""}
        ${qaRows.map(({ question, answer }) => `
        <tr>
          <td colspan="2" style="padding:18px 0 6px;">
            <p style="margin:0 0 5px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">${question}</p>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#1E1B17;font-family:Arial,sans-serif;">${answer}</p>
          </td>
        </tr>
        <tr><td colspan="2" style="padding:0;"><hr style="${HAIRLINE}"></td></tr>
        `).join("")}
      </table>
    </div>
  `);

  return {
    subject: `[Booking] ${eventName} — ${inviteeName}`,
    html,
  };
}

/* ═══════════════════════════════════════════════════════════════
   5. CONTRACT INVITE — sent to client when Martina sends the contract
   ═══════════════════════════════════════════════════════════════ */

export interface ContractInviteEmailData {
  firstName: string;
  programmeLabel: string;
  contractUrl: string;
}

export function contractInviteEmail(data: ContractInviteEmailData): {
  subject: string;
  html: string;
} {
  const { firstName, programmeLabel, contractUrl } = data;

  const html = wrap(`
    <div style="${HEADER_DARK}">
      <span style="${PINK_RULE}"></span>
      ${eyebrow("Your coaching contract")}
      ${h1(`Before we begin.`)}
      <p style="margin:0;font-size:15px;color:#EDE8E0;opacity:0.7;font-family:Arial,sans-serif;">
        ${programmeLabel}
      </p>
    </div>

    <div style="${BODY_SECTION}">
      ${body(`Dear ${firstName},`)}
      ${body(`Before we begin, I send a short contract that sets out what we are building together &mdash; the programme, the format, the investment, and the terms I work under.`)}
      ${body(`It takes two minutes. You read it, type your name, and confirm. That is the whole process.`)}

      ${ctaButton("Review and sign your contract &rarr;", contractUrl)}

      <hr style="${HAIRLINE}">

      ${small(`The contract is waiting at the link above. It expires in 7 days. If you have any questions about the terms before signing, simply reply to this email.`)}
      ${signature()}
    </div>
  `);

  return {
    subject: `Your coaching contract — ${firstName}`,
    html,
  };
}

/* ═══════════════════════════════════════════════════════════════
   6. CONTRACT SIGNED — sent to both parties after client signs
   ═══════════════════════════════════════════════════════════════ */

export interface ContractSignedEmailData {
  firstName: string;
  email: string;
  programmeLabel: string;
  serviceDescription: string;
  fee: string;
  deliveryMethod: string;
  location?: string;
  contractDate: string;
  contractId: string;
  signedAt: string;
  signedName: string;
  /** true = internal copy to Martina; false = client copy */
  isInternal?: boolean;
}

export function contractSignedEmail(data: ContractSignedEmailData): {
  subject: string;
  html: string;
} {
  const {
    firstName,
    email,
    programmeLabel,
    serviceDescription,
    fee,
    deliveryMethod,
    location,
    contractDate,
    contractId,
    signedAt,
    signedName,
    isInternal = false,
  } = data;

  const signedDate = new Date(signedAt).toLocaleDateString("en-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const deliveryDisplay = location
    ? `${deliveryMethod} (${location})`
    : deliveryMethod;

  function contractRow(label: string, value: string) {
    return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #C8B8A2;width:36%;vertical-align:top;">
          <p style="margin:0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">${label}</p>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #C8B8A2;vertical-align:top;">
          <p style="margin:0;font-size:15px;line-height:1.65;color:#1E1B17;font-family:Arial,sans-serif;">${value}</p>
        </td>
      </tr>
    `;
  }

  const html = wrap(`
    <div style="${HEADER_DARK}">
      <span style="${PINK_RULE}"></span>
      ${eyebrow(isInternal ? `Contract signed — ${firstName}` : "Your signed contract")}
      ${h1(isInternal ? `${firstName} has signed.` : `Your contract is confirmed.`)}
      <p style="margin:0;font-size:15px;color:#EDE8E0;opacity:0.7;font-family:Arial,sans-serif;">
        ${programmeLabel}
      </p>
    </div>

    <div style="${BODY_SECTION}">

      ${isInternal ? body(`${firstName} (${email}) has signed the coaching contract. A copy has been sent to them. The record below is your reference.`) : body(`Dear ${firstName}, your coaching contract is now signed and confirmed. A copy of the agreed terms is below for your records.`)}

      <!-- Signed badge -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
        <tr>
          <td style="background:#5C2D8E;padding:10px 24px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#F7F3EE;font-family:Arial,sans-serif;">
              &#10003; Signed digitally on ${signedDate}
            </p>
          </td>
        </tr>
      </table>

      <hr style="${HAIRLINE}">
      <p style="margin:0 0 20px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Contract terms</p>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 32px;">
        ${contractRow("Parties", `Concept Studio Martina Rink UG (haftungsbeschr&auml;nkt), Karlsruhe &mdash; Coach<br>${signedName} &mdash; Customer`)}
        ${contractRow("Programme", programmeLabel)}
        ${contractRow("Services", serviceDescription)}
        ${contractRow("Format", deliveryDisplay)}
        ${contractRow("Investment", fee)}
        ${contractRow("Contract date", contractDate)}
      </table>

      <hr style="${HAIRLINE}">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Subject matter</p>
      ${small(`The coaching supports personal development processes, goal achievement and quality of life improvement. The coaching is based on a dialogue based on partnership. The client undertakes to actively participate in the coaching process. The coach expressly does not guarantee success.`)}

      <hr style="${HAIRLINE}">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Annexes confirmed</p>
      ${small(`The client confirmed receipt and agreement to: General Terms &amp; Conditions, Cancellation Policy, and Privacy Policy.`)}

      <hr style="${HAIRLINE}">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8A7F72;font-family:Arial,sans-serif;">Signature record</p>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
        ${contractRow("Signed by", signedName)}
        ${contractRow("Signed at", signedDate)}
        ${contractRow("Reference", contractId)}
      </table>

      ${isInternal ? "" : `
      <hr style="${HAIRLINE}">
      ${small(`This document is your record of the signed agreement. Please save it for your reference. If you have any questions, simply reply to this email.`)}
      ${signature()}
      `}
    </div>
  `);

  return {
    subject: isInternal
      ? `[Contract signed] ${firstName} — ${programmeLabel}`
      : `Your coaching contract — signed`,
    html,
  };
}
