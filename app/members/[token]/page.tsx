import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import {
  getAudioDropsForClient,
  getMilestonesForClient,
  getJournalMonthProgress,
  getWorkbookProgress,
  getCareTeamForProgramme,
  getProgrammeDefinition,
  type MemberAudioDrop,
} from "@/sanity/lib/membersQueries";
import { monthIndexFor, toDateKey } from "@/lib/journal/prompts";
import { PortalDashboardHero } from "@/components/portal/PortalDashboardHero";
import { CurrentStageTimeline } from "@/components/portal/CurrentStageTimeline";
import { NextActionCard } from "@/components/portal/NextActionCard";
import { JournalStatusCard } from "@/components/portal/JournalStatusCard";
import { WorkbookCard } from "@/components/portal/WorkbookCard";
import { SessionCard } from "@/components/portal/SessionCard";
import { ResourceShelf } from "@/components/portal/ResourceShelf";
import { SupportRequestCard } from "@/components/portal/SupportRequestCard";
import { BillingCard } from "@/components/portal/BillingCard";
import { ProgrammeCard } from "@/components/portal/ProgrammeCard";
import { CareTeamBlock } from "@/components/portal/CareTeamBlock";
import { SessionBootstrap } from "@/components/portal/SessionBootstrap";
import { SuspendedAccessView } from "@/components/portal/SuspendedAccessView";
import { LinkExpiredView } from "@/components/portal/LinkExpiredView";
import { deriveEntitlement } from "@/lib/members/entitlements";

export const metadata = buildMetadata({ noIndex: true });

interface MembersPageProps {
  params: Promise<{ token: string }>;
}

const PROGRAMME_LABELS: Record<string, string> = {
  "sober-muse": "The Sober Muse Method",
  empowerment: "Female Empowerment & Leadership",
  consultation: "Private Consultation",
};

const STAGE_SUBLINE: Record<string, string> = {
  accepted: "Your programme is being prepared.",
  consultation: "Your consultation phase.",
  onboarding: "Settling in.",
  active: "Your programme is underway.",
  integration: "Your final month together.",
  completed: "Your programme has concluded.",
};

interface VerifyResponse {
  valid: boolean;
  reason?: string;
  clientId?: string;
  firstName?: string;
  programme?: string;
  programmeVariant?: string | null;
  archetype?: string | null;
  enrolledAt?: string | null;
  expectedCompletionAt?: string | null;
  portalStage?: string | null;
  nextStepTitle?: string | null;
  nextStepDescription?: string | null;
  nextStepCtaLabel?: string | null;
  nextStepHref?: string | null;
  nextStepDueAt?: string | null;
  depositPaidAt?: string | null;
  manualDepositPaidAt?: string | null;
  finalFeeDueAt?: string | null;
  finalFeePaidAt?: string | null;
  manualFinalFeePaidAt?: string | null;
  programmeActiveAt?: string | null;
  nextSessionAt?: string | null;
  programmeCompletedAt?: string | null;
  accessSuspendedAt?: string | null;
  adminAccessOverride?: boolean | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  return `${Math.ceil(seconds / 60)} min`;
}

/* ── Private beta state — shown when env not configured ───────── */
function PrivateBetaPage() {
  return (
    <section className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">Members portal</p>
        <p className="font-[family-name:var(--font-script)] text-[40px] text-ink leading-none mb-6">
          In private beta.
        </p>
        <p className="text-[17px] leading-[1.75] text-ink-soft mb-8">
          The members area is opening to current clients in the coming weeks. If you are working with
          Martina and expected access, write to her at{" "}
          <a href="mailto:contact@martinarink.com" className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors">
            contact@martinarink.com
          </a>{" "}
          and she will send your private link.
        </p>
        <Link href="/" className="inline-block text-[14px] text-ink-quiet hover:text-ink transition-colors underline underline-offset-4">
          Return home
        </Link>
      </div>
    </section>
  );
}


/* ── Archived (completed) state ────────────────────────────────── */
function ArchivedPage({ firstName, drops }: { firstName: string; drops: MemberAudioDrop[] | null }) {
  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-28 md:pt-36 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="font-[family-name:var(--font-script)] text-[36px] md:text-[44px] text-ink leading-none mb-4">
            {firstName}.
          </p>
          <p className="text-[17px] leading-[1.75] text-ink-soft max-w-xl">
            Your programme has concluded. These recordings remain yours — they are here whenever you need them.
          </p>
        </div>
      </section>
      {drops && drops.length > 0 && (
        <section className="pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-8">Your recordings</p>
            <div className="space-y-4">
              {drops.map((drop) => (
                <div key={drop._id} className="bg-bone border border-sand/40 p-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[16px] text-ink leading-snug">{drop.title}</p>
                    {drop.durationSeconds && (
                      <p className="text-[13px] text-ink-quiet mt-1">{formatDuration(drop.durationSeconds)}</p>
                    )}
                  </div>
                  <p className="text-[12px] text-ink-quiet flex-shrink-0">{formatDate(drop.releasedAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default async function MembersPage({ params }: MembersPageProps) {
  const { token } = await params;

  if (!process.env.MEMBERS_TOKEN_SECRET) return <PrivateBetaPage />;

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
    return <LinkExpiredView />;
  }

  if (!verify.valid && verify.reason === "archived") {
    return <ArchivedPage firstName={verify.firstName ?? ""} drops={null} />;
  }
  if (!verify.valid || !verify.clientId || !verify.firstName) {
    return <LinkExpiredView reason={verify.reason} />;
  }

  const { clientId, firstName, programme, programmeVariant, enrolledAt, portalStage } = verify;

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

  // Suspended clients see a calm pause notice before any data is fetched.
  if (entitlement.suspended) {
    return <SuspendedAccessView firstName={verify.firstName!} />;
  }

  const [drops, milestones, progress, workbookProgress, careTeam, programmeDef] = await Promise.all([
    programme ? getAudioDropsForClient(clientId, programme) : Promise.resolve(null),
    getMilestonesForClient(clientId),
    getJournalMonthProgress(clientId),
    getWorkbookProgress(clientId),
    programme ? getCareTeamForProgramme(programme) : Promise.resolve(null),
    programme ? getProgrammeDefinition(programme) : Promise.resolve(null),
  ]);

  const journalHref = `/members/${token}/journal`;
  const monthIndex = enrolledAt ? monthIndexFor(enrolledAt, toDateKey(new Date())) : 1;
  const latestMilestones = (milestones ?? []).slice(0, 5);

  // Single primary action — Martina's set next step, else a calm journal default.
  const next = verify.nextStepTitle
    ? {
        title: verify.nextStepTitle,
        description: verify.nextStepDescription ?? null,
        ctaLabel: verify.nextStepCtaLabel ?? "Continue",
        ctaHref: verify.nextStepHref ?? journalHref,
        dueAt: verify.nextStepDueAt ?? null,
      }
    : {
        title: "Continue your journal",
        description: "A few quiet minutes — morning or evening. Return whenever you're ready.",
        ctaLabel: "Open your journal",
        ctaHref: journalHref,
        dueAt: null,
      };

  return (
    <div className="bg-cream min-h-screen">
      <PortalDashboardHero
        firstName={firstName}
        programmeLabel={programme ? (PROGRAMME_LABELS[programme] ?? programme) : null}
        stageLabel={STAGE_SUBLINE[portalStage ?? ""] ?? null}
      />

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <NextActionCard
          title={next.title}
          description={next.description}
          ctaLabel={next.ctaLabel}
          ctaHref={next.ctaHref}
          dueAt={next.dueAt}
        />

        <CurrentStageTimeline portalStage={portalStage ?? null} enrolledAt={enrolledAt ?? null} />

        <ProgrammeCard
          programme={programmeDef ?? null}
          programmeKey={programme ?? null}
          enrolledAt={verify.enrolledAt ?? null}
          expectedCompletionAt={verify.expectedCompletionAt ?? null}
          token={token}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <JournalStatusCard
            monthIndex={monthIndex}
            mornings={progress.mornings}
            evenings={progress.evenings}
            href={journalHref}
          />
          <WorkbookCard
            startedKeys={workbookProgress.startedKeys}
            href={`/members/${token}/workbook`}
          />
        </div>

        <SessionCard token={token} nextSessionAt={verify.nextSessionAt} />

        {entitlement.portalAccess && (
          <BillingCard
            token={token}
            billing={billingFields}
            variant="summary"
            programme={programme ?? null}
            programmeVariant={programmeVariant ?? null}
          />
        )}

        <ResourceShelf drops={drops} token={token} />

        <SupportRequestCard token={token} />

        {careTeam && careTeam.length > 0 && (
          <CareTeamBlock members={careTeam} />
        )}

        {latestMilestones.length > 0 && (
          <section className="pt-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-8">Your milestones</p>
            <div className="space-y-8">
              {latestMilestones.map((m) => (
                <div key={m._id} className="pb-8 border-b border-sand/20 last:border-0 last:pb-0">
                  <p className="text-[12px] text-ink-quiet mb-2">{formatDate(m.achievedAt)}</p>
                  <p className="font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">{m.title}</p>
                  {m.note && <p className="mt-2 text-[15px] leading-[1.7] text-ink-soft">{m.note}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Phase A: issue HttpOnly session cookie in background for future /dashboard access */}
      <SessionBootstrap token={token} />
    </div>
  );
}
