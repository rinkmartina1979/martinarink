import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seoDefaults',
  title: 'SEO Defaults',
  type: 'document',

  fields: [
    defineField({
      name: 'defaultTitle',
      title: 'Default Site Title',
      type: 'string',
      description: 'Used when a page has no specific title. e.g. "Martina Rink — Private Mentoring"',
    }),
    defineField({
      name: 'defaultDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 2,
      description: 'Fallback description for pages without a specific one. Max 160 characters.',
      validation: (R) => R.max(160),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default OG Image',
      type: 'image',
      description: 'Fallback social share image. 1200 × 630 pixels.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter / X Handle',
      type: 'string',
      description: 'Optional. e.g. @martinarink',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'SEO Defaults' }
    },
  },
})
