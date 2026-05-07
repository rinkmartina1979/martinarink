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
import { generateTokenEmail } from '@/lib/members/token'
import { client as sanityClient } from '@/sanity/lib/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ClientRecord {
  _id: string
  firstName: string
  email: string
  clientId: string
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
        _id, firstName, email, clientId
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

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://martinarink.com'

  let portalUrl: string
  try {
    portalUrl = generateTokenEmail(clientRecord.clientId, baseUrl)
  } catch (err) {
    console.error('[send-link] Token generation failed:', err)
    return NextResponse.json(
      { error: 'Token generation failed — check MEMBERS_TOKEN_SECRET' },
      { status: 503 },
    )
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@martinarink.com'
  const firstName = clientRecord.firstName

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#F7F3EE;padding:48px 40px;color:#1E1B17;">
      <p style="font-size:17px;line-height:1.7;margin:0 0 24px;">
        ${firstName},
      </p>
      <p style="font-size:17px;line-height:1.7;margin:0 0 24px;color:#4A3728;">
        Your private space is ready.
      </p>
      <p style="font-size:17px;line-height:1.7;margin:0 0 32px;color:#4A3728;">
        You'll find your audio drops, milestones, and everything we've been building
        together — all in one place, accessible only to you.
      </p>
      <a
        href="${portalUrl}"
        style="display:inline-block;background:#5C2D8E;color:#F7F3EE;font-family:Georgia,serif;font-size:15px;letter-spacing:0.06em;text-decoration:none;padding:14px 32px;border-radius:1px;"
      >
        OPEN YOUR PORTAL
      </a>
      <p style="font-size:13px;line-height:1.6;margin:40px 0 0;color:#8A7F72;">
        This link is personal — it signs you in automatically. Please don't share it.
        If you ever need a new link, write to me directly.
      </p>
      <hr style="border:none;border-top:1px solid #C8B8A2;margin:32px 0;" />
      <p style="font-size:13px;color:#8A7F72;margin:0;">
        Martina Rink &nbsp;·&nbsp; martinarink.com
      </p>
    </div>
  `

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [clientRecord.email],
        subject: 'Your private portal',
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
