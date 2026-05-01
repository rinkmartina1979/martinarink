import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'workWithMePage',
  title: 'Work With Me Page',
  type: 'document',

  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'cta', title: 'CTA' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroCopy',
      title: 'Opening Copy',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Primary CTA Label',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Primary CTA URL',
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
      return { title: 'Work With Me Page' }
    },
  },
})
