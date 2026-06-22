/**
 * Portal audit logging — server only.
 *
 * Writes coarse, non-sensitive audit events. NEVER pass journal content or any
 * sensitive body here; `meta` is for short, safe context only.
 */

import { writeClient, hasWriteClient } from "@/sanity/lib/writeClient";

export async function logAuditEvent(
  event: string,
  opts: { clientId?: string; meta?: string; ip?: string } = {},
): Promise<void> {
  if (!hasWriteClient(writeClient)) return;
  try {
    await writeClient.create({
      _type: "portalAuditEvent",
      event,
      clientId: opts.clientId ?? null,
      meta: opts.meta ?? null,
      ip: opts.ip ?? null,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[audit] failed:", err instanceof Error ? err.message : "unknown");
  }
}

/** Best-effort client IP from proxy headers. */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
