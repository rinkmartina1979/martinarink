/**
 * POST /api/members/billing-portal
 *
 * Creates a Stripe Customer Portal session for the authenticated member.
 * Returns { url } — caller redirects to it.
 *
 * Auth: token in request body (same pattern as session-request).
 * The Stripe Customer Portal URL is a short-lived session — never cache it.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyMemberToken } from '@/lib/members/token'
import { getClientByToken } from '@/sanity/lib/membersQueries'
import { stripe, hasStripe } from '@/lib/stripe'
import { deriveEntitlement } from '@/lib/members/entitlements'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!hasStripe(stripe)) {
    return NextResponse.json({ error: 'Billing not configured' }, { status: 503 })
  }

  let body: { token?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { token } = body
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  const payload = verifyMemberToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  const client = await getClientByToken(payload.clientId)
  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  // Revocation check
  if (client.revokedAt) {
    return NextResponse.json({ error: 'Access revoked' }, { status: 401 })
  }
  if ((payload.tv ?? 1) < (client.tokenVersion ?? 1)) {
    return NextResponse.json({ error: 'Token superseded' }, { status: 401 })
  }

  // Entitlement — must have portal access at minimum
  const entitlement = deriveEntitlement(client)
  if (!entitlement.portalAccess) {
    return NextResponse.json({ error: 'No billing access — deposit not confirmed' }, { status: 403 })
  }

  if (!client.stripeCustomerId) {
    return NextResponse.json({ error: 'No billing record found — contact Martina' }, { status: 404 })
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://martinarink.com'

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: client.stripeCustomerId,
      return_url: `${origin}/members/${token}/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err) {
    console.error('[billing-portal] Stripe error:', err)
    return NextResponse.json({ error: 'Could not create billing session' }, { status: 502 })
  }
}
