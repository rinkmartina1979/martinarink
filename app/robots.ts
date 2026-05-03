import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";

// NOINDEX MODE — site is under client review. Switch back to production rules before launch.
const PREVIEW_MODE = true

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
