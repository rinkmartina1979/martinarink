import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { ResourceList } from "@/components/portal/ResourceList";
import { deriveEntitlement } from "@/lib/members/entitlements";
import {
  getAudioDropsForClient,
  getProgrammeResources,
} from "@/sanity/lib/membersQueries";

export const metadata = buildMetadata({ noIndex: true });

interface ResourcesPageProps {
  params: Promise<{ token: string }>;
}

interface VerifyResponse {
  valid: boolean;
  clientId?: string;
  programme?: string;
  portalStage?: string | null;
  depositPaidAt?: string | null;
  manualDepositPaidAt?: string | null;
  finalFeePaidAt?: string | null;
  manualFinalFeePaidAt?: string | null;
  programmeActiveAt?: string | null;
  programmeCompletedAt?: string | null;
  accessSuspendedAt?: string | null;
  adminAccessOverride?: boolean | null;
}

function ExpiredPage() {
  return (
    <section className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="font-[family-name:var(--font-script)] text-[32px] text-pink leading-none mb-6">
          Unavailable.
        </p>
        <p className="text-[18px] leading-[1.75] text-ink-soft">
          This link has expired or is no longer active. You can request a fresh one at{" "}
          <Link
            href="/portal"
            className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
          >
            martinarink.com/portal
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export default async function ResourcesPage({ params }: ResourcesPageProps) {
  const { token } = await params;

  if (!process.env.MEMBERS_TOKEN_SECRET) return <ExpiredPage />;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  let verify: VerifyResponse;
  try {
    const res = await fetch(`${baseUrl}/api/members/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });
    verify = await res.json();
  } catch {
    return <ExpiredPage />;
  }

  if (!verify.valid || !verify.clientId) return <ExpiredPage />;

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

  const programme = verify.programme ?? "sober-muse";
  const portalStage = verify.portalStage ?? "accepted";

  // Fetch audio drops (all, no limit) + programme resources in parallel
  // getProgrammeResources needs the Sanity _id — we pass clientId (UUID) as a fallback;
  // the GROQ query handles the case where visibleTo is empty (shows to all).
  const [audioDrops, programmeResources] = await Promise.all([
    entitlement.portalAccess
      ? getAudioDropsForClient(verify.clientId, programme)
      : Promise.resolve(null),
    entitlement.programmeAccess
      ? getProgrammeResources(programme, portalStage, verify.clientId)
      : Promise.resolve(null),
  ]);

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-8">
        <Link
          href={`/members/${token}`}
          className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet hover:text-ink transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      <section className="max-w-3xl mx-auto px-6 pb-10">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">Resources</p>
        <h1 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] text-ink leading-none">
          Your library.
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        {!entitlement.portalAccess ? (
          <p className="text-[15px] text-ink-quiet leading-[1.75] py-8 border-t border-sand/20">
            Resources become available once your programme is confirmed. If you believe this is an error, write to{" "}
            <a
              href="mailto:contact@martinarink.com"
              className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
            >
              contact@martinarink.com
            </a>
            .
          </p>
        ) : !entitlement.programmeAccess ? (
          <>
            {/* Portal access but not programme access — show audio drops only */}
            <p className="text-[14px] text-ink-quiet mb-8 border-b border-sand/20 pb-4">
              Full resources become available once your programme is active.
            </p>
            <ResourceList
              audioDrops={audioDrops}
              programmeResources={null}
              token={token}
            />
          </>
        ) : (
          <ResourceList
            audioDrops={audioDrops}
            programmeResources={programmeResources}
            token={token}
          />
        )}
      </section>
    </div>
  );
}
