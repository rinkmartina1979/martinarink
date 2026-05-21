import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { buildMetadata, breadcrumbSchema } from "@/lib/metadata";
import { SITE } from "@/lib/utils";
import {
  getPressPage,
  getPublications,
  getPressItems,
  getPartnerLogos,
  type SanityPublication,
  type SanityPressItem,
  type SanityPartnerLogo,
} from "@/sanity/lib/queries";
import { getVisibleCaseStudies } from "@/sanity/lib/membersQueries";
import { CaseStudyCard } from "@/components/press/CaseStudyCard";
import { FALLBACK_CASE_STUDIES } from "@/lib/fallback-content";
import { CopyButton } from "@/components/press/CopyButton";

/* ─── Metadata ──────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const data = await getPressPage();
  if (data?.seo?.seoTitle) {
    return buildMetadata({
      title: data.seo.seoTitle,
      description: data.seo.seoDescription ?? undefined,
      path: "/press",
    });
  }
  return buildMetadata({
    title: "Press & Speaking — Martina Rink",
    description:
      "Press information, biography, speaking topics, and media kit for Martina Rink — Spiegel Bestseller author, former personal assistant to Isabella Blow, and private mentor to senior women in transition.",
    path: "/press",
  });
}

/* ─── Structured data ─────────────────────────────────────────── */
function pressSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE.url}/#person`,
        name: "Martina Rink",
        url: SITE.url,
        jobTitle: ["Author", "Private Mentor", "Panel Speaker"],
        description:
          "Spiegel Bestseller author, former personal assistant to Isabella Blow, and private mentor to high-achieving women navigating identity, sobriety, and the second chapter of a serious career.",
        email: SITE.email,
        telephone: "+49-172-174-1499",
        sameAs: [SITE.social.linkedin, SITE.social.instagram],
      },
      {
        "@type": "Book",
        "@id": `${SITE.url}/#book-people-of-deutschland`,
        name: "People of Deutschland",
        author: { "@id": `${SITE.url}/#person` },
        publisher: "Prestel · Random House",
        datePublished: "2023",
      },
      {
        "@type": "Book",
        "@id": `${SITE.url}/#book-fashion-germany`,
        name: "Fashion Germany",
        author: { "@id": `${SITE.url}/#person` },
        publisher: "Prestel · Random House",
        datePublished: "2014",
      },
      {
        "@type": "Book",
        "@id": `${SITE.url}/#book-isabella-blow`,
        name: "Isabella Blow",
        author: { "@id": `${SITE.url}/#person` },
        publisher: "Thames & Hudson",
        datePublished: "2010",
        isPartOf: { "@type": "BookSeries", name: "Spiegel Bestseller" },
      },
    ],
  };
}

/* ─── Press images — curated from audit, normalized, clean names ─ */
const POD_PRESS = [
  { src: "/images/press/pod-press-01.jpg", w: 957, h: 538, alt: "People of Deutschland — press coverage featuring Martina Rink, national media" },
  { src: "/images/press/pod-press-02.jpg", w: 957, h: 538, alt: "People of Deutschland — Deutschlandfunk feature coverage" },
  { src: "/images/press/pod-press-03.jpg", w: 957, h: 538, alt: "People of Deutschland — editorial press review spread" },
  { src: "/images/press/pod-press-04.jpg", w: 957, h: 538, alt: "People of Deutschland — press interview and article coverage" },
  { src: "/images/press/pod-press-05.jpg", w: 957, h: 538, alt: "People of Deutschland — German media feature" },
  { src: "/images/press/pod-press-06.jpg", w: 957, h: 538, alt: "People of Deutschland — Perspective Daily coverage" },
] as const;

const BLOW_PRESS = [
  { src: "/images/press/blow-press-feature.jpg", w: 853, h: 539, alt: "Isabella Blow — featured press spread, publication coverage of Martina Rink biography", featured: true },
  { src: "/images/press/blow-press-01.jpg", w: 419, h: 539, alt: "Isabella Blow — magazine coverage of Martina Rink biography" },
  { src: "/images/press/blow-press-02.jpg", w: 413, h: 539, alt: "Isabella Blow — international press review" },
  { src: "/images/press/blow-press-03.jpg", w: 384, h: 540, alt: "Isabella Blow — book review in print media" },
  { src: "/images/press/blow-press-04.jpg", w: 391, h: 540, alt: "Isabella Blow — editorial review coverage" },
] as const;

const FASHION_PRESS = [
  { src: "/images/press/fashion-press-feature.jpg", w: 455, h: 366, alt: "Fashion Germany — featured press clipping, Prestel publication coverage", featured: true },
  { src: "/images/press/fashion-cover-01.jpg", w: 274, h: 366, alt: "Fashion Germany — magazine cover feature" },
  { src: "/images/press/fashion-cover-02.jpg", w: 259, h: 365, alt: "Fashion Germany — fashion press review" },
  { src: "/images/press/fashion-cover-03.jpg", w: 259, h: 365, alt: "Fashion Germany — publication review" },
  { src: "/images/press/fashion-cover-04.jpg", w: 258, h: 365, alt: "Fashion Germany — German fashion media coverage" },
] as const;

/* ─── Static content ─────────────────────────────────────────── */
const AUTHORITY_OUTLETS = [
  "Der Spiegel", "Brigitte", "STERN", "Vogue Germany",
  "ELLE Germany", "Die Zeit", "Manager Magazin",
];

const SPEAKING_TOPICS = [
  {
    title: "The intelligent woman’s guide to re-examining alcohol",
    body: "Not a recovery story. A cultural, psychological, and deeply personal case for why the most ambitious women often arrive at the same quiet question.",
  },
  {
    title: "Identity in the second half of a serious career",
    body: "What happens when you have built everything you said you wanted — and find that it doesn’t quite fit. The gap between the CV and the interior life.",
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
    text: "Martina Rink is a private mentor, author, and panel speaker whose work addresses the interior life of women at the height of their careers. Her two programmes — The Sober Muse Method and Female Empowerment & Leadership — work with a small number of senior women each year on the questions that do not appear on any competency framework: who am I, now that I have become this? What do I actually want, given that I can no longer pretend I haven’t thought about it?\n\nRink spent several years as personal assistant to Isabella Blow — the legendary British fashion editor, stylist, and talent spotter whose influence shaped a generation of designers including Alexander McQueen and Philip Treacy. That proximity to radical vision, eccentricity, and the cost of brilliance left a permanent mark on her thinking.\n\nShe is the author of People of Deutschland, a documentary portrait of contemporary Germany, and a Spiegel Bestseller. Her writing on women, identity, and culture appears in her online journal and regular letters to subscribers.\n\nRink is represented for literary rights by Elisabeth Ruge Agentur GmbH, Berlin. She is based across Ibiza, Berlin, and Munich.",
  },
];

/* ─── Page ───────────────────────────────────────────────────── */
export default async function PressPage() {
  const [pressData, publications, pressItems, partnerLogos, caseStudies] =
    await Promise.all([
      getPressPage(),
      getPublications(),
      getPressItems(),
      getPartnerLogos(),
      getVisibleCaseStudies(),
    ]);

  const heroCopy =
    pressData?.bioCopy ??
    "Martina Rink is a Spiegel Bestseller author, former personal assistant to Isabella Blow, and private mentor to senior women at the inflection points of a serious career. She is available for press interviews, podcast conversations, and panel discussions.";

  const hasSanityPublications = publications && publications.length > 0;
  const hasSanityLogos        = partnerLogos  && partnerLogos.length  > 0;
  const featuredPressItems    = pressItems?.filter((p: SanityPressItem) => p.featured) ?? [];

  const displayCaseStudies =
    caseStudies && caseStudies.length > 0 ? caseStudies : FALLBACK_CASE_STUDIES;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pressSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([{ name: "Press & Speaking", path: "/press" }]),
          ),
        }}
      />

      {/* ══════════════════════════════════════════════════════
          1 — HERO
      ══════════════════════════════════════════════════════ */}
      <section className="bg-aubergine pt-28 md:pt-36 lg:pt-44 pb-0 overflow-hidden">
        <div className="container-content grid lg:grid-cols-[0.56fr_0.44fr] gap-12 lg:gap-0 items-end">

          {/* Left — text */}
          <div className="pb-16 md:pb-20 lg:pb-24">
            <Eyebrow className="text-cream/60 border-cream/20">
              Press &amp; Speaking
            </Eyebrow>

            <h1
              className="mt-7 font-[family-name:var(--font-display)] text-cream leading-[0.86] tracking-[-0.055em]"
              style={{ fontSize: "clamp(3.5rem, 6.4vw, 7.4rem)" }}
            >
              A voice at the
              intersection of
              identity, culture,
              and the examined life.
            </h1>

            <p className="mt-8 text-[17px] md:text-[18px] leading-[1.8] text-cream/70 max-w-[500px] font-[family-name:var(--font-body)]">
              {heroCopy}
            </p>

            {/* Credential pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "Spiegel Bestseller author",
                "Former PA to Isabella Blow",
                "Panel guest · Europe-wide",
                "Private mentor · by application",
              ].map((cred) => (
                <span
                  key={cred}
                  className="px-4 py-2 border border-cream/20 text-[10px] uppercase tracking-[0.18em] text-cream/60 font-[family-name:var(--font-body)]"
                >
                  {cred}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <PlumButton href={`mailto:${SITE.email}`}>
                Request press materials
              </PlumButton>
              <GhostButton
                href="#speaking"
                className="border-cream/40 text-cream hover:bg-cream/10"
              >
                Invite Martina to speak
              </GhostButton>
            </div>

            {/* Contact line */}
            <p className="mt-8 text-[12px] uppercase tracking-[0.18em] text-cream/35 font-[family-name:var(--font-body)]">
              {SITE.email} &middot; +49 (0) 172 174 1499
            </p>
          </div>

          {/* Right — portrait */}
          <div className="relative lg:self-end">
            <div className="relative bg-bone overflow-hidden mx-auto max-w-[420px] lg:max-w-none">
              <Image
                src="/images/portraits/martina-bw-studio.jpg"
                alt="Martina Rink — speaker, author, and private mentor"
                width={1067}
                height={1600}
                sizes="(max-width: 1024px) 90vw, 38vw"
                className="w-full object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2 — AUTHORITY STRIP
      ══════════════════════════════════════════════════════ */}
      <section className="bg-cream border-y border-sand/40 py-8 md:py-10 overflow-hidden">
        <div className="container-content">
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink-quiet text-center mb-6 font-[family-name:var(--font-body)]">
            {hasSanityLogos ? "Partners & affiliates" : "As featured in"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 md:gap-x-12">
            {(hasSanityLogos
              ? (partnerLogos as SanityPartnerLogo[]).map((l) => l.name)
              : AUTHORITY_OUTLETS
            ).map((name) => (
              <span
                key={name}
                className="font-[family-name:var(--font-display)] text-[14px] md:text-[15px] text-ink/40 tracking-[0.04em] whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3 — FEATURED MEDIA MOSAIC
      ══════════════════════════════════════════════════════ */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-content">
          <div className="max-w-4xl mb-14 md:mb-18">
            <Eyebrow withLine>Media coverage</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[40px] md:text-[52px] leading-[1.0] tracking-[-0.02em] text-ink">
              Featured in the conversation.
            </h2>
            <p className="mt-5 text-[16px] leading-[1.8] text-ink-soft max-w-xl font-[family-name:var(--font-body)]">
              Three published books. Two decades of editorial work.
              A selection of coverage across print, radio, television, and digital.
            </p>
          </div>

          {/* Sanity press items */}
          {featuredPressItems.length > 0 && (
            <div className="max-w-4xl mb-16 space-y-px">
              {featuredPressItems.map((item: SanityPressItem) => (
                <div key={item._id} className="flex items-start gap-6 py-5 border-b border-sand/50 bg-cream px-6">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-quiet mb-1 font-[family-name:var(--font-body)]">
                      {item.publication}{item.type && ` · ${item.type}`}
                    </p>
                    {item.headline && (
                      <p className="font-[family-name:var(--font-display)] italic text-[18px] text-ink leading-snug">
                        {item.headline}
                      </p>
                    )}
                  </div>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] uppercase tracking-[0.15em] text-plum hover:text-plum-deep transition-colors shrink-0 font-[family-name:var(--font-body)] mt-1">
                      Read →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── People of Deutschland ── */}
          <div className="mb-20 md:mb-24">
            <div className="flex items-center gap-5 mb-8">
              <span className="h-px w-10 bg-pink shrink-0" aria-hidden />
              <div>
                <p className="text-[9px] uppercase tracking-[0.32em] text-ink-quiet font-[family-name:var(--font-body)]">
                  Prestel &middot; Random House &middot; 2023
                </p>
                <p className="font-[family-name:var(--font-display)] text-[22px] md:text-[26px] leading-tight text-ink mt-0.5">
                  People of Deutschland
                </p>
              </div>
            </div>

            {/* Feature image full width */}
            <div className="flex aspect-[16/9] items-center justify-center bg-cream p-4 md:p-6 mb-3">
              <Image
                src={POD_PRESS[0].src}
                alt={POD_PRESS[0].alt}
                width={POD_PRESS[0].w}
                height={POD_PRESS[0].h}
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="h-full w-full object-contain"
                priority
              />
            </div>

            {/* Remaining 5 in 3-col grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {POD_PRESS.slice(1).map((img, i) => (
                <div key={i} className="flex aspect-[16/9] items-center justify-center bg-cream p-4 md:p-5">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.w}
                    height={img.h}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Deutsche Welle", "Deutschlandfunk Nova", "SWR", "WDR", "Strive", "Perspective Daily"].map((o) => (
                <span key={o} className="px-3 py-1.5 border border-sand/60 text-[10px] uppercase tracking-[0.16em] text-ink-quiet font-[family-name:var(--font-body)]">
                  {o}
                </span>
              ))}
            </div>
          </div>

          {/* ── Isabella Blow ── */}
          <div className="mb-20 md:mb-24">
            <div className="flex items-center gap-5 mb-8">
              <span className="h-px w-10 bg-pink shrink-0" aria-hidden />
              <div>
                <p className="text-[9px] uppercase tracking-[0.32em] text-ink-quiet font-[family-name:var(--font-body)]">
                  Thames &amp; Hudson &middot; 2010
                </p>
                <p className="font-[family-name:var(--font-display)] text-[22px] md:text-[26px] leading-tight text-ink mt-0.5">
                  Isabella Blow &mdash; A Life in Fashion
                </p>
              </div>
            </div>

            {/* Feature image + 2 portrait covers side by side */}
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-3 mb-3">
              <div className="flex aspect-[4/3] items-center justify-center bg-cream p-5 md:p-8">
                <Image
                  src={BLOW_PRESS[0].src}
                  alt={BLOW_PRESS[0].alt}
                  width={BLOW_PRESS[0].w}
                  height={BLOW_PRESS[0].h}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {BLOW_PRESS.slice(1, 3).map((img, i) => (
                  <div key={i} className="flex aspect-[3/4] items-center justify-center bg-cream p-4">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.w}
                      height={img.h}
                      sizes="(min-width: 1024px) 18vw, 45vw"
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Remaining 2 portraits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BLOW_PRESS.slice(3).map((img, i) => (
                <div key={i} className="flex aspect-[3/4] items-center justify-center bg-cream p-4">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.w}
                    height={img.h}
                    sizes="(min-width: 1024px) 18vw, 45vw"
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["House Magazine", "Elara Magazine", "Tiffany & Co", "International press"].map((o) => (
                <span key={o} className="px-3 py-1.5 border border-sand/60 text-[10px] uppercase tracking-[0.16em] text-ink-quiet font-[family-name:var(--font-body)]">
                  {o}
                </span>
              ))}
            </div>
          </div>

          {/* ── Fashion Germany ── */}
          <div>
            <div className="flex items-center gap-5 mb-8">
              <span className="h-px w-10 bg-pink shrink-0" aria-hidden />
              <div>
                <p className="text-[9px] uppercase tracking-[0.32em] text-ink-quiet font-[family-name:var(--font-body)]">
                  Prestel &middot; Random House &middot; 2014
                </p>
                <p className="font-[family-name:var(--font-display)] text-[22px] md:text-[26px] leading-tight text-ink mt-0.5">
                  Fashion Germany
                </p>
              </div>
            </div>

            {/* Feature image + small cover thumbnails */}
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3">
              <div className="flex aspect-[4/3] items-center justify-center bg-cream p-5 md:p-8">
                <Image
                  src={FASHION_PRESS[0].src}
                  alt={FASHION_PRESS[0].alt}
                  width={FASHION_PRESS[0].w}
                  height={FASHION_PRESS[0].h}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              {/* 4 small covers — max 130px rendered width, object-contain */}
              <div className="grid grid-cols-2 gap-3">
                {FASHION_PRESS.slice(1).map((img, i) => (
                  <div key={i} className="flex aspect-[3/4] items-center justify-center bg-cream p-5 md:p-6">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.w}
                      height={img.h}
                      sizes="(min-width: 1024px) 12vw, 25vw"
                      className="max-h-full max-w-[130px] w-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Glamour Germany", "Woman Magazine", "Fondation Cartier", "Prestel"].map((o) => (
                <span key={o} className="px-3 py-1.5 border border-sand/60 text-[10px] uppercase tracking-[0.16em] text-ink-quiet font-[family-name:var(--font-body)]">
                  {o}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4 — PUBLISHED WORK
      ══════════════════════════════════════════════════════ */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-content">
          <div className="max-w-4xl mb-14">
            <Eyebrow withLine>Books</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] italic text-[40px] md:text-[48px] leading-tight text-ink">
              Published work.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl">
            {hasSanityPublications
              ? (publications as SanityPublication[]).map((pub) => (
                  <article key={pub._id} className="flex flex-col">
                    <div className="flex aspect-[4/5] items-center justify-center bg-bone p-10">
                      <Image
                        src={`/images/books/${pub.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-cover.png`}
                        alt={`${pub.title} — book cover by Martina Rink`}
                        width={900}
                        height={1200}
                        sizes="(min-width: 1024px) 28vw, 80vw"
                        className="max-h-full w-auto object-contain drop-shadow-[0_18px_35px_rgba(30,27,23,0.12)]"
                      />
                    </div>
                    <p className="mt-6 text-[9px] uppercase tracking-[0.28em] text-ink-quiet font-[family-name:var(--font-body)]">
                      {pub.subtitle ?? (pub.isBestseller ? "Spiegel Bestseller" : "")}
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
                      {pub.title}
                    </h3>
                    {pub.description && (
                      <p className="mt-3 text-[14px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
                        {pub.description}
                      </p>
                    )}
                  </article>
                ))
              : (
                <>
                  <article className="flex flex-col">
                    <div className="flex aspect-[4/5] items-center justify-center bg-bone p-10">
                      <Image
                        src="/images/books/isabella-blow-cover.png"
                        alt="Isabella Blow — A Life in Fashion, book cover by Martina Rink"
                        width={900}
                        height={1200}
                        sizes="(min-width: 1024px) 28vw, 80vw"
                        className="max-h-full w-auto object-contain drop-shadow-[0_18px_35px_rgba(30,27,23,0.12)]"
                      />
                    </div>
                    <p className="mt-6 text-[9px] uppercase tracking-[0.28em] text-ink-quiet font-[family-name:var(--font-body)]">
                      Thames &amp; Hudson &middot; 2010
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
                      Isabella Blow &mdash; A Life in Fashion
                    </h3>
                    <p className="mt-3 text-[14px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
                      Written from a position of unique proximity &mdash; Rink served as
                      Blow&rsquo;s personal assistant and confidante.
                    </p>
                  </article>

                  <article className="flex flex-col">
                    <div className="flex aspect-[4/5] items-center justify-center bg-bone p-10">
                      <Image
                        src="/images/books/people-of-deutschland-cover.png"
                        alt="People of Deutschland — book cover by Martina Rink"
                        width={900}
                        height={1200}
                        sizes="(min-width: 1024px) 28vw, 80vw"
                        className="max-h-full w-auto object-contain drop-shadow-[0_18px_35px_rgba(30,27,23,0.12)]"
                      />
                    </div>
                    <p className="mt-6 text-[9px] uppercase tracking-[0.28em] text-ink-quiet font-[family-name:var(--font-body)]">
                      Prestel &middot; Random House &middot; 2023
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
                      People of Deutschland
                    </h3>
                    <p className="mt-3 text-[14px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
                      A documentary portrait of contemporary Germany &mdash; its people,
                      contradictions, and quiet grandeur.
                    </p>
                  </article>

                  <article className="flex flex-col">
                    <div className="flex aspect-[4/5] items-center justify-center bg-bone p-10">
                      <Image
                        src="/images/books/fashion-germany-cover.png"
                        alt="Fashion Germany — book cover by Martina Rink"
                        width={900}
                        height={1200}
                        sizes="(min-width: 1024px) 28vw, 80vw"
                        className="max-h-full w-auto object-contain drop-shadow-[0_18px_35px_rgba(30,27,23,0.12)]"
                      />
                    </div>
                    <p className="mt-6 text-[9px] uppercase tracking-[0.28em] text-ink-quiet font-[family-name:var(--font-body)]">
                      Prestel &middot; Random House &middot; 2014
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-[20px] text-ink leading-snug">
                      Fashion Germany
                    </h3>
                    <p className="mt-3 text-[14px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
                      A portrait of German fashion &mdash; its designers, its codes, and the
                      culture that shaped one of Europe&rsquo;s most underestimated style capitals.
                    </p>
                  </article>
                </>
              )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5 — ISABELLA BLOW AUTHORITY BLOCK
      ══════════════════════════════════════════════════════ */}
      <section className="bg-aubergine py-20 md:py-28">
        <div className="container-content">
          <div className="grid lg:grid-cols-[1fr_0.42fr] gap-12 lg:gap-16 items-start max-w-5xl">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-sand/50 mb-8 font-[family-name:var(--font-body)]">
                Background
              </p>
              <blockquote className="font-[family-name:var(--font-display)] italic text-[28px] md:text-[36px] lg:text-[40px] leading-[1.2] text-cream">
                &ldquo;She shaped the careers of Alexander McQueen, Philip Treacy,
                and a generation of designers who changed fashion&rsquo;s course.&rdquo;
              </blockquote>
              <div className="mt-8 space-y-5 text-[16px] leading-[1.8] text-cream/65 font-[family-name:var(--font-body)] max-w-2xl">
                <p>
                  For several years, Martina Rink served as personal assistant to
                  Isabella Blow &mdash; the late British fashion editor, stylist, and
                  singular talent spotter whose influence defined the avant-garde
                  of the 1990s and 2000s.
                </p>
                <p>
                  That proximity to radical vision, eccentricity, and the human
                  cost of brilliance shaped the particular lens Rink brings to her
                  work with women.
                </p>
                <p>
                  It is a perspective that cannot be acquired from a course. It is
                  earned.
                </p>
              </div>
            </div>
            {/* Press clipping as credibility image */}
            <div className="hidden lg:flex items-center justify-center bg-cream/5 p-6">
              <Image
                src="/images/press/blow-press-feature.jpg"
                alt="Isabella Blow — press coverage spread featuring Martina Rink biography"
                width={853}
                height={539}
                sizes="280px"
                className="w-full object-contain opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6 — SPEAKING
      ══════════════════════════════════════════════════════ */}
      <section id="speaking" className="bg-cream py-20 md:py-28 scroll-mt-20">
        <div className="container-content">
          <div className="max-w-4xl mb-14">
            <Eyebrow withLine>Speaking</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] italic text-[40px] md:text-[48px] leading-tight text-ink">
              For audiences of senior women.
            </h2>
            <p className="mt-5 text-[17px] leading-[1.8] text-ink-soft max-w-2xl font-[family-name:var(--font-body)]">
              Martina speaks for conferences, corporate retreats, and curated
              evenings. Her talks are conversational, precisely argued, and
              deliberately uncomfortable in the way that useful things tend to be.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-5xl">
            {SPEAKING_TOPICS.map((topic, i) => (
              <div
                key={i}
                className="group bg-bone border border-sand/40 p-8 md:p-10 hover:border-sand/70 hover:shadow-[0_4px_28px_rgba(61,26,92,0.07)] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-6 bg-pink shrink-0" aria-hidden />
                  <span className="text-[9px] uppercase tracking-[0.28em] text-ink-quiet font-[family-name:var(--font-body)]">
                    Topic {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="font-[family-name:var(--font-display)] text-[19px] md:text-[20px] leading-snug text-ink mb-4">
                  {topic.title}
                </p>
                <p className="text-[14px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
                  {topic.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7 — FORMATS / AVAILABILITY
      ══════════════════════════════════════════════════════ */}
      <section className="bg-bone border-y border-sand/40 py-10 md:py-12">
        <div className="container-content">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 max-w-4xl">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-ink-quiet mb-3 font-[family-name:var(--font-body)]">
                Formats
              </p>
              <div className="flex flex-wrap gap-2">
                {["Panel guest", "Intimate fireside conversation", "Podcast guest"].map((f) => (
                  <span key={f} className="px-4 py-2 border border-sand/60 text-[11px] text-ink-soft font-[family-name:var(--font-body)] tracking-[0.06em]">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-ink-quiet mb-3 font-[family-name:var(--font-body)]">
                Availability
              </p>
              <p className="text-[15px] text-ink-soft font-[family-name:var(--font-body)]">
                Europe-wide &middot; International on request
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-2 inline-block text-[12px] uppercase tracking-[0.16em] text-plum hover:text-plum-deep transition-colors font-[family-name:var(--font-body)]"
              >
                Send a speaking enquiry &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          8 — PRESS MATERIALS / BIOS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-content">
          <div className="max-w-4xl mb-14">
            <Eyebrow withLine>Press materials</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] italic text-[40px] md:text-[48px] leading-tight text-ink">
              Biographies.
            </h2>
            <p className="mt-4 text-[16px] text-ink-soft font-[family-name:var(--font-body)]">
              Three lengths for editorial use. Please do not edit without prior approval.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl">
            {BIOS.map((bio) => (
              <div key={bio.length} className="bg-[#FFFCF8] border border-sand/40 p-8 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-ink-quiet font-[family-name:var(--font-body)]">
                    {bio.length} bio
                  </p>
                  <CopyButton text={bio.text} label="Copy bio" />
                </div>
                <p className="text-[15px] md:text-[16px] leading-[1.85] text-ink-soft font-[family-name:var(--font-body)] whitespace-pre-line">
                  {bio.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4 max-w-4xl">
            <GhostButton href={`mailto:${SITE.email}?subject=Headshot request`}>
              Request headshot
            </GhostButton>
            <GhostButton href={`mailto:${SITE.email}?subject=Hi-res book cover request`}>
              Request hi-res book cover
            </GhostButton>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          9 — LITERARY REPRESENTATION
      ══════════════════════════════════════════════════════ */}
      <section className="bg-bone py-16 md:py-20">
        <div className="container-content max-w-3xl">
          <Eyebrow withLine>Literary representation</Eyebrow>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-[26px] md:text-[30px] text-ink leading-snug">
            For rights and literary enquiries.
          </h2>
          <div className="mt-8 bg-cream border border-sand/50 p-8 md:p-10">
            <p className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-1">
              Elisabeth Ruge Agentur GmbH
            </p>
            <p className="text-[13px] text-ink-quiet mb-6 font-[family-name:var(--font-body)]">
              Rosenthaler Str. 34/35, 10178 Berlin, Germany
            </p>
            <div className="space-y-2 text-[15px] text-ink-soft font-[family-name:var(--font-body)]">
              <p>
                Representative:{" "}
                <span className="text-ink">Elisabeth Ruge</span>
              </p>
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:info@elisabeth-ruge-agentur.de"
                  className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
                >
                  info@elisabeth-ruge-agentur.de
                </a>
              </p>
              <p>Telefon: +49 30 2888 406 00</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          10 — SELECTED WORK / CASE STUDIES
      ══════════════════════════════════════════════════════ */}
      {displayCaseStudies.length > 0 && (
        <section className="bg-cream py-20 md:py-28 border-t border-sand/30">
          <div className="container-content">
            <div className="max-w-4xl mb-14">
              <Eyebrow withLine>Selected work</Eyebrow>
              <h2 className="mt-5 font-[family-name:var(--font-display)] italic text-[40px] md:text-[48px] leading-tight text-ink">
                Private work. Three accounts.
              </h2>
              <p className="mt-5 text-[17px] leading-[1.8] text-ink-soft max-w-xl font-[family-name:var(--font-body)]">
                Three accounts, with permission, from women who agreed to share
                the nature of the work. Pseudonyms throughout.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayCaseStudies.slice(0, 3).map((cs) => (
                <CaseStudyCard
                  key={cs._id}
                  pseudonym={cs.pseudonym}
                  industry={cs.industry}
                  programme={cs.programme ?? ""}
                  problemSnapshot={cs.problemSnapshot ?? ""}
                  outcomeMarker={cs.outcomeMarker ?? ""}
                  slug={cs.slug ?? cs._id}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          11 — FINAL PRESS CTA
      ══════════════════════════════════════════════════════ */}
      <section className="bg-aubergine py-20 md:py-28">
        <div className="container-content">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-end max-w-5xl">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cream/50 mb-6 font-[family-name:var(--font-body)]">
                Press &amp; speaking enquiries
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-[32px] md:text-[42px] lg:text-[48px] leading-[1.05] tracking-[-0.02em] text-cream">
                For press interviews, podcast conversations, and speaking engagements.
              </h2>
              <p className="mt-6 text-[17px] leading-[1.8] text-cream/65 font-[family-name:var(--font-body)] max-w-xl">
                Write directly to Martina. She responds to press and speaking requests personally.
              </p>
              <div className="mt-10 space-y-3 font-[family-name:var(--font-body)]">
                <a
                  href={`mailto:${SITE.email}`}
                  className="block font-[family-name:var(--font-display)] italic text-[22px] md:text-[26px] text-cream hover:text-pink transition-colors duration-200"
                >
                  {SITE.email}
                </a>
                <p className="text-[13px] uppercase tracking-[0.18em] text-cream/45">
                  Tel: +49 (0) 172 174 1499
                </p>
                <p className="text-[13px] text-cream/35">
                  Response within 48 hours on working days.
                </p>
              </div>
            </div>
            <div className="lg:pb-2">
              <PlumButton href={`mailto:${SITE.email}`}>
                Write to Martina
              </PlumButton>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-[13px] text-cream/30 font-[family-name:var(--font-body)]">
              Martina Rink &mdash; UG (haftungsbeschr&auml;nkt), Karlsruhe
            </p>
            <div className="flex gap-6 text-[13px] font-[family-name:var(--font-body)]">
              <Link href="/about"        className="text-cream/40 hover:text-cream/80 transition-colors">About</Link>
              <Link href="/writing"      className="text-cream/40 hover:text-cream/80 transition-colors">Writing</Link>
              <Link href="/work-with-me" className="text-cream/40 hover:text-cream/80 transition-colors">Work with me</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
