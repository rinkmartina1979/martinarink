"use client";

import { useEffect } from "react";

/**
 * Phase A session bootstrap.
 *
 * Fires a background POST to /api/members/auth on first render to issue
 * the HttpOnly mr_session cookie. This happens silently — the page has
 * already rendered and the client never sees this request.
 *
 * Once SESSION_SECRET + DATABASE_URL are configured in Vercel, every valid
 * magic-link visit automatically acquires a session cookie. Phase B then
 * routes /dashboard/* via that cookie, keeping tokens out of the URL.
 */
export function SessionBootstrap({ token }: { token: string }) {
  useEffect(() => {
    // Only fire once per page load. The cookie may already exist on re-visits.
    fetch("/api/members/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      credentials: "same-origin",
    }).catch(() => {
      // Silently ignore — session issuance is best-effort in Phase A.
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
