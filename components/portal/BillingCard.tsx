import Link from "next/link";
import { deriveEntitlement, type ClientEntitlementFields } from "@/lib/members/entitlements";
import { DEPOSIT, getVariant, getVariantByProgramme } from "@/lib/pricing";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatEur(amount: number): string {
  return `€${amount.toLocaleString("de-DE")}`;
}

interface BillingCardProps {
  token: string;
  billing: ClientEntitlementFields & { finalFeeDueAt?: string | null };
  /** "summary" = compact card on dashboard; "full" = detail view on /billing */
  variant?: "summary" | "full";
  /** Broad programme key — used as fallback when programmeVariant is not set */
  programme?: string | null;
  /** Specific tier (sober-muse-3m, empowerment-6m, etc.) — takes precedence over programme */
  programmeVariant?: string | null;
}

export function BillingCard({
  token,
  billing,
  variant = "summary",
  programme,
  programmeVariant,
}: BillingCardProps) {
  const entitlement = deriveEntitlement(billing);

  const depositPaid    = !!(billing.depositPaidAt || billing.manualDepositPaidAt);
  const finalFeePaid   = !!(billing.finalFeePaidAt || billing.manualFinalFeePaidAt);
  const depositDate    = formatDate(billing.depositPaidAt ?? billing.manualDepositPaidAt ?? null);
  const finalFeeDate   = formatDate(billing.finalFeePaidAt ?? billing.manualFinalFeePaidAt ?? null);
  const finalFeeDueDate = formatDate(billing.finalFeeDueAt ?? null);

  // Prefer specific variant (set by Martina at onboarding) over broad programme key.
  const resolvedVariant = getVariant(programmeVariant) ?? getVariantByProgramme(programme);
  const programmeTotal   = resolvedVariant?.total ?? null;
  const programmeLabel   = resolvedVariant?.label ?? null;
  const programmeSublabel = resolvedVariant?.sublabel ?? null;
  // Balance = total − deposit (only relevant when total > deposit)
  const balance = programmeTotal && programmeTotal > DEPOSIT ? programmeTotal - DEPOSIT : null;
  const isConsultationOnly = resolvedVariant?.programme === "consultation" || (programmeTotal !== null && programmeTotal <= DEPOSIT);

  if (variant === "summary") {
    return (
      <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-1">Billing</p>

        {programmeLabel && (
          <p className="text-[13px] text-ink-soft mb-4 font-[family-name:var(--font-body)]">
            {programmeLabel}
            {programmeSublabel && (
              <span className="text-ink-quiet"> — {programmeSublabel}</span>
            )}
          </p>
        )}

        <div className="space-y-2 mb-4">
          {/* Deposit row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${depositPaid ? "bg-mint" : "bg-sand"}`}
              />
              <span className="text-[14px] text-ink-soft font-[family-name:var(--font-body)]">
                Deposit
                {depositPaid && depositDate ? ` — ${depositDate}` : depositPaid ? " — received" : " — pending"}
              </span>
            </div>
            <span className="text-[13px] text-ink-quiet flex-shrink-0">
              {formatEur(DEPOSIT)}
            </span>
          </div>

          {/* Final fee / balance row — only for multi-session programmes */}
          {!isConsultationOnly && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    finalFeePaid ? "bg-mint" : finalFeeDueDate ? "bg-blush" : "bg-sand"
                  }`}
                />
                <span className="text-[14px] text-ink-soft font-[family-name:var(--font-body)]">
                  {finalFeePaid
                    ? `Programme balance — received${finalFeeDate ? ` ${finalFeeDate}` : ""}`
                    : finalFeeDueDate
                    ? `Programme balance — due ${finalFeeDueDate}`
                    : "Programme balance — not yet due"}
                </span>
              </div>
              {balance !== null && (
                <span className="text-[13px] text-ink-quiet flex-shrink-0">
                  {formatEur(balance)}
                </span>
              )}
            </div>
          )}

          {/* Total line */}
          {programmeTotal && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-sand/30 mt-1">
              <span className="text-[13px] text-ink-quiet font-[family-name:var(--font-body)]">
                Total
              </span>
              <span className="text-[13px] text-ink font-[family-name:var(--font-body)]">
                {formatEur(programmeTotal)}
              </span>
            </div>
          )}
        </div>

        {entitlement.portalAccess && (
          <Link
            href={`/members/${token}/billing`}
            className="text-[13px] text-plum hover:text-plum-deep transition-colors"
          >
            {!isConsultationOnly && !finalFeePaid && !entitlement.programmeAccess
              ? "Choose your programme & pay balance →"
              : "View billing details →"}
          </Link>
        )}
      </div>
    );
  }

  // ── Full billing view (/billing page) ──────────────────────────
  return (
    <div className="space-y-8">
      {programmeLabel && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-1">Programme</p>
          <p className="font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
            {programmeLabel}
          </p>
          {programmeSublabel && (
            <p className="text-[13px] text-ink-quiet mt-0.5 font-[family-name:var(--font-body)]">
              {programmeSublabel}
            </p>
          )}
        </div>
      )}

      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-5">Payment summary</p>
        <div className="space-y-0">
          {/* Deposit */}
          <div className="flex items-start justify-between gap-4 py-4 border-b border-sand/30">
            <div>
              <p className="text-[15px] text-ink font-[family-name:var(--font-body)]">
                Consultation deposit
              </p>
              <p className="text-[13px] text-ink-quiet mt-0.5">
                {formatEur(DEPOSIT)} — applied toward programme
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              {depositPaid ? (
                <>
                  <p className="text-[13px] text-ink font-[family-name:var(--font-body)]">Received</p>
                  {depositDate && (
                    <p className="text-[12px] text-ink-quiet mt-0.5">{depositDate}</p>
                  )}
                </>
              ) : (
                <p className="text-[13px] text-ink-quiet">Pending</p>
              )}
            </div>
          </div>

          {/* Programme balance — only for multi-session programmes */}
          {!isConsultationOnly && (
            <div className="flex items-start justify-between gap-4 py-4 border-b border-sand/30">
              <div>
                <p className="text-[15px] text-ink font-[family-name:var(--font-body)]">
                  Programme balance
                </p>
                <p className="text-[13px] text-ink-quiet mt-0.5">
                  {balance !== null ? `${formatEur(balance)} remaining` : "Final fee for your programme"}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                {finalFeePaid ? (
                  <>
                    <p className="text-[13px] text-ink font-[family-name:var(--font-body)]">Received</p>
                    {finalFeeDate && (
                      <p className="text-[12px] text-ink-quiet mt-0.5">{finalFeeDate}</p>
                    )}
                  </>
                ) : finalFeeDueDate ? (
                  <>
                    <p className="text-[13px] text-ink-soft font-[family-name:var(--font-body)]">Due</p>
                    <p className="text-[12px] text-ink-quiet mt-0.5">{finalFeeDueDate}</p>
                  </>
                ) : (
                  <p className="text-[13px] text-ink-quiet">Not yet due</p>
                )}
              </div>
            </div>
          )}

          {/* Total */}
          {programmeTotal && (
            <div className="flex items-start justify-between gap-4 pt-4">
              <p className="text-[14px] text-ink-soft font-[family-name:var(--font-body)]">Total</p>
              <p className="text-[14px] text-ink font-[family-name:var(--font-body)]">
                {formatEur(programmeTotal)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">
          Invoices & receipts
        </p>
        <p className="text-[14px] leading-[1.7] text-ink-soft font-[family-name:var(--font-body)] mb-5">
          Download receipts, update your payment method, and manage your billing details through the Stripe billing portal.
        </p>
        <p className="text-[13px] text-ink-quiet font-[family-name:var(--font-body)]">
          You will be redirected to Stripe and returned here afterward.
        </p>
      </div>
    </div>
  );
}
