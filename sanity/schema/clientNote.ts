/**
 * Sanity schema: clientNote (PRIVATE — Martina's CRM log)
 *
 * A dated, sortable per-client note for Martina's own reference. These notes are
 * NEVER shown to the client and NEVER queried by any portal/membersQueries
 * function — they exist only inside Sanity Studio.
 *
 * Every note is dated on creation (createdAt initialValue), so the "Client Notes"
 * Studio views can sort reliably by date.
 */

import { EditIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "clientNote",
  title: "Client Notes",
  type: "document",
  icon: EditIcon,
  fields: [
    defineField({
      name: "client",
      title: "Client",
      type: "reference",
      to: [{ type: "clientProfile" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clientId",
      title: "Client ID",
      type: "string",
      description: "Denormalised from the client profile — used to scope the per-client notes view.",
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General", value: "general" },
          { title: "Session", value: "session" },
          { title: "Wellbeing", value: "wellbeing" },
          { title: "Billing", value: "billing" },
          { title: "Admin", value: "admin" },
        ],
        layout: "radio",
      },
      initialValue: "general",
    }),
    defineField({
      name: "pinned",
      title: "Pinned",
      type: "boolean",
      description: "Pinned notes sort to the top of the per-client view.",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Date",
      type: "datetime",
      description: "Set automatically when the note is created.",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
  ],

  orderings: [
    {
      title: "Newest first",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Pinned, then newest",
      name: "pinnedThenDate",
      by: [
        { field: "pinned", direction: "desc" },
        { field: "createdAt", direction: "desc" },
      ],
    },
  ],

  preview: {
    select: {
      note: "note",
      category: "category",
      pinned: "pinned",
      createdAt: "createdAt",
      clientFirst: "client.firstName",
      clientLast: "client.lastName",
    },
    prepare({ note, category, pinned, createdAt, clientFirst, clientLast }) {
      const who = [clientFirst, clientLast].filter(Boolean).join(" ") || "Client";
      const date = createdAt ? new Date(createdAt).toLocaleDateString("en-GB") : "";
      const pin = pinned ? "📌 " : "";
      const firstLine = (note ?? "").split("\n")[0].slice(0, 60);
      return {
        title: `${pin}${who} — ${date}`,
        subtitle: `${category ?? "general"} · ${firstLine}`,
      };
    },
  },
});
