import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/sanity/lib/queries";
import { SITE } from "@/lib/utils";

// Static indexed pages (from CLAUDE.md sitemap)
const STATIC_PAGES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/",               changeFrequency: "weekly",  priority: 1.0 },
  { path: "/about",          changeFrequency: "monthly", priority: 0.9 },
  { path: "/work-with-me",   changeFrequency: "monthly", priority: 0.9 },
  { path: "/sober-muse",     changeFrequency: "monthly", priority: 0.9 },
  { path: "/empowerment",    changeFrequency: "monthly", priority: 0.9 },
  { path: "/assessment",     changeFrequency: "monthly", priority: 0.8 },
  { path: "/press",          changeFrequency: "monthly", priority: 0.7 },
  { path: "/writing",        changeFrequency: "weekly",  priority: 0.8 },
  { path: "/newsletter",     changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact",        changeFrequency: "yearly",  priority: 0.5 },
  { path: "/creative-work",  changeFrequency: "monthly", priority: 0.6 },
  { path: "/legal/privacy",  changeFrequency: "yearly",  priority: 0.3 },
  { path: "/legal/imprint",  changeFrequency: "yearly",  priority: 0.3 },
  { path: "/legal/terms",    changeFrequency: "yearly",  priority: 0.3 },
];

// Hardcoded fallback article slugs — always included so crawlers can index
const HARDCODED_ARTICLE_SLUGS = [
  "what-high-functioning-women-use-alcohol-for",
  "the-identity-underneath-the-title",
  "on-elegance-and-edges-isabella-blow",
];

// Hardcoded case study slugs
const HARDCODED_CASE_SLUGS = ["adriana", "helena", "margaux"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  // Static pages
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })
  );

  // Dynamic blog posts from Sanity (fallback to hardcoded if Sanity empty)
  const sanitySlugs = await getAllPostSlugs().catch(() => null);
  const articleSlugs =
    sanitySlugs && sanitySlugs.length > 0 ? sanitySlugs : HARDCODED_ARTICLE_SLUGS;

  const articleEntries: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${base}/writing/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Case study pages
  const caseEntries: MetadataRoute.Sitemap = HARDCODED_CASE_SLUGS.map((slug) => ({
    url: `${base}/press/case/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries, ...caseEntries];
}
