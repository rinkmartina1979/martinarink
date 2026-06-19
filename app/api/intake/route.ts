/**
 * POST /api/intake
 *
 * Full confidential client intake form.
 * Sends formatted notification to Martina via Resend.
 * Adds client to Brevo with full intake attributes.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addBrevoContact, trackBrevoEvent } from "@/lib/brevo";

const IntakeSchema = z.object({
  // ── Personal ────────────────────────────────────────────────
  firstName:             z.string().min(1),
  lastName:              z.string().min(1),
  dateOfBirth:           z.string().min(1),
  address:               z.string().min(1),
  city:                  z.string().min(1),
  postcode:              z.string().min(1),
  phone:                 z.string().min(1),
  email:                 z.string().email(),
  occupation:            z.string().min(1),
  employer:              z.string().optional(),
  emergencyContactName:  z.string().min(1),
  emergencyContactPhone: z.string().min(1),
  maritalStatus:         z.string().min(1),
  preferredPronouns:     z.string().optional(),
  referralSource:        z.string().optional(),
  emailOptIn:            z.boolean().optional(),
  programme:             z.enum(["sober-muse", "empowerment", "consultation"]),

  // ── Medical ─────────────────────────────────────────────────
  conditions:              z.array(z.string()).optional(),
  medications:             z.boolean(),
  medicationsDetail:       z.string().optional(),
  recentTherapy:           z.boolean(),
  recentTherapyDetail:     z.string().optional(),
  sleepIssues:             z.boolean(),
  sleepIssuesDetail:       z.string().optional(),
  addictions:              z.boolean(),
  addictionsDetail:        z.string().optional(),
  currentTherapist:        z.boolean(),
  currentTherapistDetail:  z.string().optional(),
  physicalHealth:          z.string().min(1),

  // ── Questionnaire ────────────────────────────────────────────
  whyNow:          z.string().min(10),
  whatIsWorking:   z.string().min(10),
  whatCouldBeBetter: z.string().min(10),
  expectations:    z.string().min(10),
  focusFirst:      z.string().min(10),
  strengths:       z.string().min(10),
  areasForGrowth:  z.string().min(10),
  withoutLimits:   z.string().min(10),

  // ── Lifestyle ────────────────────────────────────────────────
  timeKeeping:      z.string().min(1),
  exerciseRegular:  z.boolean(),
  exerciseDetail:   z.string().optional(),
  hobbies:          z.boolean(),
  hobbiesDetail:    z.string().optional(),
  funActivities:    z.string().optional(),

  // ── Goals ───────────────────────────────────────────────────
  personalGoals:      z.string().min(10),
  professionalGoals:  z.string().min(10),
  desiredChanges:     z.string().min(10),
  obstacles:          z.string().min(10),
  successDefinition:  z.string().min(10),

  // ── Investment ───────────────────────────────────────────────
  investmentReadiness: z.string().min(1),

  consent: z.literal(true),
});

type IntakeData = z.infer<typeof IntakeSchema>;

function row(label: string, value: string | undefined | boolean | string[]) {
  if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) return "";
  if (typeof value === "boolean") value = value ? "Yes" : "No";
  if (Array.isArray(value)) value = value.join(", ");
  return `
    <tr>
      <td style="padding: 8px 12px; background:#F8F4F1; border-bottom:1px solid #EDE8E0;
                 font-size:11px; color:#8A7F72; text-transform:uppercase; letter-spacing:0.1em;
                 white-space:nowrap; width:200px; vertical-align:top;">${label}</td>
      <td style="padding: 8px 12px; border-bottom:1px solid #EDE8E0; font-size:14px;
                 color:#1E1B17; white-space:pre-wrap; vertical-align:top;">${value}</td>
    </tr>`;
}

function section(title: string, rows: string) {
  return `
    <h3 style="margin: 32px 0 8px; font-size:11px; letter-spacing:0.18em; text-transform:uppercase;
               color:#F942AA; font-family:sans-serif; font-weight:600; border-bottom:1px solid #F942AA;
               padding-bottom:6px;">${title}</h3>
    <table style="width:100%; border-collapse:collapse; font-family:Georgia,serif;">${rows}</table>`;
}

function buildEmail(d: IntakeData): string {
  const programmeLabels: Record<string, string> = {
    "sober-muse":    "The Sober Muse Method",
    empowerment:     "Female Empowerment & Leadership",
    consultation:    "Private Consultation",
  };
  return `
  <div style="font-family:Georgia,serif; max-width:680px; margin:0 auto; color:#1E1B17; background:#fff;">

    <div style="background:#231727; padding:32px 40px;">
      <p style="margin:0; font-family:sans-serif; font-size:11px; letter-spacing:0.22em;
                text-transform:uppercase; color:#F942AA;">Confidential Client Intake</p>
      <h1 style="margin:8px 0 0; font-size:28px; font-weight:400; color:#F8F4F1; letter-spacing:0.04em;">
        ${d.firstName} ${d.lastName}
      </h1>
      <p style="margin:6px 0 0; font-size:13px; color:rgba(248,244,241,0.6);">
        ${programmeLabels[d.programme]} &nbsp;·&nbsp; ${new Date().toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}
      </p>
    </div>

    <div style="padding:32px 40px;">

      ${section("Personal Information",
        row("Full name",        `${d.firstName} ${d.lastName}`) +
        row("Date of birth",    d.dateOfBirth) +
        row("Phone",            d.phone) +
        row("Email",            d.email) +
        row("Address",          `${d.address}, ${d.city}, ${d.postcode}`) +
        row("Occupation",       d.occupation) +
        row("Employer",         d.employer) +
        row("Marital status",   d.maritalStatus) +
        row("Preferred pronouns", d.preferredPronouns) +
        row("Emergency contact", `${d.emergencyContactName} — ${d.emergencyContactPhone}`) +
        row("Referral source",  d.referralSource) +
        row("Email list opt-in", d.emailOptIn)
      )}

      ${section("Medical & Wellbeing",
        row("Conditions noted",  d.conditions) +
        row("Medications",       d.medications) +
        row("Medications detail", d.medicationsDetail) +
        row("Recent therapy / support (30 days)", d.recentTherapy) +
        row("Recent therapy detail", d.recentTherapyDetail) +
        row("Sleep difficulties", d.sleepIssues) +
        row("Sleep detail",      d.sleepIssuesDetail) +
        row("Addictions",        d.addictions) +
        row("Addictions detail", d.addictionsDetail) +
        row("Currently seeing therapist", d.currentTherapist) +
        row("Therapist detail",  d.currentTherapistDetail) +
        row("Physical health",   d.physicalHealth)
      )}

      ${section("Why Now",
        row("What brought you here",      d.whyNow) +
        row("What is working well",       d.whatIsWorking) +
        row("What could be working better", d.whatCouldBeBetter) +
        row("Expectations",               d.expectations) +
        row("First focus",                d.focusFirst) +
        row("Strengths",                  d.strengths) +
        row("Areas for growth",           d.areasForGrowth) +
        row("If nothing could hold you back", d.withoutLimits)
      )}

      ${section("Habits & Lifestyle",
        row("Time keeping",     d.timeKeeping) +
        row("Exercise",         d.exerciseRegular) +
        row("Exercise detail",  d.exerciseDetail) +
        row("Hobbies",          d.hobbies) +
        row("Hobbies detail",   d.hobbiesDetail) +
        row("What she does for fun", d.funActivities)
      )}

      ${section("Goals",
        row("Personal goals",      d.personalGoals) +
        row("Professional goals",  d.professionalGoals) +
        row("Desired changes",     d.desiredChanges) +
        row("Obstacles",           d.obstacles) +
        row("Definition of success", d.successDefinition)
      )}

      ${section("Investment",
        row("Programme",           programmeLabels[d.programme]) +
        row("Investment readiness", d.investmentReadiness)
      )}

    </div>

    <div style="background:#F8F4F1; padding:16px 40px; font-size:11px;
                color:#8A7F72; font-family:sans-serif; letter-spacing:0.08em;">
      Confidential — Martina Rink Private Mentorship &nbsp;·&nbsp; martinarink.com
    </div>
  </div>`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = IntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const d = parsed.data;
  const fullName = `${d.firstName} ${d.lastName}`;
  const programmeLabels: Record<string, string> = {
    "sober-muse":  "The Sober Muse Method",
    empowerment:   "Female Empowerment & Leadership",
    consultation:  "Private Consultation",
  };

  // ── Resend — full intake to Martina ───────────────────────
  const resendKey   = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || process.env.RESEND_REPLY_TO;
  const fromEmail   = process.env.RESEND_FROM_EMAIL   || "hello@martinarink.com";

  if (resendKey && notifyEmail) {
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from:     `Martina Rink <${fromEmail}>`,
        to:       [notifyEmail],
        reply_to: d.email,
        subject:  `[Intake] ${fullName} — ${programmeLabels[d.programme]}`,
        html:     buildEmail(d),
      }),
    }).catch((err) => console.error("[Intake] Resend failed:", err));
  } else {
    console.warn("[Intake] RESEND_API_KEY or RESEND_NOTIFY_EMAIL not set — email skipped.");
  }

  // ── Brevo — add/update contact with full intake attributes ─
  const listIdRaw = process.env.BREVO_LIST_ID_ASSESSMENT;
  if (listIdRaw) {
    addBrevoContact({
      email: d.email,
      firstName: d.firstName,
      listIds: [parseInt(listIdRaw, 10)],
      attributes: {
        LASTNAME:              d.lastName,
        PHONE:                 d.phone,
        SOURCE:                "intake",
        APPLICATION_PROGRAMME: d.programme,
        APPLICATION_STATUS:    "intake_submitted",
        PHYSICAL_HEALTH:       d.physicalHealth,
        HAS_THERAPIST:         d.currentTherapist ? "yes" : "no",
        EMAIL_OPT_IN:          d.emailOptIn ? "yes" : "no",
        INTAKE_STATUS:         "submitted",
      },
    }).catch((err) => console.error("[Intake] Brevo contact failed:", err));
  }

  // ── Brevo — fire intake_submitted event ───────────────────
  trackBrevoEvent({
    email: d.email,
    eventName: "intake_submitted",
    properties: {
      programme:       d.programme,
      programme_label: programmeLabels[d.programme],
      full_name:       fullName,
    },
    contactProperties: {
      FIRSTNAME:           d.firstName,
      APPLICATION_PROGRAMME: d.programme,
      APPLICATION_STATUS:  "intake_submitted",
    },
  }).catch((err) => console.error("[Intake] Brevo event failed:", err));

  return NextResponse.json({ success: true });
}
