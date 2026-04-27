/**
 * HMAC-signed result ID utilities.
 * Extracted from app/api/assessment/route.ts to avoid Next.js route export constraints.
 */

import crypto from "crypto";
import type { Archetype, ServiceIntent, ReadinessLevel, PrivacyNeed } from "./types";

export interface ResultPayload {
  archetype: Archetype;
  serviceIntent: ServiceIntent;
  readinessLevel: ReadinessLevel;
  privacyNeed: PrivacyNeed;
  iat: number; // issued-at unix seconds — no PII
}

function getSecret(): string {
  const secret = process.env.ASSESSMENT_RESULT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Assessment] ASSESSMENT_RESULT_SECRET not set — using insecure dev key.");
      return "dev-insecure-key-replace-in-production";
    }
    throw new Error("ASSESSMENT_RESULT_SECRET must be set in production.");
  }
  return secret;
}

export function makeResultId(
  archetype: Archetype,
  serviceIntent: ServiceIntent,
  readinessLevel: ReadinessLevel,
  privacyNeed: PrivacyNeed
): string {
  const payload: ResultPayload = {
    archetype,
    serviceIntent,
    readinessLevel,
    privacyNeed,
    iat: Math.floor(Date.now() / 1000),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifyAndDecodeResultId(resultId: string): ResultPayload | null {
  try {
    const dotIndex = resultId.lastIndexOf(".");
    if (dotIndex === -1) return null;
    const payloadB64 = resultId.slice(0, dotIndex);
    const sig = resultId.slice(dotIndex + 1);

    const expectedSig = crypto
      .createHmac("sha256", getSecret())
      .update(payloadB64)
      .digest("base64url");

    // Constant-time comparison to prevent timing attacks
    if (
      sig.length !== expectedSig.length ||
      !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
    ) {
      return null;
    }

    const decoded: ResultPayload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );

    if (
      !decoded.archetype ||
      !decoded.serviceIntent ||
      !decoded.readinessLevel ||
      !decoded.privacyNeed ||
      !decoded.iat
    ) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
