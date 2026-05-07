import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { buildMetadata } from "@/lib/metadata";
import { calcReadingTime, articleSchema } from "@/lib/posts";
import { SITE } from "@/lib/utils";
import {
  getAllPostSlugs,
  getPost,
  getRelatedPosts,
  type PostFull,
  type PostListItem,
} from "@/sanity/lib/queries";

/* ── Hardcoded fallback articles ───────────────────────────── */
const HARDCODED: Record<string, Omit<PostFull, "_id" | "coverImage" | "seoTitle" | "seoDescription" | "slug">> = {
  "what-high-functioning-women-use-alcohol-for": {
    title: "What High-Functioning Women Use Alcohol For",
    publishedAt: "2026-04-01T00:00:00Z",
    excerpt:
      "The women I work with are not in crisis. They are in the much quieter problem.",
    body: null,
    // body rendered via paragraphs below
  },
  "the-identity-underneath-the-title": {
    title: "The Identity Underneath the Title",
    publishedAt: "2026-04-08T00:00:00Z",
    excerpt:
      "When a woman has spent two decades building a career, she often discovers that the title was never the destination.",
    body: null,
  },
  "on-elegance-and-edges-isabella-blow": {
    title: "On Elegance and Edges — What Isabella Blow Understood About Being Fully Alive",
    publishedAt: "2026-04-15T00:00:00Z",
    excerpt: "Isabella Blow wore hats that could clear a room. Not to be noticed. To exist.",
    body: null,
  },
};

const HARDCODED_BODY: Record<string, string[]> = {
  "what-high-functioning-women-use-alcohol-for": [
    "The women I work with are not in crisis.",
    "They are not at rock bottom. They have not lost a job, a relationship, or their health to alcohol. They are, by every external measure, doing extremely well.",
    "What they have, instead, is a quiet, accumulating awareness. The glass of plum that started as one and became two, and then became the thing they think about on the drive home. The drink that takes the edge off — but the edge is always back the next morning, and slightly sharper.",
    "Here is what I have learned, working privately with high-achieving women over a decade: alcohol is almost never the problem. It is the solution. The problem — the thing the drink is managing — is something else entirely. And it is usually something that the woman in question is quite good at not looking at directly.",
    "The question I ask every woman I work with is not \"why are you drinking?\" It is \"what does the drink let you not-quite-notice?\" The answer is always more interesting than the drink itself.",
  ],
  "the-identity-underneath-the-title": [
    "There is a particular kind of exhaustion that does not show up in bloodwork.",
    "It does not register on a burnout assessment. It is the fatigue of being someone who no longer quite fits.",
    "When a woman has spent two decades building a career, she often discovers that the title was never the destination — it was a container. And containers, when full, require something new.",
    "The container has stopped being the same size as the woman inside it. She has grown. The container has not.",
  ],
  "on-elegance-and-edges-isabella-blow": [
    "Isabella Blow wore hats that could clear a room.",
    "Not to be noticed. To exist. There is a distinction, and it matters more than most fashion writing has been willing to say.",
    "I worked for Isabella during the years when she was at her most visible and, though no one knew it at the time, her most precarious. I was young. I was watching.",
    "Style, in the conventional reading, is about appearance. What Isabella understood is that style is not about appearance at all. It is about position.",
  ],
};

/* ── Portable text components ──────────────────────────────── */
const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-[18px] leading-[1.75] text-ink-soft">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-[family-name:var(--font-display)] text-[32px] text-ink mt-12 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-[family-name:var(--font-display)] text-[24px] text-ink mt-8 mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-pink pl-6 font-[family-name:var(--font-display)] italic text-[22px] leading-snug text-ink my-8">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-medium text-ink">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href: string };
      children?: React.ReactNode;
    }) => (
      <a
        href={value?.href}
        className="text-plum underline decoration-pink underline-offset-4"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
};

/* ── Static params ─────────────────────────────────────────── */
export async function generateStaticParams() {
  const hardcoded = Object.keys(HARDCODED).map((slug) => ({ slug }));
  const sanitySlugs = await getAllPostSlugs();
  if (!sanitySlugs) return hardcoded;
  const all = new Map<string, { slug: string }>();
  [...hardcoded, ...sanitySlugs.map((s) => ({ slug: s }))].forEach((p) =>
    all.set(p.slug, p),
  );
  return Array.from(all.values());
}

/* ── Metadata ──────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sanityPost = await getPost(slug);
  if (sanityPost) {
    return buildMetadata({
      title: sanityPost.seoTitle ?? sanityPost.title,
      description:
        sanityPost.seoDescription ??
        sanityPost.excerpt ??
        sanityPost.title,
      path: `/writing/${slug}`,
    });
  }
  const hardcoded = HARDCODED[slug];
  if (!hardcoded) return buildMetadata({ noIndex: true });
  return buildMetadata({
    title: hardcoded.title,
    description: hardcoded.excerpt ?? hardcoded.title,
    path: `/writing/${slug}`,
  });
}

/* ── Page ──────────────────────────────────────────────────── */
function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try Sanity first
  const sanityPost = await getPost(slug);

  if (sanityPost) {
    const readingMinutes = calcReadingTime(sanityPost.body);
    const articleUrl = `${SITE.url}/writing/${slug}`;
    const description =
      sanityPost.seoDescription ?? sanityPost.excerpt ?? sanityPost.title;
    const related = await getRelatedPosts(slug, 2);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              articleSchema({
                title: sanityPost.title,
                description,
                url: articleUrl,
                publishedAt: sanityPost.publishedAt,
              }),
            ),
          }}
        />
        <article className="bg-cream pt-32 md:pt-40 pb-16">
          <div className="container-read">
            <Eyebrow>
              {formatDate(sanityPost.publishedAt)} · {readingMinutes} min read
            </Eyebrow>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[56px] leading-tight text-ink">
              {sanityPost.title}
            </h1>
            {sanityPost.body && (
              <div className="mt-12 space-y-6">
                <PortableText
                  value={sanityPost.body as Parameters<typeof PortableText>[0]["value"]}
                  components={ptComponents}
                />
              </div>
            )}
            <div className="mt-16 pt-8 border-t border-sand/40">
              <p className="text-[15px] text-ink-quiet">
                If something in this landed —{" "}
                <Link
                  href="/assessment"
                  className="text-plum underline decoration-pink underline-offset-4"
                >
                  the assessment is here
                </Link>
                .
              </p>
            </div>
          </div>
        </article>
        <RelatedArticles posts={related} currentSlug={slug} />
        <NewsletterSection />
      </>
    );
  }

  // Fall back to hardcoded
  const hardcoded = HARDCODED[slug];
  if (!hardcoded) notFound();

  const paragraphs = HARDCODED_BODY[slug] ?? [];
  const readingMinutes = calcReadingTime(paragraphs);
  const articleUrl = `${SITE.url}/writing/${slug}`;

  // For hardcoded posts, "related" = the other 2 hardcoded slugs.
  const otherHardcoded: PostListItem[] = Object.entries(HARDCODED)
    .filter(([s]) => s !== slug)
    .slice(0, 2)
    .map(([s, p]) => ({
      _id: s,
      title: p.title,
      slug: s,
      excerpt: p.excerpt,
      publishedAt: p.publishedAt,
      coverImage: null,
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleSchema({
              title: hardcoded.title,
              description: hardcoded.excerpt ?? hardcoded.title,
              url: articleUrl,
              publishedAt: hardcoded.publishedAt,
            }),
          ),
        }}
      />
      <article className="bg-cream pt-32 md:pt-40 pb-16">
        <div className="container-read">
          <Eyebrow>
            {formatDate(hardcoded.publishedAt)} · {readingMinutes} min read
          </Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[56px] leading-tight text-ink">
            {hardcoded.title}
          </h1>
          <div className="mt-12 space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[18px] leading-[1.75] text-ink-soft">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-16 pt-8 border-t border-sand/40">
            <p className="text-[15px] text-ink-quiet">
              If something in this landed —{" "}
              <Link
                href="/assessment"
                className="text-plum underline decoration-pink underline-offset-4"
              >
                the assessment is here
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
      <RelatedArticles posts={otherHardcoded} currentSlug={slug} />
      <NewsletterSection />
    </>
  );
}

function RelatedArticles({
  posts,
  currentSlug,
}: {
  posts: PostListItem[] | null;
  currentSlug: string;
}) {
  const filtered = (posts ?? []).filter((p) => p.slug !== currentSlug);
  if (filtered.length === 0) return null;
  return (
    <section className="bg-cream pb-16 border-t border-sand/30 pt-16">
      <div className="container-read">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-8">
          Read next
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {filtered.map((p) => (
            <Link
              key={p._id}
              href={`/writing/${p.slug}`}
              className="group block"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
                {formatDate(p.publishedAt)}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-[26px] leading-[1.2] text-ink group-hover:text-plum transition-colors duration-200">
                {p.title}
              </h3>
              {p.excerpt && (
                <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft">
                  {p.excerpt}
                </p>
              )}
              <p className="mt-4 text-[13px] text-plum">Read →</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
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
  );
}
