import Link from "next/link";

export function SessionCard({ token }: { token: string }) {
  return (
    <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3">Sessions</p>
      <p className="font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
        Book a time with Martina
      </p>
      <p className="mt-2 text-[14px] text-ink-soft font-[family-name:var(--font-body)]">
        Choose a moment that suits you. Return whenever you need to.
      </p>
      <Link
        href={`/members/${token}/schedule`}
        className="mt-5 inline-block border border-plum text-plum text-[12px] uppercase tracking-[0.18em] px-6 py-2.5 rounded-[1px] hover:bg-plum hover:text-cream transition-colors duration-200"
      >
        Book a session
      </Link>
    </div>
  );
}
