/**
 * Sanity seed script — populates a fresh Sanity dataset with the same
 * fallback content used at runtime, so the studio is not empty after launch.
 *
 * Usage:
 *   pnpm dlx tsx scripts/seed-sanity.ts
 *   # or
 *   npx tsx scripts/seed-sanity.ts
 *
 * Required env (read from .env.local automatically by next-sanity if loaded;
 * otherwise pass in shell):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET   (defaults to "production")
 *   SANITY_API_TOKEN             (write token from sanity.io/manage)
 *
 * Idempotent: existing documents (matched by _id) are not overwritten.
 */

import { createClient } from "@sanity/client";
import {
  FALLBACK_CASE_STUDIES,
  FALLBACK_AUDIO_DROPS,
} from "../lib/fallback-content";

const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "")
  .replace(/[^a-z0-9-]/g, "")
  .trim();
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production").trim();
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("✗ NEXT_PUBLIC_SANITY_PROJECT_ID is missing.");
  process.exit(1);
}
if (!token) {
  console.error("✗ SANITY_API_TOKEN is missing — write token required.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-01",
  token,
  useCdn: false,
});

async function seedCaseStudies() {
  console.log(`\n→ Case studies (${FALLBACK_CASE_STUDIES.length})`);
  for (const cs of FALLBACK_CASE_STUDIES) {
    const _id = `caseStudy.${cs.slug}`;
    const doc = {
      _id,
      _type: "caseStudy",
      slug: { _type: "slug", current: cs.slug },
      pseudonym: cs.pseudonym,
      industry: cs.industry,
      programme: cs.programme,
      problemSnapshot: cs.problemSnapshot,
      workNarrative: cs.workNarrative,
      outcomeMarker: cs.outcomeMarker,
      permissionGrantedAt: cs.permissionGrantedAt,
      visibleOnSite: cs.visibleOnSite,
      order: cs.order,
    };
    const result = await client.createIfNotExists(doc);
    console.log(
      result._createdAt
        ? `  ✓ created ${_id}`
        : `  · skipped ${_id} (exists)`,
    );
  }
}

async function seedSampleClient() {
  console.log("\n→ Sample client profile (DEMO)");
  const _id = "clientProfile.demo-adriana";
  const doc = {
    _id,
    _type: "clientProfile",
    clientId: "DEMO-ADRIANA-001",
    firstName: "DEMO Adriana",
    archetype: "The Founder",
    programme: "sober-muse",
    status: "active",
    enrolledAt: "2025-09-01T00:00:00Z",
    expectedCompletionAt: "2025-12-01T00:00:00Z",
  };
  const result = await client.createIfNotExists(doc);
  console.log(
    result._createdAt ? `  ✓ created ${_id}` : `  · skipped ${_id} (exists)`,
  );
}

async function seedAudioDrops() {
  console.log(`\n→ Audio drops (${FALLBACK_AUDIO_DROPS.length})`);
  for (const drop of FALLBACK_AUDIO_DROPS) {
    const _id = `audioDrop.${drop.slug}`;
    const doc = {
      _id,
      _type: "audioDrop",
      title: drop.title,
      slug: { _type: "slug", current: drop.slug },
      description: drop.description,
      audioUrl: drop.audioUrl,
      durationSeconds: drop.durationSeconds,
      releasedAt: drop.releasedAt,
      programme: "both",
      visibleTo: [],
    };
    const result = await client.createIfNotExists(doc);
    console.log(
      result._createdAt ? `  ✓ created ${_id}` : `  · skipped ${_id} (exists)`,
    );
  }
}

async function main() {
  console.log(`Seeding Sanity (project=${projectId}, dataset=${dataset})`);
  await seedCaseStudies();
  await seedSampleClient();
  await seedAudioDrops();
  console.log("\nDone.\n");
}

main().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
