import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    { path: "/", priority: 1.0 },
    { path: "/about", priority: 0.9 },
    { path: "/sober-muse", priority: 0.95 },
    { path: "/empowerment", priority: 0.95 },
    { path: "/work-with-me", priority: 0.85 },
    { path: "/assessment", priority: 0.9 },
    { path: "/writing", priority: 0.8 },
    { path: "/newsletter", priority: 0.75 },
    { path: "/press", priority: 0.6 },
    { path: "/contact", priority: 0.5 },
    { path: "/legal/privacy", priority: 0.3 },
    { path: "/legal/imprint", priority: 0.3 },
    { path: "/legal/terms", priority: 0.3 },
    // Sample articles (replace with Sanity fetch later)
    { path: "/writing/what-high-functioning-women-use-alcohol-for", priority: 0.7 },
    { path: "/writing/the-identity-underneath-the-title", priority: 0.7 },
    { path: "/writing/on-elegance-and-edges-isabella-blow", priority: 0.7 },
  ];

  return pages.map(({ path, priority }) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));
}
