import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { buildMetadata } from "@/lib/metadata";
import { CalendlyEmbed } from "@/components/book/CalendlyEmbed";
import { DepositCTA } from "@/components/book/DepositCTA";

export const metadata = buildMetadata({
  title: "Book a Consultation",
  noIndex: true,
});

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/martinarink/let-s-make-a-change";

interface BookPageProps {
  searchParams: Promise<{
    token?: string;
    programme?: string;
    cancelled?: string;
    payment_error?: string;
  }>;
}

/**
 * /book is gated behind the application flow.
 * - Without ?token=approved (issued in the acceptance email), visitors see
 *   the gate explaining the application process.
 * - With ?token=approved, the Calendly embed loads.
 *
 * This is intentional friction — see strategic plan:
 * paid €450 consultation → gate filters tyre-kickers and forces
 * the application/qualification step. Determined attackers aren't
 * the buyer for a €5k+ programme; this is a soft filter, not security.
 */
export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams;
  const isApproved = params.token === "approved";
  const showCancelled = params.cancelled === "1";
  const showPaymentError = params.payment_error === "1";

  if (!isApproved) {
    return (
      <>
        {/* ── GATE ───────────────────────────────────────────── */}
        <section className="bg-cream pt-32 md:pt-40 pb-12">
          <div className="container-content max-w-2xl mx-auto text-center">
            <Eyebrow className="justify-center" withLine>
              By application
            </Eyebrow>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[52px] leading-tight text-ink">
              The private consultation is offered after application.
            </h1>
            <p className="mt-8 text-[17px] leading-[1.75] text-ink-soft">
              I work with a small number of women each year. Before we speak,
              I read every application personally. It is the part of my
              practice I take most seriously — and the reason the work itself
              is what it is.
            </p>
            <p className="mt-6 text-[17px] leading-[1.75] text-ink-soft">
              The application is short. Five questions, answered honestly. I
              respond within forty-eight hours. If we are a fit, you receive
              the booking link in that email.
            </p>
            <p className="mt-8 text-[15px] text-ink-quiet">
              Private consultation: €450, applied in full to the programme
              investment upon enrolment.
            </p>
          </div>
        </section>

        {/* ── PROCESS ────────────────────────────────────────── */}
        <section className="bg-bone py-12 border-t border-b border-sand/60">
          <div className="container-content max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "You apply",
                  body: "Five questions. Honestly answered. About ten minutes.",
                },
                {
                  step: "02",
                  title: "I read it personally",
                  body: "Every application. Reply within 48 hours.",
                },
                {
                  step: "03",
                  title: "We speak",
                  body: "If we are a fit, you receive a private booking link.",
                },
              ].map(({ step, title, body }) => (
                <div key={step}>
                  <p className="text-[11px] tracking-[0.22em] uppercase text-ink-quiet mb-3">
                    {step}
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-[18px] text-ink mb-2">
                    {title}
                  </p>
                  <p className="text-[14px] leading-[1.7] text-ink-soft">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTAs ───────────────────────────────────────────── */}
        <section className="bg-cream py-20">
          <div className="container-content max-w-2xl mx-auto text-center">
            <p className="font-[family-name:var(--font-display)] italic text-[22px] text-ink mb-10">
              Choose the work that fits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PlumButton href="/apply/sober-muse">
                Apply — Sober Muse Method
              </PlumButton>
              <PlumButton href="/apply/empowerment">
                Apply — Empowerment & Leadership
              </PlumButton>
            </div>
            <p className="mt-10 text-[14px] text-ink-quiet">
              Not sure which fits?{" "}
              <Link
                href="/assessment"
                className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
              >
                Begin with the seven-question assessment
              </Link>
              .
            </p>
            <div className="mt-10">
              <GhostButton href="/work-with-me">Or read about the work →</GhostButton>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Approved — show deposit CTA + Calendly embed
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-cream pt-32 md:pt-40 pb-12">
        <div className="container-content max-w-2xl mx-auto text-center">
          <Eyebrow className="justify-center" withLine>
            A private conversation
          </Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[52px] leading-tight text-ink">
            A forty-five minute conversation, before anything else.
          </h1>
          <p className="mt-8 text-[17px] leading-[1.75] text-ink-soft">
            This is not a sales call, and it is not complimentary coaching.
            It&rsquo;s a genuine conversation — about where you are, what
            you&rsquo;re considering, and whether working together is right for
            both of us. I hold four of these a week.
          </p>
          <p className="mt-6 text-[15px] text-ink-quiet">
            €450, applied to the programme if you proceed.
          </p>

          {/* Status banners */}
          {showCancelled && (
            <p className="mt-6 text-[14px] text-ink-soft bg-bone border border-sand/50 px-5 py-3 inline-block">
              Your payment wasn&rsquo;t completed — the calendar is still available below.
            </p>
          )}
          {showPaymentError && (
            <p className="mt-6 text-[14px] text-ink-soft bg-bone border border-sand/50 px-5 py-3 inline-block">
              There was an issue verifying your payment. Please try again or use the calendar below.
            </p>
          )}

          {/* Primary CTA */}
          <div className="mt-10 flex justify-center">
            <DepositCTA />
          </div>
        </div>
      </section>

      {/* ── CALENDLY EMBED ───────────────────────────────────── */}
      <section className="bg-cream pb-24">
        <div className="container-content max-w-3xl mx-auto">
          <p className="text-[13px] text-ink-quiet text-center mb-6">
            If you have received a complimentary booking link, the calendar is below.
          </p>
          <div className="bg-bone p-2">
            {/* CalendlyEmbed listens for the embed postMessage event and
                notifies our backend when a booking completes — free-tier safe */}
            <CalendlyEmbed url={CALENDLY_URL} />
          </div>
          <p className="mt-8 text-center text-[14px] text-ink-quiet leading-relaxed">
            If, after our conversation, the timing doesn&rsquo;t feel right —
            I&rsquo;ll say so, warmly. The fit matters as much to me as it does
            to you.
          </p>
        </div>
      </section>
    </>
  );
}
