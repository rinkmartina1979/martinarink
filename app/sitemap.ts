import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";
import { getAllPostSlugs } from "@/sanity/lib/queries";

const STATIC_PAGES = [
  { path: "/", priority: 1.0 },
  { path: "/about", priority: 0.9 },
  { path: "/sober-muse", priority: 0.95 },
  { path: "/empowerment", priority: 0.95 },
  { path: "/work-with-me", priority: 0.85 },
  { path: "/assessment", priority: 0.9 },
  { path: "/writing", priority: 0.8 },
  { path: "/newsletter", priority: 0.75 },
  { path: "/press", priority: 0.6 },
  { path: "/creative-work", priority: 0.6 },
  { path: "/contact", priority: 0.5 },
  { path: "/legal/privacy", priority: 0.3 },
  { path: "/legal/imprint", priority: 0.3 },
  { path: "/legal/terms", priority: 0.3 },
] as const;

// Hardcoded fallback article slugs (used when Sanity is not configured)
const FALLBACK_ARTICLE_SLUGS = [
  "what-high-functioning-women-use-alcohol-for",
  "the-identity-underneath-the-title",
  "on-elegance-and-edges-isabella-blow",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Try to fetch live article slugs from Sanity
  const liveSlugsFetched = await getAllPostSlugs();
  const articleSlugs = liveSlugsFetched && liveSlugsFetched.length > 0
    ? liveSlugsFetched
    : FALLBACK_ARTICLE_SLUGS;

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, priority }) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));

  const articleEntries: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${SITE.url}/writing/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...articleEntries];
}
