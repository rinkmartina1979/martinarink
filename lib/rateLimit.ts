/**
 * Atomic rate limiting via Upstash Redis.
 *
 * Env vars (both required — set via Upstash integration in Vercel):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * Falls back to a no-op (allow) when env vars are absent so existing
 * Sanity-based counters can remain as a secondary guard during the rollout.
 *
 * Pattern: INCR key → EXPIRE key (only on first increment) → check count.
 * This is atomic and correct — no read-then-write race condition.
 */

import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}

/**
 * Increment a counter and check against the limit.
 *
 * @param key         Stable, non-PII key (e.g. sha256 of email + window)
 * @param limit       Max requests allowed
 * @param windowSec   Window duration in seconds
 * @returns           true if request is allowed, false if rate limited
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSec: number,
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return true; // no-op: fall through to Sanity counter

  const prefixed = `rl:${key}`;
  try {
    const count = await redis.incr(prefixed);
    // Set TTL only on the first increment — subsequent calls preserve the window.
    if (count === 1) await redis.expire(prefixed, windowSec);
    return count <= limit;
  } catch (err) {
    console.error("[rateLimit] Redis error:", err);
    return true; // fail open — Sanity fallback still active
  }
}

/**
 * Revoke (delete) a rate-limit key immediately.
 * Used after a successful send to prevent the counter persisting after the window.
 */
export async function clearRateLimit(key: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.del(`rl:${key}`);
  } catch {
    // non-fatal
  }
}

/**
 * Derive a stable, non-PII key from an email address.
 * sha256 so the raw email is never stored in Redis.
 */
export function emailRateLimitKey(email: string): string {
  const { createHash } = require("node:crypto") as typeof import("node:crypto");
  return createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
}

/**
 * Derive a stable, non-PII key from an IP address.
 */
export function ipRateLimitKey(ip: string): string {
  const { createHash } = require("node:crypto") as typeof import("node:crypto");
  return createHash("sha256").update(ip).digest("hex");
}
