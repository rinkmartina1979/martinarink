import { StarIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pressItem',
  title: 'Press Items',
  type: 'document',
  icon: StarIcon,

  preview: {
    select: { title: 'publication', subtitle: 'type' },
    prepare({ title, subtitle }) {
      return { title: title ?? 'Untitled', subtitle: subtitle ?? '' }
    },
  },

  fields: [
    defineField({
      name: 'publication',
      title: 'Publication / Channel',
      type: 'string',
      description: 'e.g. "Vogue Germany", "ZDF", "Spiegel"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline or Show Name',
      type: 'string',
      description: 'The article title or show name, if applicable.',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Print Article', value: 'article' },
          { title: 'Interview', value: 'interview' },
          { title: 'Podcast', value: 'podcast' },
          { title: 'TV', value: 'tv' },
          { title: 'Radio', value: 'radio' },
          { title: 'Online', value: 'online' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Link to the article or episode, if publicly available.',
    }),
    defineField({
      name: 'logo',
      title: 'Publication Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Feature prominently?',
      type: 'boolean',
      description: 'Show this item in the hero press strip.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
})
