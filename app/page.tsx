import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { WineButton } from "@/components/brand/WineButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { AuthorityStrip } from "@/components/brand/AuthorityStrip";
import { TestimonialCard } from "@/components/brand/TestimonialCard";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata();

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 bg-cream overflow-hidden">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7 lg:col-span-7">
            <Eyebrow withLine>For the woman who already has it all</Eyebrow>

            <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] sm:text-[56px] md:text-[72px] lg:text-[82px] leading-[0.95] tracking-[-0.02em] text-ink">
              You&rsquo;ve built a life that looks{" "}
              <em className="italic">extraordinary</em> from the outside
              <br className="hidden md:inline" />
              <ScriptAccent className="block mt-2 text-[0.7em] leading-none">
                — and yet.
              </ScriptAccent>
            </h1>

            <p className="mt-8 max-w-[520px] text-[19px] leading-[1.65] text-ink-soft">
              The career. The recognition. The particular kind of life that, on
              paper, resolves. And somewhere — quietly, between the Sunday
              afternoons and the 4am recalibrations — something has stopped
              feeling like yours. I work with a small number of women at a time.
              Privately.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-5 sm:items-center">
              <WineButton href="/assessment">Begin the assessment</WineButton>
              <Link
                href="/work-with-me"
                className="text-[15px] text-ink underline decoration-pink decoration-1 underline-offset-[6px] hover:text-pink transition-colors"
              >
                Or explore the work →
              </Link>
            </div>
          </div>

          {/* Portrait placeholder — replace with editorial image */}
          <div className="md:col-span-5 lg:col-span-5 relative">
            <div className="relative aspect-[3/4] bg-bone overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-ink-quiet text-[12px] uppercase tracking-[0.18em]">
                Editorial Portrait
              </div>
              <ScriptAccent
                as="div"
                className="absolute -bottom-2 -right-2 md:bottom-4 md:right-4 text-[28px] md:text-[32px] -rotate-2"
              >
                welcome home, love
              </ScriptAccent>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AUTHORITY STRIP ─────────────────────────────────── */}
      <AuthorityStrip />

      {/* ─── TWO WAYS IN ─────────────────────────────────────── */}
      <section className="bg-cream section-pad">
        <div className="container-content">
          <div className="max-w-3xl">
            <Eyebrow>Two ways in</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.015em] text-ink">
              Most women arrive through one of two doors. They are closer to
              each other than they look.
            </h2>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                roman: "I.",
                title: "The Sober Muse Method",
                tagline: "For the woman re-examining alcohol.",
                body: "Not because it has become a problem. Because it has become a question. A 90-day private engagement — no group sessions, no recovery narrative, no one-size-fits-all framework. One woman, one mentor.",
                meta: "90 days · private · from €5,000",
                href: "/sober-muse",
              },
              {
                roman: "II.",
                title: "Female Empowerment & Leadership",
                tagline: "For the woman navigating identity, presence, and what comes next.",
                body: "There is a particular exhaustion that comes not from doing too much, but from being someone who no longer quite fits. The container you built has stopped being the same size as you are. This is information. And it is the beginning of the most interesting work available to you.",
                meta: "6–12 months · open-ended · from €7,500",
                href: "/empowerment",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative bg-cream border border-sand/50 p-10 md:p-12 hover:border-pink hover:-translate-y-1 transition-all duration-300"
              >
                <span className="block font-[family-name:var(--font-display)] italic text-pink-soft text-[42px] leading-none">
                  {card.roman}
                </span>
                <h3 className="mt-6 font-[family-name:var(--font-display)] text-[28px] text-ink leading-tight">
                  {card.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-display)] italic text-[18px] text-ink-soft">
                  {card.tagline}
                </p>
                <p className="mt-6 text-[16px] leading-[1.7] text-ink-soft">
                  {card.body}
                </p>
                <p className="mt-8 text-[12px] uppercase tracking-[0.15em] text-ink-quiet">
                  {card.meta}
                </p>
                <p className="mt-6 text-[14px] text-wine font-medium group-hover:text-pink transition-colors">
                  Explore →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT TEASER ────────────────────────────────────── */}
      <section className="bg-bone section-pad">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5">
            <div className="aspect-[4/5] bg-sand/30 flex items-center justify-center text-ink-quiet text-[12px] uppercase tracking-[0.18em]">
              Editorial Portrait
            </div>
          </div>
          <div className="md:col-span-7">
            <Eyebrow>About</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-[1.15] text-ink">
              I am interested in the distance between how a woman appears — and
              how she{" "}
              <ScriptAccent className="text-[1.1em] leading-none">
                actually feels
              </ScriptAccent>{" "}
              inside her own life.
            </h2>
            <div className="mt-8 space-y-5 text-[17px] leading-[1.7] text-ink-soft max-w-[560px]">
              <p>
                Before I built this practice, I worked as personal assistant to
                Isabella Blow in London. I co-created People of Deutschland. I
                wrote a book that became a Spiegel Bestseller.
              </p>
              <p>
                None of that is the work. The work is what I do now: sit with
                women who are accomplished enough to know that accomplishment is
                not the answer, and precise enough to want a real conversation.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-6">
              <ScriptAccent className="text-[38px]">Martina</ScriptAccent>
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
                Author · Mentor · Ibiza · Berlin
              </span>
            </div>
            <Link
              href="/about"
              className="mt-8 inline-block text-[14px] text-wine underline decoration-pink decoration-1 underline-offset-[6px]"
            >
              Read the longer version →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ASSESSMENT TEASER (DARK) ────────────────────────── */}
      <section className="relative bg-navy section-pad overflow-hidden">
        <div
          aria-hidden
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.08] bg-pink"
        />
        <div className="container-content relative max-w-3xl mx-auto text-center">
          <Eyebrow className="justify-center">
            <span className="text-pink-soft">A private assessment</span>
          </Eyebrow>
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[56px] leading-[1.05] text-cream">
            Which of two patterns is most alive in your life right now?
          </h2>
          <p className="mt-8 text-[19px] leading-[1.65] text-cream/80 max-w-[520px] mx-auto">
            Seven questions. About four minutes. At the end, a letter — written
            specifically for where you are. Not a quiz. Not a quadrant. A
            beginning.
          </p>
          <div className="mt-10">
            <GhostButton variant="light" href="/assessment">
              Begin the assessment
            </GhostButton>
          </div>
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-cream/50">
            Private · Confidential · Always
          </p>
        </div>
      </section>

      {/* ─── TESTIMONIAL ─────────────────────────────────────── */}
      <section className="bg-cream section-pad">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center">
            <Eyebrow className="justify-center">
              Women who have done this work
            </Eyebrow>
            <span className="block mt-8 text-pink text-[14px]">✦ ✦</span>
            <blockquote className="mt-6 font-[family-name:var(--font-display)] italic text-[28px] md:text-[34px] leading-[1.3] text-ink">
              I stopped being surprised by myself. The work wasn&rsquo;t a
              rebuild — it was the return of a woman I&rsquo;d quietly stopped
              expecting.
            </blockquote>
            <p className="mt-8 text-[12px] uppercase tracking-[0.22em] text-ink-quiet">
              — Clara · Founder · London
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
