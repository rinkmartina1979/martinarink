import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { buildMetadata, aboutPersonSchema, breadcrumbSchema } from "@/lib/metadata";
import { getAboutPage } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutPage();
  if (data?.seo?.seoTitle) {
    return buildMetadata({
      title: data.seo.seoTitle,
      description: data.seo.seoDescription ?? undefined,
      path: "/about",
    });
  }
  return buildMetadata({
    title: "About — Author & Private Mentor",
    description:
      "Spiegel Bestseller author, former personal assistant to Isabella Blow, co-creator of People of Deutschland. Private mentor to executive women.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const data = await getAboutPage();

  const heroHeadline =
    data?.heroHeadline ??
    "I work with women who have arrived somewhere and are not entirely sure it is where they intended to go.";

  const ctaLabel = data?.ctaLabel ?? "Begin the assessment";
  const ctaUrl = data?.ctaUrl ?? "/assessment";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPersonSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([{ name: "About", path: "/about" }]),
          ),
        }}
      />
      {/* HERO */}
      <section className="bg-cream pt-32 md:pt-40 pb-12">
        <div className="container-content max-w-4xl">
          <Eyebrow withLine>About Martina Rink</Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[64px] leading-[1.05] tracking-[-0.015em] text-ink">
            {heroHeadline}
          </h1>
        </div>
      </section>

      {/* OPENING — flows from hero, no top padding */}
      <section className="bg-cream pb-16 md:pb-24">
        <div className="container-content grid md:grid-cols-12 gap-0 md:gap-16 items-start">
          <div className="md:col-span-7 pt-10 md:pt-0 space-y-6 text-[17px] leading-[1.75] text-ink-soft">
            {data?.heroCopy ? (
              data.heroCopy.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <>
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
              </>
            )}
          </div>
          <aside className="md:col-span-5 md:sticky md:top-24 md:self-start pt-10 md:pt-0">
            <div className="relative aspect-[3/4] bg-bone overflow-hidden">
              <Image
                src="/images/portraits/martina-portrait-pink-blouse.jpg"
                alt="Martina Rink"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-contain object-top"
              />
            </div>
          </aside>
        </div>
        {/* Pull quote — full-width editorial, below the grid */}
        <div className="container-content mt-16 md:mt-20 max-w-3xl">
          <blockquote className="border-l-2 border-pink pl-8 font-[family-name:var(--font-display)] italic text-[24px] md:text-[28px] leading-snug text-ink">
            The most interesting questions available to accomplished women are
            the ones they don&rsquo;t yet have the private space to ask properly.
          </blockquote>
          <p className="pl-8 mt-4 text-[12px] uppercase tracking-[0.18em] text-ink-quiet">— Martina Rink</p>
        </div>
      </section>

      {/* ISABELLA BLOW / ORIGIN — full-bleed 50/50 editorial split */}
      <section className="bg-bone overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left — full-bleed image, no container constraint */}
          <div className="relative h-[420px] md:h-auto md:min-h-[580px] bg-sand/30">
            <Image
              src="/images/portraits/martina-gallery-leopard.jpg"
              alt="Martina Rink — formative years"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          {/* Right — text with internal padding */}
          <div className="px-8 py-16 md:px-16 md:py-20 lg:px-20 space-y-6">
            <Eyebrow>The years before</Eyebrow>
            <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-tight text-ink">
              Before the practice.
            </h2>
            <div className="space-y-5 text-[17px] leading-[1.75] text-ink-soft">
              {data?.storyIsabellaBlowEra ? (
                data.storyIsabellaBlowEra.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PULL QUOTE — Isabella Blow specific authority */}
      <section className="bg-violet-soft py-14 md:py-20">
        <div className="container-content max-w-3xl mx-auto text-center">
          <span
            aria-hidden
            className="block font-[family-name:var(--font-display)] italic text-plum/40 text-[80px] leading-none"
          >
            &ldquo;
          </span>
          <blockquote className="-mt-4 font-[family-name:var(--font-display)] italic text-[26px] md:text-[34px] leading-[1.25] text-ink">
            Isabella collected people the way she collected hats — with absolute
            precision, and an instinct for who could carry weight. She placed
            McQueen, Treacy, the entire generation. What I learned was not how
            to be like her. It was how to read a room the way she read it.
          </blockquote>
          <p className="mt-10 text-[12px] uppercase tracking-[0.22em] text-ink-quiet">
            — Martina, on her years at Isabella Blow&rsquo;s side, London 2003–2007
          </p>
        </div>
      </section>

      {/* CREDENTIALS — TWO COLUMN */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-content grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-[28px] text-ink">
              The work before the work.
            </h3>
            <div className="mt-6 space-y-4 text-[17px] leading-[1.75] text-ink-soft">
              {data?.storyBooks ? (
                data.storyBooks.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <>
                  <p>
                    I have published three books: <em>Isabella Blow</em> (a Spiegel
                    Bestseller, written from unique proximity as her personal
                    assistant), <em>People of Deutschland</em> (a documentary
                    portrait of contemporary Germany, covered extensively in national
                    media), and <em>Fashion Germany</em>.
                  </p>
                  <p>
                    I mention this not as a credential list, but because context
                    matters: the women I work with are at a level where they need
                    someone who has operated in complex, high-visibility environments
                    — and who has written, publicly and carefully, about what those
                    environments cost.
                  </p>
                  <p>
                    I hold a coaching certification from the International Coaching
                    Institute (ICI), and my practice is grounded in the intersection
                    of psychological insight, lived experience, and literary precision.
                  </p>
                </>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-[28px] text-ink">
              The clinical partnership.
            </h3>
            <p className="mt-6 text-[17px] leading-[1.75] text-ink-soft">
              For clients in the Sober Muse Method who benefit from clinical
              support alongside our private work, I maintain a partnership with
              Mrs. Ruta Nürnberger at the My Way Betty Ford Clinic.
            </p>
            <p className="mt-4 text-[17px] leading-[1.75] text-ink-soft">
              Mrs. Nürnberger works with high-functioning individuals for whom
              standard treatment frameworks are not appropriate. The partnership
              is discreet, high-calibre, and available when relevant — not
              mandatory, and not foregrounded.
            </p>
          </div>
        </div>
      </section>

      {/* PERSONAL ORIGIN — DARK */}
      <section className="bg-ink py-16 md:py-24 [transform:translateZ(0)] isolate [-webkit-font-smoothing:antialiased]">
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
              {data?.storyOrigin ? (
                data.storyOrigin.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <>
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
                </>
              )}
            </div>
            <div className="space-y-5 text-[17px] leading-[1.75] text-cream/85">
              {data?.storySobriety ? (
                data.storySobriety.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <>
                  <p>
                    My own re-examination of alcohol began not from a crisis but
                    from a question. I was, by all external measures, doing well. I
                    had a life, a body of published work, a set of relationships I
                    valued, and a daily glass of plum that had quietly become a
                    different thing from what it started as.
                  </p>
                  <p>
                    I did not need a programme. I needed a conversation — precise,
                    private, conducted between equals. I did not find one that was
                    right for me. So eventually, I built it. Six years later, I am
                    still building it. For women who are, in one way or another,
                    asking the same question I was.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING + CTA */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-content max-w-2xl mx-auto text-center">
          {data?.storyWhy ? (
            <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-tight text-ink">
              {data.storyWhy}
            </h2>
          ) : (
            <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-tight text-ink">
              This is private work. It is serious. And it is available to women
              who are ready for it.
            </h2>
          )}
          <ScriptAccent className="block mt-10 text-[48px] text-plum">
            Martina
          </ScriptAccent>
          <p className="mt-10 text-[13px] uppercase tracking-[0.18em] text-ink-quiet">
            Also on{" "}
            <a
              href="https://open.spotify.com/show/martinarink"
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum underline decoration-pink decoration-1 underline-offset-4 hover:text-plum-deep transition-colors"
            >
              Spotify
            </a>
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <PlumButton href={ctaUrl}>{ctaLabel}</PlumButton>
            <GhostButton href="/sober-muse">Explore the work</GhostButton>
          </div>
        </div>
      </section>
    </>
  );
}
