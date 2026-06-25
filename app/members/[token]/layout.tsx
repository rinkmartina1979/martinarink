import { PortalNav } from "@/components/portal/PortalNav";
import { deriveEntitlement } from "@/lib/members/entitlements";

/**
 * Shared shell for every /members/[token] route — renders the persistent portal
 * navigation above the page. Verification here is presentational only (it decides
 * which nav items are reachable); each page still verifies independently and
 * renders its own gated/expired states. When verification fails we render the
 * page without nav and let the page handle it.
 */

interface PortalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}

interface VerifyResponse {
  valid: boolean;
  depositPaidAt?: string | null;
  manualDepositPaidAt?: string | null;
  finalFeePaidAt?: string | null;
  manualFinalFeePaidAt?: string | null;
  programmeActiveAt?: string | null;
  programmeCompletedAt?: string | null;
  accessSuspendedAt?: string | null;
  adminAccessOverride?: boolean | null;
}

export default async function PortalLayout({ children, params }: PortalLayoutProps) {
  const { token } = await params;

  let nav: React.ReactNode = null;

  if (process.env.MEMBERS_TOKEN_SECRET) {
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
      const verify = (await res.json()) as VerifyResponse;
      if (verify.valid) {
        const entitlement = deriveEntitlement({
          depositPaidAt: verify.depositPaidAt ?? null,
          manualDepositPaidAt: verify.manualDepositPaidAt ?? null,
          finalFeePaidAt: verify.finalFeePaidAt ?? null,
          manualFinalFeePaidAt: verify.manualFinalFeePaidAt ?? null,
          programmeActiveAt: verify.programmeActiveAt ?? null,
          programmeCompletedAt: verify.programmeCompletedAt ?? null,
          accessSuspendedAt: verify.accessSuspendedAt ?? null,
          adminAccessOverride: verify.adminAccessOverride ?? null,
        });
        // Suspended clients see no nav — the page renders the pause notice.
        if (!entitlement.suspended) {
          nav = (
            <PortalNav
              token={token}
              portalAccess={entitlement.portalAccess}
              programmeAccess={entitlement.programmeAccess}
            />
          );
        }
      }
    } catch {
      // Leave nav null — the page handles its own expired/error state.
    }
  }

  return (
    <>
      {nav}
      {children}
    </>
  );
}
