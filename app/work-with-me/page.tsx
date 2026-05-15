import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";
import { buildMetadata, breadcrumbSchema } from "@/lib/metadata";
import { getWorkWithMePage } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getWorkWithMePage();
  if (data?.seo?.seoTitle) {
    return buildMetadata({
      title: data.seo.seoTitle,
      description: data.seo.seoDescription ?? undefined,
      path: "/work-with-me",
    });
  }
  return buildMetadata({
    title: "Work With Me",
    description:
      "Apply for a private consultation with Martina Rink. Two programmes: the Sober Muse Method and Female Empowerment & Leadership.",
    path: "/work-with-me",
  });
}

export default async function WorkWithMePage() {
  const data = await getWorkWithMePage();

  const heroHeadline = data?.heroHeadline ?? "There are two ways to begin.";
  const heroCopy =
    data?.heroCopy ??
    "A private consultation is the right starting point for both programmes. It is 45 minutes. €450, applied to the programme if you proceed. Not a sales call — a focused conversation to establish whether the work is the right fit.";
  const ctaLabel = data?.ctaLabel ?? "Begin the assessment";
  const ctaUrl = data?.ctaUrl ?? "/assessment";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([{ name: "Work With Me", path: "/work-with-me" }]),
          ),
        }}
      />
      <section className="bg-cream pt-32 md:pt-40 pb-0">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-0 items-stretch">
          {/* Text — 7/12 */}
          <div className="md:col-span-7 md:pr-16 pb-16 md:pb-24 flex flex-col justify-center">
            <Eyebrow withLine>Work with me</Eyebrow>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[60px] leading-tight text-ink">
              {heroHeadline}
            </h1>
            <p className="mt-8 text-[17px] leading-[1.75] text-ink-soft max-w-[480px]">
              {heroCopy}
            </p>
            {/* Scarcity signal — TODO: surface intake month as Sanity field so Martina can update without a deploy */}
            <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 bg-violet-soft border border-violet-mid self-start">
              <span className="block w-1.5 h-1.5 rounded-full bg-plum animate-pulse" />
              <span className="text-[12px] uppercase tracking-[0.18em] text-plum-deep">
                Two openings · next intake June 2026
              </span>
            </div>
          </div>
          {/* Portrait — 5/12, full height, bleeds to edge */}
          <div className="md:col-span-5 relative min-h-[480px] md:min-h-0 bg-bone overflow-hidden">
            <Image
              src="/images/portraits/martina-portrait-studio.jpg"
              alt="Martina Rink — private mentor"
              fill
              sizes="(max-width: 768px) 100vw, 38vw"
              className="object-cover object-top"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 md:py-24">
        <div className="container-content max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] text-cream text-center">
            The two programmes.
          </h2>

          <div className="mt-16 grid md:grid-cols-12 gap-0 md:divide-x divide-plum-deep/40">
            {/* Sober Muse — 5/12 cols */}
            <div className="md:col-span-5 md:pr-14 py-4 md:py-0 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-cream/50">
                Sober Muse Method
              </p>
              <p className="mt-4 font-[family-name:var(--font-display)] italic text-[22px] text-cream">
                For the woman re-examining alcohol.
              </p>
              <ul className="mt-6 space-y-2 text-[15px] text-cream/85">
                <li>· 90 days</li>
                <li>· 3 private sessions per month</li>
                <li>· Written prompts between sessions</li>
                <li>· Ongoing correspondence</li>
              </ul>
              <p className="mt-8 text-[12px] uppercase tracking-[0.18em] text-cream/55">
                By application
              </p>
              <a
                href="/sober-muse"
                className="mt-4 inline-block text-[14px] text-pink underline decoration-pink decoration-1 underline-offset-[6px]"
              >
                Learn more →
              </a>
            </div>

            {/* Empowerment — 7/12 cols */}
            <div className="md:col-span-7 md:pl-14 pt-10 md:pt-0 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-cream/50">
                Female Empowerment &amp; Leadership
              </p>
              <p className="mt-4 font-[family-name:var(--font-display)] italic text-[22px] text-cream">
                For the woman navigating what comes next.
              </p>
              <ul className="mt-6 space-y-2 text-[15px] text-cream/85">
                <li>· 6–12 months (open-ended)</li>
                <li>· 2 private sessions per month</li>
                <li>· Between-session correspondence</li>
                <li>· Quarterly review sessions</li>
              </ul>
              <p className="mt-8 text-[12px] uppercase tracking-[0.18em] text-cream/55">
                By application
              </p>
              <a
                href="/empowerment"
                className="mt-4 inline-block text-[14px] text-pink underline decoration-pink decoration-1 underline-offset-[6px]"
              >
                Learn more →
              </a>
            </div>
          </div>

          <p className="mt-16 text-center text-[14px] text-cream/60">
            Investment is confirmed in the private consultation.
          </p>
        </div>
      </section>

      <section className="bg-cream py-14 md:py-20">
        <div className="container-content max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[32px] text-ink">
            Not sure which applies to you?
          </h2>
          <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft">
            The assessment will help. Seven questions. Four minutes. A clearer
            sense of which conversation — if either — is the right fit.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <PlumButton href={ctaUrl}>{ctaLabel}</PlumButton>
          </div>
        </div>
      </section>

      <section className="bg-bone py-14 md:py-20">
        <div className="container-content max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] italic text-[28px] text-ink">
            Before you apply, ask yourself:
          </h2>
          <div className="mt-10 space-y-6">
            {[
              "Am I doing this because I want to — not because I feel I should?",
              "Am I willing to be honest, even when what's honest is inconvenient?",
              "Am I at a point where I want a real conversation, not a framework?",
              "Am I prepared to do the work, rather than just talk about doing it?",
            ].map((q) => (
              <p
                key={q}
                className="font-[family-name:var(--font-display)] italic text-[20px] text-ink"
              >
                {q}
              </p>
            ))}
          </div>
          <p className="mt-12 text-[15px] text-ink-quiet">
            If the answer to each of those is yes, we should speak.
          </p>
          <div className="mt-10">
            <PlumButton href={ctaUrl}>{ctaLabel}</PlumButton>
          </div>
          <p className="mt-5 text-[13px] text-ink-quiet">
            Private consultation: €450 · Applied in full to programme investment upon enrolment.
          </p>
        </div>
      </section>
    </>
  );
}
