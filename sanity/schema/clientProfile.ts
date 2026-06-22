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
          { title: 'The Emotionally Exhausted Self',    value: 'exhausted' },
          { title: 'The Self-Doubting Achiever',        value: 'doubting'  },
          { title: 'The Self-Abandoning People Pleaser',value: 'pleasing'  },
          { title: 'The Emerging Empowered Woman',      value: 'empowered' },
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

    // ── Portal dashboard (client-facing) ─────────────────────────
    defineField({
      name: 'portalStage',
      title: 'Portal stage',
      type: 'string',
      description: 'Drives the "current stage" timeline on the client dashboard.',
      options: {
        list: [
          { title: 'Accepted', value: 'accepted' },
          { title: 'Consultation', value: 'consultation' },
          { title: 'Onboarding (contract + intake)', value: 'onboarding' },
          { title: 'Programme active', value: 'active' },
          { title: 'Final month', value: 'integration' },
          { title: 'Completed', value: 'completed' },
        ],
        layout: 'radio',
      },
      initialValue: 'onboarding',
    }),
    defineField({ name: 'nextStepTitle', title: 'Next step — title', type: 'string',
      description: 'The single primary action shown to the client. Keep it calm.' }),
    defineField({ name: 'nextStepDescription', title: 'Next step — description', type: 'text', rows: 2 }),
    defineField({ name: 'nextStepCtaLabel', title: 'Next step — button label', type: 'string' }),
    defineField({ name: 'nextStepHref', title: 'Next step — link', type: 'string',
      description: 'Relative path (e.g. /book) or full URL.' }),
    defineField({ name: 'nextStepDueAt', title: 'Next step — due', type: 'datetime' }),
    defineField({ name: 'journalStartDate', title: 'Journal start date', type: 'date' }),
    defineField({ name: 'timezone', title: 'Timezone', type: 'string', description: 'IANA, e.g. Europe/Berlin' }),
    defineField({ name: 'lastClientUpdateAt', title: 'Last client update', type: 'datetime', readOnly: true }),
    defineField({ name: 'lastMartinaUpdateAt', title: 'Last note from Martina', type: 'datetime', readOnly: true }),

    // ── Token security & link recovery ───────────────────────────
    defineField({
      name: 'tokenVersion',
      title: 'Token version',
      type: 'number',
      initialValue: 1,
      description: 'Increment to instantly revoke every previously issued portal link for this client.',
    }),
    defineField({
      name: 'revokedAt',
      title: 'Access revoked at',
      type: 'datetime',
      description: 'Set to immediately block ALL portal access for this client (e.g. lost device).',
    }),
    defineField({ name: 'lastUsedAt', title: 'Portal last used', type: 'datetime', readOnly: true }),
    defineField({ name: 'portalLinkResendCount', title: 'Portal link resends', type: 'number', readOnly: true }),
    defineField({ name: 'portalLinkLastSentAt', title: 'Portal link last sent', type: 'datetime', readOnly: true }),

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
