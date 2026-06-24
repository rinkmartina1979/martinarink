/**
 * Single source of truth for programme pricing.
 * Import from here — never hardcode fees in components.
 */

export const DEPOSIT = 350;

export const PROGRAMME_FEES: Record<string, { total: number; label: string }> = {
  "sober-muse": { total: 5000, label: "The Sober Muse Method" },
  empowerment: { total: 7500, label: "Female Empowerment & Leadership" },
  consultation: { total: 350, label: "Private Consultation" },
};

export function getBalance(programmeKey: string): number {
  const fee = PROGRAMME_FEES[programmeKey];
  if (!fee) return 0;
  return fee.total - DEPOSIT;
}

export function formatEur(amount: number): string {
  return `€${amount.toLocaleString("de-DE")}`;
}
