import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { AuthorityStrip } from "@/components/brand/AuthorityStrip";
import { HeroSection } from "@/components/sections/HeroSection";
import { PressMarquee } from "@/components/brand/PressMarquee";
import { buildMetadata } from "@/lib/metadata";
import { getHomePage, getFeaturedTestimonials, getPartnerLogos, type Testimonial } from "@/sanity/lib/queries";

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

// Real client testimonials — with verified portrait photos.
interface FallbackTestimonial {
  name: string;
  role: string | null;
  quote: string;
  nda: boolean;
  photoPath?: string; // path to /images/portraits/
}

const FALLBACK_TESTIMONIALS: FallbackTestimonial[] = [
  {
    name: "Rebecca",
    role: "Travel Agent & Entrepreneur",
    quote:
      "A dear friend introduced me to Martina's Dry January Challenge. What began as an experiment quickly became one of the most significant months of my life. With Martina's support I not only completed the challenge but gained a much deeper understanding of my relationship with myself. Challenge accomplished.",
    nda: false,
    photoPath: "/images/portraits/portrait-rebecca.avif",
  },
  {
    name: "Harita",
    role: "Manager · Automotive industry",
    quote:
      "I've had a few conversations with Martina, and her energy is truly special. The topics we discuss resonate so deeply with my own thoughts — as if taken directly from my own mind. She speaks from experience and conveys profound depth. Every interaction is simply inspiring.",
    nda: false,
    photoPath: "/images/portraits/portrait-harita.avif",
  },
  {
    name: "Lu",
    role: "Patent Attorney",
    quote:
      "Martina has so many wonderful attributes that it is very difficult to describe the full impact in a few sentences. She is warm, supportive, constructive and very professional — with great expertise to guide people in finding their way. Highly recommended for anyone seeking serious personal development.",
    nda: false,
    photoPath: "/images/portraits/portrait-lu.avif",
  },
  {
    name: "Anja",
    role: "Founder & Digital Business Consultant",
    quote:
      "The session with Martina was a thoroughly enriching experience. It was inspiring, motivating, and above all extremely effective. She has a wonderful way of helping you arrive at important realisations about yourself — in a remarkably short time.",
    nda: false,
  },
];

function TestimonialBlock({
  testimonial,
  bg,
  accentColor,
}: {
  testimonial: { name: string; role: string | null; quote: string; nda: boolean; photoPath?: string };
  bg: string;
  accentColor: string;
}) {
  const displayName = testimonial.nda ? testimonial.role : testimonial.name;
  const role = testimonial.nda ? null : testimonial.role;
  return (
    <div className={`${bg} p-10 flex flex-col`}>
      <span
        aria-hidden
        className={`block font-[family-name:var(--font-display)] italic ${accentColor} text-[60px] leading-none -mt-2 mb-2`}
      >
        &ldquo;
      </span>
      <blockquote className="font-[family-name:var(--font-display)] italic text-[20px] leading-[1.5] text-ink flex-1">
        {testimonial.quote}
      </blockquote>
      {/* Portrait + attribution */}
      <div className="mt-8 flex items-center gap-4">
        {testimonial.photoPath && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-sand/60">
            <Image
              src={testimonial.photoPath}
              alt={displayName ?? "Client"}
              fill
              sizes="48px"
              className="object-cover object-top"
            />
          </div>
        )}
        <div>
          {displayName && (
            <p className="text-[12px] uppercase tracking-[0.18em] text-ink font-medium">
              {displayName}
            </p>
          )}
          {role && (
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-quiet mt-0.5">
              {role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [pageData, testimonialData, partnerData] = await Promise.all([
    getHomePage(),
    getFeaturedTestimonials(),
    getPartnerLogos(),
  ]);

  // Use Sanity testimonials if available and non-empty, else use hardcoded real testimonials
  const testimonials =
    testimonialData && testimonialData.length > 0
      ? testimonialData.slice(0, 4)
      : FALLBACK_TESTIMONIALS;

  const heroSubheadline =
    pageData?.heroSubheadline ??
    "The career. The recognition. The particular kind of life that, on paper, resolves. And somewhere — quietly, between the Sunday afternoons and the 4am recalibrations — something has stopped feeling like yours. I work with a small number of women at a time. Privately.";

  const heroCta = pageData?.heroCta?.label ?? "Begin the assessment";
  const heroCtaUrl = pageData?.heroCta?.url ?? "/assessment";
  const heroSecondaryLabel = pageData?.heroSecondaryLabel ?? "Or explore the work →";
  const heroSecondaryUrl = pageData?.heroSecondaryUrl ?? "/work-with-me";

  const assessmentCtaHeadline =
    pageData?.assessmentCtaHeadline ?? "Which of two patterns is most alive in your life right now?";
  const assessmentCtaCopy =
    pageData?.assessmentCtaCopy ??
    "Seven questions. About four minutes. At the end, a letter — written specifically for where you are. Not a quiz. Not a quadrant. A beginning.";
  const assessmentCtaLabel = pageData?.assessmentCtaLabel ?? "Begin the assessment";

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      {/* body copy is hardcoded inside HeroSection per brief — not Sanity-driven */}
      {/* secondary label + body copy are hardcoded in HeroSection — not Sanity-driven */}
      <HeroSection
        heroCta={heroCta}
        heroCtaUrl={heroCtaUrl}
        heroSecondaryUrl={heroSecondaryUrl}
      />

      {/* ─── AUTHORITY STRIP ─────────────────────────────────── */}
      <AuthorityStrip />

      {/* ─── ENTITY DEFINITION (Google E-A-T + Knowledge Panel) ──
          Single sentence. Visually quiet. Parses cleanly as
          "Martina Rink is a [job title] and [credential]". */}
      <section className="bg-cream border-b border-sand/30 py-10">
        <div className="container-content max-w-3xl text-center">
          <p className="text-[15px] md:text-[16px] leading-[1.7] text-ink-quiet italic font-[family-name:var(--font-display)]">
            Martina Rink is a Spiegel Bestselling author and private mentor
            for accomplished women — working across Ibiza, Berlin, and Munich
            on identity, sobriety, and the second chapter of a public life.
          </p>
        </div>
      </section>

      {/* ─── AS FEATURED IN — infinite press marquee ─────────── */}
      <PressMarquee />

      {/* ─── THE PRIVATE COST ────────────────────────────────── */}
      <section className="bg-bone section-pad">
        <div className="container-content max-w-3xl">
          <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.015em] text-ink">
            The outside life is not the whole story.
          </h2>
          <div className="mt-10 space-y-6 text-[17px] leading-[1.75] text-ink-soft max-w-[600px]">
            <p>
              You may be functioning. You may be loved. You may be respected —
              even admired. And still, something in you may know: this version
              of your life is costing more than anyone can see.
            </p>
            <p>
              Not because anything has gone dramatically wrong. Because
              something has shifted — quietly, privately, in the space between
              who you appear to be and who you actually are.
            </p>
            <p>
              That shift is what I work with.
            </p>
          </div>
        </div>
      </section>

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
                meta: "90 days · private · by application",
                href: "/sober-muse",
              },
              {
                roman: "II.",
                title: "Female Empowerment & Leadership",
                tagline: "For the woman navigating identity, presence, and what comes next.",
                body: "There is a particular exhaustion that comes not from doing too much, but from being someone who no longer quite fits. The container you built has stopped being the same size as you are. This is information. And it is the beginning of the most interesting work available to you.",
                meta: "6–12 months · open-ended · by application",
                href: "/empowerment",
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
                  Read more →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CULTURAL WORK TEASER ────────────────────────────── */}
      <section className="bg-bone section-pad">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5">
            <div className="relative aspect-[2/3] bg-sand/30 overflow-hidden">
              <Image
                src="/images/portraits/martina-library-pink.jpg"
                alt="Martina Rink — author and cultural observer"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover object-top"
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <Eyebrow>Creative Work</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[34px] md:text-[42px] leading-[1.15] text-ink">
              Before this work became private, it was cultural.
            </h2>
            <div className="mt-8 space-y-5 text-[17px] leading-[1.7] text-ink-soft max-w-[520px]">
              <p>
                Three published books. A Spiegel Bestseller. Years inside the
                fashion world at the highest level. Co-creator of People of
                Deutschland. Personal assistant to Isabella Blow in London.
              </p>
              <p>
                This is not the biography of a coach. It is the foundation of
                a very particular kind of understanding.
              </p>
            </div>
            <Link
              href="/creative-work"
              className="mt-8 inline-block text-[14px] text-plum underline decoration-pink decoration-1 underline-offset-[6px]"
            >
              View the creative work →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PUBLISHED WORKS — premium editorial book archive ───
          White background, large display headline, publisher-style
          card layout. Mobile: title/meta above image. */}
      <section
        className="py-16 md:py-24 border-t border-sand/30"
        style={{ backgroundColor: "#FFFCF8" }}
      >
        <div className="container-content max-w-7xl">

          {/* Header */}
          <div className="text-center mb-14 md:mb-20">
            <p
              className="font-[family-name:var(--font-body)]"
              style={{
                fontSize:      "11px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color:         "#636260",
              }}
            >
              Bestsellers
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
                meta:  "PRESTEL · 2014",
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
                meta:  "CALLWEY",
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
                      color:         "#636260",
                    }}
                  >
                    {book.meta}
                  </p>
                </figcaption>

                {/* Image stage */}
                <div
                  className="relative w-full overflow-hidden transition-transform duration-500 ease-out md:group-hover:-translate-y-1"
                  style={{
                    aspectRatio:     "4 / 5",
                    backgroundColor: "#F4EFE8",
                  }}
                >
                  <Image
                    src={book.src}
                    alt={book.alt}
                    fill
                    sizes="(max-width: 768px) 88vw, 30vw"
                    className="object-contain p-8 md:p-10"
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
                      color:         "#636260",
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

      {/* ─── PARTNER LOGOS ───────────────────────────────────── */}
      <section className="bg-bone border-t border-sand/30 py-14">
        <div className="container-content">
          <p className="text-center text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-10">
            Selected Partners &amp; Collaborators
          </p>
          {partnerData && partnerData.length > 0 ? (
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
              {partnerData.map((p) => (
                <span
                  key={p._id}
                  className="text-[13px] uppercase tracking-[0.15em] text-ink/50 font-medium"
                >
                  {p.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
              {[
                "Otto", "MCM", "Vogue Germany", "H&M", "Meta",
                "About You", "Henkel", "Beiersdorf", "Telekom", "Prestel",
              ].map((name) => (
                <span
                  key={name}
                  className="text-[13px] uppercase tracking-[0.15em] text-ink/50 font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
          <p className="mt-8 text-center text-[11px] text-ink-quiet/60">
            Corporate clients and project partners · 2009–2022
          </p>
        </div>
      </section>

      {/* ─── ABOUT TEASER ────────────────────────────────────── */}
      <section className="bg-bone section-pad">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5">
            <div className="relative aspect-[2/3] bg-sand/30 overflow-hidden">
              <Image
                src="/images/portraits/martina-salon-ibiza.jpg"
                alt="Martina Rink — private mentor"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover object-top"
              />
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
                {pageData?.aboutTeaser ||
                  "Born in Persia. Adopted by German parents. Educated in Germany and London. I have lived, from the beginning, with the question of who I am underneath the circumstances I was placed in."}
              </p>
              <p>
                Before this practice: personal assistant to Isabella Blow in
                London. Three published books, including a Spiegel Bestseller.
                Six years sober. None of that is the work — it is simply why I
                can sit with women who are accomplished enough to know that
                accomplishment is not the answer.
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
              className="mt-8 inline-block text-[14px] text-plum underline decoration-pink decoration-1 underline-offset-[6px]"
            >
              Read the longer version →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ASSESSMENT TEASER (DARK) ────────────────────────── */}
      <section className="relative bg-navy section-pad overflow-hidden">
        {/* Centered plum bloom — editorial warmth */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-[800px] h-[800px] rounded-full blur-[120px] opacity-[0.18] bg-plum" />
        </div>
        {/* Edge pink accent orb */}
        <div
          aria-hidden
          className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.14] bg-pink"
        />
        {/* Bottom-left teal hint — depth */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full blur-3xl opacity-[0.07] bg-teal"
        />
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

      {/* ─── TESTIMONIALS ────────────────────────────────────── */}
      <section className="bg-cream section-pad">
        <div className="container-content">
          <Eyebrow className="mb-14">Women who have done this work</Eyebrow>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
            {testimonials.map((t, i) => {
              const bgMap = ["bg-blush", "bg-bone", "bg-lilac-soft", "bg-bone"];
              const accentMap = ["text-plum/30", "text-pink/30", "text-plum/25", "text-pink/25"];
              const isSanity = "_id" in t;
              const item = {
                name: t.name,
                role: t.role ?? null,
                quote: t.quote,
                nda: t.nda,
                photoPath: isSanity ? undefined : (t as FallbackTestimonial).photoPath,
              };
              return (
                <TestimonialBlock
                  key={isSanity ? (t as Testimonial)._id : t.name + String(i)}
                  testimonial={item}
                  bg={bgMap[i % bgMap.length]}
                  accentColor={accentMap[i % accentMap.length]}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
