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
      name: 'programmeVariant',
      title: 'Programme variant',
      type: 'string',
      description: 'Set when onboarding — drives the exact fee amount shown in the client billing card.',
      options: {
        list: [
          { title: 'Sober Muse — 3 months (€5,000)', value: 'sober-muse-3m' },
          { title: 'Sober Muse — 3 months · 7 days (€6,500)', value: 'sober-muse-3m-7days' },
          { title: 'Sober Muse — 6 months · Weekdays (€10,000)', value: 'sober-muse-6m-weekdays' },
          { title: 'Sober Muse — 6 months · 7 days (€13,000)', value: 'sober-muse-6m-7days' },
          { title: 'Empowerment — 3 months (€7,000)', value: 'empowerment-3m' },
          { title: 'Empowerment — 6 months (€14,000)', value: 'empowerment-6m' },
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

    // ── Billing & entitlement (written only by Stripe webhooks or Martina in Studio) ──
    defineField({
      name: 'stripeCustomerId',
      title: 'Stripe customer ID',
      type: 'string',
      description: 'Set at checkout — used to create billing-portal sessions and attach invoices.',
      readOnly: true,
    }),
    defineField({
      name: 'depositPaidAt',
      title: 'Deposit paid at',
      type: 'datetime',
      description: 'Set by Stripe webhook (checkout.session.completed). Never set manually — use manualDepositPaidAt instead.',
      readOnly: true,
    }),
    defineField({
      name: 'manualDepositPaidAt',
      title: 'Manual deposit paid at',
      type: 'datetime',
      description: 'Use when payment received outside Stripe (bank transfer, etc.). Treated identically to depositPaidAt for access.',
    }),
    defineField({
      name: 'finalFeeDueAt',
      title: 'Final fee due at',
      type: 'datetime',
      description: 'Set by Martina when issuing the final-fee Stripe invoice.',
    }),
    defineField({
      name: 'finalFeePaidAt',
      title: 'Final fee paid at',
      type: 'datetime',
      description: 'Set by Stripe webhook (invoice.paid). Never set manually — use manualFinalFeePaidAt instead.',
      readOnly: true,
    }),
    defineField({
      name: 'manualFinalFeePaidAt',
      title: 'Manual final fee paid at',
      type: 'datetime',
      description: 'Use when final fee received outside Stripe. Treated identically to finalFeePaidAt.',
    }),
    defineField({
      name: 'programmeStartDate',
      title: 'Programme start date',
      type: 'date',
      description: 'Confirmed kickoff date.',
    }),
    defineField({
      name: 'programmeActiveAt',
      title: 'Programme active at',
      type: 'datetime',
      description: 'Set when the programme formally begins (admin-confirmed or invoice-triggered). Grants programme-level portal access.',
    }),
    defineField({
      name: 'programmeCompletedAt',
      title: 'Programme completed at',
      type: 'datetime',
      description: 'Set when the programme concludes. Portal moves to archived view.',
    }),
    defineField({
      name: 'nextSessionAt',
      title: 'Next session at',
      type: 'datetime',
      description: 'Set by the Cal.com booking webhook (BOOKING_CREATED/RESCHEDULED). Cleared on cancellation. Display only — never used for entitlement.',
      readOnly: true,
    }),
    defineField({
      name: 'calcomBookingUid',
      title: 'Cal.com booking UID',
      type: 'string',
      description: 'Set by the Cal.com booking webhook. Used to match cancellation/reschedule events to the stored nextSessionAt.',
      readOnly: true,
    }),
    defineField({
      name: 'accessSuspendedAt',
      title: 'Access suspended at',
      type: 'datetime',
      description: 'Hard kill-switch. Overrides all other access. Set to block ALL portal access immediately (e.g. dispute, safeguarding).',
    }),
    defineField({
      name: 'adminAccessOverride',
      title: 'Admin access override',
      type: 'boolean',
      description: 'Grants full portal + programme access without payment (scholarship, comp, manual arrangement). Use sparingly.',
      initialValue: false,
    }),
  ],
})
