import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { AuthorityStrip } from "@/components/brand/AuthorityStrip";
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
  return buildMetadata({
    path: "/",
  });
}

// Hardcoded fallback testimonials — used when Sanity is not configured.
// TODO: replace with real client testimonial once received from Martina.
const FALLBACK_TESTIMONIALS: Omit<Testimonial, "_id" | "portrait" | "programme" | "featured" | "order">[] = [
  {
    name: "Armina",
    role: "Patent Engineer",
    quote:
      "She helped me gain clarity about my life path and clearly define my goals. What I thought was a problem with discipline turned out to be a problem with direction.",
    nda: false,
  },
  {
    name: "",
    role: "Senior Director · Vienna",
    quote:
      "What Martina does is different — it is more like being read than being advised. Within the first month she named something I had never managed to say out loud.",
    nda: true,
  },
];

function TestimonialBlock({
  testimonial,
  bg,
  accentColor,
}: {
  testimonial: { name: string; role: string | null; quote: string; nda: boolean };
  bg: string;
  accentColor: string;
}) {
  const displayName = testimonial.nda ? testimonial.role : `${testimonial.name}${testimonial.role ? ` · ${testimonial.role}` : ""}`;
  return (
    <div className={`${bg} p-10`}>
      <span
        aria-hidden
        className={`block font-[family-name:var(--font-display)] italic ${accentColor} text-[60px] leading-none -mt-2 mb-2`}
      >
        &ldquo;
      </span>
      <blockquote className="font-[family-name:var(--font-display)] italic text-[22px] leading-[1.4] text-ink">
        {testimonial.quote}
      </blockquote>
      <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-ink-quiet">
        — {displayName}
      </p>
    </div>
  );
}

export default async function HomePage() {
  const [pageData, testimonialData, partnerData] = await Promise.all([
    getHomePage(),
    getFeaturedTestimonials(),
    getPartnerLogos(),
  ]);

  // Use Sanity testimonials if available and non-empty, else fallback
  const testimonials =
    testimonialData && testimonialData.length > 0
      ? testimonialData.slice(0, 2)
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
      {/* ─── HERO — dark aubergine, fluid H1, 2026 editorial ───── */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 bg-plum overflow-hidden">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7 lg:col-span-7">
            <Eyebrow withLine variant="light">
              For the woman who already has it all
            </Eyebrow>

            {/* Fluid H1 — clamp scales from 44px (mobile) to 82px (desktop) */}
            <h1
              className="mt-6 font-[family-name:var(--font-display)] leading-[0.95] tracking-[-0.02em] text-cream"
              style={{ fontSize: "clamp(2.75rem, 5.5vw + 0.5rem, 5.125rem)" }}
            >
              You&rsquo;ve built a life that looks{" "}
              <em className="italic">extraordinary</em> from the outside
              <br className="hidden md:inline" />
              {/* TODO: "— and yet." script accent — homepage hero only, keep here */}
              <ScriptAccent className="block mt-2 text-[0.7em] leading-none text-pink">
                — and yet.
              </ScriptAccent>
            </h1>

            <p className="mt-8 max-w-[520px] text-[19px] leading-[1.65] text-cream/75">
              {heroSubheadline}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-5 sm:items-center">
              {/* Cream-fill primary button on dark plum background */}
              <PlumButton
                href={heroCtaUrl}
                className="!bg-cream !text-plum hover:!bg-bone"
              >
                {heroCta}
              </PlumButton>
              <GhostButton href={heroSecondaryUrl} variant="light">
                {heroSecondaryLabel}
              </GhostButton>
            </div>
          </div>

          {/* Hero portrait */}
          <div className="md:col-span-5 lg:col-span-5 relative">
            <div className="relative aspect-[3/4] bg-bone overflow-hidden">
              <Image
                src="/images/portraits/martina-glam-portrait.jpg"
                alt="Martina Rink — private mentor and author"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-top"
                priority
                fetchPriority="high"
              />
              {/* TODO: "welcome home, love" — keep; awaiting Martina copy review */}
              <ScriptAccent
                as="div"
                className="absolute -bottom-2 -right-2 md:bottom-4 md:right-4 text-[28px] md:text-[32px] -rotate-2 drop-shadow-sm text-cream"
              >
                welcome home, love
              </ScriptAccent>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AS FEATURED IN — press logos above fold ─────────── */}
      <section className="bg-cream border-t border-sand/40 py-8">
        <div className="container-content">
          <p className="text-center text-[10px] uppercase tracking-[0.24em] text-ink-quiet mb-5">
            As featured in
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3">
            {["Der Spiegel", "Brigitte", "STERN", "Vogue Germany", "Die Zeit"].map(
              (outlet) => (
                <span
                  key={outlet}
                  className="font-[family-name:var(--font-display)] text-[15px] md:text-[17px] text-ink/55 tracking-[0.04em]"
                >
                  {outlet}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── AUTHORITY STRIP ─────────────────────────────────── */}
      <AuthorityStrip />

      {/* ─── THE PRIVATE COST ────────────────────────────────── */}
      <section className="bg-cream section-pad">
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
            <div className="relative aspect-[4/5] bg-sand/30 overflow-hidden">
              <Image
                src="/images/portraits/martina-cafe-editorial.jpg"
                alt="Martina Rink — author and cultural observer"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover object-center"
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
            <div className="relative aspect-[4/5] bg-sand/30 overflow-hidden">
              <Image
                src="/images/portraits/martina-portrait-studio.jpg"
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
        <div
          aria-hidden
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.08] bg-pink"
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
            {testimonials.map((t, i) => (
              <TestimonialBlock
                key={"_id" in t ? (t as Testimonial)._id : (t as { name: string }).name + String(i)}
                testimonial={t}
                bg={i === 0 ? "bg-blush" : "bg-bone"}
                accentColor={i === 0 ? "text-plum/30" : "text-pink/30"}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
