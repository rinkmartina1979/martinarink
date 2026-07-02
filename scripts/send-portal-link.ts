/**
 * scripts/send-portal-link.ts
 *
 * Look up a client by email in Sanity, generate their portal token,
 * and send the portal invitation email via Resend.
 *
 * Usage:
 *   npx dotenv -e .env.local -- npx tsx scripts/send-portal-link.ts seovizeofficial@gmail.com
 */

import { createClient } from '@sanity/client'
import crypto from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Load .env.local manually — tsx doesn't auto-load it
try {
  const envPath = resolve(process.cwd(), '.env.local')
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
} catch { /* .env.local not found — rely on shell env */ }

const email = process.argv[2]
if (!email) {
  console.error('Usage: npx tsx scripts/send-portal-link.ts <email>')
  process.exit(1)
}

const sanityClient = createClient({
  projectId: (process.env.SANITY_API_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID)!,
  dataset: process.env.SANITY_API_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

function base64urlEncode(str: string): string {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function generateToken(clientId: string, tokenVersion: number): string {
  const secret = process.env.MEMBERS_TOKEN_SECRET
  if (!secret) throw new Error('MEMBERS_TOKEN_SECRET not set')
  const iat = Math.floor(Date.now() / 1000)
  const payload = { clientId, scope: 'all', iat, v: 1, exp: iat + 120 * 86400, tv: tokenVersion }
  const encoded = base64urlEncode(JSON.stringify(payload))
  const sig = crypto.createHmac('sha256', secret).update(encoded).digest('hex')
  return `${encoded}.${sig}`
}

async function sendEmail(to: string, firstName: string, portalUrl: string, programmeLabel: string) {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'contact@martinarink.com'
  if (!resendKey) throw new Error('RESEND_API_KEY not set')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({
      from: `Martina Rink <${fromEmail}>`,
      to: [to],
      reply_to: fromEmail,
      subject: 'Your private portal is ready',
      html: `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Martina Rink</title></head>
<body style="margin:0;padding:0;background:#fff;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#F7F3EE;">
  <div style="background:#231727;padding:40px 48px 36px;">
    <p style="margin:0 0 16px;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#8A7F72;">Your portal</p>
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:32px;font-weight:normal;color:#EDE8E0;line-height:1.15;">Dear Sober Muse.</h1>
  </div>
  <div style="padding:40px 48px;background:#F7F3EE;">
    <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#4A3728;">Your private portal for <strong>${programmeLabel}</strong> is ready.</p>
    <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#4A3728;">This is your personal link — bookmark it. It will work for the next 120 days.</p>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
      <tr><td style="background:#231727;padding:14px 32px;">
        <a href="${portalUrl}" style="font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:.18em;color:#F7F3EE;text-decoration:none;display:inline-block;">OPEN YOUR PORTAL</a>
      </td></tr>
    </table>
    <p style="margin:24px 0 0;font-size:13px;color:#8A7F72;">Or copy this link: <a href="${portalUrl}" style="color:#5C2D8E;word-break:break-all;">${portalUrl}</a></p>
  </div>
  <div style="padding:28px 48px 36px;background:#F7F3EE;border-top:1px solid #C8B8A2;">
    <p style="margin:0;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8A7F72;">Martina Rink — Private Mentoring</p>
    <p style="margin:6px 0 0;font-size:12px;color:#8A7F72;"><a href="https://martinarink.com" style="color:#8A7F72;text-decoration:none;">martinarink.com</a></p>
  </div>
</div></body></html>`,
    }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Resend error ${res.status}: ${txt}`)
  }
  return res.json()
}

async function main() {
  console.log(`\nLooking up client: ${email}`)

  const client = await sanityClient.fetch<{
    _id: string; clientId: string; firstName: string; email: string; programme: string | null
  } | null>(
    `*[_type == "clientProfile" && email == $email][0] { _id, clientId, firstName, email, programme }`,
    { email }
  )

  if (!client) {
    console.error(`\n✗ No clientProfile found with email: ${email}`)
    console.error('  Create the client profile in Studio first, then re-run this script.')
    process.exit(1)
  }

  console.log(`\n✓ Found client:`)
  console.log(`  Name:      ${client.firstName}`)
  console.log(`  clientId:  ${client.clientId}`)
  console.log(`  Programme: ${client.programme ?? '(not set)'}`)

  const LABELS: Record<string, string> = {
    'sober-muse': 'The Sober Muse Method',
    empowerment: 'Female Empowerment & Leadership',
    consultation: 'Private Consultation',
  }
  const programmeLabel = LABELS[client.programme ?? ''] ?? 'Private Coaching Programme'

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://martinarink.com'
  const token = generateToken(client.clientId)
  const portalUrl = `${baseUrl}/members/${token}`

  console.log(`\n✓ Portal URL generated:`)
  console.log(`  ${portalUrl}`)

  console.log(`\nSending invitation email to ${email}…`)
  await sendEmail(email, client.firstName, portalUrl, programmeLabel)

  // Record token issuance in Sanity
  await sanityClient.patch(client._id).set({ tokenIssuedAt: new Date().toISOString() }).commit()

  console.log(`\n✓ Done — portal link sent to ${email}`)
  console.log(`  The link expires in 120 days.\n`)
}

main().catch((err) => {
  console.error('\n✗ Error:', err.message)
  process.exit(1)
})
