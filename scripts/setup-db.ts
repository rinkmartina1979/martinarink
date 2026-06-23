/**
 * One-time database setup script.
 *
 * Creates all required tables and indexes in the Neon Postgres database.
 * Run this ONCE after DATABASE_URL is configured in your environment:
 *
 *   DATABASE_URL="postgres://..." npx tsx scripts/setup-db.ts
 *
 * Or with the package.json script (which reads from .env.local):
 *
 *   npm run setup:db
 *
 * All operations are idempotent (CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS),
 * so re-running is safe. The script exits non-zero on failure.
 */

import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("[setup-db] DATABASE_URL is not set. Aborting.");
    process.exit(1);
  }

  const sql = neon(url);
  console.log("[setup-db] Connecting to Neon Postgres…");

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS mr_sessions (
        id         TEXT PRIMARY KEY,
        client_id  TEXT NOT NULL,
        tv         INT  NOT NULL DEFAULT 1,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_seen  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMPTZ NOT NULL,
        revoked_at TIMESTAMPTZ
      )
    `;
    console.log("[setup-db] ✓ mr_sessions");

    await sql`
      CREATE INDEX IF NOT EXISTS mr_sessions_client_id
        ON mr_sessions(client_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS mr_sessions_expires_at
        ON mr_sessions(expires_at)
    `;
    console.log("[setup-db] ✓ mr_sessions indexes");

    await sql`
      CREATE TABLE IF NOT EXISTS mr_portal_audit (
        id         BIGSERIAL PRIMARY KEY,
        client_id  TEXT NOT NULL,
        event      TEXT NOT NULL,
        metadata   JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    console.log("[setup-db] ✓ mr_portal_audit");

    await sql`
      CREATE INDEX IF NOT EXISTS mr_portal_audit_client_id
        ON mr_portal_audit(client_id, created_at DESC)
    `;
    console.log("[setup-db] ✓ mr_portal_audit index");

    console.log("[setup-db] All tables ready.");
  } catch (err) {
    console.error("[setup-db] Migration failed:", err);
    process.exit(1);
  }
}

main();
