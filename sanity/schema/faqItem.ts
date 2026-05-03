import { HelpCircleIcon } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faqItem',
  title: 'FAQs',
  type: 'document',

  preview: {
    select: { title: 'question', subtitle: 'programme' },
    prepare({ title, subtitle }) {
      const prog: Record<string, string> = {
        'sober-muse': 'Sober Muse',
        'empowerment': 'Empowerment',
        'general': 'General',
      }
      return { title: title ?? 'Untitled', subtitle: subtitle ? prog[subtitle] ?? subtitle : '' }
    },
  },

  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 4,
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'programme',
      title: 'Programme',
      type: 'string',
      description: 'Which page should this FAQ appear on?',
      options: {
        list: [
          { title: 'Sober Muse Method', value: 'sober-muse' },
          { title: 'Female Empowerment & Leadership', value: 'empowerment' },
          { title: 'Work With Me / General', value: 'general' },
        ],
        layout: 'radio',
      },
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
