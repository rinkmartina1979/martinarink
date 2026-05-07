/**
 * Article utilities — reading time calculation and structured data builders.
 */

const WORDS_PER_MINUTE = 220;

interface PortableTextBlock {
  _type?: string;
  children?: { text?: string }[];
}

/**
 * Calculate reading time from a Sanity Portable Text body or a raw paragraph
 * array. Returns whole minutes, minimum 1.
 */
export function calcReadingTime(
  body: unknown[] | string[] | null | undefined,
): number {
  if (!body || !Array.isArray(body) || body.length === 0) return 1;

  let wordCount = 0;
  for (const block of body as (PortableTextBlock | string)[]) {
    if (typeof block === "string") {
      wordCount += block.trim().split(/\s+/).filter(Boolean).length;
      continue;
    }
    const children = block?.children ?? [];
    for (const child of children) {
      if (typeof child?.text === "string") {
        wordCount += child.text.trim().split(/\s+/).filter(Boolean).length;
      }
    }
  }

  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

/**
 * schema.org/Article JSON-LD builder for /writing/[slug].
 * Used inline as <script type="application/ld+json"> on the article page.
 */
export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  publishedAt: string | null;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.publishedAt ?? undefined,
    dateModified: opts.publishedAt ?? undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    image: opts.imageUrl ? [opts.imageUrl] : undefined,
    author: {
      "@type": "Person",
      name: "Martina Rink",
      url: "https://martinarink.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Martina Rink",
      logo: {
        "@type": "ImageObject",
        url: "https://martinarink.com/favicon.png",
      },
    },
  };
}
