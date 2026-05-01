import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { WineButton } from "@/components/brand/WineButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { TestimonialCard } from "@/components/brand/TestimonialCard";
import { buildMetadata, faqSchema } from "@/lib/metadata";
import { getSoberMusePage } from "@/sanity/lib/queries";

const FAQS = [
  {
    q: "Do I need to have decided to stop drinking to work with you?",
    a: "No. Most women I work with have not made that decision when we begin. The work is not contingent on that decision having been made.",
  },
  {
    q: "Is this therapy?",
    a: "No. It is mentoring. The distinction matters: I am not a therapist, and I do not work as one. Where clinical support is relevant, I will say so and I have resources to recommend.",
  },
  {
    q: "Is it confidential?",
    a: "Completely. I do not share client information with anyone under any circumstances, except as required by law.",
  },
  {
    q: "Where does the work take place?",
    a: "By private video or phone session, scheduled to your timezone. I work with women internationally. No in-person requirement.",
  },
  {
    q: "What if I'm not sure it's the right fit?",
    a: "That is what the assessment is for. Take it. It will give you a clearer sense of where you are and which conversation makes sense right now.",
  },
  {
    q: "Do you work with couples or families?",
    a: "No. I work only with individual women, privately.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSoberMusePage();
  if (data?.seo?.seoTitle) {
    return buildMetadata({
      title: data.seo.seoTitle,
      description: data.seo.seoDescription ?? undefined,
      path: "/sober-muse",
    });
  }
  return buildMetadata({
    title: "The Sober Muse Method",
    description:
      "A 90-day private engagement for executive women re-examining their relationship with alcohol. No recovery language. No group settings. From €5,000.",
    path: "/sober-muse",
  });
}

export default async function SoberMusePage() {
  const data = await getSoberMusePage();

  const heroHeadline =
    data?.heroHeadline ?? "This is not about what you’re giving up.";
  const heroCopy =
    data?.heroCopy ??
    "It is about what you are finally able to see clearly, once the management strategy has been set aside.";
  const ctaLabel = data?.ctaLabel ?? "Request a private consultation";
  const ctaUrl = data?.ctaUrl ?? "/book";
  const investmentText = data?.investmentText ?? null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }}
      />

      {/* HERO */}
      <section className="bg-cream pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7">
            <Eyebrow withLine>The Sober Muse Method</Eyebrow>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[64px] leading-[1.05] tracking-[-0.015em] text-ink">
              {heroHeadline}
            </h1>
            <p className="mt-8 text-[20px] leading-[1.55] text-ink-soft max-w-[520px]">
              {heroCopy}
            </p>
            <div className="mt-10">
              <WineButton href={ctaUrl}>{ctaLabel}</WineButton>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[3/4] bg-bone overflow-hidden">
              <Image
                src="/images/portraits/martina-ibiza-working.jpg"
                alt="Martina Rink — Sober Muse Method"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS / WHAT IS NOT */}
      <section className="bg-bone section-pad">
        <div className="container-content grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <h2 className="font-[family-name:var(--font-display)] italic text-[32px] text-ink">
              What this is not.
            </h2>
            {data?.whatThisIsNotCopy ? (
              <div className="mt-8 space-y-4 text-[16px] leading-[1.7] text-ink-soft">
                {data.whatThisIsNotCopy.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <ul className="mt-8 space-y-4 text-[16px] leading-[1.7] text-ink-soft">
                {[
                  "A recovery programme",
                  "Group sessions or peer support",
                  "An identity as a “sober person”",
                  "A curriculum, a workbook, or a content library",
                  "Something you need to have hit a bottom to access",
                  "Labelled, categorised, or filed under any clinical framework",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-pink mt-2 select-none">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-display)] italic text-[32px] text-ink">
              What this is.
            </h2>
            {data?.forWhomCopy ? (
              <div className="mt-8 space-y-4 text-[16px] leading-[1.7] text-ink-soft">
                {data.forWhomCopy.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <ul className="mt-8 space-y-4 text-[16px] leading-[1.7] text-ink-soft">
                {[
                  "A 90-day private mentoring engagement",
                  "One woman, one mentor, no group dynamic",
                  "Work that begins with the original question, not the symptom",
                  "Precise, confidential, and calibrated to where you actually are",
                  "Available in English, internationally",
                  "For women who are, by every external measure, doing well",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-pink mt-2 select-none">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* THE METHOD — 3 PHASES */}
      <section className="bg-cream section-pad">
        <div className="container-content">
          <div className="text-center max-w-2xl mx-auto">
            <Eyebrow className="justify-center">The method</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[40px] md:text-[48px] leading-tight text-ink">
              Three phases. Ninety days.
            </h2>
            {data?.methodCopy && (
              <div className="mt-6 space-y-4 text-[17px] leading-[1.75] text-ink-soft text-left">
                {data.methodCopy.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              {
                phase: "Phase one — weeks 1–3",
                title: "Naming.",
                body: "Before we can work with a thing, we have to be able to say what it actually is. The first phase is dedicated entirely to precision — naming the drink, naming what it is managing, naming the original question with as much accuracy as the work allows.",
              },
              {
                phase: "Phase two — weeks 4–9",
                title: "Clearing.",
                body: "The middle phase is the work itself. We address what the drink was managing — directly, methodically, without the softening. This is where the original question gets examined, not as a symptom but as information about the life that is possible.",
              },
              {
                phase: "Phase three — weeks 10–12",
                title: "Return.",
                body: "The final phase is about building. Not a new identity, not a story about yourself. A return to a version of yourself that has its own position — its own preferences, its own way of occupying space — that doesn't need to be softened before it can be tolerated.",
              },
            ].map((p) => (
              <div key={p.title} className="bg-bone p-8 md:p-10">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
                  {p.phase}
                </p>
                <h3 className="mt-4 font-[family-name:var(--font-display)] italic text-[28px] text-ink">
                  {p.title}
                </h3>
                <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL — DARK */}
      <section className="bg-ink section-pad">
        <div className="container-content max-w-3xl mx-auto text-center">
          <span
            aria-hidden
            className="block font-[family-name:var(--font-display)] italic text-wine-deep text-[80px] leading-none"
          >
            &ldquo;
          </span>
          <blockquote className="mt-2 font-[family-name:var(--font-display)] italic text-[24px] md:text-[28px] leading-snug text-cream">
            I came in thinking I had a drinking problem. I left understanding I
            had a clarity problem — and the drinking had been the solution
            I&rsquo;d found for it. Martina saw that distinction before I did.
          </blockquote>
          <p className="mt-8 text-[13px] uppercase tracking-[0.15em] text-cream/60">
            — Founder · London
          </p>
        </div>
      </section>

      {/* INVESTMENT */}
      <section className="bg-cream section-pad">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-4">
            <div className="relative aspect-[3/4] bg-bone overflow-hidden">
              <Image
                src="/images/portraits/martina-cozy-portrait.jpg"
                alt="Martina Rink"
                fill
                sizes="(max-width: 768px) 100vw, 28vw"
                className="object-cover object-top"
              />
            </div>
          </div>
          <div className="md:col-span-8">
        <div className="max-w-2xl text-center mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-tight text-ink">
            The investment.
          </h2>
          <div className="mt-8 space-y-5 text-[17px] leading-[1.75] text-ink-soft">
            <p>
              The Sober Muse Method is offered at{" "}
              <strong className="text-ink">
                {investmentText ?? "from €5,000"}
              </strong>{" "}
              for the 90-day engagement.
            </p>
            {data?.privacyCopy ? (
              data.privacyCopy.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <>
                <p>
                  This includes three private sessions per month, written prompts
                  between sessions, ongoing correspondence, and a final integration
                  session. Payment by instalment is available.
                </p>
                <p>
                  A private consultation — €450, applied toward the programme if you
                  enrol — is the correct place to begin.
                </p>
              </>
            )}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <WineButton href={ctaUrl}>{ctaLabel}</WineButton>
            <GhostButton href="/assessment">Begin the assessment</GhostButton>
          </div>
        </div>
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section className="bg-bone section-pad">
        <div className="container-content max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[36px] text-ink">
            Common questions.
          </h2>
          <dl className="mt-12 divide-y divide-sand/60">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-6">
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                  <dt className="font-[family-name:var(--font-display)] text-[20px] md:text-[22px] text-ink">
                    {faq.q}
                  </dt>
                  <span className="text-wine text-2xl mt-1 group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <dd className="mt-4 text-[16px] leading-[1.75] text-ink-soft pr-12">
                  {faq.a}
                </dd>
              </details>
            ))}
          </dl>
        </div>
      </section>

      {/* TestimonialCard preview slot */}
      <section className="bg-cream py-16">
        <div className="container-content">
          <TestimonialCard
            quote="The work was not a rebuild. It was the return of a capacity I had quietly stopped believing in."
            attribution="Founder · London"
            nda
          />
        </div>
      </section>
    </>
  );
}
