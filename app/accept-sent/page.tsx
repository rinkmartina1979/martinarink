import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Booking link sent",
  noIndex: true,
});

export default async function AcceptSentPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; email?: string }>;
}) {
  const params = await searchParams;
  const name  = params.name  ?? "the applicant";
  const email = params.email ?? "";

  return (
    <section className="min-h-screen bg-aubergine flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">

        {/* Pink hairline */}
        <div
          aria-hidden
          className="h-px w-16 mx-auto mb-10"
          style={{ background: "linear-gradient(to right, transparent, #F942AA, transparent)" }}
        />

        {/* Check mark */}
        <div className="w-12 h-12 rounded-full border border-pink/40 flex items-center justify-center mx-auto mb-8">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M4 10.5l4.5 4.5 7.5-9" stroke="#F942AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p className="font-[family-name:var(--font-body)] text-[11px] uppercase tracking-[0.26em] text-cream/40 mb-4">
          Sent
        </p>

        <h1 className="font-[family-name:var(--font-display)] italic text-[32px] md:text-[40px] leading-[1.1] text-cream mb-6">
          {name} has her booking link.
        </h1>

        <p className="text-[15px] leading-[1.75] text-cream/60 font-[family-name:var(--font-body)] mb-2">
          The acceptance email — with the link to{" "}
          <span className="text-cream/80">/book?token=approved</span> — has been sent to{" "}
          {email ? (
            <span className="text-cream/80">{email}</span>
          ) : (
            "her inbox"
          )}.
        </p>

        <p className="text-[13px] leading-[1.7] text-cream/40 font-[family-name:var(--font-body)] mt-6">
          Her Brevo status has been updated to <span className="text-cream/60">accepted</span>.
        </p>

        <div className="mt-12 pt-8 border-t border-cream/10">
          <p className="font-[family-name:var(--font-display)] italic text-[20px] text-cream/70">
            Martina
          </p>
        </div>

      </div>
    </section>
  );
}
