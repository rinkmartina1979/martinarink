import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms of service for private mentoring with Martina Rink.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <article className="bg-cream pt-32 md:pt-40 pb-24">
      <div className="container-read">
        <h1 className="font-[family-name:var(--font-display)] text-[40px] text-ink mb-2">
          Terms of Service
        </h1>
        <p className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-12">
          Last updated: April 2026 — DRAFT pending legal review
        </p>

        <div className="space-y-8 text-[16px] leading-[1.75] text-ink-soft">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
              Services offered
            </h2>
            <p>
              Martina Rink offers private mentoring services through two
              programmes: the Sober Muse Method (90-day engagement) and the
              Female Empowerment &amp; Leadership programme (open-ended,
              typically 6–12 months). Delivered via private video or phone
              sessions and written correspondence.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
              Not medical or therapeutic services
            </h2>
            <p>
              The services offered are mentoring, not therapy, counselling, or
              medical treatment. Martina Rink is not a licensed therapist,
              psychologist, or physician. Where clinical support is relevant,
              clients are referred to qualified professionals, including Dr.
              Ruta Nürnberger at the My Way Betty Ford Clinic. If you are in
              crisis, please contact a qualified professional or emergency
              service.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
              Investment and payment
            </h2>
            <ul className="space-y-2 list-disc pl-6">
              <li>Sober Muse Method: from €5,000 for the 90-day programme</li>
              <li>Female Empowerment &amp; Leadership: from €7,500</li>
              <li>Private Consultation: €450 (applied to programme on enrolment)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
              Cancellation and rescheduling
            </h2>
            <p>
              Sessions may be rescheduled with 48 hours notice. Late
              cancellations under 24 hours may be charged at 50% of the session
              rate. Programme fees are non-refundable once commenced, except in
              exceptional circumstances at Martina&rsquo;s sole discretion.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
              Confidentiality
            </h2>
            <p>
              All client information is held in strict confidence. Martina Rink
              will not disclose client details or session content to any third
              party without explicit consent, except where required by law.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
              No guarantee of outcomes
            </h2>
            <p>
              Mentoring outcomes depend on many factors. No specific outcome —
              including sobriety, professional advancement, or personal change —
              is guaranteed.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
              Governing law
            </h2>
            <p>
              These terms are governed by the laws of the Federal Republic of
              Germany.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
