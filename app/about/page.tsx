import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";
import { PageHero } from "@/components/sections/PageHero";
import { GhostButton } from "@/components/brand/GhostButton";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { TestimonialCard } from "@/components/brand/TestimonialCard";
import { buildMetadata, aboutPersonSchema, breadcrumbSchema } from "@/lib/metadata";
import { getAboutPage } from "@/sanity/lib/queries";
import { CredentialBadges } from "@/components/brand/CredentialBadges";
import { getReview } from "@/lib/testimonials";

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
  const aboutTestimonial = getReview("anja-about");

  const heroHeadline =
    data?.heroHeadline ??
    "I work with women who have arrived somewhere and are not entirely sure it is where they intended to go.";

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

      {/* 1. HERO — dark editorial split: recognition + authority + action (Option A) */}
      <PageHero
        eyebrow="About Martina Rink"
        headline={heroHeadline}
        subheadline="Private mentorship for high-achieving women whose outside life resolves on paper, but quietly no longer feels like their own."
        cta={{ label: "Begin the assessment", href: "/assessment" }}
        ctaSecondary={{ label: "Work with me privately", href: "/work-with-me" }}
        variant="dark"
        portrait={{
          src: "/images/portraits/martina-hero.jpg",
          alt: "Martina Rink — Female Empowerment Coach, Spiegel bestselling author and private mentor",
          objectPosition: "50% 20%",
        }}
      >
        <p className="mt-6 font-[family-name:var(--font-body)] text-[11px] uppercase tracking-[0.22em] leading-[1.9] text-cream/55">
          Spiegel bestselling author &middot; Founder of The Sober Muse &middot;
          Former assistant to Isabella Blow &middot; Featured in Vogue Germany
        </p>
      </PageHero>

      {/* 2. ABOUT — Martina's full story, in her own words (client copy 2026-06-17) */}
      <section className="bg-bone py-16 md:py-24">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-center">

          {/* Photo — pink-blouse editorial portrait (the design Martina approved) */}
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] bg-sand/30 overflow-hidden">
              <Image
                src="/images/portraits/martina-portrait-pink-blouse.jpg"
                alt="Martina Rink — Female Empowerment Coach, author and private mentor"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          {/* Text — eyebrow → headline → bio → signature */}
          <div className="md:col-span-7">
            <Eyebrow>About</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[34px] md:text-[46px] leading-[1.12] text-ink">
              I am interested in the distance between how a woman appears — and
              how she{" "}
              <ScriptAccent className="text-[1.1em] leading-none">
                actually feels
              </ScriptAccent>{" "}
              inside her own life.
            </h2>

            <div className="mt-8 space-y-5 text-[17px] leading-[1.75] text-ink-soft max-w-[560px]">
              <p>
                I am Martina — a Female Empowerment Coach, Sober Conscious Mentor
                of <em>The Sober Muse</em>, a Spiegel bestselling author, and a
                creative.
              </p>
              <p>
                My story has been shaped by Persian roots, adoption, and a life
                lived between Germany, London, Paris, and Ibiza — experiences
                that shaped my understanding of identity, belonging, and inner
                strength.
              </p>
              <p>
                For many years I moved within the international fashion and
                creative industry, where success, beauty, image, and strength
                were often visible on the surface — while emotional exhaustion
                remained carefully hidden underneath.
              </p>
              <p className="text-ink font-medium">I witnessed this in other women.</p>
              <p className="text-ink font-medium">And I lived my own version of it.</p>
              <p>
                Behind a life that looked accomplished, I was navigating anxiety,
                depression, social phobia, and a relationship with alcohol that
                had quietly become something I could no longer ignore.
              </p>
              <p>
                Choosing sobriety became a profound turning point. It was the
                moment I stopped running from myself. This is where my work was
                born — not from theory, but from lived transformation.
              </p>
              <p>
                I did not want a programme. I wanted a conversation — precise,
                private, conducted between equals. I did not find one that felt
                right for me, so I built it.
              </p>
              <p>
                Today I work primarily with high-achieving women, creative
                entrepreneurs, founders, and visionaries who are ready to release
                old patterns, reconnect with themselves, and create a more
                conscious, sober, and aligned life.
              </p>
              <p>
                My work is my calling: to create spaces where women no longer
                have to lose themselves in order to succeed, be loved, be
                admired, or belong. Spaces where they can return to who they are
                — with greater awareness, emotional freedom, and genuine inner
                strength.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ScriptAccent className="text-[38px]">Martina</ScriptAccent>
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
                Author &middot; Mentor &middot; Ibiza &middot; Berlin &middot; London &middot; International
              </span>
            </div>
          </div>
        </div>

        {/* Soft CTA — first private door, placed at the first emotional peak */}
        <div className="container-content mt-12 md:mt-14">
          <p className="font-[family-name:var(--font-display)] italic text-[20px] md:text-[24px] leading-snug text-ink-soft">
            If this feels familiar,{" "}
            <Link
              href="/assessment"
              className="text-plum underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-plum"
            >
              begin with the private assessment
            </Link>
            .
          </p>
        </div>

        {/* Pull quote — full-width, below the grid */}
        <div className="container-content mt-16 md:mt-20 max-w-3xl">
          <blockquote className="border-l-2 border-pink pl-8 font-[family-name:var(--font-display)] italic text-[24px] md:text-[28px] leading-snug text-ink">
            I have always known what it is to inhabit a life that was not quite
            built around you.
          </blockquote>
          <p className="pl-8 mt-4 text-[12px] uppercase tracking-[0.18em] text-ink-quiet">
            — Martina Rink
          </p>
        </div>
      </section>

      {/* 2b. PRESS STRIP — authority proof immediately after the human story */}
      <section className="bg-cream border-y border-sand/40 py-10 md:py-12">
        <div className="container-content">
          <p className="mb-7 text-center text-[10px] uppercase tracking-[0.3em] text-ink-quiet">
            As featured in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-14">
            {["Vogue Germany", "Der Spiegel", "Die Zeit", "Spiegel Bestseller"].map(
              (name) => (
                <span
                  key={name}
                  className="font-[family-name:var(--font-display)] text-[18px] md:text-[22px] tracking-wide text-ink/70"
                >
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 4. ISABELLA BLOW — 'Before the practice', full-bleed 50/50 editorial split */}
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
      <section className="bg-rose py-14 md:py-20">
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


      {/* 5. THE EVIDENCE — books + named clinical reference (Nürnberger permission on file 2026-06-15) */}
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
                    Spiegel Bestseller, written from unique proximity as her personal
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
                    and Ayurveda — each chosen not for its certificate but for what
                    it adds to the room. The sobriety work operates under a distinct
                    name: The Sober Muse. A private method, built from the inside.
                  </p>
                </>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-[28px] text-ink">
              The clinical knowledge.
            </h3>
            <p className="mt-6 text-[17px] leading-[1.75] text-ink-soft">
              For Sober Muse clients, I maintain a close professional
              relationship with Mrs. N&uuml;rnberger, Head Physician at the
              My Way Betty Ford Clinic — one of Germany&rsquo;s leading
              addiction clinics. She was formerly my own doctor, and has since
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

      {/* 6. WHY WOMEN COME — peer mirror + selectivity signal */}
      <section className="bg-bone py-16 md:py-20">
        <div className="container-content max-w-3xl mx-auto">
          <Eyebrow>Why women come</Eyebrow>
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-tight text-ink">
            The situation is usually recognisable before the words are.
          </h2>
          <ul className="mt-10 space-y-8">
            <li className="grid grid-cols-[2px_1fr] gap-8 items-start">
              <span aria-hidden className="block w-px h-full bg-pink mt-1" />
              <p className="text-[17px] leading-[1.75] text-ink-soft">
                A founder who has exited successfully and cannot understand why
                the arrival feels nothing like she imagined. The metrics are
                right. Something else is not.
              </p>
            </li>
            <li className="grid grid-cols-[2px_1fr] gap-8 items-start">
              <span aria-hidden className="block w-px h-full bg-pink mt-1" />
              <p className="text-[17px] leading-[1.75] text-ink-soft">
                A senior executive at the top of the right career who has
                quietly begun to suspect it may be the wrong mountain. The
                question is not what to do next. It is who she is without
                the title.
              </p>
            </li>
            <li className="grid grid-cols-[2px_1fr] gap-8 items-start">
              <span aria-hidden className="block w-px h-full bg-pink mt-1" />
              <p className="text-[17px] leading-[1.75] text-ink-soft">
                A woman who has been re-examining her relationship with alcohol
                — not dramatically, not in crisis, but with the growing clarity
                that one chapter has ended and she has not yet found the language
                for what comes next.
              </p>
            </li>
          </ul>
          {/* Selectivity line becomes the mid-page door (CRO: convert at the scarcity moment) */}
          <div className="mt-12 border-t border-sand/40 pt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <p className="text-[15px] leading-[1.8] text-ink-soft max-w-md">
              I work with a small number of women at a time. Privately.
            </p>
            <GhostButton href="/work-with-me">Work with me privately</GhostButton>
          </div>
        </div>
      </section>

      {/* 7. ONE TESTIMONIAL — client evidence, max 1 per brand rules.
          Pulled from lib/testimonials.ts single source of truth (quote + portrait). */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-content">
          <TestimonialCard
            quote={aboutTestimonial.quote}
            attribution={`${aboutTestimonial.name} — ${aboutTestimonial.role}`}
            photoPath={aboutTestimonial.photoPath}
            nda={aboutTestimonial.nda}
            className="bg-rose"
          />
        </div>
      </section>

      {/* 8. ACCREDITATIONS — quiet, demoted visual weight */}
      <section className="bg-bone border-t border-sand/30">
        <div className="container-content">
          <CredentialBadges variant="block" />
        </div>
      </section>

      {/* 9. CLOSING + CTA — primary door is now /work-with-me */}
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
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <PlumButton href="/work-with-me">Work with me privately</PlumButton>
            <GhostButton href="/assessment">Begin the assessment</GhostButton>
          </div>
        </div>
      </section>
    </>
  );
}
