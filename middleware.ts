/**
 * Next.js Middleware — portal session guard.
 *
 * /dashboard and /dashboard/* require a valid mr_session cookie.
 * Verification here is HMAC-only (fast, no DB round-trip).
 * Full DB checks (expiry, revocation) happen inside the page components.
 *
 * Uses Web Crypto API (SubtleCrypto) — compatible with the Edge Runtime.
 *
 * Phase A: only /dashboard/* is guarded. /members/[token]/* is unchanged.
 * Phase C: /members/* routes will redirect to /dashboard here once sub-routes
 *          have been migrated to cookie-only auth.
 */

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mr_session";

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const buf = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

async function verifyHmac(cookieValue: string): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const dot = cookieValue.lastIndexOf(".");
  if (dot === -1) return false;

  const sessionId = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);

  // SHA-256 HMAC produces 32 bytes = 64 hex chars
  if (sig.length !== 64) return false;

  try {
    const enc = new TextEncoder();
    const key = await globalThis.crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    // SubtleCrypto.verify is timing-safe
    return await globalThis.crypto.subtle.verify(
      "HMAC",
      key,
      hexToBytes(sig),
      enc.encode(sessionId),
    );
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Guard /dashboard and all sub-paths
  if (pathname.startsWith("/dashboard")) {
    const cookieValue = req.cookies.get(COOKIE_NAME)?.value;

    if (!cookieValue || !(await verifyHmac(cookieValue))) {
      const url = req.nextUrl.clone();
      url.pathname = "/portal";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Include bare /dashboard as well as all sub-paths
  matcher: ["/dashboard", "/dashboard/:path*"],
};
