import { buildMetadata } from "@/lib/metadata";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { EmpowermentApplicationForm } from "@/components/forms/ApplicationForm";

export const metadata = buildMetadata({
  title: "Apply — Female Empowerment & Leadership",
  description:
    "Begin your application for the Female Empowerment & Leadership programme — 6–12 months private mentoring from €7,500.",
  path: "/apply/empowerment",
  noIndex: true,
});

export default function ApplyEmpowermentPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-ink pt-32 md:pt-44 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink/30 to-transparent" />
        <div className="container-content max-w-2xl mx-auto px-6">
          <Eyebrow className="text-pink-soft/80 mb-8">
            <span>By application</span>
          </Eyebrow>
          <h1 className="font-[family-name:var(--font-display)] text-[38px] md:text-[52px] leading-[1.08] text-cream">
            Female Empowerment{" "}
            <span className="block md:inline">& Leadership</span>
          </h1>
          <p className="mt-5 text-[17px] leading-[1.65] text-cream/75 max-w-lg">
            A 6–12 month private mentoring engagement. For the woman who leads
            publicly and lives privately — and is ready to close the gap between
            them.
          </p>
          <p className="mt-6 text-[14px] text-cream/50">
            From €7,500 · Private · By application only
          </p>
        </div>
      </section>

      {/* ── PROCESS NOTE ─────────────────────────────────────── */}
      <section className="bg-cream py-12 border-b border-sand">
        <div className="container-content max-w-2xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "You apply",
                body: "A short written form. I read every application personally.",
              },
              {
                step: "02",
                title: "I respond",
                body: "Within 48 hours. If the fit looks right, I will invite you for a conversation.",
              },
              {
                step: "03",
                title: "We speak",
                body: "A 45-minute private consultation — €450, applied to the programme if you proceed.",
              },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <p className="text-[11px] tracking-[0.22em] uppercase text-ink-quiet mb-3">
                  {step}
                </p>
                <p className="font-[family-name:var(--font-display)] text-[18px] text-ink mb-2">
                  {title}
                </p>
                <p className="text-[14px] leading-[1.7] text-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ─────────────────────────────────── */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-content max-w-2xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] text-[28px] md:text-[36px] leading-[1.15] text-ink mb-4">
            Begin here.
          </h2>
          <p className="text-[15px] leading-[1.7] text-ink-soft mb-12 max-w-md">
            There are no trick questions. I am looking for honesty, not
            credentials.
          </p>
          <EmpowermentApplicationForm />
        </div>
      </section>

      {/* ── PRIVACY NOTE ─────────────────────────────────────── */}
      <section className="bg-bone border-t border-sand py-10">
        <div className="container-content max-w-2xl mx-auto px-6">
          <p className="text-[13px] leading-[1.7] text-ink-quiet max-w-md">
            Your application is private. I do not share your details with any
            third party. A non-disclosure agreement is available on request.
          </p>
        </div>
      </section>
    </>
  );
}
