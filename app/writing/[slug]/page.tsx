import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { buildMetadata } from "@/lib/metadata";

const ARTICLES: Record<
  string,
  { title: string; date: string; body: string[] }
> = {
  "what-high-functioning-women-use-alcohol-for": {
    title: "What High-Functioning Women Use Alcohol For",
    date: "April 2026",
    body: [
      "The women I work with are not in crisis.",
      "They are not at rock bottom. They have not lost a job, a relationship, or their health to alcohol. They are, by every external measure, doing extremely well.",
      "What they have, instead, is a quiet, accumulating awareness. The glass of wine that started as one and became two, and then became the thing they think about on the drive home. The drink that takes the edge off — but the edge is always back the next morning, and slightly sharper.",
      "Here is what I have learned, working privately with high-achieving women over a decade: alcohol is almost never the problem. It is the solution. The problem — the thing the drink is managing — is something else entirely. And it is usually something that the woman in question is quite good at not looking at directly.",
      "The question I ask every woman I work with is not “why are you drinking?” It is “what does the drink let you not-quite-notice?” The answer is always more interesting than the drink itself.",
    ],
  },
  "the-identity-underneath-the-title": {
    title: "The Identity Underneath the Title",
    date: "April 2026",
    body: [
      "There is a particular kind of exhaustion that does not show up in bloodwork.",
      "It does not register on a burnout assessment. It is the fatigue of being someone who no longer quite fits.",
      "When a woman has spent two decades building a career, she often discovers that the title was never the destination — it was a container. And containers, when full, require something new.",
      "The container has stopped being the same size as the woman inside it. She has grown. The container has not.",
    ],
  },
  "on-elegance-and-edges-isabella-blow": {
    title: "On Elegance and Edges — What Isabella Blow Understood About Being Fully Alive",
    date: "April 2026",
    body: [
      "Isabella Blow wore hats that could clear a room.",
      "Not to be noticed. To exist. There is a distinction, and it matters more than most fashion writing has been willing to say.",
      "I worked for Isabella during the years when she was at her most visible and, though no one knew it at the time, her most precarious. I was young. I was watching.",
      "Style, in the conventional reading, is about appearance. What Isabella understood is that style is not about appearance at all. It is about position.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return buildMetadata({ noIndex: true });
  return buildMetadata({
    title: article.title,
    description: article.body[0]?.slice(0, 160),
    path: `/writing/${slug}`,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  return (
    <>
      <article className="bg-cream pt-32 md:pt-40 pb-16">
        <div className="container-read">
          <Eyebrow>{article.date}</Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[56px] leading-tight text-ink">
            {article.title}
          </h1>
          <div className="mt-12 space-y-6 text-[18px] leading-[1.75] text-ink-soft">
            {article.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-sand/40">
            <p className="text-[15px] text-ink-quiet">
              If something in this landed —{" "}
              <Link href="/assessment" className="text-wine underline decoration-pink underline-offset-4">
                the assessment is here
              </Link>
              .
            </p>
          </div>
        </div>
      </article>

      <section className="bg-bone py-16">
        <div className="container-content max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[28px] text-ink">
            Receive the letters.
          </h2>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
