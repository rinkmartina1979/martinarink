/**
 * Sanity schema: Assessment Result Copy
 *
 * Allows Martina to edit the archetype result letters without a developer.
 * One document per archetype (reckoning / threshold / return).
 *
 * Falls back to lib/assessment/result-copy.ts when Sanity is unavailable.
 */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "assessmentResult",
  title: "Assessment Result",
  type: "document",
  fields: [
    defineField({
      name: "archetype",
      title: "Archetype",
      type: "string",
      options: {
        list: [
          { title: "The Quiet Reckoning", value: "reckoning" },
          { title: "The Threshold", value: "threshold" },
          { title: "The Return", value: "return" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "name",
      title: "Archetype Name",
      type: "string",
      description: 'e.g. "The Quiet Reckoning"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "One sentence shown large beneath the name.",
      validation: (R) => R.required().max(120),
    }),
    defineField({
      name: "opening",
      title: "Opening Paragraph",
      type: "text",
      rows: 4,
      description: "Displayed in italic with a pink left border. The first thing she reads.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "bodyParagraphs",
      title: "Body Paragraphs",
      type: "array",
      of: [{ type: "text" }],
      description: "3 paragraphs maximum. Each under 100 words.",
      validation: (R) => R.required().min(1).max(3),
    }),
    defineField({
      name: "closing",
      title: "Closing Line",
      type: "string",
      description: "The final line before the signature. One sentence.",
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "tagline",
    },
  },
});
