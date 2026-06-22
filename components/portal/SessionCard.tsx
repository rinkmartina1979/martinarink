/**
 * Booking card. Secondary action — Calendly opens in a new tab.
 * Off-cadence asks go through SupportRequestCard.
 */
export function SessionCard({ calendlyUrl }: { calendlyUrl: string }) {
  return (
    <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">Sessions</p>
      <p className="font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
        Book a time with Martina
      </p>
      <p className="mt-2 text-[14px] text-ink-soft font-[family-name:var(--font-body)]">
        Choose a moment that suits you. Return whenever you need to.
      </p>
      <a
        href={calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block border border-aubergine text-aubergine text-[12px] uppercase tracking-[0.18em] px-6 py-2.5 rounded-[1px] hover:bg-aubergine hover:text-cream transition-colors duration-200"
      >
        Book a session
      </a>
    </div>
  );
}
