/**
 * Sanity schema: assessmentSubmission (PRIVATE — server write only)
 *
 * This document is written server-side via the assessment API.
 * It must NEVER be queried from the frontend.
 * It must NEVER appear in public Sanity queries.
 * It exists for Martina's CRM view and lead follow-up only.
 *
 * Access: restricted to SANITY_WRITE_TOKEN (server) and admin Studio.
 */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "assessmentSubmission",
  title: "Assessment Submission",
  type: "document",
  fields: [
    defineField({
      name: "resultId",
      title: "Result ID",
      type: "string",
      readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "archetype",
      title: "Archetype",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "The Quiet Reckoning", value: "reckoning" },
          { title: "The Threshold", value: "threshold" },
          { title: "The Return", value: "return" },
        ],
      },
    }),
    defineField({
      name: "serviceIntent",
      title: "Service Intent",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Sober Muse Method", value: "sober-muse" },
          { title: "Empowerment & Leadership", value: "empowerment" },
          { title: "Both", value: "both" },
        ],
      },
    }),
    defineField({
      name: "readinessLevel",
      title: "Readiness Level",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Low", value: "low" },
          { title: "Medium", value: "medium" },
          { title: "High", value: "high" },
        ],
      },
    }),
    defineField({
      name: "privacyNeed",
      title: "Privacy Need",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Standard", value: "standard" },
          { title: "High", value: "high" },
        ],
      },
    }),
    defineField({
      name: "kitStatus",
      title: "Kit Sync Status",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Success", value: "success" },
          { title: "Skipped (no form ID)", value: "skipped" },
          { title: "Failed", value: "failed" },
        ],
      },
    }),
    defineField({
      name: "kitError",
      title: "Kit Error (if any)",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "answersJson",
      title: "Raw Answers (JSON)",
      type: "text",
      readOnly: true,
      description: "Internal only — question IDs to option indices.",
    }),
    defineField({
      name: "sourcePage",
      title: "Source Page",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "createdAt",
      title: "Submitted At",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "userAgent",
      title: "User Agent",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "referrer",
      title: "Referrer",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "archetype",
    },
    prepare({ title, subtitle }) {
      const archetypeLabels: Record<string, string> = {
        reckoning: "Quiet Reckoning",
        threshold: "Threshold",
        return: "The Return",
      };
      return {
        title,
        subtitle: archetypeLabels[subtitle] ?? subtitle,
      };
    },
  },
});
