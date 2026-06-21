/**
 * POST /api/members/send-link
 *
 * Martina-only endpoint. Generates a member portal link for a client,
 * sends it via Resend, and records the token issuance time in Sanity.
 *
 * Called from Sanity Studio action or manually via curl.
 * Body: { clientId: string, adminSecret: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateMemberToken } from '@/lib/members/token'
import { portalInvitationEmail } from '@/lib/email-templates'
import { client as sanityClient } from '@/sanity/lib/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PROGRAMME_LABELS: Record<string, string> = {
  'sober-muse': 'The Sober Muse Method',
  empowerment: 'Female Empowerment & Leadership',
  consultation: 'Private Consultation',
}

interface ClientRecord {
  _id: string
  firstName: string
  email: string
  clientId: string
  programme: string | null
}

export async function POST(req: NextRequest) {
  const adminSecret = process.env.MEMBERS_ADMIN_SECRET
  if (!adminSecret) {
    return NextResponse.json(
      { error: 'Members admin secret not configured' },
      { status: 503 },
    )
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json(
      { error: 'Resend API key not configured' },
      { status: 503 },
    )
  }

  let body: { clientId?: string; adminSecret?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (body.adminSecret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { clientId } = body
  if (!clientId || typeof clientId !== 'string') {
    return NextResponse.json({ error: 'clientId is required' }, { status: 400 })
  }

  // Fetch the client record — email + firstName needed for the email
  let clientRecord: ClientRecord | null
  try {
    clientRecord = await sanityClient.fetch<ClientRecord | null>(
      `*[_type == "clientProfile" && clientId == $clientId][0] {
        _id, firstName, email, clientId, programme
      }`,
      { clientId },
    )
  } catch (err) {
    console.error('[send-link] Sanity fetch failed:', err)
    return NextResponse.json({ error: 'Failed to fetch client record' }, { status: 502 })
  }

  if (!clientRecord) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  // Fix: parentheses required — without them || binds before ?: and baseUrl
  // resolves to https://{VERCEL_URL} even when NEXT_PUBLIC_SITE_URL is set.
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://martinarink.com')

  let token: string
  try {
    token = generateMemberToken(clientRecord.clientId, 'all')
  } catch (err) {
    console.error('[send-link] Token generation failed:', err)
    return NextResponse.json(
      { error: 'Token generation failed — check MEMBERS_TOKEN_SECRET' },
      { status: 503 },
    )
  }

  const portalUrl = `${baseUrl}/members/${token}`
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'contact@martinarink.com'
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL ?? process.env.RESEND_REPLY_TO
  const firstName = clientRecord.firstName
  const programmeLabel =
    PROGRAMME_LABELS[clientRecord.programme ?? ''] ?? 'Private Coaching Programme'

  const { subject, html } = portalInvitationEmail({ firstName, programmeLabel, portalUrl })

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: `Martina Rink <${fromEmail}>`,
        to: [clientRecord.email],
        reply_to: notifyEmail ?? fromEmail,
        ...(notifyEmail && { bcc: [notifyEmail] }),
        subject,
        html,
      }),
    })

    if (!resendRes.ok) {
      const errText = await resendRes.text()
      console.error('[send-link] Resend error:', resendRes.status, errText)
      return NextResponse.json(
        { error: `Failed to send email: HTTP ${resendRes.status}` },
        { status: 502 },
      )
    }
  } catch (err) {
    console.error('[send-link] Resend network error:', err)
    return NextResponse.json({ error: 'Email send failed' }, { status: 502 })
  }

  // Record token issuance time in Sanity (fire-and-forget, non-blocking for response)
  sanityClient
    .patch(clientRecord._id)
    .set({ tokenIssuedAt: new Date().toISOString() })
    .commit()
    .catch((err: unknown) => console.error('[send-link] Sanity patch failed:', err))

  return NextResponse.json({ ok: true, email: clientRecord.email })
}
