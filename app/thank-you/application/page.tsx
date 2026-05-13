import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { GhostButton } from "@/components/brand/GhostButton";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Your application has been received",
  noIndex: true,
});

/**
 * /thank-you/application — post-submit confirmation for the application form.
 *
 * Strategic purpose: bridge the 48-hour silent gap between submission and
 * Martina's personal reply. Without this, applicants second-guess, lose
 * momentum, or assume the form broke. The page acknowledges weight, reinforces
 * the decision, and gives them something to read while they wait.
 */
export default function ApplicationThankYouPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-cream pt-32 md:pt-40 pb-16">
        <div className="container-content max-w-2xl mx-auto text-center">
          <Eyebrow className="justify-center" withLine>
            Received
          </Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[42px] md:text-[56px] leading-[1.08] text-ink">
            Your application is in front of me.
          </h1>
          <ScriptAccent className="block mt-8 text-[44px] text-plum">
            thank you.
          </ScriptAccent>
          <p className="mt-10 text-[17px] leading-[1.75] text-ink-soft">
            I read every application myself. Not in a queue, not by an
            assistant. You will hear from me, personally, within 48 hours.
          </p>
          <p className="mt-5 text-[17px] leading-[1.75] text-ink-soft">
            You&rsquo;ll receive a short confirmation in your inbox in the next
            few minutes. The longer letter — the one that actually responds to
            what you wrote — follows from me directly.
          </p>
        </div>
      </section>

      {/* ── WHAT HAPPENS NEXT ─────────────────────────────────── */}
      <section className="bg-bone py-14 md:py-20 border-t border-b border-sand/60">
        <div className="container-content max-w-3xl mx-auto">
          <p className="text-center text-[12px] uppercase tracking-[0.22em] text-ink-quiet mb-12">
            What happens next
          </p>
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {[
              {
                step: "Within minutes",
                title: "A confirmation",
                body: "A short note from me, sent automatically, so you know your application arrived.",
              },
              {
                step: "Within 48 hours",
                title: "A personal reply",
                body: "I read what you wrote and respond. If the fit is right, you receive a private booking link.",
              },
              {
                step: "If we speak",
                title: "A private consultation",
                body: "Forty-five minutes. A real conversation about whether the work is right for both of us.",
              },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <p className="text-[11px] tracking-[0.22em] uppercase text-ink-quiet mb-3">
                  {step}
                </p>
                <p className="font-[family-name:var(--font-display)] text-[20px] text-ink mb-3">
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

      {/* ── WHILE YOU WAIT ─────────────────────────────────────── */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container-content max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] italic text-[28px] md:text-[32px] text-ink">
            While you wait.
          </h2>
          <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft">
            If you&rsquo;d like to read more in the meantime — about the work,
            about the women I write for, about why I built this practice the way
            I did — three pieces are below.
          </p>
          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "What high-functioning women use alcohol for",
                slug: "what-high-functioning-women-use-alcohol-for",
              },
              {
                title: "The identity underneath the title",
                slug: "the-identity-underneath-the-title",
              },
              {
                title: "On elegance and edges — Isabella Blow",
                slug: "on-elegance-and-edges-isabella-blow",
              },
            ].map((piece) => (
              <Link
                key={piece.slug}
                href={`/writing/${piece.slug}`}
                className="group block bg-bone p-6 hover:bg-violet-soft transition-colors duration-200"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                  Essay
                </p>
                <p className="font-[family-name:var(--font-display)] text-[18px] leading-tight text-ink group-hover:text-plum transition-colors">
                  {piece.title}
                </p>
                <p className="mt-4 text-[12px] uppercase tracking-[0.15em] text-plum">
                  Read →
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-14">
            <GhostButton href="/writing">All writing →</GhostButton>
          </div>
        </div>
      </section>

      {/* ── A FINAL NOTE ───────────────────────────────────────── */}
      <section className="bg-bone py-12 border-t border-sand/60">
        <div className="container-content max-w-2xl mx-auto text-center">
          <p className="font-[family-name:var(--font-display)] italic text-[18px] text-ink-soft leading-[1.6]">
            If, after reading what you wrote, I don&rsquo;t think the work is
            the right fit — I will say so, plainly and warmly. The fit matters
            as much to me as it does to you.
          </p>
          <p className="mt-8 text-[13px] uppercase tracking-[0.18em] text-ink-quiet">
            — Martina
          </p>
        </div>
      </section>
    </>
  );
}
