/**
 * POST /api/assessment
 *
 * Security model:
 * - All scoring is server-side. Client sends answers + email only.
 * - resultId is HMAC-SHA256 signed. Cannot be forged without ASSESSMENT_RESULT_SECRET.
 * - resultId encodes only non-sensitive metadata (archetype, intent, readiness, privacy).
 * - Email and answers are NEVER encoded into the URL.
 * - Brevo is fire-and-forget (never blocks redirect).
 * - Sanity backup is fire-and-forget (never blocks redirect).
 * - High-intent Resend notification is fire-and-forget.
 */

import { NextRequest, NextResponse } from "next/server";
import { computeResult, deriveRouting } from "@/lib/assessment/scoring";
import { assessmentSubmissionSchema } from "@/lib/assessment/validation";
import { makeResultId } from "@/lib/assessment/resultId";
import { subscribeAssessmentLead } from "@/lib/brevo";
import { storeSubmission } from "@/lib/assessment/storage";
import { notifyHighIntentLead } from "@/lib/assessment/notify";
import type { Archetype, ServiceIntent, ReadinessLevel, PrivacyNeed } from "@/lib/assessment/types";

// (Brevo handles segmentation via contact attributes — no tag builder needed)

// ── SIMPLE RATE LIMIT ─────────────────────────────────────────

const submissionLog = new Map<string, number[]>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (submissionLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (times.length >= RATE_MAX) return true;
  times.push(now);
  submissionLog.set(ip, times);
  return false;
}

// ── ROUTE HANDLER ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = assessmentSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { answers, email, firstName } = parsed.data;

  // ── SERVER-SIDE SCORING ──────────────────────────────────────
  const result = computeResult(answers);
  const { archetype, serviceIntent, readinessLevel, privacyNeed } = result;

  // ── SIGNED RESULT ID ─────────────────────────────────────────
  let resultId: string;
  try {
    resultId = makeResultId(archetype, serviceIntent, readinessLevel, privacyNeed);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "signing error";
    console.error("[Assessment] resultId signing failed:", msg);
    return NextResponse.json(
      { error: "Service configuration error. Please contact support." },
      { status: 503 }
    );
  }

  const submittedAt = new Date().toISOString();

  // ── BACKGROUND TASKS ─────────────────────────────────────────
  let brevoStatus: "success" | "skipped" | "failed" = "skipped";
  let brevoError: string | undefined;

  const background = async () => {
    // 1. Brevo contact creation + list add
    try {
      const brevoResult = await subscribeAssessmentLead({
        email,
        firstName,
        archetype,
        serviceIntent,
        readinessLevel,
        privacyNeed,
        completedAt: submittedAt,
      });
      if (brevoResult.success) {
        brevoStatus = "success";
        console.log(`[Assessment] Brevo contact created: ${archetype} / ${readinessLevel}`);
      } else {
        brevoStatus = "failed";
        brevoError = brevoResult.error;
        console.error("[Assessment] Brevo failed:", brevoResult.error);
      }
    } catch (err) {
      brevoStatus = "failed";
      brevoError = String(err);
      console.error("[Assessment] Brevo threw:", err);
    }

    // 2. Sanity lead backup
    await storeSubmission({
      resultId,
      email,
      firstName,
      answers,
      archetype,
      serviceIntent,
      readinessLevel,
      privacyNeed,
      emailStatus: brevoStatus,
      emailError: brevoError,
      sourcePage: "/assessment",
      userAgent: req.headers.get("user-agent") ?? undefined,
      referrer: req.headers.get("referer") ?? undefined,
      createdAt: submittedAt,
    });

    // 3. High-intent notification
    if (readinessLevel === "high") {
      await notifyHighIntentLead({
        firstName,
        archetype,
        serviceIntent,
        readinessLevel,
        privacyNeed,
        resultId,
        submittedAt,
      });
    }
  };

  background().catch((err) =>
    console.error("[Assessment] Background task failed:", err)
  );

  // ── RESPOND IMMEDIATELY ──────────────────────────────────────
  const routing = deriveRouting(result);

  return NextResponse.json({
    resultId,
    archetype,
    serviceIntent,
    readinessLevel,
    routing,
  });
}
