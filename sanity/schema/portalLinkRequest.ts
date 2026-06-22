/**
 * Sanity schema: portalLinkRequest (PRIVATE — server write only)
 *
 * One record per lost-link recovery attempt at /portal. Used BOTH as an audit
 * trail and as the rate-limit source (we count recent requests by email + IP).
 *
 * SECURITY: never stores a token. `email` is stored to enforce per-email
 * throttling and to support abuse investigation only.
 */

import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "portalLinkRequest",
  title: "Portal Link Requests",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "ip", title: "IP", type: "string", readOnly: true }),
    defineField({ name: "userAgent", title: "User agent", type: "string", readOnly: true }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Link sent (match)", value: "sent" },
          { title: "No matching client", value: "no-match" },
          { title: "Rate limited", value: "rate-limited" },
          { title: "Honeypot tripped", value: "honeypot" },
        ],
      },
    }),
    defineField({ name: "createdAt", title: "Requested at", type: "datetime", readOnly: true }),
  ],
  preview: {
    select: { email: "email", outcome: "outcome", createdAt: "createdAt" },
    prepare({ email, outcome, createdAt }) {
      return {
        title: `${email ?? "—"}`,
        subtitle: `${outcome ?? ""} · ${createdAt ? new Date(createdAt).toLocaleString("en-GB") : ""}`,
      };
    },
  },
});
