/**
 * Neon Postgres client.
 *
 * Env vars required:
 *   DATABASE_URL — Neon connection string (pooled endpoint)
 *
 * All exports gracefully return null when DATABASE_URL is absent so Phase A
 * degrades silently (no cookie issued) rather than throwing.
 *
 * Tables are created on first successful connection (idempotent CREATE IF NOT EXISTS).
 */

import { neon } from "@neondatabase/serverless";

export type Sql = ReturnType<typeof neon>;

let _sql: Sql | null = null;
let _initialized = false;

function getSql(): Sql | null {
  if (!process.env.DATABASE_URL) return null;
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql;
}

export async function getDb(): Promise<Sql | null> {
  const sql = getSql();
  if (!sql) return null;

  if (!_initialized) {
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
      _initialized = true;
    } catch (err) {
      console.error("[db] Table init failed:", err);
      return null;
    }
  }

  return sql;
}
