import { Eyebrow } from "@/components/brand/Eyebrow";
import { WineButton } from "@/components/brand/WineButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About — Author & Private Mentor",
  description:
    "Spiegel Bestseller author, former personal assistant to Isabella Blow, co-creator of People of Deutschland. Private mentor to executive women.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-cream pt-32 md:pt-40 pb-16">
        <div className="container-content max-w-4xl">
          <Eyebrow withLine>About Martina Rink</Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[64px] leading-[1.05] tracking-[-0.015em] text-ink">
            I work with women who have arrived somewhere and are not entirely
            sure it is where they intended to go.
          </h1>
        </div>
      </section>

      {/* OPENING */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7 space-y-6 text-[17px] leading-[1.75] text-ink-soft">
            <p>
              The women I work with are accomplished. They have built careers,
              led teams, navigated complex personal landscapes with intelligence
              and, usually, with some grace.
            </p>
            <p>
              What they share — the thing that brings them to this conversation
              — is a very specific quality of awareness. The sense that
              something, at the level they are now operating, is not quite
              right. Not wrong enough to name easily. Not obvious enough to
              explain to anyone else.
            </p>
          </div>
          <aside className="md:col-span-5">
            <blockquote className="border-l-2 border-pink pl-6 font-[family-name:var(--font-display)] italic text-[24px] leading-snug text-ink">
              The most interesting questions available to accomplished women are
              the ones they don&rsquo;t yet have the private space to ask
              properly.
            </blockquote>
            <p className="mt-4 pl-6 text-[13px] uppercase tracking-[0.15em] text-ink-quiet">
              — Martina Rink
            </p>
          </aside>
        </div>
      </section>

      {/* ISABELLA BLOW / ORIGIN */}
      <section className="bg-bone section-pad">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5">
            <div className="aspect-[4/5] bg-sand/30 flex items-center justify-center text-ink-quiet text-[12px] uppercase tracking-[0.18em]">
              Isabella Blow Era
            </div>
          </div>
          <div className="md:col-span-7 space-y-6">
            <Eyebrow>The years before</Eyebrow>
            <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-tight text-ink">
              Before the practice.
            </h2>
            <div className="space-y-5 text-[17px] leading-[1.75] text-ink-soft">
              <p>
                I spent several formative years working as personal assistant to
                Isabella Blow in London. Isabella was, by any reasonable
                account, one of the most extraordinary women of her generation —
                a creator, an instigator, a woman who lived entirely from her
                own vision.
              </p>
              <p>
                What I observed, working closely with her, was something that I
                have spent the years since trying to articulate: the particular
                cost of being fully, unapologetically yourself in a world that
                finds that either inconvenient or consumable. The commitment to
                one&rsquo;s own interior, even when the exterior is being
                dismantled.
              </p>
              <p>It was an education that no institution offers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CREDENTIALS — TWO COLUMN */}
      <section className="bg-cream section-pad">
        <div className="container-content grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-[28px] text-ink">
              The work before the work.
            </h3>
            <p className="mt-6 text-[17px] leading-[1.75] text-ink-soft">
              I have published three books: <em>Isabella Blow</em> (a Spiegel
              Bestseller, written from unique proximity as her personal
              assistant), <em>People of Deutschland</em> (a documentary
              portrait of contemporary Germany, covered extensively in national
              media), and <em>Fashion Germany</em>.
            </p>
            <p className="mt-4 text-[17px] leading-[1.75] text-ink-soft">
              I mention this not as a credential list, but because context
              matters: the women I work with are at a level where they need
              someone who has operated in complex, high-visibility environments
              — and who has written, publicly and carefully, about what those
              environments cost.
            </p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-[28px] text-ink">
              The clinical partnership.
            </h3>
            <p className="mt-6 text-[17px] leading-[1.75] text-ink-soft">
              For clients in the Sober Muse Method who benefit from clinical
              support alongside our private work, I maintain a partnership with
              Dr. Ruta Nürnberger at the My Way Betty Ford Clinic.
            </p>
            <p className="mt-4 text-[17px] leading-[1.75] text-ink-soft">
              Dr. Nürnberger works with high-functioning individuals for whom
              standard treatment frameworks are not appropriate. The partnership
              is discreet, high-calibre, and available when relevant — not
              mandatory, and not foregrounded.
            </p>
          </div>
        </div>
      </section>

      {/* PERSONAL ORIGIN — DARK */}
      <section className="bg-ink section-pad">
        <div className="container-content max-w-3xl mx-auto">
          <Eyebrow>
            <span className="text-pink-soft">Where this started</span>
          </Eyebrow>
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-[42px] md:text-[52px] leading-tight text-cream">
            I have always known what it is to inhabit a life that was not quite
            built around you.
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-10">
            <div className="space-y-5 text-[17px] leading-[1.75] text-cream/85">
              <p>
                I was born in Persia and adopted by German parents shortly after
                birth. I grew up in Germany and London, and attended boarding
                school — an education that, alongside the academic curriculum,
                offered a thorough introduction to what people use when the
                interior becomes too much.
              </p>
              <p>
                I have lived, from the beginning, with a particular kind of
                question: who am I, underneath the circumstances I was placed
                in? It is a question that does not have a final answer, but
                which can be lived in a great deal more consciously than most of
                us manage.
              </p>
            </div>
            <div className="space-y-5 text-[17px] leading-[1.75] text-cream/85">
              <p>
                My own re-examination of alcohol began not from a crisis but
                from a question. I was, by all external measures, doing well. I
                had a life, a body of published work, a set of relationships I
                valued, and a daily glass of wine that had quietly become a
                different thing from what it started as.
              </p>
              <p>
                I did not need a programme. I needed a conversation — precise,
                private, conducted between equals. I did not find one that was
                right for me. So eventually, I built it. Six years later, I am
                still building it. For women who are, in one way or another,
                asking the same question I was.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING + CTA */}
      <section className="bg-cream section-pad">
        <div className="container-content max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-tight text-ink">
            This is private work. It is serious. And it is available to women
            who are ready for it.
          </h2>
          <ScriptAccent className="block mt-10 text-[48px] text-wine">
            Martina
          </ScriptAccent>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <WineButton href="/assessment">Begin the assessment</WineButton>
            <GhostButton href="/sober-muse">Explore the work</GhostButton>
          </div>
        </div>
      </section>
    </>
  );
}
