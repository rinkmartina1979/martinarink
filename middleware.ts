/**
 * Next.js Middleware — portal session guard.
 *
 * /dashboard/* requires a valid mr_session cookie.
 * Verification here is HMAC-only (fast, no DB round-trip).
 * Full DB checks (expiry, revocation) happen inside the page components.
 *
 * Phase A: only /dashboard/* is guarded. /members/[token]/* is unchanged.
 * Phase C: /members/* routes will redirect to /dashboard here once sub-routes
 *          have been migrated to cookie-only auth.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const COOKIE_NAME = "mr_session";

function verifyHmac(cookieValue: string): boolean {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const dot = cookieValue.lastIndexOf(".");
  if (dot === -1) return false;

  const sessionId = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);

  try {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(sessionId)
      .digest("hex");

    // Both must be 64-char hex (SHA256) for timingSafeEqual to accept them
    if (expected.length !== sig.length) return false;
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(sig, "hex"),
    );
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Guard /dashboard and all sub-paths
  if (pathname.startsWith("/dashboard")) {
    const cookieValue = req.cookies.get(COOKIE_NAME)?.value;

    if (!cookieValue || !verifyHmac(cookieValue)) {
      const url = req.nextUrl.clone();
      url.pathname = "/portal";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
