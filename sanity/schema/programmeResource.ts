import { DocumentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'programmeResource',
  title: 'Programme Resources',
  type: 'document',
  icon: DocumentIcon,

  preview: {
    select: {
      title: 'title',
      type: 'type',
      publishedAt: 'publishedAt',
    },
    prepare({ title, type, publishedAt }) {
      const typeLabel: Record<string, string> = {
        document: 'Document',
        link: 'Link',
        workbook: 'Workbook',
        video: 'Video',
      }
      return {
        title: title || 'Untitled resource',
        subtitle: [typeLabel[type] ?? type, publishedAt
          ? new Date(publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          : ''].filter(Boolean).join(' · '),
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: '1–2 sentences describing this resource.',
    }),

    defineField({
      name: 'type',
      title: 'Resource type',
      type: 'string',
      options: {
        list: [
          { title: 'Document (PDF)', value: 'document' },
          { title: 'Workbook', value: 'workbook' },
          { title: 'Link / reading', value: 'link' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'asset',
      title: 'File (PDF / document)',
      type: 'file',
      description: 'Upload a PDF or document. Used when type is Document or Workbook.',
    }),

    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'External link. Used when type is Link or Video.',
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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'gatedByStage',
      title: 'Visible from stage',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Accepted', value: 'accepted' },
          { title: 'Consultation', value: 'consultation' },
          { title: 'Onboarding', value: 'onboarding' },
          { title: 'Active', value: 'active' },
          { title: 'Integration', value: 'integration' },
          { title: 'Completed', value: 'completed' },
        ],
      },
      description: 'Leave empty to show from day one. Select stages when this resource should become available.',
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      description: 'When this resource becomes visible to clients.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'visibleTo',
      title: 'Visible to (specific clients)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'clientProfile' }] }],
      description: 'Leave empty to show to all clients in the programme. Add specific clients to restrict.',
    }),
  ],
})
