/**
 * Session management for the HttpOnly cookie layer (P3).
 *
 * Env vars:
 *   SESSION_SECRET  — 32+ random bytes (hex or base64). Separate from MEMBERS_TOKEN_SECRET.
 *   DATABASE_URL    — Neon connection string.
 *
 * Cookie name: mr_session
 * Cookie value: <sessionId_hex>.<hmac_hex>
 * DB stores:   sha256(sessionId) — raw value never persisted.
 *
 * All functions return null gracefully when env vars are absent.
 */

import crypto from "node:crypto";
import { getDb } from "@/lib/db";

export const COOKIE_NAME = "mr_session";
export const SESSION_TTL_DAYS = 30;

function getSecret(): string | null {
  return process.env.SESSION_SECRET ?? null;
}

function sign(sessionId: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(sessionId).digest("hex");
}

function hash(sessionId: string): string {
  return crypto.createHash("sha256").update(sessionId).digest("hex");
}

function buildCookieValue(sessionId: string, secret: string): string {
  return `${sessionId}.${sign(sessionId, secret)}`;
}

/** Parse and verify the HMAC of a raw cookie value. Returns sessionId or null. */
function parseAndVerify(cookieValue: string, secret: string): string | null {
  const dot = cookieValue.lastIndexOf(".");
  if (dot === -1) return null;

  const sessionId = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);

  const expected = sign(sessionId, secret);
  try {
    const valid = crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(sig, "hex"),
    );
    return valid ? sessionId : null;
  } catch {
    return null;
  }
}

export interface SessionData {
  clientId: string;
  tokenVersion: number;
}

/**
 * Create a new session for a client. Returns the signed cookie value to set,
 * or null if DB / secret is not configured.
 */
export async function createSession(
  clientId: string,
  tokenVersion: number,
): Promise<string | null> {
  const secret = getSecret();
  const db = await getDb();
  if (!secret || !db) return null;

  const sessionId = crypto.randomBytes(32).toString("hex");
  const id = hash(sessionId);
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  try {
    await db`
      INSERT INTO mr_sessions (id, client_id, tv, expires_at)
      VALUES (${id}, ${clientId}, ${tokenVersion}, ${expiresAt.toISOString()})
      ON CONFLICT (id) DO NOTHING
    `;
    return buildCookieValue(sessionId, secret);
  } catch (err) {
    console.error("[session] createSession failed:", err);
    return null;
  }
}

/**
 * Verify a raw cookie value. Returns session data and rolls the expiry,
 * or null if invalid / expired / revoked.
 */
export async function verifySession(
  cookieValue: string,
): Promise<SessionData | null> {
  const secret = getSecret();
  const db = await getDb();
  if (!secret || !db) return null;

  const sessionId = parseAndVerify(cookieValue, secret);
  if (!sessionId) return null;

  const id = hash(sessionId);
  const now = new Date().toISOString();
  const newExpiry = new Date(
    Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  try {
    const rows = await db<
      { client_id: string; tv: number }[]
    >`
      UPDATE mr_sessions
      SET last_seen  = ${now},
          expires_at = ${newExpiry}
      WHERE id         = ${id}
        AND expires_at > ${now}
        AND revoked_at IS NULL
      RETURNING client_id, tv
    `;

    if (!rows.length) return null;
    return { clientId: rows[0].client_id, tokenVersion: rows[0].tv };
  } catch (err) {
    console.error("[session] verifySession failed:", err);
    return null;
  }
}

/**
 * Revoke all active sessions for a client immediately.
 * Used when a client reports a compromised device or Martina manually revokes.
 */
export async function revokeAllSessions(clientId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db`
      UPDATE mr_sessions
      SET revoked_at = NOW()
      WHERE client_id = ${clientId}
        AND revoked_at IS NULL
    `;
  } catch (err) {
    console.error("[session] revokeAllSessions failed:", err);
  }
}

/** Build Set-Cookie header options for the session cookie. */
export function cookieOptions(maxAgeSec = SESSION_TTL_DAYS * 24 * 60 * 60) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}
