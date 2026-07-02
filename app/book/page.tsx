import { Eyebrow } from "@/components/brand/Eyebrow";
import { FunnelProgress } from "@/components/funnel/FunnelProgress";
import { PlumButton } from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { TestimonialCard } from "@/components/brand/TestimonialCard";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { buildMetadata } from "@/lib/metadata";
import { CalComEmbed } from "@/components/book/CalComEmbed";
import { DepositCTA } from "@/components/book/DepositCTA";

export const metadata = buildMetadata({
  title: "Book a Consultation",
  noIndex: true,
});

const CALCOM_URL =
  process.env.NEXT_PUBLIC_CALCOM_URL || "https://cal.com/martinarink/30min";

interface BookPageProps {
  searchParams: Promise<{
    token?: string;
    programme?: string;
    cancelled?: string;
    payment_error?: string;
    calendar?: string;
  }>;
}

/**
 * /book is gated behind the application flow.
 * - Without ?token=approved (issued in the acceptance email), visitors see
 *   the gate explaining the application process.
 * - With ?token=approved, the full consultation landing page loads.
 *
 * This is intentional friction — paid €350 consultation → gate filters
 * tyre-kickers and forces the application/qualification step.
 * Determined attackers aren't the buyer for a €5k+ programme.
 */
export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams;
  const isApproved = params.token === "approved";
  const showCancelled = params.cancelled === "1";
  const showPaymentError = params.payment_error === "1";
  const showCalendar = params.calendar === "1";

  /* ═══════════════════════════════════════════════════════════════════
     GATE STATE — unapproved visitors
     Dark editorial hero → process strip → testimonial → apply CTAs
  ═══════════════════════════════════════════════════════════════════ */
  if (!isApproved) {
    return (
      <>
        {/* ── FUNNEL PROGRESS ──────────────────────────────── */}
        <FunnelProgress activeStep={4} variant="dark" />

        {/* ── HERO — dark aubergine ─────────────────────────── */}
        <section className="bg-[#231727] pt-28 md:pt-36 pb-20 md:pb-24">
          <div className="container-content max-w-2xl mx-auto text-center">

            {/* Pink gradient hairline */}
            <div
              aria-hidden
              className="h-px w-16 mx-auto mb-10"
              style={{ background: "linear-gradient(to right, transparent, #F942AA, transparent)" }}
            />

            <Eyebrow variant="light" withLine className="justify-center">
              By application
            </Eyebrow>

            <h1 className="mt-6 font-[family-name:var(--font-display)] italic
                           text-[38px] md:text-[52px] leading-[1.02] tracking-[-0.03em] text-cream">
              The consultation is offered<br className="hidden sm:block" /> after application.
            </h1>

            <p className="mt-8 text-[17px] leading-[1.8] text-cream/65 max-w-lg mx-auto
                          font-[family-name:var(--font-body)]">
              I work with a small number of women each year. Before we speak,
              I read every application personally. It is the part of my
              practice I take most seriously.
            </p>
            <p className="mt-5 text-[17px] leading-[1.8] text-cream/65 max-w-lg mx-auto
                          font-[family-name:var(--font-body)]">
              This is not gatekeeping for its own sake. It is how I stay true to the
              work — and how you arrive at the conversation knowing it is worth having.
            </p>
            <p className="mt-5 text-[17px] leading-[1.8] text-cream/65 max-w-lg mx-auto
                          font-[family-name:var(--font-body)]">
              The application is short. Five questions, answered honestly.
              I respond within forty-eight hours. If we are a fit, you receive
              the booking link by email.
            </p>

            <p className="mt-8 font-[family-name:var(--font-body)] text-[13px] uppercase
                          tracking-[0.22em] text-cream/35">
              Private consultation &middot; €350 &middot; credited in full upon enrolment
            </p>
          </div>
        </section>

        {/* ── PROCESS STRIP ────────────────────────────────── */}
        <section className="bg-bone py-14 border-t border-b border-sand/60">
          <div className="container-content max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-10 md:gap-8">
              {[
                {
                  step: "01",
                  title: "Five questions.",
                  body: "Honestly answered. I read every application personally.",
                },
                {
                  step: "02",
                  title: "Forty-eight hours.",
                  body: "My reply — and my honest assessment of fit.",
                },
                {
                  step: "03",
                  title: "The booking link.",
                  body: "Sent only if we are the right match for each other.",
                },
              ].map(({ step, title, body }) => (
                <div key={step}>
                  <p className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.28em]
                                uppercase text-pink mb-4">{step}</p>
                  <div className="h-px w-8 bg-pink mb-5" aria-hidden />
                  <p className="font-[family-name:var(--font-display)] italic text-[18px]
                                text-ink mb-2">{title}</p>
                  <p className="font-[family-name:var(--font-body)] text-[14px] leading-[1.75]
                                text-ink-soft">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL ──────────────────────────────────── */}
        <section className="bg-cream py-16 md:py-20">
          <div className="container-content max-w-2xl mx-auto">
            <TestimonialCard
              quote="Martina saw the distinction before I did. I arrived thinking I had a drinking problem. I left understanding I had a clarity problem — and the drinking had been the solution I had found for it."
              attribution="Founder — London"
              nda
              className="max-w-xl mx-auto"
            />
          </div>
        </section>

        {/* ── CTAs ─────────────────────────────────────────── */}
        <section className="bg-cream pb-24">
          <div className="container-content max-w-2xl mx-auto text-center">
            <p className="font-[family-name:var(--font-display)] italic text-[24px] text-ink mb-3">
              Which work is yours?
            </p>
            <p className="font-[family-name:var(--font-body)] text-[15px] text-ink-quiet mb-10">
              Not sure? The assessment tells you in about five minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <PlumButton href="/apply/sober-muse">
                Apply — Sober Muse Method
              </PlumButton>
              <PlumButton href="/apply/empowerment">
                Apply — Empowerment &amp; Leadership
              </PlumButton>
            </div>
            <GhostButton href="/assessment">
              Begin with the assessment →
            </GhostButton>
          </div>
        </section>
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     APPROVED STATE — accepted applicants
     Dark editorial hero → 3-col "what this is" → DepositCTA → testimonial → Calendly
  ═══════════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── FUNNEL PROGRESS ──────────────────────────────────── */}
      <FunnelProgress activeStep={4} variant="dark" />

      {/* ── HERO — dark aubergine arrival ─────────────────────── */}
      <section className="bg-[#231727] pt-28 md:pt-36 pb-20 md:pb-24">
        <div className="container-content max-w-2xl mx-auto text-center">

          {/* Pink gradient hairline */}
          <div
            aria-hidden
            className="h-px w-16 mx-auto mb-10"
            style={{ background: "linear-gradient(to right, transparent, #F942AA, transparent)" }}
          />

          <Eyebrow variant="light" withLine className="justify-center">
            A private conversation
          </Eyebrow>

          <h1 className="mt-6 font-[family-name:var(--font-display)] italic
                         text-[38px] md:text-[52px] leading-[1.02] tracking-[-0.03em] text-cream">
            Forty-five minutes.<br className="hidden sm:block" />
            Before anything else.
          </h1>

          <p className="mt-8 text-[17px] leading-[1.8] text-cream/70 max-w-lg mx-auto
                        font-[family-name:var(--font-body)]">
            This is not a sales call, and it is not a diagnostic. It is a genuine
            conversation — about where you are, what you are considering, and whether
            working together is the right move for both of us.
          </p>

          <p className="mt-6 font-[family-name:var(--font-body)] text-[13px] uppercase
                        tracking-[0.22em] text-cream/40">
            €350 &middot; Applied in full to the programme upon enrolment
          </p>

          {/* Status banners */}
          {showCancelled && (
            <p className="mt-8 text-[14px] text-cream/70 bg-white/[0.06] border border-white/10
                          px-5 py-3 inline-block font-[family-name:var(--font-body)]">
              Your payment wasn&rsquo;t completed — you can start again below.
            </p>
          )}
          {showPaymentError && (
            <p className="mt-8 text-[14px] text-cream/70 bg-white/[0.06] border border-white/10
                          px-5 py-3 inline-block font-[family-name:var(--font-body)]">
              There was an issue verifying your payment. Please try again below.
            </p>
          )}
        </div>
      </section>

      {/* ── WHAT THIS CONVERSATION IS — 3 columns ──────────────── */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-content max-w-3xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {[
              {
                step: "01",
                title: "Clarity.",
                body: "You will leave knowing whether this programme is right for you — and whether I am the right guide. The answer might be no. I will tell you if it is.",
              },
              {
                step: "02",
                title: "Mutual.",
                body: "I am deciding too. Both of us are choosing. That is the only way this kind of work begins correctly.",
              },
              {
                step: "03",
                title: "A plan, if we match.",
                body: "If we are the right fit, we build the shape of the programme together from this conversation — not after.",
              },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <p className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.28em]
                              uppercase text-pink mb-4">{step}</p>
                <div className="h-px w-8 bg-pink mb-5" aria-hidden />
                <p className="font-[family-name:var(--font-display)] italic text-[20px]
                              text-ink mb-3">{title}</p>
                <p className="font-[family-name:var(--font-body)] text-[15px] leading-[1.75]
                              text-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ─────────────────────────────────────────── */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-content max-w-2xl mx-auto">
          <TestimonialCard
            quote="The session with Martina was a thoroughly enriching experience — inspiring, motivating, and above all extremely effective. She has a wonderful way of helping you arrive at important realisations about yourself in a remarkably short time."
            attribution="Anja — Founder & Digital Business Consultant"
            className="max-w-xl mx-auto"
          />
          <p className="mt-10 text-center font-[family-name:var(--font-body)] text-[13px]
                        text-ink-quiet leading-relaxed max-w-md mx-auto">
            If, after our conversation, the timing doesn&rsquo;t feel right — I will say
            so, warmly. The fit matters as much to me as it does to you.
          </p>
        </div>
      </section>

      {/* ── DEPOSIT CTA ─────────────────────────────────────────── */}
      <section className="bg-bone py-16 md:py-20 border-t border-b border-sand/40">
        <div className="container-content max-w-lg mx-auto text-center">

          <ScriptAccent
            className="text-pink block mb-4"
            style={{ fontSize: "2rem", lineHeight: 1.2 }}
          >
            ready.
          </ScriptAccent>

          <p className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-2">
            Confirm your consultation.
          </p>
          <p className="font-[family-name:var(--font-body)] text-[14px] text-ink-quiet mb-4 max-w-sm mx-auto">
            €350 — your booking calendar opens immediately after payment,
            in the same tab.
          </p>

          <p className="font-[family-name:var(--font-body)] text-[11px] uppercase tracking-[0.2em] text-ink-quiet/70 mb-8">
            I hold four consultations per week &middot; current availability: this week
          </p>

          <div className="flex justify-center">
            <DepositCTA />
          </div>

          <p className="mt-6 font-[family-name:var(--font-body)] text-[12px] text-ink-quiet
                        leading-relaxed max-w-sm mx-auto">
            Payment confirms your consultation slot is held. Applied in full
            to your programme investment upon enrolment.
          </p>
        </div>
      </section>

      {/* ── CAL.COM — for rescheduling confirmed consultations only ── */}
      <section className="bg-cream pb-24">
        <div className="container-content max-w-3xl mx-auto">
          <details open={showCalendar} className="text-center">
            <summary className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet
                                cursor-pointer hover:text-ink-soft transition-colors
                                font-[family-name:var(--font-body)]">
              Schedule your consultation time →
            </summary>
            <div className="mt-8 bg-bone p-2">
              <CalComEmbed url={CALCOM_URL} />
            </div>
          </details>
        </div>
      </section>
    </>
  );
}
