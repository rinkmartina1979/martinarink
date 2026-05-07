import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { buildMetadata } from "@/lib/metadata";
import { calcReadingTime, articleSchema } from "@/lib/posts";
import { SITE } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/image";
import {
  getAllPostSlugs,
  getPost,
  getRelatedPosts,
  type PostFull,
  type PostListItem,
} from "@/sanity/lib/queries";

/* ── Hardcoded fallback articles ───────────────────────────── */
const HARDCODED: Record<string, Omit<PostFull, "_id" | "coverImage" | "seoTitle" | "seoDescription" | "slug"> & { heroImage?: string }> = {
  "what-high-functioning-women-use-alcohol-for": {
    title: "What High-Functioning Women Use Alcohol For",
    publishedAt: "2026-04-01T00:00:00Z",
    excerpt:
      "The women I work with are not in crisis. They are in the much quieter problem.",
    body: null,
    heroImage: "/images/portraits/martina-ibiza-working.jpg",
  },
  "the-identity-underneath-the-title": {
    title: "The Identity Underneath the Title",
    publishedAt: "2026-04-08T00:00:00Z",
    excerpt:
      "When a woman has spent two decades building a career, she often discovers that the title was never the destination.",
    body: null,
    heroImage: "/images/portraits/martina-portrait-studio.jpg",
  },
  "on-elegance-and-edges-isabella-blow": {
    title: "On Elegance and Edges — What Isabella Blow Understood About Being Fully Alive",
    publishedAt: "2026-04-15T00:00:00Z",
    excerpt: "Isabella Blow wore hats that could clear a room. Not to be noticed. To exist.",
    body: null,
    heroImage: "/images/portraits/martina-gallery-leopard.jpg",
  },
};

const HARDCODED_BODY: Record<string, string[]> = {
  "what-high-functioning-women-use-alcohol-for": [
    "The women I work with are not in crisis.",
    "They are not at rock bottom. They have not lost a job, a relationship, or their health to alcohol. They are, by every external measure, doing extremely well.",
    "What they have, instead, is a quiet, accumulating awareness. The glass of plum that started as one and became two, and then became the thing they think about on the drive home. The drink that takes the edge off — but the edge is always back the next morning, and slightly sharper.",
    "Here is what I have learned, working privately with high-achieving women over a decade: alcohol is almost never the problem. It is the solution. The problem — the thing the drink is managing — is something else entirely. And it is usually something that the woman in question is quite good at not looking at directly.",
    "There are a few things I hear again and again. The drink makes the transition between her professional self and her private self possible — it gives her permission to stop performing, without having to explain why she was performing in the first place.",
    "There is also this: the drink is one of the few things that belongs entirely to her. Her days are structured around what other people need. The glass at the end of it is hers. The problem is that something which started as a small private sovereignty has become, quietly, something less optional.",
    "What I have also noticed is this — and it may be the most important thing I can say here: the women who drink this way are almost never doing so because they are weak, or lost, or self-destructive. They are drinking because they are managing something that requires managing. The question is not whether the management strategy is working. It is what it is costing — and whether there is something underneath it that is ready to be looked at properly.",
    "The question I ask every woman I work with is not \"why are you drinking?\" It is \"what does the drink let you not-quite-notice?\" The answer is always more interesting than the drink itself.",
    "Sometimes the answer is: the marriage has become a structure I maintain, rather than a life I share. Sometimes it is: I have built a career I am proud of and cannot locate myself inside it. Sometimes it is simply: something has changed, and I have not yet permitted myself to say so out loud.",
    "What none of the answers ever turn out to be is: I am weak, or broken. The women who come to me are not looking for a label. They are looking for clarity — the kind that the drink was preventing, without either of them knowing.",
    "This is what the Sober Muse Method is built around. Not sobriety as an achievement, not a new identity to perform, but the original question — the one the drink was sitting on top of. When that question gets proper space and attention, the drinking usually stops being necessary. Not because of willpower. Because the thing it was managing has been addressed.",
    "I am not a therapist. I do not offer clinical support. What I offer is a particular kind of focused private attention — the kind that makes it possible to look at the question underneath the question, and decide what to do with it.",
    "If something in this finds you, you do not need to be ready. You simply need to be curious.",
  ],
  "the-identity-underneath-the-title": [
    "There is a particular kind of exhaustion that does not show up in bloodwork.",
    "It does not register on a burnout assessment. It is the fatigue of being someone who no longer quite fits — someone who has been performing a version of herself for long enough that the performance and the person have become, from the outside, indistinguishable.",
    "When a woman has spent two decades building a career, she often discovers that the title was never the destination — it was a container. Containers, when full, require something new.",
    "The container has stopped being the same size as the woman inside it. She has grown. The container has not.",
    "I see this most clearly in women at the top of their fields — the ones whose professional confidence is absolute and whose private uncertainty is enormous. The gap between those two things is where the most interesting work happens.",
    "What I have learned is that the question is rarely about the career itself. It is about what the career was supposed to deliver, and why it has not. These are different problems. The first has a tactical answer. The second requires a different kind of conversation.",
    "What does it mean to have arrived somewhere and to not quite recognise yourself in it? Not to regret the path — but to notice that the destination looks different from the inside than it did from a distance. To have built something you are proud of and to find yourself wondering, privately, what you were doing it for.",
    "This is not a crisis. It is a very important question.",
    "The women who come to me have almost always tried to resolve it through motion. Another role. Another project. Another qualification. A sabbatical. These things are not wrong — they are just insufficient. They address the exterior without attending to the interior. And the interior, left unaddressed, keeps producing the same question.",
    "What I offer is a space to ask the question properly. Not to solve it — it is not that kind of question. But to give it the precision it deserves, and to understand what, specifically, is being called for.",
    "That is usually different from what the woman thought she needed when she arrived.",
  ],
  "on-elegance-and-edges-isabella-blow": [
    "Isabella Blow wore hats that could clear a room.",
    "Not to be noticed. To exist. There is a distinction, and it matters more than most fashion writing has been willing to say.",
    "I worked for Isabella during the years when she was at her most visible and, though no one knew it at the time, her most precarious. I was young. I was watching — the way you watch when you are near someone extraordinary and have not yet learned to take it for granted.",
    "Style, in the conventional reading, is about appearance. What Isabella understood is that style is not about appearance at all. It is about position.",
    "By which I mean: the hat said something that Isabella could not always say directly. It said: I am here. I am serious. I am prepared to take up space. She wore it, and the room reorganised itself around her, and she had already won the conversation before it began.",
    "What struck me, working close to her, was the gap between what the world saw and what was happening privately. The world saw the hats, the irreverence, the eye. I saw the cost.",
    "Not the cost of being eccentric — eccentricity was never the point. The cost of being entirely oneself, in a world that finds total self-possession deeply unsettling. The women who are most fully alive are rarely comfortable to be around. They require something of you. They make the performance you did not know you were giving seem suddenly visible.",
    "Isabella was like this. She would see something — a young designer, a fabric, an angle of light — and her recognition was total. Not considered. Not strategic. Just: yes. And then she would do everything in her power to make the world see what she saw.",
    "What I find myself thinking about, years later, is this: she knew the cost and she went on anyway. Not because she was reckless. Because she could not do it differently. She was constitutionally incapable of managing herself down to a size that would make other people comfortable.",
    "This, I think, is the thing that gets lost in the conversation about ambition and achievement and leadership. We talk about strategy and presence and confidence as though they were skills to be acquired. What Isabella had — what the women I most admire have — is something prior to all of that. A settled willingness to be exactly what they are, without apology, even when it costs.",
    "What I carry from those years with her — and what I try to offer the women I work with now — is this: the thing you are editing out of yourself in order to be acceptable is very probably the thing that is most worth attending to.",
    "The hat was not about fashion. It was about truth.",
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
            {sanityPost.coverImage && urlForImage(sanityPost.coverImage) && (
              <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-bone">
                <Image
                  src={urlForImage(sanityPost.coverImage)!}
                  alt={sanityPost.coverImage.alt ?? sanityPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 760px"
                  className="object-cover object-center"
                  priority
                />
              </div>
            )}
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
          {hardcoded.heroImage && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-bone">
              <Image
                src={hardcoded.heroImage}
                alt={hardcoded.title}
                fill
                sizes="(max-width: 768px) 100vw, 760px"
                className="object-cover object-[50%_20%]"
                priority
              />
            </div>
          )}
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
