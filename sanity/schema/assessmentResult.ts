/**
 * Sanity schema: Assessment Result Copy
 *
 * Editable archetype letter content. One document per archetype.
 * Fetched server-side by /assessment/result/[resultId].
 * Falls back to lib/assessment/result-copy.ts if unavailable.
 */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "assessmentResult",
  title: "Assessment Result",
  type: "document",
  fields: [
    defineField({
      name: "archetype",
      title: "Archetype Key",
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
      title: "Opening Paragraph (italic pull-quote)",
      type: "text",
      rows: 4,
      description: "Displayed in italic with a pink left border. First thing she reads.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "bodyParagraphs",
      title: "Body Paragraphs",
      type: "array",
      of: [{ type: "text" }],
      description: "2–3 paragraphs. Each under 100 words. No banned words.",
      validation: (R) => R.required().min(1).max(3),
    }),
    defineField({
      name: "whatThisMeans",
      title: "What This Means",
      type: "text",
      rows: 3,
      description: "Optional interpretive paragraph — what the archetype reveals.",
    }),
    defineField({
      name: "whatYouMayBeProtecting",
      title: "What You May Be Protecting",
      type: "text",
      rows: 3,
      description: "Optional depth paragraph — the fear underneath the pattern.",
    }),
    defineField({
      name: "whatBecomesPossible",
      title: "What Becomes Possible",
      type: "text",
      rows: 3,
      description: "Optional forward-looking paragraph — not a promise, a possibility.",
    }),
    defineField({
      name: "closing",
      title: "Closing Line",
      type: "string",
      description: "Final line before the signature. One sentence.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "emailSubjectLine",
      title: "Email Subject Line (for Kit sequence)",
      type: "string",
      description: "Used in the result email subject. e.g. 'Your result: The Quiet Reckoning'",
    }),
    defineField({
      name: "noindex",
      title: "noindex result pages",
      type: "boolean",
      initialValue: true,
      description: "Result pages should almost always be noindexed.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "tagline",
    },
  },
});
