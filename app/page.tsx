import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { GhostButton } from "@/components/brand/GhostButton";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { AuthorityStrip } from "@/components/brand/AuthorityStrip";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorks } from "@/components/funnel/HowItWorks";
import { PressMarquee } from "@/components/brand/PressMarquee";
import { EditorialTestimonials } from "@/components/sections/EditorialTestimonials";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/utils";
import { REVIEWS, type Review } from "@/lib/testimonials";
import { getHomePage, getFeaturedTestimonials, type Testimonial } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePage();
  if (data?.seo?.seoTitle) {
    return buildMetadata({
      title: data.seo.seoTitle,
      description: data.seo.seoDescription ?? undefined,
      path: "/",
    });
  }
  return buildMetadata({ path: "/" });
}


export default async function HomePage() {
  const [pageData, testimonialData] = await Promise.all([
    getHomePage(),
    getFeaturedTestimonials(),
  ]);

  // Use Sanity testimonials if available and non-empty, else all real reviews except page-specific ones
  const testimonials =
    testimonialData && testimonialData.length > 0
      ? testimonialData
      : REVIEWS.filter((r) => r.id !== "anja-about");

  const heroSubheadline =
    pageData?.heroSubheadline ??
    "The career. The recognition. The particular kind of life that, on paper, resolves. And somewhere — quietly, between the Sunday afternoons and the 4am recalibrations — something has stopped feeling like yours. I work with a small number of women at a time. Privately.";

  const heroCta = pageData?.heroCta?.label ?? "Begin the private assessment";
  const heroCtaUrl = pageData?.heroCta?.url ?? "/assessment";
  const heroSecondaryLabel = pageData?.heroSecondaryLabel ?? "Explore the work";
  const heroSecondaryUrl = pageData?.heroSecondaryUrl ?? "/work-with-me";

  const assessmentCtaHeadline =
    pageData?.assessmentCtaHeadline ?? "Which of two patterns is most alive in your life right now?";
  const assessmentCtaCopy =
    pageData?.assessmentCtaCopy ??
    "Ten questions. About five minutes. At the end, a letter — written specifically for where you are. Not a quiz. Not a quadrant. A beginning.";
  const assessmentCtaLabel = pageData?.assessmentCtaLabel ?? "Begin the assessment";

  return (
    <>
      {/* ─── 1 · HERO — 2026 editorial split hero ────────────── */}
      <HeroSection
        heroCta={heroCta}
        heroCtaUrl={heroCtaUrl}
        heroSecondaryLabel={heroSecondaryLabel}
        heroSecondaryUrl={heroSecondaryUrl}
        heroSubheadline={heroSubheadline}
      />

      {/* ─── 1b · QUALIFIER BAND — who it's for, by application ─ */}
      <section className="bg-cream border-y border-sand/40 py-10 md:py-12">
        <div className="container-content max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.28em] text-ink-quiet font-[family-name:var(--font-body)]">
              Who I work with
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-[20px] md:text-[24px] leading-snug text-ink">
              Private mentoring for founders, executives, and creatives — at the
              point where the life they built stopped feeling like theirs.
            </p>
          </div>
          <div className="shrink-0 md:text-right space-y-2">
            <p className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet font-[family-name:var(--font-body)]">
              By application &middot; {SITE.pricing.soberMuseFrom.charAt(0).toUpperCase() + SITE.pricing.soberMuseFrom.slice(1)}
            </p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-quiet/80 font-[family-name:var(--font-body)]">
              Vogue Germany &middot; Der Spiegel &middot; Die Zeit
            </p>
          </div>
        </div>
      </section>

      {/* ─── 2 · ABOUT — who Martina is, right after the hero ── */}
      <section className="bg-bone section-pad">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5">
            <div className="relative aspect-[2/3] bg-sand/30 overflow-hidden">
              <Image
                src="/images/portraits/martina-library-pink.jpg"
                alt="Martina Rink — author and private mentor"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover object-top"
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <Eyebrow>About</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[34px] md:text-[44px] leading-[1.15] text-ink">
              I am interested in the distance between how a woman appears — and
              how she{" "}
              <ScriptAccent className="text-[1.1em] leading-none">
                actually feels
              </ScriptAccent>{" "}
              inside her own life.
            </h2>
            <div className="mt-8 space-y-5 text-[17px] leading-[1.7] text-ink-soft max-w-[560px]">
              <p>
                {pageData?.aboutTeaser ||
                  "Born in Persia. Adopted by German parents. Raised between Germany, London, Paris, and Ibiza. I have lived, from the beginning, with the question of who I am underneath the circumstances I was placed in."}
              </p>
              <p>
                Before this practice: personal assistant to Isabella Blow in
                London. Years inside the international creative and fashion
                industry, watching what success can cost the women inside it.
                Three published books, including a Spiegel Bestseller. Six
                years alcohol-free. None of that is the work — it is simply
                why I understand what it takes to build a life that fits who
                you actually are.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-6">
              <ScriptAccent className="text-[38px]">Martina</ScriptAccent>
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
                Author &middot; Mentor &middot; Ibiza &middot; Berlin &middot; London &middot; International
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <Link
                href="/about"
                className="inline-block text-[14px] text-plum underline decoration-pink decoration-1 underline-offset-[6px]"
              >
                Read the full story →
              </Link>
              <Link
                href="/work-with-me"
                className="inline-block text-[14px] text-plum underline decoration-pink decoration-1 underline-offset-[6px]"
              >
                Work with me →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3 · AUTHORITY BAND — press + credentials ─────────── */}
      <PressMarquee />
      <AuthorityStrip />

      {/* ─── 4 · THE PRIVATE COST — emotional continuation ───── */}
      <section className="bg-bone section-pad">
        <div className="container-content max-w-3xl">
          <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.015em] text-ink">
            The outside life is not the whole story.
          </h2>
          <div className="mt-10 space-y-6 text-[17px] leading-[1.75] text-ink-soft max-w-[600px]">
            <p>
              You may be functioning. Loved. Respected — even admired. And
              still, something in you knows: this version of your life is
              costing more than anyone can see.
            </p>
            <p>
              Not because anything has gone wrong. Because something has
              shifted — quietly, in the space between who you appear to be
              and who you actually are. That shift is what I work with.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 5 · TWO WAYS IN ─────────────────────────────────── */}
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
                meta: "90 days · private · by application",
                href: "/sober-muse",
                link: "The method →",
              },
              {
                roman: "II.",
                title: "Female Empowerment & Leadership",
                tagline: "For the woman navigating identity, presence, and what comes next.",
                body: "There is a particular exhaustion that comes not from doing too much, but from being someone who no longer quite fits. The container you built has stopped being the same size as you are. This is information. And it is the beginning of the most interesting work available to you.",
                meta: "3–12 months · open-ended · by application",
                href: "/empowerment",
                link: "The work →",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative bg-bone border-l-[3px] border-l-sand/60 hover:border-l-pink p-10 md:p-12 hover:-translate-y-1 transition-all duration-300 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_32px_rgba(61,26,92,0.10)]"
              >
                <span className="block font-[family-name:var(--font-body)] text-[11px] uppercase tracking-[0.3em] text-pink/70">
                  {card.roman}
                </span>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-[28px] text-ink leading-tight">
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
                <p className="mt-6 text-[14px] text-plum font-medium group-hover:text-pink transition-colors">
                  {card.link}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6 · PUBLISHED WORK — editorial book archive ──────── */}
      <section className="py-16 md:py-24 border-t border-sand/30 bg-cream">
        <div className="container-content max-w-7xl">

          {/* Header */}
          <div className="text-center mb-14 md:mb-20">
            <p
              className="font-[family-name:var(--font-body)]"
              style={{
                fontSize:      "11px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color:         "var(--color-ink-quiet)",
              }}
            >
              Published work
            </p>
            <h2
              className="mt-5 font-[family-name:var(--font-display)] text-ink mx-auto"
              style={{
                fontSize:   "clamp(2.6rem, 6vw, 6.8rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
                maxWidth:   "1100px",
              }}
            >
              Written from inside the work.
            </h2>
          </div>

          {/* Book grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 xl:gap-14">
            {[
              {
                title: "Isabella Blow — A Life in Fashion",
                meta:  "THAMES & HUDSON · 2010",
                src:   "/images/books/isabella-blow-cover.png",
                alt:   "Book cover of Isabella Blow — A Life in Fashion by Martina Rink",
              },
              {
                title: "People of Deutschland",
                meta:  "SPIEGEL BESTSELLER · 2022",
                src:   "/images/books/people-of-deutschland-cover.png",
                alt:   "Book cover of People of Deutschland by Martina Rink and Simon Usifo",
              },
              {
                title: "Fashion Germany",
                meta:  "PRESTEL · RANDOM HOUSE",
                src:   "/images/books/fashion-germany-cover.png",
                alt:   "Book cover of Fashion Germany by Martina Rink",
              },
            ].map((book) => (
              <figure
                key={book.title}
                className="group flex flex-col items-center text-center"
              >
                {/* Mobile: title + meta ABOVE image */}
                <figcaption className="md:hidden mb-5 w-full">
                  <p
                    className="font-[family-name:var(--font-display)] text-ink leading-[1.2]"
                    style={{ fontSize: "clamp(1.35rem, 5vw, 1.6rem)" }}
                  >
                    {book.title}
                  </p>
                  <p
                    className="mt-2 font-[family-name:var(--font-body)]"
                    style={{
                      fontSize:      "10px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color:         "var(--color-ink-quiet)",
                    }}
                  >
                    {book.meta}
                  </p>
                </figcaption>

                {/* Image stage */}
                <div
                  className="relative w-full bg-white overflow-hidden
                             transition-all duration-500 ease-out
                             md:group-hover:-translate-y-2
                             shadow-[0_2px_20px_rgba(30,27,23,0.06)]
                             md:group-hover:shadow-[0_12px_48px_rgba(30,27,23,0.13)]"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <Image
                    src={book.src}
                    alt={book.alt}
                    fill
                    sizes="(max-width: 768px) 88vw, 30vw"
                    className="object-contain p-10 md:p-12
                               drop-shadow-[0_16px_32px_rgba(30,27,23,0.18)]"
                  />
                </div>

                {/* Desktop: title + meta BELOW image */}
                <figcaption className="hidden md:block mt-7 w-full">
                  <p
                    className="font-[family-name:var(--font-display)] text-ink leading-[1.2]"
                    style={{ fontSize: "1.2rem" }}
                  >
                    {book.title}
                  </p>
                  <p
                    className="mt-2 font-[family-name:var(--font-body)]"
                    style={{
                      fontSize:      "10px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color:         "var(--color-ink-quiet)",
                    }}
                  >
                    {book.meta}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Footer link */}
          <div className="text-center mt-16 md:mt-20">
            <Link
              href="/creative-work"
              className="inline-block font-[family-name:var(--font-body)] text-plum underline decoration-pink decoration-1 underline-offset-[6px]"
              style={{ fontSize: "13px", letterSpacing: "0.06em" }}
            >
              See the complete creative work →
            </Link>
          </div>

        </div>
      </section>

      {/* ─── 7 · TESTIMONIALS — editorial 2026 ───────────────── */}
      <EditorialTestimonials
        testimonials={testimonials.map((t, i) => {
          const isSanity = "_id" in t;
          return {
            key: isSanity ? (t as Testimonial)._id : (t as Review).id ?? t.name + i,
            name: t.name,
            role: t.role ?? null,
            quote: t.quote,
            nda: t.nda,
            photoPath: isSanity ? undefined : (t as Review).photoPath,
          };
        })}
      />

      {/* ─── 8 · THE PATH — process, after desire ─────────────── */}
      <HowItWorks />

      {/* ─── 9 · CLOSING — private assessment (DARK) ──────────── */}
      <section className="relative bg-aubergine section-pad overflow-hidden">
        <div className="container-content relative max-w-3xl mx-auto text-center">
          <Eyebrow className="justify-center">
            <span className="text-pink-soft">A private assessment</span>
          </Eyebrow>
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[56px] leading-[1.05] text-cream">
            {assessmentCtaHeadline}
          </h2>
          <p className="mt-8 text-[19px] leading-[1.65] text-cream/80 max-w-[520px] mx-auto">
            {assessmentCtaCopy}
          </p>
          <div className="mt-10">
            <GhostButton variant="light" href="/assessment">
              {assessmentCtaLabel}
            </GhostButton>
          </div>
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-cream/50">
            Private · Confidential · Always
          </p>
        </div>
      </section>
    </>
  );
}
