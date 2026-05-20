import type { Metadata } from "next";
import { ClientIntakeForm } from "@/components/forms/ClientIntakeForm";
import { ScriptAccent } from "@/components/brand/ScriptAccent";

export const metadata: Metadata = {
  title: "Confidential Client Intake — Martina Rink",
  description:
    "Private client intake form for the Sober Muse Method and Female Empowerment & Leadership programme. Confidential.",
  robots: { index: false, follow: false },
};

type Programme = "sober-muse" | "empowerment" | "consultation";

const VALID_PROGRAMMES: Programme[] = ["sober-muse", "empowerment", "consultation"];

const PROGRAMME_LABELS: Record<Programme, string> = {
  "sober-muse":   "The Sober Muse Method",
  empowerment:    "Female Empowerment & Leadership",
  consultation:   "Private Consultation",
};

export default async function IntakePage({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string }>;
}) {
  const params = await searchParams;
  const rawProgramme = params?.programme;
  const programme: Programme = VALID_PROGRAMMES.includes(rawProgramme as Programme)
    ? (rawProgramme as Programme)
    : "sober-muse";

  return (
    <>
      {/* ── HEADER ────────────────────────────────────────── */}
      <section className="bg-aubergine pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="container-content max-w-3xl">

          {/* Pink hairline overline */}
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-pink" aria-hidden />
            <p className="text-[10px] uppercase tracking-[0.36em] text-cream/60 font-[family-name:var(--font-body)]">
              Confidential &nbsp;·&nbsp; {PROGRAMME_LABELS[programme]}
            </p>
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-[48px] md:text-[64px]
                         leading-[1.0] tracking-[-0.015em] text-cream">
            Client intake<br />
            <em className="italic">form.</em>
          </h1>

          <div className="mt-4 flex items-center gap-4">
            <span className="h-px w-14 bg-pink/50" aria-hidden />
            <ScriptAccent className="text-[2rem] leading-none text-pink">
              private work.
            </ScriptAccent>
          </div>

          <p className="mt-8 text-[16px] leading-[1.75] text-cream/70 max-w-[520px]
                        font-[family-name:var(--font-body)]">
            This form is the beginning of something private and precise. Take your time
            with it. There are no wrong answers — only honest ones.
          </p>

          {/* Confidentiality note */}
          <div className="mt-10 border border-cream/10 px-6 py-5 max-w-[520px]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-pink mb-2 font-[family-name:var(--font-body)]">
              Confidentiality
            </p>
            <p className="text-[13px] leading-[1.7] text-cream/60 font-[family-name:var(--font-body)]">
              Everything you share here is read by Martina only. Nothing is stored in
              a shared system or passed to any third party. You may request deletion
              of your data at any time.
            </p>
          </div>
        </div>
      </section>

      {/* ── FORM BODY ─────────────────────────────────────── */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-content max-w-3xl">
          <ClientIntakeForm programme={programme} />
        </div>
      </section>
    </>
  );
}
