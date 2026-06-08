import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Contract signed — Martina Rink",
  noIndex: true,
});

export default function ContractSignedPage() {
  return (
    <section className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">

        {/* Pink hairline */}
        <div
          aria-hidden
          className="h-px w-16 mx-auto mb-10"
          style={{ background: "linear-gradient(to right, transparent, #F942AA, transparent)" }}
        />

        {/* Check mark */}
        <div className="w-14 h-14 rounded-full border border-plum/30 flex items-center justify-center mx-auto mb-8">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path
              d="M5 11.5l5 5 8-10"
              stroke="#5C2D8E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.26em] text-ink-quiet mb-4">
          Signed
        </p>

        <h1 className="font-[family-name:var(--font-display)] italic text-[34px] md:text-[42px] leading-[1.08] tracking-[-0.02em] text-ink mb-6">
          Your contract is confirmed.
        </h1>

        <p className="text-[16px] leading-[1.8] text-ink-soft font-[family-name:var(--font-body)] mb-3 max-w-sm mx-auto">
          A signed copy has been sent to your email address. Please save it for your records.
        </p>

        <p className="text-[14px] leading-[1.75] text-ink-quiet font-[family-name:var(--font-body)] mb-10 max-w-sm mx-auto">
          Martina will be in touch within 24 hours with the next steps for your programme.
        </p>

        <hr className="border-sand mb-10 max-w-xs mx-auto" />

        <p className="font-[family-name:var(--font-body)] text-[12px] uppercase tracking-[0.22em] text-ink-quiet mb-5">
          While you wait
        </p>

        <Link
          href="/writing"
          className="inline-block text-[12px] uppercase tracking-[0.2em] text-plum hover:text-plum-deep transition-colors font-[family-name:var(--font-body)]"
        >
          Read the writing &rarr;
        </Link>

        <div className="mt-16 pt-8 border-t border-sand">
          <p className="font-[family-name:var(--font-display)] italic text-[22px] text-ink/60">
            Martina
          </p>
        </div>

      </div>
    </section>
  );
}
