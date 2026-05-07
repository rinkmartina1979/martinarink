/**
 * HMAC-SHA256 member token system.
 *
 * Env var required: MEMBERS_TOKEN_SECRET (32+ chars)
 *
 * Token format: base64url(JSON payload) + '.' + hmac_hex
 * No expiry — Martina rotates MEMBERS_TOKEN_SECRET to revoke all tokens at once.
 */

import crypto from 'node:crypto'

export interface MemberTokenPayload {
  clientId: string
  scope: 'all' | 'audio' | 'milestones'
  iat: number // issued at (unix seconds)
  v: number   // version — v=1 for this scheme
}

function base64urlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function base64urlDecode(str: string): string {
  // Re-pad to standard base64
  const padded = str + '='.repeat((4 - (str.length % 4)) % 4)
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
}

function hmac(secret: string, data: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

export function generateMemberToken(
  clientId: string,
  scope: MemberTokenPayload['scope'] = 'all',
): string {
  const secret = process.env.MEMBERS_TOKEN_SECRET
  if (!secret) throw new Error('MEMBERS_TOKEN_SECRET is not set')

  const payload: MemberTokenPayload = {
    clientId,
    scope,
    iat: Math.floor(Date.now() / 1000),
    v: 1,
  }

  const encoded = base64urlEncode(JSON.stringify(payload))
  const sig = hmac(secret, encoded)
  return `${encoded}.${sig}`
}

export function verifyMemberToken(token: string): MemberTokenPayload | null {
  const secret = process.env.MEMBERS_TOKEN_SECRET
  if (!secret) return null

  const dotIndex = token.lastIndexOf('.')
  if (dotIndex === -1) return null

  const encoded = token.slice(0, dotIndex)
  const signature = token.slice(dotIndex + 1)

  const expected = hmac(secret, encoded)

  try {
    if (
      !crypto.timingSafeEqual(
        Buffer.from(expected, 'hex'),
        Buffer.from(signature, 'hex'),
      )
    ) {
      return null
    }
  } catch {
    return null
  }

  try {
    const payload = JSON.parse(base64urlDecode(encoded)) as MemberTokenPayload
    if (payload.v !== 1) return null
    return payload
  } catch {
    return null
  }
}

export function generateTokenEmail(clientId: string, baseUrl: string): string {
  const token = generateMemberToken(clientId, 'all')
  return `${baseUrl.replace(/\/$/, '')}/members/${token}`
}
