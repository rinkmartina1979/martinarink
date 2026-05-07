import { PlayIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'audioDrop',
  title: 'Audio Drops',
  type: 'document',
  icon: PlayIcon,

  preview: {
    select: {
      title: 'title',
      releasedAt: 'releasedAt',
    },
    prepare({ title, releasedAt }) {
      return {
        title: title || 'Untitled drop',
        subtitle: releasedAt
          ? new Date(releasedAt).toLocaleDateString('en-GB', {
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
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description:
        '1–2 sentences. Editorial voice — same as public site. No wellness jargon.',
    }),

    defineField({
      name: 'audioUrl',
      title: 'Audio URL',
      type: 'url',
      description:
        'Vercel Blob URL (upload via /api/members/audio-upload) — or Hello Audio private feed URL when upgraded',
    }),

    defineField({
      name: 'durationSeconds',
      title: 'Duration (seconds)',
      type: 'number',
      description: "Audio duration in seconds. Used to show '3 min listen' to client.",
    }),

    defineField({
      name: 'transcript',
      title: 'Transcript',
      type: 'text',
      rows: 8,
      description: 'Optional transcript for accessibility',
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'releasedAt',
      title: 'Released at',
      type: 'datetime',
      description: 'When this drop becomes visible to clients',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'visibleTo',
      title: 'Visible to (specific clients)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'clientProfile' }] }],
      description:
        'Leave empty to show to ALL active clients. Add specific clients to restrict.',
    }),

    defineField({
      name: 'programme',
      title: 'Programme',
      type: 'string',
      options: {
        list: [
          { title: 'Sober Muse Method', value: 'sober-muse' },
          { title: 'Female Empowerment & Leadership', value: 'empowerment' },
          { title: 'Both', value: 'both' },
        ],
        layout: 'radio',
      },
      description: 'Filters which clients see this if visibleTo is empty',
    }),
  ],
})
