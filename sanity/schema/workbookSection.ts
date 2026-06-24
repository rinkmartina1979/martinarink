/**
 * Sanity schema: workbookSection (PRIVATE — server write only)
 *
 * One document per client per foundation-workbook section. Written exclusively
 * by /api/workbook via the Sanity write token. Never created or edited from the
 * browser, never from Studio by hand.
 *
 * PRIVACY BY DESIGN
 * - `visibility` defaults to "private". The client portal and the Studio
 *   "Shared"/"Needs Support" views only ever surface shared/needs-support
 *   sections. Private sections get no browse view.
 * - Honest limit: a Studio/dataset-owner CAN technically open any document.
 *   True client-only secrecy would require field-level encryption (roadmap).
 *   Do not promise clients "no one can ever read this".
 */

import { ComposeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "workbookSection",
  title: "Foundation Workbook",
  type: "document",
  icon: ComposeIcon,

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
      description: "Denormalised from the member token — used to scope queries.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sectionKey",
      title: "Section",
      type: "string",
      description: "Workbook section key (mirrors lib/workbook/sections.ts).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "visibility",
      title: "Visibility",
      type: "string",
      options: {
        list: [
          { title: "Private (client only)", value: "private" },
          { title: "Shared with Martina", value: "shared" },
          { title: "Needs support", value: "needs-support" },
        ],
        layout: "radio",
      },
      initialValue: "private",
      validation: (Rule) => Rule.required(),
    }),

    // ── Content (free-form object; keys mirror lib/workbook/sections.ts) ──
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      description: "Section answers. Keys mirror lib/workbook/sections.ts.",
      options: { collapsible: true, collapsed: true },
      fields: [
        // Vision & identity
        { name: "becoming", title: "Becoming", type: "text", rows: 3 },
        { name: "visionDescription", title: "Vision", type: "text", rows: 3 },
        { name: "whyChange", title: "Why change", type: "text", rows: 3 },
        { name: "goalWhat", title: "Goal — what", type: "text", rows: 2 },
        { name: "goalWhy", title: "Goal — why", type: "text", rows: 2 },
        { name: "goalWho", title: "Goal — who", type: "text", rows: 2 },
        { name: "goalWhen", title: "Goal — when", type: "string" },
        { name: "goalWhere", title: "Goal — where", type: "string" },
        // Understanding
        { name: "fearList", title: "Fear list", type: "text", rows: 3 },
        { name: "prosChange", title: "Pros of changing", type: "text", rows: 3 },
        { name: "consChange", title: "Cons of changing", type: "text", rows: 3 },
        { name: "voidToFill", title: "Void to fill", type: "text", rows: 3 },
        // Letters
        { name: "letterPast", title: "Letter — past self", type: "text", rows: 4 },
        { name: "letterFuture", title: "Letter — future self", type: "text", rows: 4 },
        { name: "letterFamily", title: "Letter — family", type: "text", rows: 4 },
        // Commitment
        { name: "contractText", title: "Contract text", type: "text", rows: 3 },
        { name: "contractLocation", title: "Contract location/date", type: "string" },
        { name: "contractSignature", title: "Contract signature", type: "string" },
        { name: "affirmations", title: "Affirmations", type: "text", rows: 3 },
        // Practice
        { name: "dailyMindset", title: "Daily mindset", type: "text", rows: 3 },
        { name: "newLifeMeaning", title: "New life meaning", type: "text", rows: 3 },
        { name: "freeJournaling", title: "Free journaling", type: "text", rows: 4 },
        { name: "notes", title: "Notes", type: "text", rows: 4 },
      ],
    }),

    defineField({
      name: "signedAt",
      title: "Signed at",
      type: "datetime",
      description: "Set when the Contract section is signed (server write only).",
      readOnly: true,
    }),
    defineField({ name: "createdAt", title: "Created at", type: "datetime" }),
    defineField({ name: "updatedAt", title: "Updated at", type: "datetime" }),
  ],

  preview: {
    select: { sectionKey: "sectionKey", visibility: "visibility" },
    prepare({ sectionKey, visibility }) {
      const mark =
        visibility === "needs-support" ? "🆘 " : visibility === "shared" ? "👁 " : "🔒 ";
      return {
        title: `${mark}${sectionKey ?? "—"}`,
        subtitle: visibility,
      };
    },
  },
});
