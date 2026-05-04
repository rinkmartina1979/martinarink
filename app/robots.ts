import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

// LIVE MODE — crawlers allowed. Set true to re-enter preview/noindex for redesigns.
const PREVIEW_MODE = false

export default function robots(): MetadataRoute.Robots {
  if (PREVIEW_MODE) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    }
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/book", "/apply", "/thank-you", "/api/", "/assessment/result"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
