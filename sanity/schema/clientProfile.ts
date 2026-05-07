import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'clientProfile',
  title: 'Client Profiles',
  type: 'document',
  icon: UserIcon,

  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      programme: 'programme',
    },
    prepare({ firstName, lastName, programme }) {
      return {
        title: [firstName, lastName].filter(Boolean).join(' ') || 'Unnamed client',
        subtitle: programme || '',
      }
    },
  },

  fields: [
    defineField({
      name: 'clientId',
      title: 'Client ID',
      type: 'string',
      description: 'Stable UUID — used in the signed member token. Never change this.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'firstName',
      title: 'First name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'lastName',
      title: 'Last name',
      type: 'string',
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Primary contact email',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'archetype',
      title: 'Archetype',
      type: 'string',
      options: {
        list: [
          { title: 'The Reckoning', value: 'reckoning' },
          { title: 'The Threshold', value: 'threshold' },
          { title: 'The Return', value: 'return' },
        ],
        layout: 'radio',
      },
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
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Paused', value: 'paused' },
          { title: 'Completed', value: 'completed' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),

    defineField({
      name: 'enrolledAt',
      title: 'Enrolled at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'expectedCompletionAt',
      title: 'Expected completion',
      type: 'datetime',
    }),

    defineField({
      name: 'tokenIssuedAt',
      title: 'Token issued at',
      type: 'datetime',
      description: 'Set when first member token is generated. Used for audit only.',
    }),

    defineField({
      name: 'privateNotes',
      title: 'Private notes',
      type: 'text',
      description: 'Martina only — NEVER rendered to client under any circumstances',
      validation: (Rule) =>
        Rule.warning('This note is private and never shown to the client.'),
    }),
  ],
})
