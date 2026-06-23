import { BookIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'programme',
  title: 'Programme Definitions',
  type: 'document',
  icon: BookIcon,

  preview: {
    select: {
      title: 'name',
      subtitle: 'programmeId',
    },
  },

  fields: [
    defineField({
      name: 'name',
      title: 'Programme name',
      type: 'string',
      description: 'e.g. "The Sober Muse Method"',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'programmeId',
      title: 'Programme ID',
      type: 'string',
      options: {
        list: [
          { title: 'Sober Muse Method', value: 'sober-muse' },
          { title: 'Female Empowerment & Leadership', value: 'empowerment' },
        ],
        layout: 'radio',
      },
      description: 'Must match the programme field on client profiles.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One sentence shown on the client dashboard. Editorial voice.',
    }),

    defineField({
      name: 'durationDisplay',
      title: 'Duration (display text)',
      type: 'string',
      description: 'e.g. "3–6 months" — shown on the dashboard card.',
    }),

    defineField({
      name: 'includedItems',
      title: "What's included",
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short bullet points shown on the client dashboard. 3–6 items recommended.',
    }),
  ],
})
