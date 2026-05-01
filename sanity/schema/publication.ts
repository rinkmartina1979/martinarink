import { BookIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'publication',
  title: 'Publications',
  type: 'document',
  icon: BookIcon,

  preview: {
    select: { title: 'title', subtitle: 'publisher', media: 'coverImage' },
    prepare({ title, subtitle }) {
      return { title: title ?? 'Untitled', subtitle: subtitle ?? '' }
    },
  },

  fields: [
    defineField({
      name: 'title',
      title: 'Book Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'string',
      description: 'e.g. "Aufbau Verlag"',
    }),
    defineField({
      name: 'year',
      title: 'Publication Year',
      type: 'number',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isBestseller',
      title: 'Mark as Bestseller?',
      type: 'boolean',
      description: 'Shows a "Spiegel Bestseller" badge.',
      initialValue: false,
    }),
    defineField({
      name: 'amazonUrl',
      title: 'Amazon / Buy Link',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
})
