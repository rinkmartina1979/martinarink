/**
 * Sanity schema: assessmentPage (singleton)
 *
 * Allows editing of the assessment landing page copy, SEO, and privacy text
 * without a developer. Fetched server-side with fallback to page.tsx defaults.
 */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "assessmentPage",
  title: "Assessment Page",
  type: "document",
  fields: [
    // ── Hero / Landing ──────────────────────────────────────
    defineField({
      name: "eyebrow",
      title: "Eyebrow Label",
      type: "string",
      initialValue: "A private assessment",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "Points of Departure",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 2,
      initialValue:
        "A private diagnostic for the woman who knows something has shifted — and wants to understand exactly where she stands.",
    }),
    defineField({
      name: "introCopy",
      title: "Intro Copy (before questions begin)",
      type: "array",
      of: [{ type: "text" }],
      initialValue: [
        "Each question has one answer — the one that lands closest to true, not the one you wish were true.",
        "There are no wrong answers. There is only where you are.",
        "At the end: a letter. Written for where you are, not for where you think you should be.",
      ],
    }),
    // ── Email Gate ──────────────────────────────────────────
    defineField({
      name: "emailGateHeadline",
      title: "Email Gate Headline",
      type: "string",
      initialValue: "Your result will be written as a letter.",
    }),
    defineField({
      name: "emailGateCopy",
      title: "Email Gate Body",
      type: "string",
      initialValue: "Where would you like it sent?",
    }),
    defineField({
      name: "consentText",
      title: "Consent / Privacy Note",
      type: "text",
      rows: 3,
      initialValue:
        "Your answers are private. You will receive your result letter and occasional writing from Martina. One click to unsubscribe, always.",
    }),
    // ── Page Footer ─────────────────────────────────────────
    defineField({
      name: "privacyNote",
      title: "Privacy Note (bottom of page)",
      type: "text",
      rows: 2,
      initialValue:
        "Your answers are private and used only to personalise your result. Submitting your email adds you to Martina's private list. You can unsubscribe at any time — one click, no friction.",
    }),
    // ── SEO ─────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      initialValue: "Points of Departure — A Private Assessment | Martina Rink",
      validation: (R) => R.max(60),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      initialValue:
        "Seven questions. About four minutes. At the end, a letter — written specifically for where you are. Not a quiz. A beginning.",
      validation: (R) => R.max(160),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare({ title }) {
      return { title: title ?? "Assessment Page" };
    },
  },
});
