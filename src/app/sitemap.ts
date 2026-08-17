import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// lastModified now stamps with the actual build time on every deploy instead of a hardcoded
// past date, so it reflects reality without needing a manual edit each release.
export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();

  return [
    {
      url: "https://maazkamal08.github.io/",
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: "https://maazkamal08.github.io/writing/",
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.8
    }
  ];
}
