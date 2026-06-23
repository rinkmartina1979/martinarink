/**
 * POST /api/members/auth
 *
 * Called client-side (from SessionBootstrap) after a valid token visit.
 * Verifies the token, creates a DB session, and sets the HttpOnly mr_session cookie.
 *
 * This endpoint is intentionally quiet: always returns 200 so the caller
 * never learns whether a session was created. Cookie is set on success only.
 *
 * Phase A: called in background — does not affect page render.
 * Phase B: /dashboard reads this cookie to bypass token verification.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyMemberToken } from "@/lib/members/token";
import { getClientByToken } from "@/sanity/lib/membersQueries";
import { createSession, cookieOptions, COOKIE_NAME } from "@/lib/members/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OK = NextResponse.json({ ok: true });

export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return OK;
  }

  const { token } = body;
  if (!token || typeof token !== "string") return OK;

  // Verify the HMAC + expiry
  const payload = verifyMemberToken(token);
  if (!payload) return OK;

  // Verify against Sanity (revocation, tokenVersion, status)
  const profile = await getClientByToken(payload.clientId).catch(() => null);
  if (!profile) return OK;
  if (profile.status === "completed") return OK;
  if (profile.revokedAt) return OK;
  if ((payload.tv ?? 1) < (profile.tokenVersion ?? 1)) return OK;

  // Issue session
  const cookieValue = await createSession(
    payload.clientId,
    profile.tokenVersion ?? 1,
  );
  if (!cookieValue) return OK; // DB not configured yet — silently no-op

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, cookieValue, cookieOptions());
  return res;
}
