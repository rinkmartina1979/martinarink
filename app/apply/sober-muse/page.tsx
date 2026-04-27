import { buildMetadata } from "@/lib/metadata";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { SoberMuseApplicationForm } from "@/components/forms/ApplicationForm";

export const metadata = buildMetadata({
  title: "Apply — The Sober Muse Method",
  description:
    "Begin your application for the Sober Muse Method — a 90-day private mentoring programme from €5,000.",
  path: "/apply/sober-muse",
  noIndex: true,
});

export default function ApplySoberMusePage() {
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
            The Sober Muse Method
          </h1>
          <p className="mt-5 text-[17px] leading-[1.65] text-cream/75 max-w-lg">
            A 90-day private mentoring programme. For the woman who is ready to
            put the drinking behind her — and reclaim who she was before it became
            the architecture of her days.
          </p>
          <p className="mt-6 text-[14px] text-cream/50">
            From €5,000 · Private · By application only
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
                body: "Short form. Five questions. Honestly answered.",
              },
              {
                step: "02",
                title: "I review",
                body: "I read every application personally. You will hear from me within 48 hours.",
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
            Five questions. It takes about ten minutes if you answer honestly.
            There is no wrong answer — only an accurate one.
          </p>
          <SoberMuseApplicationForm />
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
