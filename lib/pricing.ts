/**
 * Single source of truth for programme pricing.
 *
 * Variants map 1:1 to the Stripe products Martina has created.
 * The `programme` field on clientProfile is the broad routing key (sober-muse / empowerment).
 * The `programmeVariant` field on clientProfile is the specific tier (sober-muse-3m, etc.)
 * and must be set by Martina in Sanity Studio when onboarding each client.
 *
 * Never hardcode fees in components — always import from here.
 */

export const DEPOSIT = 350;

export const PROGRAMME_VARIANTS = {
  // ── Sober Muse ────────────────────────────────────────────────
  "sober-muse-3m": {
    stripeProductId: "prod_UkL2KZuZkSRi3O",
    programme: "sober-muse" as const,
    label: "The Sober Muse Method",
    sublabel: "3 months · Weekdays",
    total: 5_000,
    durationMonths: 3,
  },
  "sober-muse-6m-weekdays": {
    stripeProductId: "prod_UkL6o1RqoNWPP1",
    programme: "sober-muse" as const,
    label: "The Sober Muse Method",
    sublabel: "6 months · Weekdays",
    total: 10_000,
    durationMonths: 6,
  },
  "sober-muse-6m-7days": {
    stripeProductId: "prod_UkLBoJeV2c49SL",
    programme: "sober-muse" as const,
    label: "The Sober Muse Method",
    sublabel: "6 months · 7 days",
    total: 13_000,
    durationMonths: 6,
  },
  // ── Female Empowerment ─────────────────────────────────────────
  "empowerment-3m": {
    stripeProductId: "prod_UkLE49hFhgk0yD",
    programme: "empowerment" as const,
    label: "Female Empowerment & Leadership",
    sublabel: "3 months",
    total: 7_000,
    durationMonths: 3,
  },
  "empowerment-6m": {
    stripeProductId: "prod_UkLFckceYNEYBt",
    programme: "empowerment" as const,
    label: "Female Empowerment & Leadership",
    sublabel: "6 months",
    total: 14_000,
    durationMonths: 6,
  },
  // ── Consultation (standalone) ──────────────────────────────────
  consultation: {
    stripeProductId: null,
    programme: "consultation" as const,
    label: "Private Consultation",
    sublabel: null,
    total: 350,
    durationMonths: null,
  },
} as const;

export type ProgrammeVariantKey = keyof typeof PROGRAMME_VARIANTS;
export type ProgrammeVariant = (typeof PROGRAMME_VARIANTS)[ProgrammeVariantKey];

/** All variant keys as a readonly tuple — use for Sanity enum + zod validation. */
export const PROGRAMME_VARIANT_KEYS = Object.keys(
  PROGRAMME_VARIANTS,
) as ProgrammeVariantKey[];

/** Look up a variant by its key. Returns null if the key is unknown. */
export function getVariant(
  variantKey: string | null | undefined,
): ProgrammeVariant | null {
  if (!variantKey) return null;
  return (PROGRAMME_VARIANTS as Record<string, ProgrammeVariant>)[variantKey] ?? null;
}

/**
 * Look up a variant by Stripe product ID.
 * Used in webhook handlers to resolve which product was purchased.
 */
export function getVariantByProductId(
  productId: string | null | undefined,
): ProgrammeVariant | null {
  if (!productId) return null;
  for (const v of Object.values(PROGRAMME_VARIANTS) as ProgrammeVariant[]) {
    if (v.stripeProductId === productId) return v;
  }
  return null;
}

/**
 * Fallback: resolve the base (cheapest) variant for a broad programme key.
 * Used when a client record predates the programmeVariant field.
 */
export function getVariantByProgramme(
  programme: string | null | undefined,
): ProgrammeVariant | null {
  if (!programme) return null;
  for (const v of Object.values(PROGRAMME_VARIANTS) as ProgrammeVariant[]) {
    if (v.programme === programme) return v;
  }
  return null;
}

/** Balance = total − deposit (0 for consultation-only). */
export function getBalance(variant: ProgrammeVariant): number {
  return Math.max(0, variant.total - DEPOSIT);
}

/** Formatted euro string in German locale (€5.000, €13.000). */
export function formatEur(amount: number): string {
  return `€${amount.toLocaleString("de-DE")}`;
}

// ── Legacy map (backwards compat for any code that still calls PROGRAMME_FEES) ──
// Use getVariant() for new code.
export const PROGRAMME_FEES: Record<string, { total: number; label: string }> = {
  "sober-muse": { total: 5_000, label: "The Sober Muse Method" },
  empowerment: { total: 7_000, label: "Female Empowerment & Leadership" },
  consultation: { total: 350, label: "Private Consultation" },
};
