/**
 * Shared editorial empty / loading / error states for the journal.
 * Calm, quiet, brand-consistent — never alarming.
 */

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-bone border border-sand/40 p-8 rounded-[1px] text-center">
      <p className="text-[15px] leading-[1.7] text-ink-soft font-[family-name:var(--font-body)]">
        {message}
      </p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="bg-bone border border-sand/40 p-8 rounded-[1px]">
      <div className="h-3 w-32 bg-sand/40 rounded-[1px] animate-pulse mb-4" />
      <div className="h-3 w-full bg-sand/30 rounded-[1px] animate-pulse mb-2" />
      <div className="h-3 w-2/3 bg-sand/30 rounded-[1px] animate-pulse" />
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="border border-pink/50 bg-blush/40 p-6 rounded-[1px]">
      <p className="text-[15px] leading-[1.7] text-ink-soft font-[family-name:var(--font-body)]">
        {message ?? "Something didn't load as it should. Please refresh, or reach Martina if it persists."}
      </p>
    </div>
  );
}
