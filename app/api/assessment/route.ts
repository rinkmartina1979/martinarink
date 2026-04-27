/**
 * POST /api/assessment
 *
 * Security model:
 * - All scoring is server-side. Client sends answers + email only.
 * - resultId is HMAC-SHA256 signed. Cannot be forged without ASSESSMENT_RESULT_SECRET.
 * - resultId encodes only non-sensitive metadata (archetype, intent, readiness, privacy).
 * - Email and answers are NEVER encoded into the URL.
 * - Kit is fire-and-forget (never blocks redirect).
 * - Sanity backup is fire-and-forget (never blocks redirect).
 * - High-intent Resend notification is fire-and-forget.
 */

import { NextRequest, NextResponse } from "next/server";
import { computeResult, deriveRouting } from "@/lib/assessment/scoring";
import { assessmentSubmissionSchema } from "@/lib/assessment/validation";
import { makeResultId } from "@/lib/assessment/resultId";
import { subscribeToKit } from "@/lib/kit";
import { storeSubmission } from "@/lib/assessment/storage";
import { notifyHighIntentLead } from "@/lib/assessment/notify";
import type { Archetype, ServiceIntent, ReadinessLevel, PrivacyNeed } from "@/lib/assessment/types";

// ── KIT TAG BUILDER ───────────────────────────────────────────

function buildKitTags(
  archetype: Archetype,
  serviceIntent: ServiceIntent,
  readinessLevel: ReadinessLevel,
  privacyNeed: PrivacyNeed
): string[] {
  const env = process.env;
  const tags: string[] = [];

  const archetypeTag: Record<Archetype, string | undefined> = {
    reckoning: env.KIT_TAG_ARCHETYPE_RECKONING,
    threshold: env.KIT_TAG_ARCHETYPE_THRESHOLD,
    return: env.KIT_TAG_ARCHETYPE_RETURN,
  };

  const intentTag: Record<ServiceIntent, string | undefined> = {
    "sober-muse": env.KIT_TAG_INTENT_SOBER_MUSE,
    empowerment: env.KIT_TAG_INTENT_EMPOWERMENT,
    both: env.KIT_TAG_INTENT_BOTH,
  };

  const readinessTag: Record<ReadinessLevel, string | undefined> = {
    low: env.KIT_TAG_READINESS_LOW,
    medium: env.KIT_TAG_READINESS_MEDIUM,
    high: env.KIT_TAG_READINESS_HIGH,
  };

  const privacyTag: Record<PrivacyNeed, string | undefined> = {
    standard: env.KIT_TAG_PRIVACY_STANDARD,
    high: env.KIT_TAG_PRIVACY_HIGH,
  };

  if (env.KIT_TAG_ASSESSMENT_COMPLETED) tags.push(env.KIT_TAG_ASSESSMENT_COMPLETED);
  if (env.KIT_TAG_SOURCE_ASSESSMENT) tags.push(env.KIT_TAG_SOURCE_ASSESSMENT);
  if (env.KIT_TAG_SEQUENCE_ASSESSMENT) tags.push(env.KIT_TAG_SEQUENCE_ASSESSMENT);

  const aTag = archetypeTag[archetype];
  const iTag = intentTag[serviceIntent];
  const rTag = readinessTag[readinessLevel];
  const pTag = privacyTag[privacyNeed];

  if (aTag) tags.push(aTag);
  if (iTag) tags.push(iTag);
  if (rTag) tags.push(rTag);
  if (pTag) tags.push(pTag);

  return tags.filter(Boolean);
}

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
  const tags = buildKitTags(archetype, serviceIntent, readinessLevel, privacyNeed);
  const formId = process.env.KIT_FORM_ID_ASSESSMENT;

  // ── BACKGROUND TASKS ─────────────────────────────────────────
  let kitStatus: "pending" | "success" | "skipped" | "failed" = "skipped";
  let kitError: string | undefined;

  const background = async () => {
    // 1. Kit subscription
    if (formId) {
      try {
        const kitResult = await subscribeToKit({
          email,
          firstName,
          formId,
          tags,
          fields: {
            archetype,
            assessment_result: archetype,
            service_intent: serviceIntent,
            readiness_level: readinessLevel,
            privacy_need: privacyNeed,
            completed_at: submittedAt,
            source_page: "points-of-departure",
          },
        });
        if (kitResult.success) {
          kitStatus = "success";
          console.log(`[Assessment] Kit subscribed: ${archetype} / ${readinessLevel}`);
        } else {
          kitStatus = "failed";
          kitError = kitResult.error;
          console.error("[Assessment] Kit subscribe failed:", kitResult.error);
        }
      } catch (err) {
        kitStatus = "failed";
        kitError = String(err);
        console.error("[Assessment] Kit threw:", err);
      }
    } else {
      console.warn("[Assessment] KIT_FORM_ID_ASSESSMENT not set — Kit skipped.");
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
      kitStatus,
      kitError,
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
