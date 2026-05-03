/**
 * POST /api/apply
 *
 * Receives application form submissions for both programmes.
 * Sends internal notification via Resend.
 * Adds applicant to Brevo Assessment Leads list with APPLICATION_STATUS attribute.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addBrevoContact } from "@/lib/brevo";

const ApplySchema = z.object({
  firstName: z.string().min(1),
  email: z.string().email(),
  q1: z.string().min(10),
  q2: z.string().min(10),
  q3: z.string().min(1),
  q4: z.string().min(10),
  q5: z.string().min(1),
  consent: z.literal(true),
  programme: z.enum(["sober-muse", "empowerment"]),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ApplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { firstName, email, q1, q2, q3, q4, q5, programme } = parsed.data;

  // Derive a quick-glance budget tag for the notification
  const budgetTag = q5.startsWith("Yes —")
    ? "READY"
    : q5.startsWith("Yes, with")
    ? "READY-PAYMENT-PLAN"
    : "NOT-YET";

  const programmeLabels: Record<string, string> = {
    "sober-muse": "The Sober Muse Method",
    empowerment: "Female Empowerment & Leadership",
  };
  const programmeLabel = programmeLabels[programme];

  // ── Resend internal notification ──────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || process.env.RESEND_REPLY_TO;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@martinarink.com";

  if (resendKey && notifyEmail) {
    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; color: #1E1B17;">
        <h2 style="font-size: 20px; font-weight: normal;">New application — ${programmeLabel}</h2>
        <p style="color: #8A7F72; font-size: 13px;">${new Date().toISOString()}</p>
        <hr style="border: none; border-top: 1px solid #C8B8A2; margin: 20px 0;" />
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr style="border: none; border-top: 1px solid #C8B8A2; margin: 20px 0;" />
        <h3 style="font-size: 14px; color: #8A7F72; text-transform: uppercase; letter-spacing: 0.1em;">What brought you here?</h3>
        <p style="white-space: pre-wrap;">${q1}</p>
        <h3 style="font-size: 14px; color: #8A7F72; text-transform: uppercase; letter-spacing: 0.1em;">What have you tried before?</h3>
        <p style="white-space: pre-wrap;">${q2}</p>
        <h3 style="font-size: 14px; color: #8A7F72; text-transform: uppercase; letter-spacing: 0.1em;">Current situation</h3>
        <p>${q3}</p>
        <h3 style="font-size: 14px; color: #8A7F72; text-transform: uppercase; letter-spacing: 0.1em;">What success looks like</h3>
        <p style="white-space: pre-wrap;">${q4}</p>
        <h3 style="font-size: 14px; color: #8A7F72; text-transform: uppercase; letter-spacing: 0.1em;">Investment readiness</h3>
        <p><strong style="color: ${budgetTag === "READY" ? "#5C2D8E" : budgetTag === "READY-PAYMENT-PLAN" ? "#4A3728" : "#8A7F72"};">${budgetTag}</strong> — ${q5}</p>
      </div>
    `;

    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notifyEmail],
        reply_to: email,
        subject: `[Application] ${firstName} — ${programmeLabel}`,
        html,
      }),
    }).catch((err) => console.error("[Apply] Resend failed:", err));
  } else {
    console.warn("[Apply] RESEND_API_KEY or RESEND_NOTIFY_EMAIL not configured — notification skipped.");
  }

  // ── Brevo: add applicant to Assessment Leads list ────────
  const listIdRaw = process.env.BREVO_LIST_ID_ASSESSMENT;
  if (listIdRaw) {
    addBrevoContact({
      email,
      firstName,
      listIds: [parseInt(listIdRaw, 10)],
      attributes: {
        SOURCE: "application",
        APPLICATION_PROGRAMME: programme,
        APPLICATION_STATUS: "submitted",
        BUDGET_READINESS: budgetTag,
      },
    }).catch((err) => console.error("[Apply] Brevo failed:", err));
  }

  return NextResponse.json({ success: true });
}
