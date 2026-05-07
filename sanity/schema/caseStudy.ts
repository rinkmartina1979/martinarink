import { DocumentTextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Studies',
  type: 'document',
  icon: DocumentTextIcon,

  preview: {
    select: {
      pseudonym: 'pseudonym',
      industry: 'industry',
    },
    prepare({ pseudonym, industry }) {
      return {
        title: pseudonym || 'Unnamed',
        subtitle: industry || '',
      }
    },
  },

  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-safe identifier. Generate from pseudonym.',
      options: { source: 'pseudonym', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'pseudonym',
      title: 'Pseudonym',
      type: 'string',
      description:
        "A first name that is NOT the client's real name. E.g. 'Vera', 'Elena', 'Sophie'.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'industry',
      title: 'Industry / context',
      type: 'string',
      description:
        "E.g. 'Founder · Tech · DACH' or 'Partner · Law · Frankfurt'. Never overly specific.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'programme',
      title: 'Programme',
      type: 'string',
      options: {
        list: [
          { title: 'Sober Muse Method', value: 'sober-muse' },
          { title: 'Female Empowerment & Leadership', value: 'empowerment' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'problemSnapshot',
      title: 'Problem snapshot',
      type: 'text',
      rows: 3,
      description:
        '2–3 sentences. What she arrived with. No clinical language, no banned words.',
      validation: (Rule) => Rule.max(300),
    }),

    defineField({
      name: 'workNarrative',
      title: 'Work narrative',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'The work itself. 3–5 paragraphs. Observational voice. No metrics, no before/after framing.',
    }),

    defineField({
      name: 'outcomeMarker',
      title: 'Outcome marker',
      type: 'text',
      rows: 2,
      description:
        "1 sentence. What shifted. Not 'she is now sober' — 'the question she came with changed.'",
      validation: (Rule) => Rule.max(150),
    }),

    defineField({
      name: 'permissionGrantedAt',
      title: 'Permission granted at',
      type: 'datetime',
      description: 'Date client gave written permission',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'visibleOnSite',
      title: 'Visible on site',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle on only after permission is confirmed in writing',
    }),

    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 99,
    }),
  ],
})
