import type { MetadataRoute } from "next";
import { getAllIndexableUrls } from "@/lib/sitemap-entries";
import { SITE_URL } from "@/lib/seo";

const MAX_URLS_PER_SITEMAP = 5000;

export default function robots(): MetadataRoute.Robots {
  const segmentCount = Math.max(1, Math.ceil(getAllIndexableUrls().length / MAX_URLS_PER_SITEMAP));
  const sitemaps = Array.from({ length: segmentCount }, (_, id) => `${SITE_URL}/sitemap/${id}.xml`);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: sitemaps,
    host: SITE_URL,
  };
}
