import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PageHero } from "@/components/sections/PageHero";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { buildMetadata, breadcrumbSchema } from "@/lib/metadata";
import { getAllPosts, type PostListItem } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

const BREADCRUMBS = breadcrumbSchema([{ name: "Writing", path: "/writing" }]);

export const metadata = buildMetadata({
  title: "Writing",
  description:
    "Essays on the examined life. For women who have built something remarkable and are now, quietly, re-reading the architecture.",
  path: "/writing",
});

/* ── Extended type for cards that have a local image path ─────── */
type ArticleCard = PostListItem & { localImage?: string };

/* ── Hardcoded fallback articles (shown when Sanity is not yet connected) */
const FALLBACK_ARTICLES: ArticleCard[] = [
  {
    _id: "1",
    slug: "what-high-functioning-women-use-alcohol-for",
    title: "What High-Functioning Women Use Alcohol For",
    excerpt:
      "The women I work with are not in crisis. They are in the much quieter problem — the one that arrives after everything has gone according to plan.",
    publishedAt: "2026-04-01T00:00:00Z",
    coverImage: null,
  },
  {
    _id: "2",
    slug: "the-identity-underneath-the-title",
    title: "The Identity Underneath the Title",
    excerpt:
      "When a woman has spent two decades building a career, she often discovers that the title was never the destination — it was a container.",
    publishedAt: "2026-04-08T00:00:00Z",
    coverImage: null,
  },
  {
    _id: "3",
    slug: "on-elegance-and-edges-isabella-blow",
    title: "On Elegance and Edges — What Isabella Blow Understood About Being Fully Alive",
    excerpt:
      "Isabella Blow wore hats that could clear a room. Not to be noticed. To exist. There is a distinction.",
    publishedAt: "2026-04-15T00:00:00Z",
    coverImage: null,
  },
];

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default async function WritingPage() {
  const sanityArticles = await getAllPosts();
  const articles: ArticleCard[] =
    sanityArticles && sanityArticles.length > 0 ? sanityArticles : FALLBACK_ARTICLES;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMBS) }}
      />
      <PageHero
        eyebrow="Writing"
        headline="Essays on the examined life."
        subheadline="For women who have built something remarkable and are now, quietly, re-reading the architecture."
        variant="dark"
      />

      <section className="bg-cream py-12 md:py-16">
        <div className="container-content">
          {articles.length === 0 ? (
            <p className="text-[16px] text-ink-quiet text-center py-16">
              New writing coming soon.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article._id}
                  href={`/writing/${article.slug}`}
                  className="group block"
                >
                  {(() => {
                    const localSrc = (article as ArticleCard).localImage ?? null;
                    const sanitySrc = article.coverImage
                      ? urlForImage(article.coverImage)
                      : null;
                    const src = localSrc ?? sanitySrc;
                    if (!src) return null;
                    return (
                      <div className="relative aspect-[3/2] mb-5 overflow-hidden bg-bone">
                        <Image
                          src={src}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>
                    );
                  })()}
                  <p className="text-[11px] uppercase tracking-[0.22em] text-ink-quiet">
                    {formatDate(article.publishedAt)}
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-[24px] leading-tight text-ink group-hover:text-plum transition-colors">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  <span className="mt-4 inline-block text-[13px] text-plum">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROGRAMME BRIDGE — converts reading intent into consultation intent ── */}
      <section className="bg-[#231727] py-14 md:py-16">
        <div className="container-content max-w-2xl mx-auto text-center">
          <div
            aria-hidden
            className="h-px w-12 mx-auto mb-8"
            style={{ background: "linear-gradient(to right, transparent, #F942AA, transparent)" }}
          />
          <p className="font-[family-name:var(--font-display)] italic text-[22px] md:text-[26px]
                        text-cream leading-snug mb-4">
            Reading is one thing. The work is another.
          </p>
          <p className="font-[family-name:var(--font-body)] text-[15px] text-cream/60 mb-8 max-w-sm mx-auto leading-relaxed">
            If something in these essays named a question you have been carrying,
            the private consultation is where that question goes next.
          </p>
          <a
            href="/assessment"
            className="inline-block px-8 py-3 bg-plum text-cream text-[12px] uppercase
                       tracking-[0.18em] font-[family-name:var(--font-body)]
                       hover:bg-plum-deep transition-colors rounded-[1px]"
          >
            Begin the assessment
          </a>
        </div>
      </section>

      <section className="bg-bone py-16 md:py-20">
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
