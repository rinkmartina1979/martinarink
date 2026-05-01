import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
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
      name: 'pressInquiryCopy',
      title: 'Press Inquiry Copy',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'privateInquiryCopy',
      title: 'Private Inquiry Copy',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'speakingInquiryCopy',
      title: 'Speaking Inquiry Copy',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'recipientEmail',
      title: 'Contact Email Address',
      type: 'string',
      group: 'content',
      description: 'The email address form submissions are sent to. Keep this confidential.',
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
      return { title: 'Contact Page' }
    },
  },
})
