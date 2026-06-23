import { UsersIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'careTeamMember',
  title: 'Care Team Members',
  type: 'document',
  icon: UsersIcon,

  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },

  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. "Lead Mentor", "Clinical Partner"',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: '2–4 sentences. First person or third person — match the rest of the site voice.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'photo',
      title: 'Photo',
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
      name: 'availability',
      title: 'Availability note',
      type: 'string',
      description: 'e.g. "Available weekdays by appointment" — shown on the care team card.',
    }),

    defineField({
      name: 'programme',
      title: 'Programme',
      type: 'string',
      options: {
        list: [
          { title: 'Sober Muse Method', value: 'sober-muse' },
          { title: 'Female Empowerment & Leadership', value: 'empowerment' },
          { title: 'Both programmes', value: 'both' },
        ],
        layout: 'radio',
      },
      description: 'Which programme clients need to be enrolled in to see this person.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first. Use 0 for Martina, 10 for Ruta, 20+ for others.',
      initialValue: 10,
    }),
  ],
})
