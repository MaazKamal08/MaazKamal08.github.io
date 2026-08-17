// Refreshes src/data/medium-posts.generated.json from the author's Medium RSS feed.
// Runs inside GitHub Actions (see .github/workflows/refresh-content.yml) on a daily schedule,
// so the "Writing" section on the portfolio shows real Medium posts without any client-side
// fetch (Medium's feed has no CORS headers, so it cannot be fetched directly from the browser).
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "src", "data", "medium-posts.generated.json");

const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME || "muhammadmaazkamal";
const FEED_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;

function decodeEntities(text) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function stripHtml(html) {
  return decodeEntities(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match ? decodeEntities(match[1]) : "";
}

function extractAll(block, tag) {
  const matches = [...block.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "g"))];
  return matches.map((m) => decodeEntities(m[1]));
}

function toExcerpt(descriptionHtml, maxLength = 220) {
  const text = stripHtml(descriptionHtml);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function estimateReadTime(descriptionHtml) {
  const words = stripHtml(descriptionHtml).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

async function main() {
  const response = await fetch(FEED_URL, { headers: { "User-Agent": "portfolio-medium-sync" } });
  if (!response.ok) {
    throw new Error(`Medium feed request failed: ${response.status} ${response.statusText}`);
  }
  const xml = await response.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

  const posts = items.slice(0, 9).map((item) => {
    const title = extractTag(item, "title");
    const link = extractTag(item, "link").split("?")[0];
    const pubDate = extractTag(item, "pubDate");
    const description = extractTag(item, "description");
    const categories = extractAll(item, "category");
    return {
      title,
      link,
      pubDate,
      excerpt: toExcerpt(description),
      readTime: estimateReadTime(description),
      categories: categories.slice(0, 4)
    };
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    username: MEDIUM_USERNAME,
    posts
  };

  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${posts.length} Medium posts to ${outPath}`);
}

main().catch((error) => {
  console.error("[fetch-medium-posts] failed:", error.message);
  process.exit(1);
});
