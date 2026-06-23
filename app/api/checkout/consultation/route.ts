/**
 * POST /api/checkout/consultation
 *
 * Creates a Stripe Checkout Session for the €350 private consultation deposit.
 * Uses inline price_data — no Stripe Price ID required.
 * Returns { url } — the caller redirects to this Stripe-hosted URL.
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, hasStripe } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!hasStripe(stripe)) {
    return NextResponse.json(
      { error: 'Payment not configured — STRIPE_SECRET_KEY is missing' },
      { status: 503 },
    )
  }

  let body: { email?: string; programme?: string } = {}
  try {
    body = await req.json()
  } catch {
    // Body is optional
  }

  const { email, programme } = body

  const origin =
    req.headers.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://martinarink.com'

  try {
    // Create a Stripe Customer so the billing portal can be used later.
    // If an email is supplied, search for an existing Customer first to avoid duplicates.
    let customerId: string | undefined
    if (email) {
      const existing = await stripe.customers.list({ email, limit: 1 })
      if (existing.data.length > 0) {
        customerId = existing.data[0].id
      } else {
        const customer = await stripe.customers.create({
          email,
          metadata: { programme: programme || '', source: 'consultation-deposit' },
        })
        customerId = customer.id
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Private Consultation — Martina Rink',
              description:
                '45-minute private consultation. €350 applied in full toward programme enrolment.',
            },
            unit_amount: 35000, // €350.00
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/book/calendly?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book?token=approved&cancelled=1`,
      ...(customerId ? { customer: customerId } : email ? { customer_email: email } : {}),
      metadata: {
        programme: programme || '',
        source: 'consultation-deposit',
        ...(customerId ? { stripeCustomerId: customerId } : {}),
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
