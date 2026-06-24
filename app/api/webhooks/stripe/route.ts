/**
 * POST /api/webhooks/stripe
 *
 * Handles Stripe webhook events.
 *
 * Events handled:
 *   - checkout.session.completed → sets depositPaidAt + stripeCustomerId on clientProfile
 *   - invoice.paid              → sets finalFeePaidAt on clientProfile
 *
 * Pattern: fast 2xx immediately, then waitUntil for side effects (Brevo, Resend, Sanity).
 * All Sanity writes are idempotent (setIfMissing for paid timestamps).
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { waitUntil } from '@vercel/functions'
import { trackBrevoEvent, addBrevoContact } from '@/lib/brevo'
import { writeClient, hasWriteClient } from '@/sanity/lib/writeClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function sendDepositConfirmation(
  email: string,
  firstName: string,
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'contact@martinarink.com'
  const archiveEmail = process.env.RESEND_NOTIFY_EMAIL || process.env.RESEND_REPLY_TO
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
        from: `Martina Rink <${fromEmail}>`,
        to: [email],
        ...(archiveEmail && { bcc: [archiveEmail] }),
        subject: 'Deposit received — consultation confirmed',
        html,
      }),
    })
  } catch (err) {
    console.error('[stripe webhook] Resend confirmation failed:', err)
  }
}

/**
 * Patch depositPaidAt + stripeCustomerId on the clientProfile that matches
 * this email. Uses setIfMissing so repeated events are safe.
 */
async function patchDepositPaid(
  email: string,
  stripeCustomerId: string | null,
  paidAt: string,
): Promise<void> {
  if (!hasWriteClient(writeClient)) return
  try {
    const profile = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "clientProfile" && email == $email][0] { _id }`,
      { email },
    )
    if (!profile) {
      console.warn('[stripe webhook] No clientProfile found for email:', email)
      return
    }
    const patch = writeClient.patch(profile._id).setIfMissing({ depositPaidAt: paidAt })
    if (stripeCustomerId) patch.setIfMissing({ stripeCustomerId })
    await patch.commit()
  } catch (err) {
    console.error('[stripe webhook] Sanity deposit patch failed:', err)
  }
}

/**
 * Patch finalFeePaidAt on the clientProfile whose stripeCustomerId matches.
 * Falls back to email lookup if customer metadata is available.
 */
async function patchFinalFeePaid(
  stripeCustomerId: string | null,
  customerEmail: string | null,
  paidAt: string,
): Promise<void> {
  if (!hasWriteClient(writeClient)) return
  try {
    let profile: { _id: string } | null = null

    if (stripeCustomerId) {
      profile = await writeClient.fetch<{ _id: string } | null>(
        `*[_type == "clientProfile" && stripeCustomerId == $cid][0] { _id }`,
        { cid: stripeCustomerId },
      )
    }
    if (!profile && customerEmail) {
      profile = await writeClient.fetch<{ _id: string } | null>(
        `*[_type == "clientProfile" && email == $email][0] { _id }`,
        { email: customerEmail },
      )
    }
    if (!profile) {
      console.warn('[stripe webhook] No clientProfile found for final-fee invoice')
      return
    }
    await writeClient.patch(profile._id).setIfMissing({ finalFeePaidAt: paidAt }).commit()
  } catch (err) {
    console.error('[stripe webhook] Sanity final-fee patch failed:', err)
  }
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY not configured' }, { status: 503 })
  }
  if (!webhookSecret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET not configured' }, { status: 503 })
  }

  const stripeClient = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' })

  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripeClient.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.warn('[stripe webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // ── checkout.session.completed → deposit paid ─────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ ok: true, skipped: 'not_paid' })
    }

    let email =
      session.customer_details?.email ??
      session.customer_email ??
      ''

    const stripeCustomerId =
      typeof session.customer === 'string' ? session.customer : null

    if (!email && stripeCustomerId) {
      try {
        const customer = await stripeClient.customers.retrieve(stripeCustomerId)
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
    const depositPaidAt = new Date().toISOString()

    const firstName =
      typeof session.customer_details?.name === 'string'
        ? session.customer_details.name.split(' ')[0]
        : ''

    waitUntil(
      patchDepositPaid(email, stripeCustomerId, depositPaidAt).catch((err) =>
        console.error('[stripe webhook] Sanity patch failed:', err),
      ),
    )

    waitUntil(
      trackBrevoEvent({
        email,
        eventName: 'consultation_deposit_paid',
        properties: { programme, amount: session.amount_total ? session.amount_total / 100 : 0 },
        contactProperties: {
          DEPOSIT_PAID: true,
          DEPOSIT_PAID_AT: depositPaidAt,
        },
      }).catch((err) => console.error('[stripe webhook] Brevo event failed:', err)),
    )

    waitUntil(
      addBrevoContact({
        email,
        attributes: {
          DEPOSIT_PAID: true,
          DEPOSIT_PAID_AT: depositPaidAt,
        },
        updateEnabled: true,
      }).catch((err) => console.error('[stripe webhook] Brevo contact update failed:', err)),
    )

    waitUntil(
      sendDepositConfirmation(email, firstName).catch((err) =>
        console.error('[stripe webhook] Confirmation email failed:', err),
      ),
    )
  }

  // ── invoice.paid → final fee paid ────────────────────────────
  // Only process invoices explicitly tagged type=final_fee in Stripe metadata.
  // Martina must set this when creating the final-fee invoice in the Stripe dashboard.
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice

    if ((invoice.metadata as Record<string, string> | null)?.type !== 'final_fee') {
      return NextResponse.json({ ok: true, skipped: 'not_final_fee' })
    }

    const stripeCustomerId =
      typeof invoice.customer === 'string' ? invoice.customer : null
    const customerEmail = invoice.customer_email ?? null
    const finalFeePaidAt = new Date().toISOString()

    // Idempotency: Stripe may retry events. patchFinalFeePaid uses setIfMissing
    // so repeated calls for the same invoice are safe.
    waitUntil(
      patchFinalFeePaid(stripeCustomerId, customerEmail, finalFeePaidAt).catch((err) =>
        console.error('[stripe webhook] Final-fee patch failed:', err),
      ),
    )
  }

  // ── invoice.payment_failed → notify Martina only ──────────────
  // Never auto-suspend a client on a failed payment. Suspensions are a human
  // decision. This event logs a warning so Martina can follow up manually.
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const customerEmail = invoice.customer_email ?? 'unknown'
    const amount = invoice.amount_due ? `€${(invoice.amount_due / 100).toFixed(2)}` : 'unknown amount'
    console.warn(
      `[stripe webhook] invoice.payment_failed — ${customerEmail} — ${amount} — invoice ${invoice.id}`,
    )
    // TODO P3b: send Resend notification to contact@martinarink.com with invoice link.
    // No portal change here — Martina decides next step.
  }

  return NextResponse.json({ ok: true })
}
