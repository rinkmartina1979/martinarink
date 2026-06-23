/**
 * Server-only Stripe client singleton.
 * Never import this in components or pages.
 */

import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY

export const stripe: Stripe | null = stripeKey
  ? new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' })
  : null

export function hasStripe(s: typeof stripe): s is Stripe {
  return s !== null
}
