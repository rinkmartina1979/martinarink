/**
 * POST /api/checkout/consultation
 *
 * Creates a Stripe Checkout Session for the €450 private consultation deposit.
 * Returns { url } — the caller redirects to this Stripe-hosted URL.
 *
 * Upgrade path: change STRIPE_CONSULTATION_PRICE_ID to a new Stripe price
 * object to change the amount. No code change required.
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json(
      { error: 'Payment not configured — STRIPE_SECRET_KEY is missing' },
      { status: 503 },
    )
  }

  const priceId = process.env.STRIPE_CONSULTATION_PRICE_ID
  if (!priceId) {
    return NextResponse.json(
      { error: 'Payment not configured — STRIPE_CONSULTATION_PRICE_ID is missing' },
      { status: 503 },
    )
  }

  let body: { email?: string; programme?: string } = {}
  try {
    body = await req.json()
  } catch {
    // Body is optional — both fields are optional
  }

  const { email, programme } = body

  const stripe = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' })

  const origin =
    req.headers.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://martinarink.com'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/book/calendly?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book?cancelled=1`,
      ...(email ? { customer_email: email } : {}),
      metadata: {
        programme: programme || '',
        source: 'consultation-deposit',
      },
      allow_promotion_codes: false,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout/consultation] Stripe error:', err)
    const message = err instanceof Stripe.errors.StripeError ? err.message : 'Checkout session creation failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
