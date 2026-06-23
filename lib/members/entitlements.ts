/**
 * Server-only entitlement derivation.
 *
 * SECURITY INVARIANT: portalStage is a display label and MUST NOT gate access.
 * Access is derived exclusively from verified payment fields and adminAccessOverride.
 * Payment fields are written only by verified Stripe webhooks or Martina in Studio.
 */

export interface ClientEntitlementFields {
  depositPaidAt?: string | null
  finalFeePaidAt?: string | null
  programmeActiveAt?: string | null
  programmeCompletedAt?: string | null
  accessSuspendedAt?: string | null
  adminAccessOverride?: boolean | null
  manualDepositPaidAt?: string | null
  manualFinalFeePaidAt?: string | null
}

export interface EntitlementResult {
  /** True if accessSuspendedAt is set — overrides all other access. */
  suspended: boolean
  /** Portal shell is accessible (deposit received or admin override). */
  portalAccess: boolean
  /** Programme content accessible (programme started, final fee paid, or admin override). */
  programmeAccess: boolean
  /** Programme has concluded. */
  completed: boolean
}

export function deriveEntitlement(profile: ClientEntitlementFields): EntitlementResult {
  const suspended = !!profile.accessSuspendedAt

  const portalAccess =
    !suspended &&
    !!(profile.depositPaidAt || profile.manualDepositPaidAt || profile.adminAccessOverride)

  const programmeAccess =
    !suspended &&
    !!(
      profile.programmeActiveAt ||
      profile.finalFeePaidAt ||
      profile.manualFinalFeePaidAt ||
      profile.adminAccessOverride
    )

  const completed = !!profile.programmeCompletedAt

  return { suspended, portalAccess, programmeAccess, completed }
}

/**
 * Returns true when the client is entitled to the given area.
 * Throws never — callers gate UI rather than 403.
 */
export function assertEntitled(
  profile: ClientEntitlementFields,
  area: 'portal' | 'programme',
): boolean {
  const e = deriveEntitlement(profile)
  if (area === 'portal') return e.portalAccess
  if (area === 'programme') return e.programmeAccess
  return false
}
