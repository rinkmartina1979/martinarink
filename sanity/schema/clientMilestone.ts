import { StarFilledIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'clientMilestone',
  title: 'Client Milestones',
  type: 'document',
  icon: StarFilledIcon,

  preview: {
    select: {
      title: 'title',
      achievedAt: 'achievedAt',
    },
    prepare({ title, achievedAt }) {
      return {
        title: title || 'Unnamed milestone',
        subtitle: achievedAt
          ? new Date(achievedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '',
      }
    },
  },

  fields: [
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{ type: 'clientProfile' }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description:
        "Short, precise. 'First sober dinner at a client event.' Never clinical language.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'achievedAt',
      title: 'Achieved at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
      rows: 4,
      description:
        "Martina's reflection — visible to client. Warm, observational, editorial voice.",
    }),

    defineField({
      name: 'private',
      title: 'Private (Martina only)',
      type: 'boolean',
      initialValue: false,
      description:
        "If true, this milestone is Martina's internal note only — not shown to client",
    }),
  ],
})
