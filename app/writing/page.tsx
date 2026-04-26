import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Writing",
  description:
    "Essays on the examined life. For women who have built something remarkable and are now, quietly, re-reading the architecture.",
  path: "/writing",
});

// Placeholder articles — to be replaced by Sanity fetch
const ARTICLES = [
  {
    slug: "what-high-functioning-women-use-alcohol-for",
    title: "What High-Functioning Women Use Alcohol For",
    excerpt:
      "The women I work with are not in crisis. They are in the much quieter problem — the one that arrives after everything has gone according to plan.",
    date: "April 2026",
  },
  {
    slug: "the-identity-underneath-the-title",
    title: "The Identity Underneath the Title",
    excerpt:
      "When a woman has spent two decades building a career, she often discovers that the title was never the destination — it was a container.",
    date: "April 2026",
  },
  {
    slug: "on-elegance-and-edges-isabella-blow",
    title: "On Elegance and Edges — What Isabella Blow Understood About Being Fully Alive",
    excerpt:
      "Isabella Blow wore hats that could clear a room. Not to be noticed. To exist. There is a distinction.",
    date: "April 2026",
  },
];

export default function WritingPage() {
  return (
    <>
      <section className="bg-cream pt-32 md:pt-40 pb-16">
        <div className="container-content max-w-3xl">
          <Eyebrow withLine>Writing</Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[60px] leading-tight text-ink">
            Essays on the examined life.
          </h1>
          <p className="mt-6 text-[18px] leading-[1.65] text-ink-soft max-w-[560px]">
            For women who have built something remarkable and are now, quietly,
            re-reading the architecture.
          </p>
        </div>
      </section>

      <section className="bg-cream py-12 md:py-16">
        <div className="container-content">
          <div className="grid md:grid-cols-3 gap-8">
            {ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={`/writing/${article.slug}`}
                className="group block"
              >
                <div className="aspect-[3/2] bg-bone mb-5 group-hover:bg-blush transition-colors duration-300" />
                <p className="text-[11px] uppercase tracking-[0.22em] text-ink-quiet">
                  {article.date}
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-[24px] leading-tight text-ink group-hover:text-wine transition-colors">
                  {article.title}
                </h2>
                <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft line-clamp-3">
                  {article.excerpt}
                </p>
                <span className="mt-4 inline-block text-[13px] text-wine">
                  Read →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone section-pad">
        <div className="container-content max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[32px] text-ink">
            Receive the letters.
          </h2>
          <p className="mt-4 text-[16px] text-ink-soft">
            One letter, once a week. About 600 words. For women who read
            carefully.
          </p>
          <div className="mt-10">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
