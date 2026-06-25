/**
 * POST /api/members/verify
 *
 * Verifies a member token and returns basic client info for the portal.
 * Always returns 200 — the UI handles invalid/expired states.
 * Completed clients receive a distinct message so the UI can show an archived view.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyMemberToken } from '@/lib/members/token'
import { getClientByToken } from '@/sanity/lib/membersQueries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  let body: { token?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ valid: false, reason: 'Invalid request body' })
  }

  const { token } = body
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ valid: false, reason: 'Token is required' })
  }

  const payload = verifyMemberToken(token)
  if (!payload) {
    return NextResponse.json({ valid: false, reason: 'Invalid token' })
  }

  const client = await getClientByToken(payload.clientId)
  if (!client) {
    return NextResponse.json({ valid: false, reason: 'Client record not found' })
  }

  if (client.status === 'completed') {
    return NextResponse.json({
      valid: false,
      reason: 'archived',
      firstName: client.firstName,
    })
  }

  // Revocation: blocked if access revoked or the link is an older token version.
  if (client.revokedAt) {
    return NextResponse.json({ valid: false, reason: 'revoked' })
  }
  if ((payload.tv ?? 1) < (client.tokenVersion ?? 1)) {
    return NextResponse.json({ valid: false, reason: 'superseded' })
  }

  return NextResponse.json({
    valid: true,
    clientId: payload.clientId,
    firstName: client.firstName,
    programme: client.programme,
    programmeVariant: client.programmeVariant ?? null,
    archetype: client.archetype,
    enrolledAt: client.enrolledAt ?? null,
    expectedCompletionAt: client.expectedCompletionAt ?? null,
    portalStage: client.portalStage ?? null,
    nextStepTitle: client.nextStepTitle ?? null,
    nextStepDescription: client.nextStepDescription ?? null,
    nextStepCtaLabel: client.nextStepCtaLabel ?? null,
    nextStepHref: client.nextStepHref ?? null,
    nextStepDueAt: client.nextStepDueAt ?? null,
    // Entitlement fields — used server-side by billing page; never gate access on these alone
    depositPaidAt: client.depositPaidAt ?? null,
    manualDepositPaidAt: client.manualDepositPaidAt ?? null,
    finalFeeDueAt: client.finalFeeDueAt ?? null,
    finalFeePaidAt: client.finalFeePaidAt ?? null,
    manualFinalFeePaidAt: client.manualFinalFeePaidAt ?? null,
    programmeActiveAt: client.programmeActiveAt ?? null,
    programmeCompletedAt: client.programmeCompletedAt ?? null,
    accessSuspendedAt: client.accessSuspendedAt ?? null,
    adminAccessOverride: client.adminAccessOverride ?? null,
    // stripeCustomerId is NOT returned — used server-side only
  })
}
