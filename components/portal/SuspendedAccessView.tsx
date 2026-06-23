import Link from "next/link";

/**
 * Shown when accessSuspendedAt is set on the client profile.
 * Never explains WHY access is paused — that is Martina's conversation.
 * Never exposes billing state, token, or any sensitive field.
 */
export function SuspendedAccessView({ firstName }: { firstName: string }) {
  return (
    <section className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg">
        <p className="font-[family-name:var(--font-script)] text-[40px] md:text-[48px] text-ink leading-[0.9] mb-7">
          {firstName}.
        </p>
        <p className="text-[17px] leading-[1.75] text-ink-soft mb-4">
          Your portal is currently paused.
        </p>
        <p className="text-[17px] leading-[1.75] text-ink-soft mb-8">
          Write to Martina at{" "}
          <a
            href="mailto:contact@martinarink.com"
            className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
          >
            contact@martinarink.com
          </a>{" "}
          and she will take care of it.
        </p>
        <Link
          href="/"
          className="inline-block text-[14px] text-ink-quiet hover:text-ink transition-colors underline underline-offset-4"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
