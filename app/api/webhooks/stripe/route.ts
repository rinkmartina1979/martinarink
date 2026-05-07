/**
 * POST /api/webhooks/stripe
 *
 * Handles Stripe webhook events.
 *
 * Events handled:
 *   - checkout.session.completed
 *
 * On payment confirmed:
 *   1. Fire Brevo event (consultation_deposit_paid)
 *   2. Update Brevo contact attributes
 *   3. Send Resend confirmation email to the client
 *
 * Uses raw body for Stripe signature verification — same pattern as
 * the Calendly webhook route.
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { trackBrevoEvent, addBrevoContact } from '@/lib/brevo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function sendDepositConfirmation(
  email: string,
  firstName: string,
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@martinarink.com'
  if (!resendKey) return

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#F7F3EE;padding:48px 40px;color:#1E1B17;">
      <p style="font-size:17px;line-height:1.7;margin:0 0 24px;">
        ${firstName || 'Hello'},
      </p>
      <p style="font-size:17px;line-height:1.7;margin:0 0 24px;color:#4A3728;">
        Your consultation deposit has been received.
      </p>
      <p style="font-size:17px;line-height:1.7;margin:0 0 24px;color:#4A3728;">
        I'll send you a Calendly link by email within 24 hours so we can find a
        time that works. The deposit will be credited toward your programme should
        you choose to continue.
      </p>
      <p style="font-size:17px;line-height:1.7;margin:0 0 40px;color:#4A3728;">
        If you have any questions before then, you can reach me at
        <a href="mailto:${fromEmail}" style="color:#5C2D8E;">${fromEmail}</a>.
      </p>
      <hr style="border:none;border-top:1px solid #C8B8A2;margin:32px 0;" />
      <p style="font-size:13px;color:#8A7F72;margin:0;">
        Martina Rink &nbsp;·&nbsp; martinarink.com
      </p>
    </div>
  `

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: 'Deposit received — consultation confirmed',
        html,
      }),
    })
  } catch (err) {
    console.error('[stripe webhook] Resend confirmation failed:', err)
  }
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey) {
    return NextResponse.json(
      { error: 'STRIPE_SECRET_KEY not configured' },
      { status: 503 },
    )
  }

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET not configured' },
      { status: 503 },
    )
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' })

  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.warn('[stripe webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Only act on confirmed payments
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ ok: true, skipped: 'not_paid' })
    }

    // Resolve customer email
    let email = session.customer_email ?? ''
    if (!email && session.customer && typeof session.customer === 'string') {
      try {
        const customer = await stripe.customers.retrieve(session.customer)
        if (!customer.deleted && customer.email) {
          email = customer.email
        }
      } catch (err) {
        console.error('[stripe webhook] Failed to fetch customer:', err)
      }
    }

    if (!email) {
      console.warn('[stripe webhook] No email found on session:', session.id)
      return NextResponse.json({ ok: true, skipped: 'no_email' })
    }

    const programme = (session.metadata?.programme as string) || ''

    // Brevo event + contact update — fire-and-forget, never block the 200 to Stripe
    trackBrevoEvent({
      email,
      eventName: 'consultation_deposit_paid',
      properties: { programme, amount: 450 },
      contactProperties: {
        DEPOSIT_PAID: true,
        DEPOSIT_PAID_AT: new Date().toISOString(),
      },
    }).catch((err) => console.error('[stripe webhook] Brevo event failed:', err))

    addBrevoContact({
      email,
      attributes: {
        DEPOSIT_PAID: true,
        DEPOSIT_PAID_AT: new Date().toISOString(),
      },
      updateEnabled: true,
    }).catch((err) =>
      console.error('[stripe webhook] Brevo contact update failed:', err),
    )

    // Confirmation email — derive first name from customer name if available
    const firstName =
      typeof session.customer_details?.name === 'string'
        ? session.customer_details.name.split(' ')[0]
        : ''

    sendDepositConfirmation(email, firstName).catch((err) =>
      console.error('[stripe webhook] Confirmation email failed:', err),
    )
  }

  return NextResponse.json({ ok: true })
}
