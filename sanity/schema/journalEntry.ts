/**
 * Sanity schema: journalEntry (PRIVATE — server write only)
 *
 * Written exclusively by /api/journal via the Sanity write token. Never
 * created or edited from the browser, never from Studio by hand.
 *
 * PRIVACY BY DESIGN
 * - `visibility` defaults to "private". The client portal and the Studio
 *   "Shared"/"Needs Support" views only ever surface shared/needs-support
 *   entries. Private entries get no browse view.
 * - Honest limit: a Studio/dataset-owner CAN technically open any document.
 *   True client-only secrecy would require field-level encryption (roadmap).
 *   Do not promise clients "no one can ever read this".
 */

import { ComposeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "journalEntry",
  title: "Journal Entries",
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
      name: "entryDate",
      title: "Entry date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "entryType",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Morning ritual", value: "morning" },
          { title: "Evening reflection", value: "evening" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "monthIndex",
      title: "Programme month (1–3)",
      type: "number",
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

    // ── Reflection content (a free-form object; keys match lib/journal/prompts) ──
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      description: "Reflection answers. Keys mirror lib/journal/prompts.ts.",
      options: { collapsible: true, collapsed: true },
      fields: [
        // Morning + shared
        { name: "feeling",            title: "Feeling",            type: "text", rows: 2 },
        { name: "sleepQuality",       title: "Sleep",              type: "text", rows: 2 },
        { name: "gratefulFor",        title: "Grateful for",       type: "text", rows: 2 },
        { name: "todayGreatIf",       title: "Today great if",     type: "text", rows: 2 },
        { name: "goalsToday",         title: "Goals today",        type: "text", rows: 2 },
        // Evening
        { name: "highlights",         title: "Highlights",         type: "text", rows: 2 },
        { name: "difficultSituations",title: "Difficult situations",type: "text", rows: 2 },
        { name: "goodForMyself",      title: "Good for myself",    type: "text", rows: 2 },
        { name: "didConsume",         title: "Did consume",        type: "boolean" },
        { name: "consumeWhat",        title: "Consumed what",      type: "string" },
        { name: "consumeHowMuch",     title: "How much",           type: "string" },
        { name: "trigger",            title: "Trigger",            type: "text", rows: 2 },
        { name: "noticedChanges",     title: "Noticed changes",    type: "text", rows: 2 },
        { name: "tomorrowAffirmations",title: "Tomorrow affirmations",type: "text", rows: 2 },
        { name: "goalsTomorrow",      title: "Goals tomorrow",     type: "text", rows: 2 },
      ],
    }),

    defineField({ name: "createdAt", title: "Created at", type: "datetime" }),
    defineField({ name: "updatedAt", title: "Updated at", type: "datetime" }),
  ],

  preview: {
    select: {
      entryDate: "entryDate",
      entryType: "entryType",
      visibility: "visibility",
      firstName: "client.firstName",
      lastName: "client.lastName",
    },
    prepare({ entryDate, entryType, visibility, firstName, lastName }) {
      const mark =
        visibility === "needs-support" ? "🆘 " : visibility === "shared" ? "👁 " : "🔒 ";
      const type = entryType === "morning" ? "Morning" : "Evening";
      const name = [firstName, lastName].filter(Boolean).join(" ") || "Unknown client";
      return {
        title: `${name} — ${entryDate ?? "—"} · ${type}`,
        subtitle: `${mark}${visibility}`,
      };
    },
  },
});
