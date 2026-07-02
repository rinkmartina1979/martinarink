import { PortalRecoveryForm } from "@/components/portal/PortalRecoveryForm";

const REASON_COPY: Record<string, string> = {
  superseded: "This link has been replaced.",
  revoked: "This link is no longer active.",
  archived: "This portal has been archived.",
};

const DEFAULT_COPY = "This link is no longer active.";

/**
 * Shown wherever a member-area page's token check fails. Replaces the old
 * dead-end ("visit /portal") with the recovery form inline, so a stranded
 * client never has to navigate away, find the form, and retype her email.
 *
 * `reason` never leaks verification mechanics to the client — only a small
 * fixed set of first-sentence variants keyed off it.
 */
export function LinkExpiredView({ reason }: { reason?: string | null }) {
  const headline = (reason && REASON_COPY[reason]) || DEFAULT_COPY;

  return (
    <section className="bg-cream min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">Private portal</p>
        <p className="font-[family-name:var(--font-display)] text-[24px] text-ink leading-snug mb-4">
          {headline}
        </p>
        <p className="text-[15px] leading-[1.75] text-ink-soft mb-8">
          Enter your email and a fresh link will arrive within a minute.
        </p>
        <div className="text-left">
          <PortalRecoveryForm />
        </div>
      </div>
    </section>
  );
}
