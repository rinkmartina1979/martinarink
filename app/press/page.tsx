import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/utils";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { GhostButton } from "@/components/brand/GhostButton";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Press & Speaking",
  description:
    "Press information, biography, speaking topics, and media kit for Martina Rink — Spiegel Bestseller author, former personal assistant to Isabella Blow, and private mentor to senior women in transition.",
  path: "/press",
});

/* ─── Structured data ─────────────────────────────────────── */
function pressSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE.url}/#person`,
        name: "Martina Rink",
        url: SITE.url,
        jobTitle: [
          "Author",
          "Private Mentor",
          "Keynote Speaker",
          "Sober Conscious Coach",
        ],
        description:
          "Spiegel Bestseller author, former personal assistant to Isabella Blow, and private mentor to high-achieving women navigating identity, sobriety, and the second chapter of a serious career.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Steinkreuzstr. 26b",
          addressLocality: "Karlsruhe",
          postalCode: "76228",
          addressCountry: "DE",
        },
        email: SITE.email,
        telephone: "+49-172-174-1499",
        sameAs: [
          SITE.social.linkedin,
          SITE.social.instagram,
          SITE.social.facebook,
          SITE.social.xing,
        ],
        knowsAbout: [
          "Women's identity and leadership",
          "Conscious sobriety",
          "High-achieving women in transition",
          "Cultural observation and memoir",
          "Fashion history",
        ],
      },
      {
        "@type": "Book",
        "@id": `${SITE.url}/#book-people-of-deutschland`,
        name: "People of Deutschland",
        author: { "@id": `${SITE.url}/#person` },
        description:
          "A documentary portrait of contemporary Germany — its people, contradictions, and quiet grandeur. Featured in national media upon publication.",
        inLanguage: "de",
        genre: "Documentary Photography / Non-fiction",
      },
      {
        "@type": "Book",
        "@id": `${SITE.url}/#book-fashion-germany`,
        name: "Fashion Germany",
        author: { "@id": `${SITE.url}/#person` },
        description:
          "A portrait of German fashion — its designers, codes, and the culture that shaped one of Europe's most underestimated style capitals.",
        inLanguage: "de",
        genre: "Fashion / Photography / Non-fiction",
      },
      {
        "@type": "Book",
        "@id": `${SITE.url}/#book-isabella-blow`,
        name: "Isabella Blow",
        author: { "@id": `${SITE.url}/#person` },
        description:
          "A biography of Isabella Blow written from unique proximity — Rink served as Blow's personal assistant and confidante. A Spiegel Bestseller.",
        inLanguage: "de",
        genre: "Biography / Fashion",
        isPartOf: {
          "@type": "BookSeries",
          name: "Spiegel Bestseller",
        },
      },
    ],
  };
}

/* ─── Speaking topics ────────────────────────────────────── */
const SPEAKING_TOPICS = [
  {
    title: "The intelligent woman's guide to re-examining alcohol",
    body: "Not a recovery story. A cultural, psychological, and deeply personal case for why the most ambitious women often arrive at the same quiet question.",
  },
  {
    title: "Identity in the second half of a serious career",
    body: "What happens when you have built everything you said you wanted — and find that it doesn't quite fit. The gap between the CV and the interior life.",
  },
  {
    title: "Leadership without the armour",
    body: "Why the strategies that got high-achieving women to the top are often the same ones keeping them from what comes next. A conversation about presence over performance.",
  },
  {
    title: "The gap between excellence and inhabiting your own life",
    body: "On the particular loneliness of women who are doing everything right and privately exhausted by it.",
  },
];

/* ─── Press biography lengths ────────────────────────────── */
const BIOS = [
  {
    length: "25 words",
    text: "Martina Rink is a private mentor, Spiegel Bestseller author, and former personal assistant to Isabella Blow. She works with executive women on identity and sobriety.",
  },
  {
    length: "75 words",
    text: "Martina Rink is a private mentor and Spiegel Bestseller author whose work sits at the intersection of identity, leadership, and the examined life. A former personal assistant to the late Isabella Blow — one of the defining figures of twentieth-century fashion — she brings a rare cultural eye to the question of who high-achieving women become after they have built the life. She works by application, across Europe and internationally.",
  },
  {
    length: "200 words",
    text: "Martina Rink is a private mentor, author, and keynote speaker whose work addresses the interior life of women at the height of their careers. Her two programmes — The Sober Muse Method and Female Empowerment & Leadership — work with a small number of senior women each year on the questions that do not appear on any competency framework: who am I, now that I have become this? What do I actually want, given that I can no longer pretend I haven't thought about it?\n\nRink spent several years as personal assistant to Isabella Blow — the legendary British fashion editor, stylist, and talent spotter whose influence shaped a generation of designers including Alexander McQueen and Philip Treacy. That proximity to radical vision, eccentricity, and the cost of brilliance left a permanent mark on her thinking.\n\nShe is the author of People of Deutschland, a documentary portrait of contemporary Germany, and a Spiegel Bestseller. Her writing on women, identity, and culture appears in her online journal and regular letters to subscribers.\n\nRink is represented for literary rights by Elisabeth Ruge Agentur GmbH, Berlin. She is based across Ibiza, Berlin, and Munich.",
  },
];

/* ─── Media outlet list ──────────────────────────────────── */
const MEDIA_OUTLETS = [
  "Der Spiegel",
  "Brigitte",
  "STERN",
  "Vogue Germany",
  "ELLE Germany",
  "Die Zeit",
  "Süddeutsche Zeitung",
  "Manager Magazin",
];

/* ─── Page ───────────────────────────────────────────────── */
export default function PressPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pressSchema()) }}
      />

      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <section className="bg-cream pt-32 md:pt-44 pb-20">
        <div className="container-content max-w-3xl">
          <Eyebrow withLine>Press &amp; Speaking</Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[58px] leading-[1.08] text-ink">
            A voice at the intersection of identity, culture, and the examined
            life.
          </h1>
          <p className="mt-8 text-[18px] leading-[1.8] text-ink-soft max-w-2xl">
            Martina Rink is a Spiegel Bestseller author, former personal
            assistant to Isabella Blow, and private mentor to senior women at
            the inflection points of a serious career. She is available for
            press interviews, podcast conversations, panel discussions, and
            keynote engagements.
          </p>

          {/* Credential pills */}
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              "Spiegel Bestseller author",
              "Former PA to Isabella Blow",
              "Keynote speaker",
              "Private mentor · by application",
            ].map((cred) => (
              <span
                key={cred}
                className="px-4 py-2 border border-sand text-[12px] uppercase tracking-[0.16em] text-ink-quiet"
              >
                {cred}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Media bar ────────────────────────────────────── */}
      <section className="bg-bone border-t border-b border-sand/60 py-10">
        <div className="container-content">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink-quiet text-center mb-8">
            Featured in
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {MEDIA_OUTLETS.map((outlet) => (
              <span
                key={outlet}
                className="font-[family-name:var(--font-display)] text-[16px] text-ink/40 tracking-[0.04em]"
              >
                {outlet}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Books ─────────────────────────────────────────── */}
      <section className="bg-cream section-pad">
        <div className="container-content max-w-5xl">
          <Eyebrow withLine>Books</Eyebrow>
          <h2 className="mt-6 font-[family-name:var(--font-display)] italic text-[40px] text-ink">
            Published work.
          </h2>

          <div className="mt-14 grid md:grid-cols-3 gap-10">
            {/* Book 1 */}
            <article>
              <div className="aspect-[3/4] bg-bone flex items-end p-6 mb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-2">
                    Documentary · Non-fiction
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-[22px] leading-tight text-ink">
                    People of Deutschland
                  </p>
                </div>
              </div>
              <p className="text-[14px] leading-[1.75] text-ink-soft">
                A documentary portrait of contemporary Germany — its people,
                contradictions, and quiet grandeur. National media coverage upon
                publication.
              </p>
            </article>

            {/* Book 2 */}
            <article>
              <div className="aspect-[3/4] bg-sand/30 flex items-end p-6 mb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-2">
                    Non-fiction · Photography
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-[22px] leading-tight text-ink">
                    Fashion Germany
                  </p>
                </div>
              </div>
              <p className="text-[14px] leading-[1.75] text-ink-soft">
                A portrait of German fashion — its designers, its codes, and the
                culture that shaped one of Europe&rsquo;s most underestimated
                style capitals.
              </p>
            </article>

            {/* Book 3 */}
            <article>
              <div className="aspect-[3/4] bg-ink flex items-end p-6 mb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-sand/60 mb-2">
                    Spiegel Bestseller · Biography
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-[22px] leading-tight text-cream">
                    Isabella Blow
                  </p>
                </div>
              </div>
              <p className="text-[14px] leading-[1.75] text-ink-soft">
                Written from a position of unique proximity — Rink served as
                Blow&rsquo;s personal assistant and confidante. A Spiegel
                Bestseller. Literary representation via Elisabeth Ruge Agentur
                GmbH, Berlin.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── 4. Isabella Blow — the signature credential ──────── */}
      <section className="bg-ink section-pad">
        <div className="container-content max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-sand/50 mb-8">
            Background
          </p>
          <blockquote className="font-[family-name:var(--font-display)] italic text-[32px] md:text-[40px] leading-[1.2] text-cream">
            &ldquo;She shaped the careers of Alexander McQueen, Philip Treacy,
            and a generation of designers who changed fashion&rsquo;s
            course.&rdquo;
          </blockquote>
          <p className="mt-8 text-[16px] leading-[1.75] text-cream/70">
            For several years, Martina Rink served as personal assistant to
            Isabella Blow — the late British fashion editor, stylist, and
            singular talent spotter whose influence defined the avant-garde of
            the 1990s and 2000s. That proximity to radical vision, eccentricity,
            and the human cost of brilliance shaped the particular lens Rink
            brings to her work with women.
          </p>
          <p className="mt-5 text-[16px] leading-[1.75] text-cream/70">
            It is a perspective that cannot be acquired from a course. It is
            earned.
          </p>
        </div>
      </section>

      {/* ── 5. Speaking ──────────────────────────────────────── */}
      <section id="speaking" className="bg-cream section-pad">
        <div className="container-content max-w-4xl">
          <Eyebrow withLine>Speaking</Eyebrow>
          <h2 className="mt-6 font-[family-name:var(--font-display)] italic text-[40px] text-ink">
            For audiences of senior women.
          </h2>
          <p className="mt-6 text-[17px] leading-[1.75] text-ink-soft max-w-2xl">
            Martina speaks for conferences, corporate retreats, and curated
            evenings. Her talks are conversational, precisely argued, and
            deliberately uncomfortable in the way that useful things tend to be.
          </p>

          <div className="mt-14 grid md:grid-cols-2 gap-8">
            {SPEAKING_TOPICS.map((topic, i) => (
              <div key={i} className="bg-bone p-8">
                <p className="font-[family-name:var(--font-display)] text-[20px] leading-tight text-ink mb-4">
                  {topic.title}
                </p>
                <p className="text-[14px] leading-[1.7] text-ink-soft">
                  {topic.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-sand/50 pt-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-[14px] uppercase tracking-[0.18em] text-ink-quiet mb-2">
                  Formats
                </p>
                <p className="text-[16px] text-ink-soft">
                  Keynote · Panel chair · Intimate fireside conversation ·
                  Podcast guest
                </p>
              </div>
              <div>
                <p className="text-[14px] uppercase tracking-[0.18em] text-ink-quiet mb-2">
                  Availability
                </p>
                <p className="text-[16px] text-ink-soft">
                  Europe-wide · International on request
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Press biographies ─────────────────────────────── */}
      <section className="bg-bone section-pad">
        <div className="container-content max-w-4xl">
          <Eyebrow withLine>Press materials</Eyebrow>
          <h2 className="mt-6 font-[family-name:var(--font-display)] italic text-[40px] text-ink">
            Biographies.
          </h2>
          <p className="mt-4 text-[16px] text-ink-soft">
            Three lengths for editorial use. Please do not edit without prior
            approval.
          </p>

          <div className="mt-12 space-y-8">
            {BIOS.map((bio) => (
              <div key={bio.length} className="bg-cream p-8 md:p-10">
                <p className="text-[11px] uppercase tracking-[0.22em] text-ink-quiet mb-5">
                  {bio.length} bio
                </p>
                <p className="text-[16px] leading-[1.8] text-ink-soft whitespace-pre-line">
                  {bio.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <GhostButton href="/contact">Request headshot</GhostButton>
            <GhostButton href="/contact">Request hi-res book cover</GhostButton>
          </div>
        </div>
      </section>

      {/* ── 7. Literary representation ───────────────────────── */}
      <section className="bg-cream section-pad">
        <div className="container-content max-w-3xl">
          <Eyebrow withLine>Literary representation</Eyebrow>
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-[28px] text-ink">
            For rights and literary enquiries.
          </h2>
          <div className="mt-8 bg-bone p-8 md:p-10">
            <p className="font-[family-name:var(--font-display)] text-[20px] text-ink mb-1">
              Elisabeth Ruge Agentur GmbH
            </p>
            <p className="text-[14px] text-ink-quiet mb-6">
              Rosenthaler Str. 34/35, 10178 Berlin, Germany
            </p>
            <div className="space-y-2 text-[15px] text-ink-soft">
              <p>
                Representative:{" "}
                <span className="text-ink">Elisabeth Ruge</span>
              </p>
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:info@elisabeth-ruge-agentur.de"
                  className="text-wine underline underline-offset-4"
                >
                  info@elisabeth-ruge-agentur.de
                </a>
              </p>
              <p>Telefon: +49 30 2888 406 00</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Press CTA ─────────────────────────────────────── */}
      <section className="bg-wine section-pad">
        <div className="container-content max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cream/60 mb-6">
            Press &amp; speaking enquiries
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-tight text-cream">
            For press interviews, podcast conversations, and speaking
            engagements.
          </h2>
          <p className="mt-6 text-[17px] leading-[1.75] text-cream/80">
            Write directly to Martina. She responds to press and speaking
            requests personally.
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-8 inline-block font-[family-name:var(--font-display)] italic text-[24px] text-cream underline decoration-cream/40 decoration-1 underline-offset-[6px] hover:decoration-cream transition-colors"
          >
            {SITE.email}
          </a>
          <p className="mt-10 text-[14px] uppercase tracking-[0.18em] text-cream/50">
            Tel: +49 (0) 172 174 1499
          </p>
          <p className="mt-3 text-[13px] text-cream/40">
            Response within 48 hours on working days.
          </p>
        </div>
      </section>

      {/* ── 9. Reassurance footer ────────────────────────────── */}
      <section className="bg-cream py-16">
        <div className="container-content max-w-3xl">
          <div className="border-t border-sand/60 pt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="text-[14px] text-ink-quiet">
              Martina Rink — UG (haftungsbeschränkt), Karlsruhe
            </p>
            <div className="flex gap-6 text-[14px]">
              <Link
                href="/about"
                className="text-ink-quiet hover:text-ink transition-colors"
              >
                About
              </Link>
              <Link
                href="/writing"
                className="text-ink-quiet hover:text-ink transition-colors"
              >
                Writing
              </Link>
              <Link
                href="/work-with-me"
                className="text-ink-quiet hover:text-ink transition-colors"
              >
                Work with me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
