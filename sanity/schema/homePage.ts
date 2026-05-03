import { HomeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,

  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'about', title: 'About Teaser' },
    { name: 'assessment', title: 'Assessment CTA' },
    { name: 'newsletter', title: 'Newsletter CTA' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    // ── Hero ──────────────────────────────────────────────────
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
      description: 'The main statement. Keep it under 15 words.',
      validation: (R) => R.max(120),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Sub-text',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'The paragraph beneath the headline. Max 60 words.',
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Primary CTA Label',
      type: 'string',
      group: 'hero',
      description: 'e.g. "Begin the assessment"',
    }),
    defineField({
      name: 'heroCtaUrl',
      title: 'Primary CTA URL',
      type: 'string',
      group: 'hero',
      description: 'e.g. /assessment',
    }),
    defineField({
      name: 'heroSecondaryLabel',
      title: 'Secondary Link Label',
      type: 'string',
      group: 'hero',
      description: 'e.g. "Or explore the work →"',
    }),
    defineField({
      name: 'heroSecondaryUrl',
      title: 'Secondary Link URL',
      type: 'string',
      group: 'hero',
      description: 'e.g. /work-with-me',
    }),
    defineField({
      name: 'authorityItems',
      title: 'Authority Strip Items',
      type: 'array',
      group: 'hero',
      of: [{ type: 'string' }],
      description: 'Short credibility items shown in the strip. Max 6 items.',
      validation: (R) => R.max(6),
    }),

    // ── About Teaser ──────────────────────────────────────────
    defineField({
      name: 'aboutTeaser',
      title: 'About Teaser Copy',
      type: 'text',
      rows: 4,
      group: 'about',
      description: 'The about section pull-quote or teaser text. Max 80 words.',
    }),

    // ── Assessment CTA ────────────────────────────────────────
    defineField({
      name: 'assessmentCtaHeadline',
      title: 'Assessment CTA Headline',
      type: 'string',
      group: 'assessment',
    }),
    defineField({
      name: 'assessmentCtaCopy',
      title: 'Assessment CTA Body',
      type: 'text',
      rows: 2,
      group: 'assessment',
    }),
    defineField({
      name: 'assessmentCtaLabel',
      title: 'Assessment CTA Button Label',
      type: 'string',
      group: 'assessment',
    }),

    // ── Newsletter CTA ────────────────────────────────────────
    defineField({
      name: 'newsletterCtaHeadline',
      title: 'Newsletter CTA Headline',
      type: 'string',
      group: 'newsletter',
    }),
    defineField({
      name: 'newsletterCtaCopy',
      title: 'Newsletter CTA Body',
      type: 'text',
      rows: 2,
      group: 'newsletter',
    }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoMeta',
      group: 'seo',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Homepage' }
    },
  },
})
