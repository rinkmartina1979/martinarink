import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'empowermentPage',
  title: 'Empowerment & Leadership Page',
  type: 'document',

  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'content', title: 'Content Sections' },
    { name: 'cta', title: 'CTA' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
      validation: (R) => R.max(80),
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroCopy',
      title: 'Hero Opening Copy',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'forWhomCopy',
      title: '"Who This Is For" Section',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'Founders, senior executives, creative directors — at a personal inflection point.',
    }),
    defineField({
      name: 'whatThisIsNotCopy',
      title: '"What This Is Not" Section',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'methodCopy',
      title: 'The Method / Container',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'privacyCopy',
      title: 'Privacy Copy',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'investmentText',
      title: 'Investment Text',
      type: 'string',
      group: 'content',
      description: 'e.g. "from €7,500 · 6–12 months"',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA URL',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoMeta',
      group: 'seo',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Empowerment & Leadership Page' }
    },
  },
})
