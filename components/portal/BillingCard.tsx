import Link from "next/link";
import { deriveEntitlement, type ClientEntitlementFields } from "@/lib/members/entitlements";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface BillingCardProps {
  token: string;
  billing: ClientEntitlementFields & { finalFeeDueAt?: string | null };
  /** summary mode: compact card on dashboard; full mode: detail view on /billing */
  variant?: "summary" | "full";
}

export function BillingCard({ token, billing, variant = "summary" }: BillingCardProps) {
  const entitlement = deriveEntitlement(billing);

  const depositPaid = !!(billing.depositPaidAt || billing.manualDepositPaidAt);
  const finalFeePaid = !!(billing.finalFeePaidAt || billing.manualFinalFeePaidAt);
  const depositDate = formatDate(billing.depositPaidAt ?? billing.manualDepositPaidAt ?? null);
  const finalFeeDate = formatDate(billing.finalFeePaidAt ?? billing.manualFinalFeePaidAt ?? null);
  const finalFeeDueDate = formatDate(billing.finalFeeDueAt ?? null);

  if (variant === "summary") {
    return (
      <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">Billing</p>
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${depositPaid ? "bg-mint" : "bg-sand"}`}
            />
            <span className="text-[14px] text-ink-soft font-[family-name:var(--font-body)]">
              Deposit — {depositPaid ? `received${depositDate ? ` ${depositDate}` : ""}` : "pending"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${finalFeePaid ? "bg-mint" : finalFeeDueDate ? "bg-blush" : "bg-sand"}`}
            />
            <span className="text-[14px] text-ink-soft font-[family-name:var(--font-body)]">
              {finalFeePaid
                ? `Final fee — received${finalFeeDate ? ` ${finalFeeDate}` : ""}`
                : finalFeeDueDate
                ? `Final fee — due ${finalFeeDueDate}`
                : "Final fee — not yet due"}
            </span>
          </div>
        </div>
        {entitlement.portalAccess && (
          <Link
            href={`/members/${token}/billing`}
            className="text-[13px] text-plum hover:text-plum-deep transition-colors"
          >
            View billing details →
          </Link>
        )}
      </div>
    );
  }

  // ── Full billing view ─────────────────────────────────────────
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-5">Payment summary</p>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-sand/30">
            <div>
              <p className="text-[15px] text-ink font-[family-name:var(--font-body)]">Consultation deposit</p>
              <p className="text-[13px] text-ink-quiet mt-0.5">€350 — applied toward programme</p>
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

          <div className="flex items-start justify-between gap-4 pb-4 border-b border-sand/30">
            <div>
              <p className="text-[15px] text-ink font-[family-name:var(--font-body)]">Programme balance</p>
              <p className="text-[13px] text-ink-quiet mt-0.5">Final fee for your programme</p>
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
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">Invoices & receipts</p>
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
