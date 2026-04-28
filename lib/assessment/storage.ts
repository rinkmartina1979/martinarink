/**
 * Assessment lead backup storage via Sanity.
 *
 * Writes an assessmentSubmission document when SANITY_WRITE_TOKEN is present.
 * Gracefully skips (with warning log) when token is missing.
 *
 * IMPORTANT: assessmentSubmission is a private document type.
 * It must NEVER be queried from the frontend or exposed to the client.
 */

import type { Archetype, ServiceIntent, ReadinessLevel, PrivacyNeed, AnswerMap } from "./types";

export interface SubmissionRecord {
  resultId: string;
  email: string;
  firstName?: string;
  answers: AnswerMap;
  archetype: Archetype;
  serviceIntent: ServiceIntent;
  readinessLevel: ReadinessLevel;
  privacyNeed: PrivacyNeed;
  emailStatus: "pending" | "success" | "skipped" | "failed";
  emailError?: string;
  sourcePage: string;
  userAgent?: string;
  referrer?: string;
  createdAt: string;
}

export async function storeSubmission(
  record: SubmissionRecord
): Promise<{ stored: boolean; error?: string }> {
  const writeToken = process.env.SANITY_WRITE_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  if (!writeToken || !projectId) {
    console.warn(
      "[Assessment] Submission backup skipped — SANITY_WRITE_TOKEN or NEXT_PUBLIC_SANITY_PROJECT_ID not set. " +
        "Lead data will NOT be stored server-side. Configure these env vars for production."
    );
    return { stored: false, error: "storage_not_configured" };
  }

  try {
    const doc = {
      _type: "assessmentSubmission",
      _id: `submission-${record.resultId}`,
      resultId: record.resultId,
      email: record.email,
      firstName: record.firstName ?? null,
      // Store answers as JSON string — don't index them
      answersJson: JSON.stringify(record.answers),
      archetype: record.archetype,
      serviceIntent: record.serviceIntent,
      readinessLevel: record.readinessLevel,
      privacyNeed: record.privacyNeed,
      emailStatus: record.emailStatus,
      emailError: record.emailError ?? null,
      sourcePage: record.sourcePage,
      userAgent: record.userAgent ?? null,
      referrer: record.referrer ?? null,
      createdAt: record.createdAt,
    };

    const apiUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${writeToken}`,
      },
      body: JSON.stringify({
        mutations: [{ createOrReplace: doc }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Assessment] Sanity storage failed:", err);
      return { stored: false, error: err };
    }

    return { stored: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "unknown error";
    console.error("[Assessment] Sanity storage threw:", msg);
    return { stored: false, error: msg };
  }
}
