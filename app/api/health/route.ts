/**
 * GET /api/health
 *
 * Returns the status of all external service integrations.
 * Used to diagnose broken keys without reading logs.
 * Restrict to non-public use: add ?key=<HEALTH_CHECK_KEY> if needed.
 */

import { NextResponse } from "next/server";

async function checkBrevo(): Promise<{ ok: boolean; detail: string }> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return { ok: false, detail: "BREVO_API_KEY not set" };
  try {
    const res = await fetch("https://api.brevo.com/v3/account", {
      headers: { "api-key": key },
    });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, detail: `Account: ${data.email}` };
    }
    return { ok: false, detail: `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, detail: String(err) };
  }
}

async function checkResend(): Promise<{ ok: boolean; detail: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, detail: "RESEND_API_KEY not set" };
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (res.ok) {
      const data = await res.json();
      const domains = (data.data ?? []).map((d: { name: string; status: string }) => `${d.name} (${d.status})`).join(", ");
      return { ok: true, detail: domains || "No domains configured — verify martinarink.com" };
    }
    if (res.status === 401) return { ok: false, detail: "Invalid API key (401) — generate a new key at resend.com/api-keys" };
    return { ok: false, detail: `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, detail: String(err) };
  }
}

// Cal.com is the booking source of truth. Unlike Calendly's free-tier embed
// workaround, Cal.com signs webhooks on every plan — so all we need to verify
// here is that the signing secret is configured (the route itself fails
// closed with a 503 if it's missing, so this just surfaces that early).
async function checkCalCom(): Promise<{ ok: boolean; detail: string }> {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  const url = process.env.NEXT_PUBLIC_CALCOM_URL;
  if (!secret) return { ok: false, detail: "CALCOM_WEBHOOK_SECRET not set — /api/webhooks/calcom rejects all events until configured" };
  if (!url) return { ok: false, detail: "NEXT_PUBLIC_CALCOM_URL not set — booking pages fall back to a hardcoded URL" };
  return { ok: true, detail: `Webhook secret configured, booking link: ${url}` };
}

function checkEnvVars() {
  const required = [
    "BREVO_API_KEY",
    "BREVO_LIST_ID_NEWSLETTER",
    "BREVO_LIST_ID_ASSESSMENT",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "RESEND_NOTIFY_EMAIL",
    "NEXT_PUBLIC_SITE_URL",
    "ASSESSMENT_RESULT_SECRET",
    "ACCEPT_SECRET",
    "CONTRACT_SECRET",
  ];
  const missing = required.filter((k) => !process.env[k]);
  const warnings: string[] = [];

  const secret = process.env.ASSESSMENT_RESULT_SECRET ?? "";
  if (secret.includes("change-me") || secret === "dev-insecure-key-replace-in-production") {
    warnings.push("ASSESSMENT_RESULT_SECRET is still the placeholder — set a real random value in Vercel");
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (siteUrl.includes("vercel.app")) {
    warnings.push(`NEXT_PUBLIC_SITE_URL is ${siteUrl} — should be https://martinarink.com in production`);
  }

  // Feature-specific keys — not hard-required (the site runs without them),
  // but the linked feature is broken until set. Surfaced as warnings.
  // Blob auth: @vercel/blob 2.3.0 needs the static read-write token. (OIDC
  // auth — BLOB_STORE_ID alone — requires @vercel/blob ≥2.4, which currently
  // breaks the Next 16 build, so we stay on the static token.)
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    warnings.push("BLOB_READ_WRITE_TOKEN not set — accept/contract/intake flow cannot store contracts");
  }
  return { missing, warnings };
}

export async function GET() {
  const [brevo, resend, calcom] = await Promise.all([checkBrevo(), checkResend(), checkCalCom()]);
  const env = checkEnvVars();

  const allOk = brevo.ok && resend.ok && calcom.ok && env.missing.length === 0 && env.warnings.length === 0;

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      services: {
        brevo: { status: brevo.ok ? "ok" : "error", detail: brevo.detail },
        resend: { status: resend.ok ? "ok" : "error", detail: resend.detail },
        calcom: { status: calcom.ok ? "ok" : "error", detail: calcom.detail },
      },
      env: {
        missing: env.missing,
        warnings: env.warnings,
      },
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 }
  );
}
