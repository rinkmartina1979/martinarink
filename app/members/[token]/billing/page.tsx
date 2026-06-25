import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { BillingCard } from "@/components/portal/BillingCard";
import { CustomerPortalButton } from "@/components/portal/CustomerPortalButton";
import { deriveEntitlement } from "@/lib/members/entitlements";

export const metadata = buildMetadata({ noIndex: true });

interface BillingPageProps {
  params: Promise<{ token: string }>;
}

interface VerifyResponse {
  valid: boolean;
  reason?: string;
  firstName?: string;
  programme?: string | null;
  programmeVariant?: string | null;
  depositPaidAt?: string | null;
  manualDepositPaidAt?: string | null;
  finalFeeDueAt?: string | null;
  finalFeePaidAt?: string | null;
  manualFinalFeePaidAt?: string | null;
  programmeActiveAt?: string | null;
  programmeCompletedAt?: string | null;
  accessSuspendedAt?: string | null;
  adminAccessOverride?: boolean | null;
}

export default async function BillingPage({ params }: BillingPageProps) {
  const { token } = await params;

  if (!process.env.MEMBERS_TOKEN_SECRET) {
    return (
      <section className="bg-cream min-h-screen flex items-center justify-center px-6">
        <p className="text-[15px] text-ink-soft">Portal not yet active.</p>
      </section>
    );
  }

  let verify: VerifyResponse;
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/members/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });
    verify = await res.json();
  } catch {
    return (
      <section className="bg-cream min-h-screen flex items-center justify-center px-6">
        <p className="text-[15px] text-ink-soft">
          This link is no longer active. Visit{" "}
          <Link href="/portal" className="text-plum underline underline-offset-4">
            the portal
          </Link>{" "}
          to request a fresh one.
        </p>
      </section>
    );
  }

  if (!verify.valid) {
    return (
      <section className="bg-cream min-h-screen flex items-center justify-center px-6">
        <p className="text-[15px] text-ink-soft">
          This link is no longer active. Visit{" "}
          <Link href="/portal" className="text-plum underline underline-offset-4">
            the portal
          </Link>{" "}
          to request a fresh one.
        </p>
      </section>
    );
  }

  const billingFields = {
    depositPaidAt: verify.depositPaidAt ?? null,
    manualDepositPaidAt: verify.manualDepositPaidAt ?? null,
    finalFeeDueAt: verify.finalFeeDueAt ?? null,
    finalFeePaidAt: verify.finalFeePaidAt ?? null,
    manualFinalFeePaidAt: verify.manualFinalFeePaidAt ?? null,
    programmeActiveAt: verify.programmeActiveAt ?? null,
    programmeCompletedAt: verify.programmeCompletedAt ?? null,
    accessSuspendedAt: verify.accessSuspendedAt ?? null,
    adminAccessOverride: verify.adminAccessOverride ?? null,
  };

  const entitlement = deriveEntitlement(billingFields);

  if (!entitlement.portalAccess) {
    return (
      <section className="bg-cream min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">Billing</p>
          <p className="font-[family-name:var(--font-display)] text-[24px] text-ink leading-snug mb-4">
            Billing details are not yet available.
          </p>
          <p className="text-[15px] leading-[1.75] text-ink-soft mb-8">
            Once your consultation deposit is confirmed, your billing information will appear here.
          </p>
          <Link
            href={`/members/${token}`}
            className="text-[13px] text-plum hover:text-plum-deep transition-colors"
          >
            ← Back to your portal
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="pt-28 md:pt-36 pb-10 px-6 border-b border-sand/30">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/members/${token}`}
            className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet hover:text-ink transition-colors"
          >
            ← Portal
          </Link>
          <p className="font-[family-name:var(--font-display)] text-[32px] md:text-[40px] text-ink leading-none mt-6 mb-2">
            Billing
          </p>
          {verify.firstName && (
            <p className="text-[15px] text-ink-soft font-[family-name:var(--font-body)]">
              {verify.firstName}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <BillingCard token={token} billing={billingFields} variant="full" programme={verify.programme ?? null} programmeVariant={verify.programmeVariant ?? null} />
          <CustomerPortalButton token={token} />
        </div>
      </section>
    </div>
  );
}
