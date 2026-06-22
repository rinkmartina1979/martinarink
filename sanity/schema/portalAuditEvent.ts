/**
 * Sanity schema: portalAuditEvent (PRIVATE — server write only)
 *
 * Lightweight audit trail for portal activity. NEVER stores journal content or
 * any sensitive body — only the event type, clientId, and coarse metadata.
 */

import { ActivityIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "portalAuditEvent",
  title: "Portal Audit Events",
  type: "document",
  icon: ActivityIcon,
  fields: [
    defineField({ name: "clientId", title: "Client ID", type: "string", readOnly: true }),
    defineField({
      name: "event",
      title: "Event",
      type: "string",
      readOnly: true,
      description: "e.g. journal_saved, needs_support, link_requested, access_revoked",
    }),
    defineField({
      name: "meta",
      title: "Meta (no sensitive content)",
      type: "string",
      readOnly: true,
      description: "Coarse, non-sensitive context only (e.g. 'evening 2026-06-22'). Never journal body.",
    }),
    defineField({ name: "ip", title: "IP", type: "string", readOnly: true }),
    defineField({ name: "createdAt", title: "At", type: "datetime", readOnly: true }),
  ],
  preview: {
    select: { event: "event", clientId: "clientId", createdAt: "createdAt" },
    prepare({ event, clientId, createdAt }) {
      return {
        title: `${event ?? "event"} · ${clientId ?? ""}`,
        subtitle: createdAt ? new Date(createdAt).toLocaleString("en-GB") : "",
      };
    },
  },
});
