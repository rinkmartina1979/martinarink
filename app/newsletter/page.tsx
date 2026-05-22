import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { buildMetadata, breadcrumbSchema } from "@/lib/metadata";
import { getNewsletterPage } from "@/sanity/lib/queries";
import { SITE } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getNewsletterPage();
  if (data?.seo?.seoTitle) {
    return buildMetadata({
      title: data.seo.seoTitle,
      description: data.seo.seoDescription ?? undefined,
      path: "/newsletter",
    });
  }
  return buildMetadata({
    title: "The Sober Muse Letter — Martina Rink",
    description:
      "One letter, once a week. For the woman who reads carefully. Identity, leadership, the examined life. A small, private list.",
    path: "/newsletter",
  });
}

/* ── Static testimonials ───────────────────────────────────────── */
const READER_VOICES = [
  {
    quote: "The most honest writing I have read about what it actually costs to be excellent at everything.",
    name: "C.B.",
    role: "Managing Director, Munich",
  },
  {
    quote: "I read it slowly, on Sunday morning, with the door closed. It is the only letter I do not delete immediately.",
    name: "E.H.",
    role: "Partner, London",
  },
  {
    quote: "It does not tell you what to do. It asks better questions.",
    name: "A.V.",
    role: "Senior Counsel, Berlin",
  },
];

const RECENT_THEMES = [
  "The architecture of a controlled life",
  "Why ambition and alcohol are so often paired",
  "The particular loneliness of external success",
  "What happens when the role no longer fits",
  "On Isabella Blow and the cost of radical vision",
  "The woman who disappears into her own CV",
  "Coming home to yourself after decades of performance",
];

export default async function NewsletterPage() {
  const data = await getNewsletterPage();

  const headline =
    data?.headline ?? "A letter, once a week.";
  const subheadline =
    data?.subheadline ?? "For the woman who reads carefully.";
  const trustNote =
    data?.trustNote ?? null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([{ name: "The Sober Muse Letter", path: "/newsletter" }]),
          ),
        }}
      />

      {/* ══════════════════════════════════════════════════════
          1 — HERO (dark, full editorial)
      ══════════════════════════════════════════════════════ */}
      <section className="bg-aubergine relative overflow-hidden pt-28 md:pt-36 lg:pt-44 pb-0">
        {/* Subtle top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink/30 to-transparent" />

        <div className="container-content grid lg:grid-cols-[0.6fr_0.4fr] gap-0 items-end">
          {/* Text column */}
          <div className="pb-16 md:pb-20 lg:pb-28 pr-0 lg:pr-16">
            <Eyebrow className="text-cream/50 border-cream/15">
              The Sober Muse Letter
            </Eyebrow>

            <h1
              className="mt-8 font-[family-name:var(--font-display)] text-cream leading-[0.9] tracking-[-0.045em]"
              style={{ fontSize: "clamp(3.4rem, 6vw, 7rem)" }}
            >
              {headline}
              <br />
              <em className="not-italic opacity-55">{subheadline}</em>
            </h1>

            <p className="mt-9 text-[17px] md:text-[18px] leading-[1.8] text-cream/65 max-w-[500px] font-[family-name:var(--font-body)]">
              {data?.bodyCopy
                ? data.bodyCopy.split("\n").filter(Boolean)[0]
                : "I write about identity, leadership, and the examined life. About what high-achieving women use alcohol for — and what they discover when they stop."}
            </p>

            {/* Signal cards */}
            <div className="mt-10 grid grid-cols-2 gap-3 max-w-[400px]">
              {[
                { label: "Frequency", value: "Once a week" },
                { label: "List size", value: "Small, deliberately" },
                { label: "Topics", value: "Identity & leadership" },
                { label: "Tone", value: "First-person, precise" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="border border-cream/12 p-4"
                >
                  <p className="text-[9px] uppercase tracking-[0.24em] text-cream/35 mb-1.5 font-[family-name:var(--font-body)]">
                    {label}
                  </p>
                  <p className="text-[13px] text-cream/70 font-[family-name:var(--font-body)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Portrait column — bleeds to bottom */}
          <div className="hidden lg:block relative self-end">
            <div className="relative overflow-hidden">
              <Image
                src="/images/portraits/martina-garden-pink.jpg"
                alt="Martina Rink — author of The Sober Muse Letter"
                width={640}
                height={860}
                sizes="35vw"
                className="w-full object-cover object-center"
                priority
              />
              {/* Left edge fade so it blends into hero */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-aubergine to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2 — FORM SECTION (cream, anchored)
      ══════════════════════════════════════════════════════ */}
      <section id="subscribe" className="bg-cream py-20 md:py-28 scroll-mt-20">
        <div className="container-content">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-start max-w-5xl">
            {/* Left — form */}
            <div>
              <span className="h-px w-10 bg-pink block mb-8" aria-hidden />
              <Eyebrow withLine>Subscribe</Eyebrow>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-[32px] md:text-[38px] leading-[1.1] text-ink mb-4">
                Receive the letters.
              </h2>
              <p className="text-[15px] leading-[1.75] text-ink-soft mb-10 max-w-sm font-[family-name:var(--font-body)]">
                Add your email below. The first letter arrives on Sunday.
              </p>
              <NewsletterForm source="newsletter-page" />
              {trustNote && (
                <p className="mt-6 text-[12px] text-ink-quiet font-[family-name:var(--font-body)]">
                  {trustNote}
                </p>
              )}
            </div>

            {/* Right — what the letter is */}
            <div className="space-y-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink-quiet mb-5 font-[family-name:var(--font-body)]">
                  What this letter is
                </p>
                <div className="space-y-5 text-[16px] leading-[1.8] text-ink-soft font-[family-name:var(--font-body)]">
                  {data?.bodyCopy ? (
                    data.bodyCopy.split("\n").filter(Boolean).map((para: string, i: number) => (
                      <p key={i}>{para}</p>
                    ))
                  ) : (
                    <>
                      <p>
                        I write about identity, leadership, and the examined life. About
                        what high-achieving women use alcohol for — and what they discover
                        when they stop. About the particular loneliness of external success.
                        About coming home to yourself.
                      </p>
                      <p>
                        It is not a newsletter. It is a correspondence. Each letter is
                        written directly to you — not to an audience, not to a brand.
                        To the woman who reads carefully and thinks carefully and is somewhere
                        in the middle of figuring something out.
                      </p>
                      <p>
                        It never tries to sell you anything until the moment it makes sense
                        to. Which sometimes never happens. That is also fine.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Recent themes */}
              <div className="bg-bone border border-sand/40 p-7">
                <p className="text-[10px] uppercase tracking-[0.26em] text-ink-quiet mb-5 font-[family-name:var(--font-body)]">
                  Recent themes
                </p>
                <ul className="space-y-3">
                  {RECENT_THEMES.map((theme) => (
                    <li key={theme} className="flex items-start gap-3">
                      <span className="mt-2.5 block w-4 h-px bg-pink shrink-0" aria-hidden />
                      <span className="text-[14px] leading-[1.6] text-ink-soft font-[family-name:var(--font-body)]">
                        {theme}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3 — READER VOICES
      ══════════════════════════════════════════════════════ */}
      <section className="bg-bone border-y border-sand/40 py-18 md:py-24">
        <div className="container-content">
          <Eyebrow withLine className="mb-12">Reader voices</Eyebrow>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl">
            {READER_VOICES.map((v) => (
              <div key={v.name} className="flex flex-col">
                <span className="h-px w-8 bg-pink block mb-6" aria-hidden />
                <blockquote className="font-[family-name:var(--font-display)] italic text-[18px] md:text-[19px] leading-[1.5] text-ink flex-1 mb-6">
                  &ldquo;{v.quote}&rdquo;
                </blockquote>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink-quiet font-[family-name:var(--font-body)]">
                  — {v.name}, {v.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4 — WHO THIS IS FOR / NOT FOR
      ══════════════════════════════════════════════════════ */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-content">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 max-w-4xl">
            {/* For */}
            <div>
              <span className="h-px w-8 bg-pink block mb-6" aria-hidden />
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-quiet mb-6 font-[family-name:var(--font-body)]">
                This letter is for
              </p>
              <ul className="space-y-4">
                {[
                  "The woman who reads slowly and thinks carefully",
                  "Senior professionals at a private inflection point",
                  "Women who are successful by most measures and quietly exhausted",
                  "Anyone re-examining the relationship between alcohol and identity",
                  "Women who want a real conversation, not a framework",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="mt-2 block w-4 h-px bg-sand shrink-0" aria-hidden />
                    <span className="text-[15px] leading-[1.65] text-ink-soft font-[family-name:var(--font-body)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not for */}
            <div>
              <span className="h-px w-8 bg-sand block mb-6" aria-hidden />
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-quiet mb-6 font-[family-name:var(--font-body)]">
                This letter is not for
              </p>
              <ul className="space-y-4">
                {[
                  "Anyone looking for a 5-step productivity system",
                  "People who want to be told what to do",
                  "Motivational content",
                  "Weekly promotions or product announcements",
                  "Those who are comfortable and plan to stay that way",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="mt-2 block w-4 h-px bg-sand/50 shrink-0" aria-hidden />
                    <span className="text-[15px] leading-[1.65] text-ink-quiet font-[family-name:var(--font-body)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5 — FROM THE WRITING (sample flavour)
      ══════════════════════════════════════════════════════ */}
      <section className="bg-ink py-20 md:py-28">
        <div className="container-content max-w-3xl">
          <Eyebrow className="text-cream/40 border-cream/15 mb-10">
            From the writing
          </Eyebrow>
          <blockquote className="font-[family-name:var(--font-display)] italic text-[24px] md:text-[30px] lg:text-[34px] leading-[1.3] text-cream mb-8">
            &ldquo;The most successful women I work with are not struggling. They are
            managing. There is a difference — and the difference is what brings them to me.&rdquo;
          </blockquote>
          <p className="text-[13px] uppercase tracking-[0.2em] text-cream/35 font-[family-name:var(--font-body)]">
            From a recent letter
          </p>

          <div className="mt-16 grid sm:grid-cols-3 gap-5">
            {[
              { title: "What high-functioning women use alcohol for", slug: "what-high-functioning-women-use-alcohol-for" },
              { title: "The identity underneath the title", slug: "the-identity-underneath-the-title" },
              { title: "On elegance and edges — Isabella Blow", slug: "on-elegance-and-edges-isabella-blow" },
            ].map((piece) => (
              <Link
                key={piece.slug}
                href={`/writing/${piece.slug}`}
                className="group block border border-cream/10 p-6 hover:border-cream/25 transition-colors duration-200"
              >
                <p className="text-[9px] uppercase tracking-[0.2em] text-cream/35 mb-3 font-[family-name:var(--font-body)]">
                  Essay
                </p>
                <p className="font-[family-name:var(--font-display)] text-[16px] leading-snug text-cream/80 group-hover:text-cream transition-colors mb-4">
                  {piece.title}
                </p>
                <span className="text-[10px] uppercase tracking-[0.15em] text-plum font-[family-name:var(--font-body)]">
                  Read &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6 — ABOUT MARTINA (who is writing to you)
      ══════════════════════════════════════════════════════ */}
      <section className="bg-cream py-20 md:py-28 border-t border-sand/40">
        <div className="container-content">
          <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start max-w-4xl">
            {/* Portrait — small, intimate */}
            <div className="relative w-[140px] md:w-[180px] aspect-[3/4] bg-bone overflow-hidden shrink-0">
              <Image
                src="/images/portraits/martina-bw-studio.jpg"
                alt="Martina Rink"
                fill
                sizes="200px"
                className="object-cover object-top"
              />
            </div>
            {/* Bio */}
            <div>
              <span className="h-px w-8 bg-pink block mb-6" aria-hidden />
              <p className="text-[10px] uppercase tracking-[0.26em] text-ink-quiet mb-5 font-[family-name:var(--font-body)]">
                Who is writing to you
              </p>
              <h3 className="font-[family-name:var(--font-display)] text-[26px] md:text-[30px] text-ink mb-6">
                Martina Rink
              </h3>
              <div className="space-y-4 text-[15px] md:text-[16px] leading-[1.8] text-ink-soft font-[family-name:var(--font-body)] max-w-lg">
                <p>
                  Private mentor, Spiegel Bestseller author, and former personal
                  assistant to Isabella Blow. I work with a small number of female entrepreneurs,
                  founders, and creatives on the questions that do not appear on any competency
                  framework.
                </p>
                <p>
                  The Sober Muse Letter is where I think out loud, before the ideas
                  become programmes. It is the longest-running thing I do.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="text-[11px] uppercase tracking-[0.18em] text-plum hover:text-plum-deep transition-colors font-[family-name:var(--font-body)]"
                >
                  About Martina &rarr;
                </Link>
                <Link
                  href="/press"
                  className="text-[11px] uppercase tracking-[0.18em] text-ink-quiet hover:text-ink transition-colors font-[family-name:var(--font-body)]"
                >
                  Press &amp; books &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7 — SECOND SUBSCRIBE CTA (dark, final)
      ══════════════════════════════════════════════════════ */}
      <section className="bg-aubergine py-20 md:py-28">
        <div className="container-content max-w-2xl text-center">
          <span className="h-px w-10 bg-pink block mx-auto mb-10" aria-hidden />
          <h2 className="font-[family-name:var(--font-display)] text-[32px] md:text-[42px] leading-[1.1] text-cream mb-6">
            Read it this Sunday.
          </h2>
          <p className="text-[16px] leading-[1.8] text-cream/60 mb-12 font-[family-name:var(--font-body)]">
            One letter arrives every Sunday morning. For the woman who reads carefully
            and keeps it private.
          </p>
          <div className="max-w-xs mx-auto">
            <NewsletterForm source="newsletter-page-bottom" dark />
          </div>
          <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-cream/25 font-[family-name:var(--font-body)]">
            {SITE.email} &middot; Unsubscribe any time
          </p>
        </div>
      </section>
    </>
  );
}
