import mediumData from "./medium-posts.generated.json";

export type MediumPost = {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
  readTime: string;
  categories: string[];
};

// Refreshed daily by .github/workflows/refresh-content.yml (scripts/fetch-medium-posts.mjs)
// by parsing the public Medium RSS feed at build time - Medium's feed has no CORS headers,
// so a client-side fetch from the browser is not possible on a static export.
export const mediumPosts: MediumPost[] = mediumData.posts as MediumPost[];
export const mediumGeneratedAt: string | null = mediumData.generatedAt;
export const mediumUsername: string = mediumData.username;
