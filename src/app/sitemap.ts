import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://maazkamal08.github.io/",
      lastModified: new Date("2026-06-13"),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
