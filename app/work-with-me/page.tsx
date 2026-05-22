import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { NewsletterStrip } from "@/components/newsletter/NewsletterStrip";
import { PackageTiers } from "@/components/brand/PackageTiers";
import { buildMetadata, breadcrumbSchema } from "@/lib/metadata";
import { getWorkWithMePage } from "@/sanity/lib/queries";
import { SITE } from "@/lib/utils";

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
    title: "Work With Me — Martina Rink",
    description:
      "Two programmes: The Sober Muse Method and Female Empowerment & Leadership. By application. Private consultation from €450, applied to programme investment.",
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

      {/* ══════════════════════════════════════════════════════
          1 — HERO
      ══════════════════════════════════════════════════════ */}
      <section className="bg-cream pt-0 pb-0 overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[90svh] items-stretch">
          {/* Text — left half */}
          <div className="flex flex-col justify-center px-8 md:px-14 lg:px-20 pt-32 md:pt-0 pb-16 md:pb-0 order-2 md:order-1">
            <Eyebrow withLine>Work with me</Eyebrow>
            <h1
              className="mt-7 font-[family-name:var(--font-display)] text-ink leading-[0.92] tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.8rem, 4.6vw, 5.8rem)" }}
            >
              {heroHeadline}
            </h1>
            <p className="mt-8 text-[17px] md:text-[18px] leading-[1.8] text-ink-soft max-w-[480px] font-[family-name:var(--font-body)]">
              {heroCopy}
            </p>

            {/* Availability signal — rose background */}
            <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 bg-blush border border-pink/25 self-start">
              <span className="block w-1.5 h-1.5 rounded-full bg-pink animate-pulse shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-ink font-[family-name:var(--font-body)]">
                Two openings &middot; next intake June 2026
              </span>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <PlumButton href={ctaUrl}>{ctaLabel}</PlumButton>
              <GhostButton href="#programmes">
                See the programmes
              </GhostButton>
            </div>
          </div>

          {/* Portrait — right half, full bleed, no crop */}
          <div className="relative min-h-[60svh] md:min-h-0 bg-bone order-1 md:order-2">
            <Image
              src="/images/portraits/martina-portrait-studio.jpg"
              alt="Martina Rink — private mentor"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
              priority
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2 — HOW IT WORKS (process strip)
      ══════════════════════════════════════════════════════ */}
      <section className="bg-bone border-y border-sand/40 py-14 md:py-18">
        <div className="container-content">
          <div className="grid md:grid-cols-4 gap-8 md:gap-6 max-w-5xl">
            {[
              {
                step: "01",
                title: "Take the assessment",
                body: "Seven questions. Four minutes. Tells you which programme — if either — is the right conversation.",
                href: "/assessment",
              },
              {
                step: "02",
                title: "Submit your application",
                body: "Short form. Five honest questions. I read every application myself.",
                href: null,
              },
              {
                step: "03",
                title: "Private consultation",
                body: "Forty-five minutes. €450, applied in full to the programme if you proceed. Not a pitch.",
                href: null,
              },
              {
                step: "04",
                title: "The work begins",
                body: "Private sessions, written correspondence, and the particular attention of someone who has been here.",
                href: null,
              },
            ].map(({ step, title, body, href }) => (
              <div key={step} className="relative">
                <p className="text-[10px] uppercase tracking-[0.26em] text-ink-quiet mb-4 font-[family-name:var(--font-body)]">
                  {step}
                </p>
                <span className="h-px w-8 bg-pink block mb-5" aria-hidden />
                <p className="font-[family-name:var(--font-display)] text-[18px] text-ink mb-3 leading-snug">
                  {title}
                </p>
                <p className="text-[14px] leading-[1.7] text-ink-soft font-[family-name:var(--font-body)] mb-4">
                  {body}
                </p>
                {href && (
                  <Link
                    href={href}
                    className="text-[11px] uppercase tracking-[0.16em] text-plum hover:text-plum-deep transition-colors font-[family-name:var(--font-body)]"
                  >
                    Begin here &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3 — TWO PROGRAMMES
      ══════════════════════════════════════════════════════ */}
      <section id="programmes" className="bg-aubergine py-20 md:py-28 scroll-mt-20">
        <div className="container-content max-w-5xl">
          <Eyebrow className="text-cream/40 border-cream/15 mb-10">
            The two programmes
          </Eyebrow>

          <div className="grid md:grid-cols-2 gap-px bg-cream/10">
            {/* Sober Muse */}
            <div className="bg-aubergine p-10 md:p-12 flex flex-col">
              <p className="text-[9px] uppercase tracking-[0.3em] text-cream/40 mb-6 font-[family-name:var(--font-body)]">
                Programme one
              </p>
              <span className="h-px w-8 bg-pink block mb-8" aria-hidden />
              <h2 className="font-[family-name:var(--font-display)] text-[26px] md:text-[30px] text-cream leading-snug mb-5">
                The Sober Muse Method
              </h2>
              <p className="font-[family-name:var(--font-display)] italic text-[18px] text-cream/65 mb-8">
                For the woman re-examining alcohol.
              </p>
              <ul className="space-y-3 text-[14px] text-cream/75 font-[family-name:var(--font-body)] mb-8">
                {[
                  "90 days, private",
                  "4 sessions per month, daily check ins",
                  "Written work between sessions",
                  "Direct correspondence",
                  `From ${SITE.pricing.soberMuseFrom}`,
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-pink shrink-0" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] uppercase tracking-[0.2em] text-cream/30 mb-4 font-[family-name:var(--font-body)]">
                By application
              </p>
              <div className="mt-auto flex flex-col sm:flex-row gap-3">
                <PlumButton href="/apply/sober-muse">Apply now</PlumButton>
                <GhostButton variant="light" href="/sober-muse">
                  Learn more
                </GhostButton>
              </div>
            </div>

            {/* Empowerment */}
            <div className="bg-aubergine p-10 md:p-12 flex flex-col border-t md:border-t-0 border-cream/10">
              <p className="text-[9px] uppercase tracking-[0.3em] text-cream/40 mb-6 font-[family-name:var(--font-body)]">
                Programme two
              </p>
              <span className="h-px w-8 bg-pink block mb-8" aria-hidden />
              <h2 className="font-[family-name:var(--font-display)] text-[26px] md:text-[30px] text-cream leading-snug mb-5">
                Female Empowerment &amp; Leadership
              </h2>
              <p className="font-[family-name:var(--font-display)] italic text-[18px] text-cream/65 mb-8">
                For the woman navigating what comes next.
              </p>
              <ul className="space-y-3 text-[14px] text-cream/75 font-[family-name:var(--font-body)] mb-8">
                {[
                  "3–12 months, open-ended",
                  "4 sessions per month, daily check ins",
                  "Between-session correspondence",
                  "Quarterly reviews",
                  `From ${SITE.pricing.empowermentFrom}`,
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-pink shrink-0" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] uppercase tracking-[0.2em] text-cream/30 mb-4 font-[family-name:var(--font-body)]">
                By application
              </p>
              <div className="mt-auto flex flex-col sm:flex-row gap-3">
                <PlumButton href="/apply/empowerment">Apply now</PlumButton>
                <GhostButton variant="light" href="/empowerment">
                  Learn more
                </GhostButton>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-[13px] text-cream/35 font-[family-name:var(--font-body)]">
            Investment is confirmed in the private consultation. {SITE.pricing.consultation} — credited in full upon enrolment.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3b — HOW WE MEET
      ══════════════════════════════════════════════════════ */}
      <section className="bg-cream py-20 md:py-28 border-b border-sand/30">
        <div className="container-content max-w-5xl">
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.28em] text-ink-quiet mb-5 font-[family-name:var(--font-body)]">
              How we meet
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[32px] md:text-[38px] text-ink leading-tight">
              Three formats. One standard of work.
            </h2>
            <p className="mt-5 text-[16px] leading-[1.8] text-ink-soft max-w-xl font-[family-name:var(--font-body)]">
              The engagement format is chosen in the private consultation, based
              on where you are and what the work requires. Investment varies by format.
            </p>
          </div>
          <PackageTiers surface="cream" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4 — INNER QUALIFYING QUESTIONS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-bone py-20 md:py-28 border-b border-sand/40">
        <div className="container-content max-w-3xl">
          <Eyebrow withLine className="mb-10">Before you apply</Eyebrow>
          <h2 className="font-[family-name:var(--font-display)] italic text-[28px] md:text-[34px] text-ink mb-12 leading-snug">
            Ask yourself, honestly:
          </h2>
          <div className="space-y-6">
            {[
              "Am I doing this because I want to — not because I feel I should?",
              "Am I willing to be honest, even when what is honest is inconvenient?",
              "Am I at a point where I want a real conversation, not a framework?",
              "Am I prepared to do the work, rather than just talk about doing it?",
            ].map((q, i) => (
              <div key={i} className="flex items-start gap-6 py-5 border-b border-sand/50">
                <span className="text-[11px] uppercase tracking-[0.2em] text-ink-quiet shrink-0 mt-1 font-[family-name:var(--font-body)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-[family-name:var(--font-display)] italic text-[18px] md:text-[20px] text-ink leading-snug">
                  {q}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[15px] text-ink-quiet font-[family-name:var(--font-body)]">
            If the answer to each of those is yes, we should speak.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <PlumButton href={ctaUrl}>{ctaLabel}</PlumButton>
          </div>
          <p className="mt-5 text-[12px] text-ink-quiet font-[family-name:var(--font-body)]">
            Private consultation: {SITE.pricing.consultation} &middot; Applied in full to programme investment upon enrolment.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5 — NOT READY YET? Newsletter bridge
      ══════════════════════════════════════════════════════ */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-content max-w-4xl">
          <div className="mb-10">
            <Eyebrow withLine>Not ready yet?</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] italic text-[28px] md:text-[34px] text-ink leading-snug">
              The letter is a gentler beginning.
            </h2>
            <p className="mt-4 text-[16px] leading-[1.8] text-ink-soft max-w-xl font-[family-name:var(--font-body)]">
              Many women arrive at the application after months of reading the letter.
              There is no pressure. Read first. Decide later.
            </p>
          </div>
          <NewsletterStrip source="work-with-me-bridge" />
        </div>
      </section>
    </>
  );
}
