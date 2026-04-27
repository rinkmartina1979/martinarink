import { StarIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  icon: StarIcon,

  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'portrait',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Unnamed client',
        subtitle: subtitle || '',
      }
    },
  },

  fields: [
    defineField({
      name: 'name',
      title: 'Client name or initials',
      type: 'string',
      description: 'Use initials only if client requested anonymity (e.g. "S.K.").',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'role',
      title: 'Role / description',
      type: 'string',
      description: 'E.g. "Founder · London" or "Patent Engineer · Munich".',
    }),

    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      description: 'The testimonial. Use their exact words.',
      validation: (Rule) => Rule.required().max(400),
    }),

    defineField({
      name: 'portrait',
      title: 'Portrait (optional)',
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
      name: 'programme',
      title: 'Programme',
      type: 'string',
      description: 'Which programme did this client do?',
      options: {
        list: [
          { title: 'Sober Muse Method', value: 'sober-muse' },
          { title: 'Female Empowerment & Leadership', value: 'empowerment' },
          { title: 'Private Consultation', value: 'consultation' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'featured',
      title: 'Feature on homepage?',
      type: 'boolean',
      description: 'Toggle on to show this testimonial on the homepage.',
      initialValue: false,
    }),

    defineField({
      name: 'nda',
      title: 'NDA — show as anonymous?',
      type: 'boolean',
      description: 'If on, the name shown will be role only (e.g. "Founder · London").',
      initialValue: false,
    }),

    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first. Leave blank for newest-first.',
      initialValue: 99,
    }),
  ],
})
