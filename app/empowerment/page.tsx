import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { TestimonialCard } from "@/components/brand/TestimonialCard";
import { buildMetadata, faqSchema } from "@/lib/metadata";
import { getEmpowermentPage } from "@/sanity/lib/queries";
import { CoachingDisclaimer } from "@/components/brand/CoachingDisclaimer";

const FAQS = [
  {
    q: "Is this coaching?",
    a: "It is mentoring — a distinction that matters. I do not use coaching frameworks, tools, or methodologies. I use my own intelligence and a careful process I have developed over a decade of private work.",
  },
  {
    q: "What kinds of women do you work with?",
    a: "Founders, senior executives, creative directors, partners at professional services firms, women at significant personal inflection points. The common thread is not their role — it is a particular quality of intelligence about themselves.",
  },
  {
    q: "How long does the work last?",
    a: "It varies significantly. Some women work with me for six months. Some for two years or more. I do not operate on a fixed timeline. The work runs until it is done.",
  },
  {
    q: "Is it confidential?",
    a: "Completely. I have never discussed client work with anyone, and I never will. The confidentiality is absolute.",
  },
  {
    q: "Do you work with men?",
    a: "No. My practice is exclusively for women.",
  },
  {
    q: "I'm not sure I'm ready. What should I do?",
    a: "Take the assessment. It is a private exercise designed to give you a clearer sense of where you are. It is not a funnel — it is a genuine attempt at understanding before we speak.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const data = await getEmpowermentPage();
  if (data?.seo?.seoTitle) {
    return buildMetadata({
      title: data.seo.seoTitle,
      description: data.seo.seoDescription ?? undefined,
      path: "/empowerment",
    });
  }
  return buildMetadata({
    title: "Female Empowerment & Leadership",
    description:
      "Private engagement for senior women navigating identity, leadership, and what comes next. From €7,500. English-speaking, internationally based.",
    path: "/empowerment",
  });
}

export default async function EmpowermentPage() {
  const data = await getEmpowermentPage();

  const heroHeadline =
    data?.heroHeadline ?? "You have done everything right. It no longer feels like yours.";
  const heroCopy =
    data?.heroCopy ??
    "This is the work for the woman who has arrived — and finds herself wondering, with some quiet urgency, what she was actually arriving for.";
  const ctaLabel = data?.ctaLabel ?? "Begin here";
  const ctaUrl = data?.ctaUrl ?? "/assessment";

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
            <Eyebrow withLine>Female Empowerment &amp; Leadership</Eyebrow>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[60px] leading-[1.05] text-ink">
              {heroHeadline}
            </h1>
            <p className="mt-8 text-[19px] leading-[1.65] text-ink-soft max-w-[520px]">
              {heroCopy}
            </p>
            <div className="mt-10">
              <PlumButton href={ctaUrl}>{ctaLabel}</PlumButton>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[3/4] bg-bone overflow-hidden">
              <Image
                src="/images/portraits/martina-ibiza-sunset.jpg"
                alt="Martina Rink — Female Empowerment & Leadership"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="bg-bone section-pad">
        <div className="container-content max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-tight text-ink">
            You might recognise this.
          </h2>
          <div className="mt-10 space-y-6 text-[17px] leading-[1.75] text-ink-soft text-left">
            {data?.forWhomCopy ? (
              data.forWhomCopy.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <>
                <p>
                  You are senior. You are accomplished. You have the title, the
                  team, the life that other people describe as impressive.
                </p>
                <p>
                  And somewhere inside that impressive life, there is a gap. Between
                  who you appear to be and who you actually are. Between what you
                  have built and what you actually wanted. Between the woman who
                  learned to be excellent and the woman who is quietly, persistently
                  asking whether excellence was ever the point.
                </p>
                <p>
                  The container — director, partner, founder, mother, expert — has
                  stopped being the same size as you are.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* THE WORK — 2 column */}
      <section className="bg-cream section-pad">
        <div className="container-content grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[32px] text-ink">
              What we examine.
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
                  "The identity you built under pressure, and whether it still serves",
                  "The gap between how you lead others and how you occupy your own life",
                  "What you were told to want, versus what you actually want",
                  "The version of yourself constructed for someone else's room",
                  "What authority looks like when it comes from a place you've chosen",
                ].map((i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-pink mt-2 select-none">—</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[32px] text-ink">
              What you build.
            </h2>
            {data?.methodCopy ? (
              <div className="mt-8 space-y-4 text-[16px] leading-[1.7] text-ink-soft">
                {data.methodCopy.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <ul className="mt-8 space-y-4 text-[16px] leading-[1.7] text-ink-soft">
                {[
                  "A version of yourself you have actually chosen",
                  "Clarity about what the next chapter is actually for",
                  "A way of leading that comes from your own position",
                  "The aesthetic of a life you have deliberately designed",
                  "Less editing. More precision.",
                ].map((i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-pink mt-2 select-none">—</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — DARK */}
      <section className="bg-ink section-pad">
        <div className="container-content max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-tight text-cream">
            An open-ended private engagement.
          </h2>
          <div className="mt-8 space-y-5 text-[17px] leading-[1.75] text-cream/85">
            {data?.privacyCopy ? (
              data.privacyCopy.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <>
                <p>
                  This work does not operate on a fixed timeline. It runs until the
                  work is done — usually somewhere between six months and two years.
                </p>
                <p>
                  We meet twice a month by private video or phone. Between sessions,
                  there is correspondence — sometimes a question I leave you with,
                  sometimes something you bring. The work is cumulative.
                </p>
                <p>
                  {data?.investmentText
                    ? data.investmentText
                    : "Investment: from €7,500 for the open-ended engagement. A private consultation — €450, applied to the programme if you proceed — is the right place to begin."}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* LEOPARD EDITORIAL STRIP */}
      <section className="bg-bone py-0 overflow-hidden">
        <div className="relative h-64 md:h-80">
          <Image
            src="/images/portraits/martina-night-sky.jpg"
            alt="Martina Rink"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-ink/40" />
        </div>
      </section>

      {/* MINT CTA SECTION */}
      <section className="bg-mint section-pad">
        <div className="container-content max-w-2xl mx-auto text-center">
          <ScriptAccent className="block text-[44px] md:text-[52px] text-ink">
            come home to yourself
          </ScriptAccent>
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-[36px] md:text-[44px] text-ink">
            When you&rsquo;re ready.
          </h2>
          <p className="mt-6 text-[17px] text-ink-soft">
            The conversation begins with a request. I read every application
            personally and respond within three working days.
          </p>
          <div className="mt-10">
            <PlumButton href={ctaUrl}>{ctaLabel}</PlumButton>
          </div>
          <p className="mt-6 italic text-[18px] text-ink-soft">
            <ScriptAccent className="text-[28px] text-ink-soft">
              it&rsquo;s about time, darling.
            </ScriptAccent>
          </p>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-cream py-16">
        <div className="container-content">
          <TestimonialCard
            quote="What Martina does is different — it's more like being read than being advised. Within the first month she named something I had never managed to say out loud."
            attribution="Senior Director · Vienna"
            nda
          />
        </div>
      </section>

      {/* WHO THIS IS NOT FOR — premium qualifier */}
      <section className="bg-violet-soft section-pad">
        <div className="container-content max-w-3xl mx-auto">
          <Eyebrow>An honest filter</Eyebrow>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-[34px] md:text-[40px] leading-tight text-ink">
            Who this is not for.
          </h2>
          <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft">
            This work is precise. It is not the right fit for every woman, and
            saying so honestly is part of how I begin.
          </p>
          <ul className="mt-10 space-y-5 text-[16px] leading-[1.75] text-ink-soft">
            {[
              "The woman who wants frameworks, formulas, or productivity systems. There are none here.",
              "The woman in early career. This work assumes you have already arrived somewhere — and are now reckoning with what that arrival means.",
              "The woman who wants someone to validate her current direction. The work begins with the questions she has been avoiding.",
              "The woman who is not ready to be honest with herself about what she actually wants. That honesty is the work.",
              "The woman looking for a fixed timeline. This is open-ended. It runs until it is done — usually six months to two years.",
            ].map((item) => (
              <li key={item} className="flex gap-4">
                <span className="text-plum mt-2 select-none">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
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
                  <span className="text-plum text-2xl mt-1 group-open:rotate-45 transition-transform duration-200">
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

      {/* Legal disclaimer — required for mentoring services */}
      <section className="bg-cream pb-16">
        <div className="container-content">
          <CoachingDisclaimer />
        </div>
      </section>
    </>
  );
}
