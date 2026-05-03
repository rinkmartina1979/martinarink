import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seoMeta',
  title: 'SEO Settings',
  type: 'object',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Recommended: under 60 characters. If blank, the page title is used.',
      validation: (R) => R.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'Recommended: under 160 characters. Shown in Google search results.',
      validation: (R) => R.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Recommended: 1200 × 630 pixels. Shown when shared on social media.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Optional. Leave blank to use the page URL automatically.',
    }),
    defineField({
      name: 'noindex',
      title: 'Hide from search engines (noindex)',
      type: 'boolean',
      description: 'Toggle on to prevent Google from indexing this page.',
      initialValue: false,
    }),
  ],
})
