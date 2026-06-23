/**
 * Stripe product registry — single source of truth for all programme products.
 *
 * Product IDs come from the live Stripe dashboard.
 * Prices are in EUR (integer cents / 100).
 * Never hardcode these IDs elsewhere — always import from here.
 */

export const STRIPE_PRODUCTS = {
  // ── The Sober Muse Method ────────────────────────────────────
  soberMuse3mWeekdays: {
    stripeProductId: 'prod_UkL2KZuZkSRi3O',
    programme: 'sober-muse' as const,
    name: 'The Sober Muse Mentorship — 3 months, weekdays',
    shortLabel: '3 months · weekdays only',
    duration: '3 months',
    format: 'weekdays' as const,
    price: 5000,
    priceDisplay: '€5,000',
    serviceDescription:
      'The Sober Muse Method — 3-month private mentoring programme, Monday to Friday. 4 sessions per month, daily written correspondence, and direct access during business hours.',
  },
  soberMuse6mWeekdays: {
    stripeProductId: 'prod_UkL6o1RqoNWPP1',
    programme: 'sober-muse' as const,
    name: 'The Sober Muse Mentorship — 6 months, weekdays',
    shortLabel: '6 months · weekdays only',
    duration: '6 months',
    format: 'weekdays' as const,
    price: 10000,
    priceDisplay: '€10,000',
    serviceDescription:
      'The Sober Muse Method — 6-month private mentoring programme, Monday to Friday. 4 sessions per month, daily written correspondence, and direct access during business hours.',
  },
  soberMuse6m7days: {
    stripeProductId: 'prod_UkLBoJeV2c49SL',
    programme: 'sober-muse' as const,
    name: 'The Sober Muse Mentorship — 6 months, 7 days/week',
    shortLabel: '6 months · 7 days/week',
    duration: '6 months',
    format: '7days' as const,
    price: 13000,
    priceDisplay: '€13,000',
    serviceDescription:
      'The Sober Muse Method — 6-month private mentoring programme, 7 days a week. 4 sessions per month, daily written correspondence, and direct access 8 a.m.–10 p.m. every day.',
  },

  // ── Female Empowerment & Leadership ─────────────────────────
  empowerment3m: {
    stripeProductId: 'prod_UkLE49hFhgk0yD',
    programme: 'empowerment' as const,
    name: 'Female Empowerment Coaching — 3 months',
    shortLabel: '3 months',
    duration: '3 months',
    format: 'standard' as const,
    price: 7000,
    priceDisplay: '€7,000',
    serviceDescription:
      'Female Empowerment & Leadership — 3-month private coaching programme. 4 sessions per month, written work between sessions, and direct correspondence.',
  },
  empowerment6m: {
    stripeProductId: 'prod_UkLFckceYNEYBt',
    programme: 'empowerment' as const,
    name: 'Female Empowerment Coaching — 6 months',
    shortLabel: '6 months',
    duration: '6 months',
    format: 'standard' as const,
    price: 14000,
    priceDisplay: '€14,000',
    serviceDescription:
      'Female Empowerment & Leadership — 6-month private coaching programme. 4 sessions per month, written work between sessions, and direct correspondence.',
  },
} as const

export type ProductKey = keyof typeof STRIPE_PRODUCTS
export type ProgrammeId = 'sober-muse' | 'empowerment'

export const SOBER_MUSE_TIERS = [
  STRIPE_PRODUCTS.soberMuse3mWeekdays,
  STRIPE_PRODUCTS.soberMuse6mWeekdays,
  STRIPE_PRODUCTS.soberMuse6m7days,
] as const

export const EMPOWERMENT_TIERS = [
  STRIPE_PRODUCTS.empowerment3m,
  STRIPE_PRODUCTS.empowerment6m,
] as const

/** Look up a product by its Stripe product ID — for webhook/invoice matching. */
export function getProductByStripeId(stripeProductId: string) {
  return Object.values(STRIPE_PRODUCTS).find(
    (p) => p.stripeProductId === stripeProductId,
  ) ?? null
}
