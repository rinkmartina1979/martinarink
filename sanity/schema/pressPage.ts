import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pressPage',
  title: 'Press Page',
  type: 'document',

  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'cta', title: 'CTA' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    defineField({
      name: 'bioCopy',
      title: 'Media Bio',
      type: 'text',
      rows: 5,
      group: 'content',
      description: 'The 2–3 paragraph bio used by editors and journalists. Authoritative, third-person.',
    }),
    defineField({
      name: 'pressKitUrl',
      title: 'Press Kit Download URL',
      type: 'url',
      group: 'content',
      description: 'Link to a press kit PDF or folder (Google Drive, Dropbox, etc.).',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Contact CTA Label',
      type: 'string',
      group: 'cta',
      description: 'e.g. "Press enquiries"',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Contact CTA URL',
      type: 'string',
      group: 'cta',
      description: 'e.g. /contact',
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
      return { title: 'Press Page' }
    },
  },
})
