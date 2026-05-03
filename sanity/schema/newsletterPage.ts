import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'newsletterPage',
  title: 'Newsletter Page',
  type: 'document',

  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'bodyCopy',
      title: 'Body Copy',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'What the letter is. Who it is for. How often it arrives.',
    }),
    defineField({
      name: 'trustNote',
      title: 'Trust / Privacy Note',
      type: 'string',
      group: 'content',
      description: 'Short note on privacy and unsubscribe.',
    }),
    defineField({
      name: 'pastIssuesTeaser',
      title: 'Past Issues Teaser',
      type: 'text',
      rows: 2,
      group: 'content',
      description: 'Optional — a brief description of recent topics.',
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
      return { title: 'Newsletter Page' }
    },
  },
})
