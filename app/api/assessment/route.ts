/**
 * POST /api/assessment
 *
 * Receives answers + email, computes archetype server-side,
 * subscribes to Kit with archetype tags, returns resultId for redirect.
 *
 * Security: scoring NEVER happens on the client.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { computeResult, deriveRouting } from "@/lib/assessment/scoring";
import { assessmentSubmissionSchema } from "@/lib/assessment/validation";
import { subscribeToKit } from "@/lib/kit";
import type { Archetype, ServiceIntent, ReadinessLevel, PrivacyNeed } from "@/lib/assessment/types";

/** Generate a short opaque result ID that encodes archetype for the result page */
function makeResultId(
  archetype: Archetype,
  serviceIntent: ServiceIntent,
  readinessLevel: ReadinessLevel,
  privacyNeed: PrivacyNeed
): string {
  const payload = JSON.stringify({ archetype, serviceIntent, readinessLevel, privacyNeed });
  const encoded = Buffer.from(payload).toString("base64url");
  // Prefix with a short random token so the URL isn't trivially guessable
  const token = crypto.randomBytes(4).toString("hex");
  return `${token}_${encoded}`;
}

/** Resolve Kit tag IDs from env for a given set of signals */
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

  const base = env.KIT_TAG_SOURCE_ASSESSMENT;
  const seqTag = env.KIT_TAG_SEQUENCE_ASSESSMENT;

  if (base) tags.push(base);
  if (seqTag) tags.push(seqTag);
  if (archetypeTag[archetype]) tags.push(archetypeTag[archetype]!);
  if (intentTag[serviceIntent]) tags.push(intentTag[serviceIntent]!);
  if (readinessTag[readinessLevel]) tags.push(readinessTag[readinessLevel]!);
  if (privacyTag[privacyNeed]) tags.push(privacyTag[privacyNeed]!);

  return tags.filter(Boolean);
}

export async function POST(req: NextRequest) {
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

  // ── SCORING (server-side, never client) ─────────────────────
  const result = computeResult(answers);
  const { archetype, serviceIntent, readinessLevel, privacyNeed } = result;

  // ── RESULT ID for redirect ───────────────────────────────────
  const resultId = makeResultId(archetype, serviceIntent, readinessLevel, privacyNeed);

  // ── KIT SUBSCRIPTION ─────────────────────────────────────────
  const formId = process.env.KIT_FORM_ID_ASSESSMENT;
  if (formId && email) {
    const tags = buildKitTags(archetype, serviceIntent, readinessLevel, privacyNeed);

    // Fire-and-forget — don't block the response
    subscribeToKit({
      email,
      firstName,
      formId,
      tags,
      fields: {
        archetype,
        service_intent: serviceIntent,
        readiness_level: readinessLevel,
        privacy_need: privacyNeed,
        source: "points-of-departure",
      },
    }).catch((err) => console.error("[Assessment] Kit subscribe failed:", err));
  }

  const routing = deriveRouting(result);

  return NextResponse.json({
    resultId,
    archetype,
    serviceIntent,
    readinessLevel,
    routing,
  });
}
