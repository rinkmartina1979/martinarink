/**
 * POST /api/members/request-link  — lost-link recovery for /portal
 *
 * Security model:
 *  - ALWAYS returns the same generic success (no email enumeration).
 *  - Honeypot field ("website") silently absorbs bots.
 *  - Rate limited by email AND IP using recent portalLinkRequest docs.
 *  - Sends a FRESH token (never re-sends an old/compromised one).
 *  - Records a portalLinkRequest (audit) + bumps resend counters.
 *  - No token is ever logged.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { waitUntil } from "@vercel/functions";
import { writeClient, hasWriteClient } from "@/sanity/lib/writeClient";
import { generateMemberToken } from "@/lib/members/token";
import { portalInvitationEmail } from "@/lib/email-templates";
import { logAuditEvent, clientIp } from "@/lib/members/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().email().max(200).optional(),
  website: z.string().max(0).optional(), // honeypot: must be empty
});

const PROGRAMME_LABELS: Record<string, string> = {
  "sober-muse": "The Sober Muse Method",
  empowerment: "Female Empowerment & Leadership",
  consultation: "Private Consultation",
};

const GENERIC = NextResponse.json({ ok: true });
const PER_EMAIL_HOUR = 3;
const PER_IP_HOUR = 10;

async function record(
  wc: NonNullable<typeof writeClient>,
  email: string,
  ip: string,
  ua: string,
  outcome: string,
) {
  try {
    await wc.create({
      _type: "portalLinkRequest",
      email,
      ip,
      userAgent: ua.slice(0, 300),
      outcome,
      createdAt: new Date().toISOString(),
    });
  } catch {
    /* non-fatal */
  }
}

export async function POST(req: NextRequest) {
  // Never reveal config state to the caller — always generic.
  if (!hasWriteClient(writeClient)) return GENERIC;
  const wc = writeClient;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return GENERIC;
  }
  const parsed = Body.safeParse(raw);
  const ip = clientIp(req.headers);
  const ua = req.headers.get("user-agent") ?? "";

  // Honeypot tripped or malformed → look successful, record quietly.
  if (!parsed.success || (parsed.data.website && parsed.data.website.length > 0)) {
    await record(wc, parsed.success ? (parsed.data.email ?? "") : "", ip, ua, "honeypot");
    return GENERIC;
  }
  const email = (parsed.data.email ?? "").trim().toLowerCase();
  if (!email) return GENERIC;

  // ── Rate limiting (last hour), by email and IP ──
  const sinceIso = new Date(Date.now() - 3_600_000).toISOString();
  try {
    const [byEmail, byIp] = await Promise.all([
      wc.fetch<number>(
        `count(*[_type=="portalLinkRequest" && email==$email && createdAt > $since])`,
        { email, since: sinceIso },
      ),
      wc.fetch<number>(
        `count(*[_type=="portalLinkRequest" && ip==$ip && createdAt > $since])`,
        { ip, since: sinceIso },
      ),
    ]);
    if ((byEmail ?? 0) >= PER_EMAIL_HOUR || (byIp ?? 0) >= PER_IP_HOUR) {
      await record(wc, email, ip, ua, "rate-limited");
      return GENERIC;
    }
  } catch {
    /* if counting fails, fail open but still record below */
  }

  // ── Look up the client by email (server-side only) ──
  const profile = await wc
    .fetch<{
      _id: string;
      clientId: string;
      firstName: string;
      programme: string | null;
      revokedAt: string | null;
      tokenVersion: number | null;
    } | null>(
      `*[_type=="clientProfile" && lower(email)==$email][0]{
        _id, clientId, firstName, programme, revokedAt, tokenVersion
      }`,
      { email },
    )
    .catch(() => null);

  // No match (or revoked) → record + generic success (no enumeration).
  if (!profile || profile.revokedAt) {
    await record(wc, email, ip, ua, "no-match");
    return GENERIC;
  }

  // ── Issue a FRESH link and send it ──
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://martinarink.com";
  const token = generateMemberToken(profile.clientId, "all", {
    tokenVersion: profile.tokenVersion ?? 1,
  });
  const portalUrl = `${siteUrl}/members/${token}`;
  const programmeLabel = PROGRAMME_LABELS[profile.programme ?? ""] ?? "Private Coaching Programme";

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "contact@martinarink.com";
  if (resendKey) {
    const { subject, html } = portalInvitationEmail({
      firstName: profile.firstName,
      programmeLabel,
      portalUrl,
    });
    waitUntil(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({ from: `Martina Rink <${fromEmail}>`, to: [email], subject, html }),
      })
        .then((r) => { if (!r.ok) console.error("[request-link] resend failed:", r.status); })
        .catch((e) => console.error("[request-link] resend error:", e)),
    );
  }

  waitUntil(record(wc, email, ip, ua, "sent"));
  waitUntil(logAuditEvent("link_requested", { clientId: profile.clientId, ip, meta: "recovery" }));
  waitUntil(
    wc
      .patch(profile._id)
      .setIfMissing({ portalLinkResendCount: 0 })
      .inc({ portalLinkResendCount: 1 })
      .set({ portalLinkLastSentAt: new Date().toISOString(), tokenIssuedAt: new Date().toISOString() })
      .commit()
      .then(() => undefined)
      .catch(() => undefined),
  );

  return GENERIC;
}
