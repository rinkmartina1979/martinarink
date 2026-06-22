/**
 * Sanity schema: sessionRequest (PRIVATE — server write only)
 *
 * Client asks for a session from inside the portal (off-cadence requests).
 * No sensitive journal content is stored here.
 */

import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "sessionRequest",
  title: "Session Requests",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({ name: "client", title: "Client", type: "reference", to: [{ type: "clientProfile" }] }),
    defineField({ name: "clientId", title: "Client ID", type: "string", readOnly: true }),
    defineField({
      name: "preferredTimeframe",
      title: "Preferred timeframe",
      type: "string",
      readOnly: true,
    }),
    defineField({ name: "reason", title: "Reason", type: "text", rows: 2, readOnly: true }),
    defineField({
      name: "urgency",
      title: "Urgency",
      type: "string",
      readOnly: true,
      options: { list: [{ title: "Normal", value: "normal" }, { title: "Soon", value: "soon" }] },
    }),
    defineField({ name: "note", title: "Note", type: "text", rows: 3, readOnly: true }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Declined", value: "declined" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({ name: "createdAt", title: "Requested at", type: "datetime", readOnly: true }),
  ],
  preview: {
    select: { urgency: "urgency", status: "status", createdAt: "createdAt", clientId: "clientId" },
    prepare({ urgency, status, createdAt, clientId }) {
      const mark = urgency === "soon" ? "⚡ " : "";
      return {
        title: `${mark}Session request · ${clientId ?? ""}`,
        subtitle: `${status ?? "new"} · ${createdAt ? new Date(createdAt).toLocaleDateString("en-GB") : ""}`,
      };
    },
  },
});
