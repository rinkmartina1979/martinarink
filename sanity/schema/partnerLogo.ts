import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'partnerLogo',
  title: 'Partner Logos',
  type: 'document',

  preview: {
    select: { title: 'name', media: 'logo' },
    prepare({ title }) {
      return { title: title ?? 'Untitled' }
    },
  },

  fields: [
    defineField({
      name: 'name',
      title: 'Partner Name',
      type: 'string',
      description: 'e.g. "Vogue", "Deutsche Telekom"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'e.g. "Vogue logo"',
        }),
      ],
    }),
    defineField({
      name: 'url',
      title: 'Website URL',
      type: 'url',
      description: 'Optional link from the logo.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 99,
    }),
  ],
})
