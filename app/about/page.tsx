import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";
import { PageHero } from "@/components/sections/PageHero";
import { GhostButton } from "@/components/brand/GhostButton";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { buildMetadata, aboutPersonSchema, breadcrumbSchema } from "@/lib/metadata";
import { SITE } from "@/lib/utils";
import { getAboutPage } from "@/sanity/lib/queries";
import { CredentialBadges } from "@/components/brand/CredentialBadges";

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
      "Spiegel Bestseller author, former personal assistant to Isabella Blow, co-creator of People of Deutschland. Private mentor to female entrepreneurs, founders, and creatives.",
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
      <PageHero
        eyebrow="About Martina Rink"
        headline={heroHeadline}
        variant="light"
      />

      {/* OPENING — flows from hero, no top padding */}
      <section className="bg-cream pb-16 md:pb-24">
        <div className="container-content grid lg:grid-cols-[1.1fr_0.75fr] gap-0 lg:gap-16 lg:items-start">
          <div className="pt-10 lg:pt-0 space-y-6 text-[17px] leading-[1.75] text-ink-soft">
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

          {/* Portrait — full image, no crop */}
          <aside className="lg:sticky lg:top-24 lg:self-start pt-10 lg:pt-4">
            <div className="mx-auto w-full max-w-[480px] lg:max-w-full bg-[#F8F4F1]">
              <Image
                src="/images/portraits/martina-portrait-pink-blouse.jpg"
                alt="Martina Rink seated beside flowers"
                width={1324}
                height={1322}
                sizes="(min-width: 1024px) 38vw, 92vw"
                className="h-auto w-full object-contain"
                priority
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
          <div className="relative h-[480px] md:h-auto md:min-h-[600px] bg-[#EDE8E0]">
            <Image
              src="/images/portraits/martina-before-practice.jpg"
              alt="Martina Rink — pink blouse, roses, Chanel and Vogue books"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-[center_18%]"
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
      <section className="bg-blush py-14 md:py-20">
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
            — Martina, on her years at Isabella Blow&rsquo;s side, London 2004–2007
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
                    I have published three books: <em>Isabella Blow</em> (a
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
                    My practice draws on formal training across coaching, NLP,
                    hypnotherapy, sobriety consulting, Transcendental Meditation,
                    and Ayurveda — each discipline chosen not for its certificate
                    but for what it adds to the room.
                  </p>
                </>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-[28px] text-ink">
              The Clinical Knowledge.
            </h3>
            <p className="mt-6 text-[17px] leading-[1.75] text-ink-soft">
              For Sober Muse clients, I maintain a close professional
              relationship with Mrs. Ruta Nürnberger, Head Physician of the
              My Way Betty Ford Clinic — who was my own doctor and has since
              become a trusted advisor to this work.
            </p>
            <p className="mt-4 text-[17px] leading-[1.75] text-ink-soft">
              The methods I use were shaped through that experience. What I
              bring is not theory — it is a framework I have lived, tested,
              and refined over six years of practice with women navigating
              the same question.
            </p>
          </div>
        </div>
      </section>

      {/* PERSONAL ORIGIN — DARK */}
      <section className="bg-aubergine py-16 md:py-24 [transform:translateZ(0)] isolate [-webkit-font-smoothing:antialiased]">
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TRAINING RECORD */}
      <section className="bg-cream py-16 md:py-20 border-t border-sand/30">
        <div className="container-content max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink-quiet mb-10 font-[family-name:var(--font-body)]">
            Training record
          </p>
          <div className="space-y-0 divide-y divide-sand/30">
            {[
              { year: "2024", credential: "Personal & Business Life Coach", institution: "Coaching & Training Academy, Munich" },
              { year: "2024", credential: "Hypno-Coach", institution: "Coaching & Training Academy, Munich" },
              { year: "2023–24", credential: "NLP Practitioner", institution: "Coaching & Training Academy, Munich" },
              { year: "2021", credential: "Sobriety Consultant", institution: "Coaching & Training Academy, Munich" },
              { year: "2020", credential: "Transcendental Meditation", institution: "Dr. med. Ulrich Bauhofer" },
            ].map((item) => (
              <div key={item.credential} className="grid grid-cols-[80px_1fr] gap-6 py-5 items-baseline">
                <span className="text-[12px] uppercase tracking-[0.16em] text-ink-quiet font-[family-name:var(--font-body)] shrink-0">
                  {item.year}
                </span>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-[17px] text-ink leading-snug">
                    {item.credential}
                  </p>
                  <p className="mt-1 text-[13px] text-ink-quiet font-[family-name:var(--font-body)]">
                    {item.institution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCREDITATIONS */}
      <section className="bg-bone border-t border-sand/30">
        <div className="container-content">
          <CredentialBadges variant="block" />
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
              This is private work. It is serious, and it is available to women
              who are ready for it.
            </h2>
          )}
          <ScriptAccent className="block mt-10 text-[48px] text-plum">
            Martina
          </ScriptAccent>
          <p className="mt-10 text-[13px] uppercase tracking-[0.18em] text-ink-quiet">
            Also on{" "}
            <a
              href={SITE.social.spotify}
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
