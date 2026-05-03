import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'soberMusePage',
  title: 'Sober Muse Method Page',
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
      description: 'The page title. Max 80 characters.',
      validation: (R) => R.max(80),
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      group: 'hero',
      description: 'One sentence beneath the headline.',
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
      description: 'Describe the woman this programme is designed for. No shame language.',
    }),
    defineField({
      name: 'whatThisIsNotCopy',
      title: '"What This Is Not" Section',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'Address the misconceptions. No "alcoholic" language.',
    }),
    defineField({
      name: 'methodCopy',
      title: 'The Method Section',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'What the 90-day private engagement actually involves.',
    }),
    defineField({
      name: 'privacyCopy',
      title: 'Privacy Reassurance',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Confidentiality, discretion, and privacy of the work.',
    }),
    defineField({
      name: 'investmentText',
      title: 'Investment Text',
      type: 'string',
      group: 'content',
      description: 'e.g. "from €5,000 · 90-day private engagement"',
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
      return { title: 'Sober Muse Method Page' }
    },
  },
})
