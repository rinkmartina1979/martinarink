/**
 * /dashboard — Phase B portal home.
 *
 * Authenticated via the HttpOnly mr_session cookie (no token in URL).
 * Reads the session, fetches client data from Sanity, generates a short-lived
 * navigation token for sub-route hrefs (journal, audio, schedule, etc.) that
 * still use token-based routes during Phase A/B.
 *
 * Phase C: all sub-routes switch to /dashboard/* and the nav token is removed.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { verifySession } from "@/lib/members/session";
import { generateMemberToken } from "@/lib/members/token";
import {
  getClientByToken,
  getAudioDropsForClient,
  getMilestonesForClient,
  getJournalMonthProgress,
  getCareTeamForProgramme,
  getProgrammeDefinition,
} from "@/sanity/lib/membersQueries";
import { monthIndexFor, toDateKey } from "@/lib/journal/prompts";
import { deriveEntitlement } from "@/lib/members/entitlements";
import { PortalDashboardHero } from "@/components/portal/PortalDashboardHero";
import { CurrentStageTimeline } from "@/components/portal/CurrentStageTimeline";
import { NextActionCard } from "@/components/portal/NextActionCard";
import { JournalStatusCard } from "@/components/portal/JournalStatusCard";
import { SessionCard } from "@/components/portal/SessionCard";
import { ResourceShelf } from "@/components/portal/ResourceShelf";
import { SupportRequestCard } from "@/components/portal/SupportRequestCard";
import { BillingCard } from "@/components/portal/BillingCard";
import { ProgrammeCard } from "@/components/portal/ProgrammeCard";
import { CareTeamBlock } from "@/components/portal/CareTeamBlock";
import type { MemberAudioDrop } from "@/sanity/lib/membersQueries";

export const metadata = buildMetadata({ noIndex: true });

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function DashboardPage() {
  // ── Auth ──────────────────────────────────────────────────────
  const jar = await cookies();
  const cookieValue = jar.get("mr_session")?.value;

  if (!cookieValue) {
    redirect("/portal");
  }

  const session = await verifySession(cookieValue);
  if (!session) {
    redirect("/portal");
  }

  // ── Profile ───────────────────────────────────────────────────
  const profile = await getClientByToken(session.clientId).catch(() => null);
  if (!profile) redirect("/portal");

  if (profile.status === "completed") redirect("/portal");
  if (profile.revokedAt) redirect("/portal");

  // Verify tokenVersion matches — if Martina bumped it, all sessions for
  // that version are stale. Client re-enters via a fresh magic link.
  if (session.tokenVersion < (profile.tokenVersion ?? 1)) {
    redirect("/portal");
  }

  // ── Navigation token (used for sub-route hrefs during Phase A/B) ─
  // Generated fresh each render — valid for 120 days at current tokenVersion.
  // Phase C: remove this and replace hrefs with /dashboard/* paths.
  const navToken = generateMemberToken(session.clientId, "all", {
    tokenVersion: profile.tokenVersion ?? 1,
  });

  const { clientId } = session;
  const programme = profile.programme ?? undefined;
  const portalStage = profile.portalStage;
  const enrolledAt = profile.enrolledAt;

  const billingFields = {
    depositPaidAt: profile.depositPaidAt,
    manualDepositPaidAt: profile.manualDepositPaidAt,
    finalFeeDueAt: profile.finalFeeDueAt,
    finalFeePaidAt: profile.finalFeePaidAt,
    manualFinalFeePaidAt: profile.manualFinalFeePaidAt,
    programmeActiveAt: profile.programmeActiveAt,
    programmeCompletedAt: profile.programmeCompletedAt,
    accessSuspendedAt: profile.accessSuspendedAt,
    adminAccessOverride: profile.adminAccessOverride,
  };
  const entitlement = deriveEntitlement(billingFields);

  // ── Data ──────────────────────────────────────────────────────
  const [drops, milestones, progress, careTeam, programmeDef] = await Promise.all([
    programme ? getAudioDropsForClient(clientId, programme) : Promise.resolve(null),
    getMilestonesForClient(clientId),
    getJournalMonthProgress(clientId),
    programme ? getCareTeamForProgramme(programme) : Promise.resolve(null),
    programme ? getProgrammeDefinition(programme) : Promise.resolve(null),
  ]);

  const journalHref = `/members/${navToken}/journal`;
  const monthIndex = enrolledAt ? monthIndexFor(enrolledAt, toDateKey(new Date())) : 1;
  const latestMilestones = (milestones ?? []).slice(0, 5);

  const next = profile.nextStepTitle
    ? {
        title: profile.nextStepTitle,
        description: profile.nextStepDescription ?? null,
        ctaLabel: profile.nextStepCtaLabel ?? "Continue",
        ctaHref: profile.nextStepHref ?? journalHref,
        dueAt: profile.nextStepDueAt ?? null,
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
        firstName={profile.firstName}
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

        <CurrentStageTimeline portalStage={portalStage ?? null} />

        {programmeDef && (
          <ProgrammeCard
            programme={programmeDef}
            enrolledAt={enrolledAt ?? null}
            expectedCompletionAt={profile.expectedCompletionAt ?? null}
            token={navToken}
          />
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <JournalStatusCard
            monthIndex={monthIndex}
            mornings={progress.mornings}
            evenings={progress.evenings}
            href={journalHref}
          />
          <SessionCard token={navToken} />
        </div>

        {entitlement.portalAccess && (
          <BillingCard token={navToken} billing={billingFields} variant="summary" />
        )}

        <ResourceShelf drops={drops} token={navToken} />

        <SupportRequestCard token={navToken} />

        {careTeam && careTeam.length > 0 && (
          <CareTeamBlock members={careTeam} />
        )}

        {latestMilestones.length > 0 && (
          <section className="pt-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-8">Your milestones</p>
            <div className="space-y-4">
              {latestMilestones.map((m) => (
                <div key={m._id} className="bg-bone border border-sand/40 p-6">
                  <p className="text-[15px] text-ink leading-snug">{m.title}</p>
                  {m.note && (
                    <p className="mt-1 text-[13px] text-ink-soft leading-[1.65]">{m.note}</p>
                  )}
                  <p className="mt-3 text-[11px] text-ink-quiet">
                    {formatDate(m.achievedAt)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
