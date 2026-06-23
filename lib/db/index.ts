/**
 * Neon Postgres client.
 *
 * Env vars required:
 *   DATABASE_URL — Neon connection string (pooled endpoint)
 *
 * Gracefully returns null when DATABASE_URL is absent (Phase A degrades silently).
 *
 * PRODUCTION SETUP: run `npm run setup:db` once after DATABASE_URL is configured.
 * This creates the required tables. getDb() no longer blocks requests on schema init.
 */

import { neon } from "@neondatabase/serverless";

export type Sql = ReturnType<typeof neon>;

let _sql: Sql | null = null;
let _migrationFired = false;

function getSql(): Sql | null {
  if (!process.env.DATABASE_URL) return null;
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql;
}

/**
 * Returns the Neon sql client immediately (no blocking migration).
 * Fires runMigrations() in the background on the first call per module lifecycle
 * as a last-resort safety net. Production systems should run `npm run setup:db`
 * explicitly so tables exist before any client request hits them.
 */
export async function getDb(): Promise<Sql | null> {
  const sql = getSql();
  if (!sql) return null;

  // Fire-and-forget: migrations run concurrently with the first request.
  // This does NOT block — the first request proceeds immediately.
  // If tables don't exist yet the session ops fail gracefully (return null).
  if (!_migrationFired) {
    _migrationFired = true;
    void runMigrations(sql).catch((err) =>
      console.error("[db] Background migration failed:", err),
    );
  }

  return sql;
}

/**
 * Creates all required tables and indexes. Idempotent (CREATE IF NOT EXISTS).
 * Run this once via `npm run setup:db` after DATABASE_URL is configured.
 * Safe to call multiple times.
 */
export async function runMigrations(sql: Sql): Promise<void> {
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
  await sql`
    CREATE INDEX IF NOT EXISTS mr_sessions_client_id
      ON mr_sessions(client_id)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS mr_sessions_expires_at
      ON mr_sessions(expires_at)
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS mr_portal_audit (
      id         BIGSERIAL PRIMARY KEY,
      client_id  TEXT NOT NULL,
      event      TEXT NOT NULL,
      metadata   JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS mr_portal_audit_client_id
      ON mr_portal_audit(client_id, created_at DESC)
  `;
  console.log("[db] Migrations complete.");
}
