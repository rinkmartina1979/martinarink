/**
 * Journey state derivation — the automation spine.
 *
 * Computes the client's "next step" purely from verified events (payment
 * timestamps, workbook progress, booked sessions) — never from a manually
 * typed field. Same discipline as deriveEntitlement: pure, server-only,
 * no stored grantable state, safe to call on every render.
 *
 * Martina can still override via nextStepTitle in Studio — when set, the
 * caller should prefer it over this function's output. This module never
 * checks that field itself; the override decision stays with the caller
 * (see app/members/[token]/page.tsx) so this stays a pure function of the
 * signals below.
 */

export interface JourneySignals {
  depositPaidAt: string | null;
  manualDepositPaidAt: string | null;
  programmeVariant: string | null;
  finalFeePaidAt: string | null;
  manualFinalFeePaidAt: string | null;
  programmeActiveAt: string | null;
  nextSessionAt: string | null;
  workbookStartedCount: number;
  workbookTotal: number;
}

export interface JourneyStep {
  title: string;
  description: string | null;
  ctaLabel: string;
  ctaHref: string;
  dueAt: string | null;
}

export function deriveJourney(signals: JourneySignals, token: string): JourneyStep {
  const depositPaid = !!(signals.depositPaidAt || signals.manualDepositPaidAt);
  const balancePaid = !!(signals.finalFeePaidAt || signals.manualFinalFeePaidAt);
  const programmeActive = !!signals.programmeActiveAt;
  const sessionUpcoming =
    !!signals.nextSessionAt && new Date(signals.nextSessionAt).getTime() > Date.now();

  // Defensive fallback — the dashboard already gates on portalAccess, so a
  // client without any deposit signal shouldn't normally reach this function.
  // Covers adminAccessOverride test profiles with no real payment history.
  if (!depositPaid) {
    return {
      title: "Reserve your consultation.",
      description: "A private conversation before anything else.",
      ctaLabel: "Book your consultation",
      ctaHref: "/book",
      dueAt: null,
    };
  }

  if (!programmeActive) {
    if (!signals.programmeVariant) {
      return {
        title: "Choose your programme.",
        description: "Select the format that suits you to complete your enrolment.",
        ctaLabel: "Choose your programme",
        ctaHref: `/members/${token}/billing`,
        dueAt: null,
      };
    }
    if (!balancePaid) {
      return {
        title: "Complete your enrolment.",
        description: "Settle your programme balance to begin.",
        ctaLabel: "Complete enrolment",
        ctaHref: `/members/${token}/billing`,
        dueAt: null,
      };
    }
  }

  if (sessionUpcoming) {
    return {
      title: "Your session is booked.",
      description: null,
      ctaLabel: "View schedule",
      ctaHref: `/members/${token}/schedule`,
      dueAt: signals.nextSessionAt,
    };
  }

  if (programmeActive && signals.workbookStartedCount === 0) {
    return {
      title: "Begin your foundation.",
      description: "Your foundation workbook is the first work of the programme — start whenever you're ready.",
      ctaLabel: "Open your workbook",
      ctaHref: `/members/${token}/workbook/becoming`,
      dueAt: null,
    };
  }

  if (programmeActive && signals.workbookStartedCount < signals.workbookTotal) {
    return {
      title: `Continue your foundation — ${signals.workbookStartedCount} of ${signals.workbookTotal}.`,
      description: null,
      ctaLabel: "Continue your workbook",
      ctaHref: `/members/${token}/workbook`,
      dueAt: null,
    };
  }

  return {
    title: "Continue your journal.",
    description: "A few quiet minutes — morning or evening. Return whenever you're ready.",
    ctaLabel: "Open your journal",
    ctaHref: `/members/${token}/journal`,
    dueAt: null,
  };
}
