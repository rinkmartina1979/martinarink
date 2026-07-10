/**
 * POST /api/webhooks/stripe
 *
 * Handles Stripe webhook events.
 *
 * Events handled:
 *   - checkout.session.completed (deposit)              → sets depositPaidAt + stripeCustomerId
 *   - checkout.session.completed (programme-balance)    → sets finalFeePaidAt + programmeActiveAt + programmeVariant,
 *                                                          sends "your programme begins" confirmation email
 *   - checkout.session.completed (subscription mode)    → no-op, handled via invoice.paid below
 *   - invoice.paid (subscription metadata=instalment)   → increments instalmentsPaid; programmeActiveAt +
 *                                                          confirmation email on 1st, finalFeePaidAt +
 *                                                          subscription cancel on last
 *   - invoice.paid (type=final_fee)                     → sets finalFeePaidAt on clientProfile
 *
 * Pattern: fast 2xx immediately, then waitUntil for side effects (Brevo, Resend, Sanity).
 * All Sanity writes are idempotent (setIfMissing for paid timestamps).
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { waitUntil } from '@vercel/functions'
import { trackBrevoEvent, addBrevoContact } from '@/lib/brevo'
import { writeClient, hasWriteClient } from '@/sanity/lib/writeClient'
import { paymentFailedNotification } from '@/lib/email-templates'
import { stripe as stripeSingleton, hasStripe } from '@/lib/stripe'
import { getVariant } from '@/lib/pricing'

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
        You can choose a time now from the confirmation page, or come back to
        it whenever suits you. The deposit will be credited toward your
        programme should you choose to continue.
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

async function sendProgrammeConfirmation(
  email: string,
  firstName: string,
  variantLabel: string | null,
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
        Your payment${variantLabel ? ` for ${variantLabel}` : ''} has been received. Your programme begins now.
      </p>
      <p style="font-size:17px;line-height:1.7;margin:0 0 24px;color:#4A3728;">
        You will hear from me directly within 48 hours with how our first weeks
        together will run. In the meantime, your foundation workbook is open
        in your portal whenever you are ready to begin.
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
        subject: 'Your programme begins',
        html,
      }),
    })
  } catch (err) {
    console.error('[stripe webhook] Programme confirmation Resend failed:', err)
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

/**
 * Programme balance paid via self-serve portal checkout
 * (checkout.session.completed with metadata.type === "programme-balance").
 *
 * This is the ONLY place a client's self-selection turns into programme access:
 * we set finalFeePaidAt + programmeActiveAt (idempotent via setIfMissing) and
 * record the variant. Lookup is by clientId from the session metadata — the most
 * reliable key, since the token-authed checkout route stamped it.
 */
async function patchProgrammeBalancePaid(
  clientId: string,
  variantKey: string | null,
  stripeCustomerId: string | null,
  paidAt: string,
): Promise<void> {
  if (!hasWriteClient(writeClient)) return
  try {
    const profile = await writeClient.fetch<{ _id: string; email: string | null; firstName: string | null } | null>(
      `*[_type == "clientProfile" && clientId == $clientId][0] { _id, email, firstName }`,
      { clientId },
    )
    if (!profile) {
      console.warn('[stripe webhook] No clientProfile found for programme-balance clientId:', clientId)
      return
    }
    const patch = writeClient
      .patch(profile._id)
      .setIfMissing({ finalFeePaidAt: paidAt, programmeActiveAt: paidAt })
    if (variantKey) patch.set({ programmeVariant: variantKey })
    if (stripeCustomerId) patch.setIfMissing({ stripeCustomerId })
    await patch.commit()

    if (profile.email) {
      await sendProgrammeConfirmation(
        profile.email,
        profile.firstName ?? '',
        getVariant(variantKey)?.label ?? null,
      )
    }
  } catch (err) {
    console.error('[stripe webhook] Sanity programme-balance patch failed:', err)
  }
}

/**
 * Programme balance paid in 3 monthly instalments via Stripe subscription
 * (invoice.paid with subscription metadata.type === "programme-instalment").
 *
 * Grants programmeActiveAt on the FIRST paid instalment (that immediacy is
 * what makes instalments convert). Sets finalFeePaidAt only once the last
 * instalment lands, then cancels the subscription server-side so it never
 * attempts a 4th charge. Idempotent by invoice ID — Stripe may retry the
 * same invoice.paid event, and a replayed final invoice must not re-cancel
 * an already-cancelled subscription or double-count instalmentsPaid.
 */
async function patchInstalmentPaid(
  clientId: string,
  variantKey: string | null,
  subscriptionId: string,
  invoiceId: string,
  totalInstalments: number,
  paidAt: string,
): Promise<void> {
  if (!hasWriteClient(writeClient)) return
  try {
    const profile = await writeClient.fetch<{
      _id: string
      instalmentsPaid: number | null
      instalmentInvoiceIds: string[] | null
      email: string | null
      firstName: string | null
    } | null>(
      `*[_type == "clientProfile" && clientId == $clientId][0] {
        _id, instalmentsPaid, instalmentInvoiceIds, email, firstName
      }`,
      { clientId },
    )
    if (!profile) {
      console.warn('[stripe webhook] No clientProfile found for instalment clientId:', clientId)
      return
    }

    // Idempotency — Stripe may retry the same invoice.paid event.
    if ((profile.instalmentInvoiceIds ?? []).includes(invoiceId)) {
      return
    }

    const paidCountAfterThis = (profile.instalmentsPaid ?? 0) + 1
    const isFirst = paidCountAfterThis === 1
    const isFinal = paidCountAfterThis >= totalInstalments

    let patch = writeClient
      .patch(profile._id)
      .setIfMissing({ instalmentsPaid: 0, instalmentInvoiceIds: [] })
      .inc({ instalmentsPaid: 1 })
      .insert('after', 'instalmentInvoiceIds[-1]', [invoiceId])
      .set({ stripeSubscriptionId: subscriptionId })

    if (isFirst) {
      patch = patch.setIfMissing({ programmeActiveAt: paidAt })
      if (variantKey) patch = patch.set({ programmeVariant: variantKey })
    }
    if (isFinal) {
      patch = patch.setIfMissing({ finalFeePaidAt: paidAt })
    }

    await patch.commit()

    if (isFirst && profile.email) {
      await sendProgrammeConfirmation(
        profile.email,
        profile.firstName ?? '',
        getVariant(variantKey)?.label ?? null,
      )
    }

    if (isFinal && hasStripe(stripeSingleton)) {
      try {
        await stripeSingleton.subscriptions.update(subscriptionId, { cancel_at_period_end: true })
      } catch (err) {
        console.error('[stripe webhook] Failed to cancel completed instalment subscription:', err)
      }
    }
  } catch (err) {
    console.error('[stripe webhook] Sanity instalment patch failed:', err)
  }
}

async function sendPaymentFailedNotification(
  customerEmail: string,
  amountDue: string,
  invoiceId: string,
  invoiceUrl: string | null,
  failureReason: string | null,
  attemptCount: number,
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'contact@martinarink.com'
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || fromEmail
  if (!resendKey) return

  const { subject, html } = paymentFailedNotification({
    customerEmail,
    amountDue,
    invoiceId,
    invoiceUrl,
    failureReason,
    attemptCount,
  })

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: `Martina Rink <${fromEmail}>`,
        to: [notifyEmail],
        subject,
        html,
      }),
    })
  } catch (err) {
    console.error('[stripe webhook] Payment-failed Resend notification error:', err)
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

  // ── checkout.session.completed ────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Subscription-mode sessions (the instalment plan) are handled entirely via
    // invoice.paid events below — the instalment metadata lives on
    // subscription_data.metadata, not session.metadata, and there is no deposit
    // to record here. Without this guard, an instalment purchase would fall
    // through into the one-time "consultation deposit" branch and incorrectly
    // fire deposit-paid side effects for what is actually a programme balance.
    if (session.mode === 'subscription') {
      return NextResponse.json({ ok: true, skipped: 'subscription_mode_handled_via_invoice_paid' })
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ ok: true, skipped: 'not_paid' })
    }

    // ── Programme balance (self-serve portal checkout) → grants programme access
    if (session.metadata?.type === 'programme-balance') {
      const clientId = session.metadata?.clientId ?? ''
      const variantKey = session.metadata?.variantKey ?? null
      const stripeCustomerId =
        typeof session.customer === 'string' ? session.customer : null
      const paidAt = new Date().toISOString()

      if (!clientId) {
        console.warn('[stripe webhook] programme-balance session missing clientId:', session.id)
        return NextResponse.json({ ok: true, skipped: 'no_client_id' })
      }

      waitUntil(
        patchProgrammeBalancePaid(clientId, variantKey, stripeCustomerId, paidAt).catch((err) =>
          console.error('[stripe webhook] programme-balance patch failed:', err),
        ),
      )

      return NextResponse.json({ ok: true, handled: 'programme-balance' })
    }

    // ── Otherwise: consultation deposit ───────────────────────────
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

  // ── invoice.paid → instalment or final fee ────────────────────
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice

    // Instalment plan — subscription metadata was stamped at checkout creation
    // (see app/api/checkout/programme/route.ts). Stripe snapshots subscription
    // metadata onto invoice.parent.subscription_details as of invoice finalization
    // (confirmed against the installed SDK's Invoice.Parent.SubscriptionDetails type —
    // there is no top-level invoice.subscription_details field).
    const subscriptionDetails = invoice.parent?.subscription_details
    const subscriptionMeta = subscriptionDetails?.metadata as
      | { type?: string; clientId?: string; variantKey?: string; totalInstalments?: string }
      | null
      | undefined

    if (subscriptionMeta?.type === 'programme-instalment') {
      const subscriptionId =
        typeof subscriptionDetails?.subscription === 'string'
          ? subscriptionDetails.subscription
          : subscriptionDetails?.subscription?.id ?? null
      const clientId = subscriptionMeta.clientId ?? ''
      const variantKey = subscriptionMeta.variantKey ?? null
      const totalInstalments = parseInt(subscriptionMeta.totalInstalments ?? '3', 10)
      const paidAt = new Date().toISOString()

      if (!clientId || !subscriptionId) {
        console.warn('[stripe webhook] instalment invoice missing clientId/subscriptionId:', invoice.id)
        return NextResponse.json({ ok: true, skipped: 'no_client_or_subscription' })
      }

      waitUntil(
        patchInstalmentPaid(clientId, variantKey, subscriptionId, invoice.id, totalInstalments, paidAt).catch(
          (err) => console.error('[stripe webhook] instalment patch failed:', err),
        ),
      )

      return NextResponse.json({ ok: true, handled: 'programme-instalment' })
    }

    // Only process invoices explicitly tagged type=final_fee in Stripe metadata.
    // Martina must set this when creating the final-fee invoice in the Stripe dashboard.
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
  // Never auto-suspend a client. Suspensions are a human decision.
  // This fires one internal email to Martina so she can follow up.
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const customerEmail = invoice.customer_email ?? 'unknown'
    const amountDue = invoice.amount_due
      ? `€${(invoice.amount_due / 100).toLocaleString('en-DE', { minimumFractionDigits: 2 })}`
      : 'unknown amount'
    const failureReason =
      (invoice as Stripe.Invoice & { last_finalization_error?: { message?: string } })
        .last_finalization_error?.message ?? null
    const invoiceUrl = invoice.hosted_invoice_url ?? null
    const attemptCount = invoice.attempt_count ?? 1

    console.warn(
      `[stripe webhook] invoice.payment_failed — ${customerEmail} — ${amountDue} — ${invoice.id}`,
    )

    waitUntil(
      sendPaymentFailedNotification(
        customerEmail,
        amountDue,
        invoice.id,
        invoiceUrl,
        failureReason,
        attemptCount,
      ).catch((err) =>
        console.error('[stripe webhook] Payment-failed notification failed:', err),
      ),
    )
  }

  return NextResponse.json({ ok: true })
}
