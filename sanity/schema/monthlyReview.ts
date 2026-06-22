/**
 * Sanity schema: monthlyReview (PRIVATE — server write only)
 *
 * One per (client, programme month). Written by /api/journal. Same privacy
 * model as journalEntry: defaults to "private"; only shared/needs-support
 * surface in the portal and Studio review views.
 */

import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "monthlyReview",
  title: "Monthly Reviews",
  type: "document",
  icon: CalendarIcon,

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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "monthIndex",
      title: "Programme month (1–3)",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
    defineField({
      name: "reviewDate",
      title: "Review date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
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

    defineField({ name: "accomplished", title: "Accomplished",   type: "text", rows: 3 }),
    defineField({ name: "whatWorked",   title: "What worked",     type: "text", rows: 3 }),
    defineField({ name: "improveNext",  title: "Improve next",    type: "text", rows: 3 }),
    defineField({ name: "towardGoals",  title: "Toward goals",    type: "text", rows: 3 }),
    defineField({ name: "celebrate",    title: "Celebrate",       type: "text", rows: 3 }),

    defineField({ name: "createdAt", title: "Created at", type: "datetime" }),
    defineField({ name: "updatedAt", title: "Updated at", type: "datetime" }),
  ],

  preview: {
    select: { monthIndex: "monthIndex", visibility: "visibility", reviewDate: "reviewDate" },
    prepare({ monthIndex, visibility, reviewDate }) {
      const mark =
        visibility === "needs-support" ? "🆘 " : visibility === "shared" ? "👁 " : "🔒 ";
      return {
        title: `${mark}Month ${monthIndex ?? "—"} review`,
        subtitle: reviewDate ?? "",
      };
    },
  },
});
