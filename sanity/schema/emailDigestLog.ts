import { CalendarIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'emailDigestLog',
  title: 'Email Digest Logs',
  type: 'document',
  icon: CalendarIcon,

  // Read-only in Studio — records are created by the cron job, never manually.
  preview: {
    select: {
      sentAt: 'sentAt',
      status: 'status',
    },
    prepare({ sentAt, status }) {
      return {
        title: sentAt
          ? new Date(sentAt).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Unknown date',
        subtitle: status || '',
      }
    },
  },

  fields: [
    defineField({
      name: 'sentAt',
      title: 'Sent at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'postIds',
      title: 'Post slugs included',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Slugs of the posts included in this digest',
    }),

    defineField({
      name: 'recipientCount',
      title: 'Recipient count',
      type: 'number',
    }),

    defineField({
      name: 'brevoEmailId',
      title: 'Brevo campaign ID',
      type: 'string',
      description: 'Brevo campaign ID returned from Campaigns API',
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Sent', value: 'sent' },
          { title: 'Skipped — no new posts', value: 'skipped' },
          { title: 'Failed', value: 'failed' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'errorMessage',
      title: 'Error message',
      type: 'string',
      description: 'If status=failed, the error from Brevo API',
    }),
  ],
})
