/**
 * Sanity schema: clientUpdate
 *
 * DEPRECATED (P6): superseded by `clientNote` (private dated CRM log for Martina)
 * and the consolidated "Client Requests" Studio inbox. This stub was never
 * queried or rendered by the app. Kept registered to avoid orphaning any existing
 * documents; do not build new features on it.
 *
 * A two-way, lightweight updates feed (NOT chat).
 *  - source "martina": a note Martina writes for the client (shown in portal).
 *  - source "client": a lightweight signal the client sent from the portal.
 *
 * No sensitive journal content is stored here.
 */

import { CommentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "clientUpdate",
  title: "Client Updates",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({ name: "client", title: "Client", type: "reference", to: [{ type: "clientProfile" }] }),
    defineField({ name: "clientId", title: "Client ID", type: "string" }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Note from Martina", value: "martina" },
          { title: "Signal from client", value: "client" },
        ],
        layout: "radio",
      },
      initialValue: "martina",
      validation: (Rule) => Rule.required(),
    }),
    // Martina → client
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "note", title: "Note", type: "text", rows: 3 }),
    defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
    defineField({ name: "ctaHref", title: "Button link", type: "string" }),
    defineField({
      name: "visibility",
      title: "Visibility",
      type: "string",
      options: {
        list: [
          { title: "Published (client sees it)", value: "published" },
          { title: "Draft (hidden)", value: "private" },
        ],
        layout: "radio",
      },
      initialValue: "published",
    }),
    // Client → Martina
    defineField({
      name: "kind",
      title: "Client signal",
      type: "string",
      options: {
        list: [
          { title: "I have a question", value: "question" },
          { title: "I would like support", value: "support" },
          { title: "Discuss in next session", value: "discuss-next-session" },
        ],
      },
    }),
    defineField({ name: "createdAt", title: "At", type: "datetime", readOnly: true }),
  ],
  preview: {
    select: { source: "source", title: "title", kind: "kind", createdAt: "createdAt" },
    prepare({ source, title, kind, createdAt }) {
      const label = source === "client" ? `Client: ${kind ?? "signal"}` : title || "Note from Martina";
      return {
        title: label,
        subtitle: createdAt ? new Date(createdAt).toLocaleString("en-GB") : "",
      };
    },
  },
});
