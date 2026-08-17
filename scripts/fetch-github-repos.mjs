// Refreshes src/data/github-repos.generated.json from the GitHub API at build/schedule time.
// Runs inside GitHub Actions (see .github/workflows/refresh-content.yml) using the built-in
// GITHUB_TOKEN, so it is authenticated (5,000 req/hr) instead of the old unauthenticated
// client-side fetch that capped out at 60 req/hr per IP and quietly fell back to stale data.
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "src", "data", "github-repos.generated.json");

const GITHUB_USER = "MaazKamal08";
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

// Repos that aren't real portfolio projects: this site itself, an older duplicate
// portfolio, and GitHub's auto-generated "Skills" tutorial-completion repos.
const EXCLUDED_REPOS = new Set([
  "MaazKamal08.github.io",
  "MaazKamal08",
  "maazkamal",
  "skills-create-applications-with-the-copilot-cli",
  "skills-customize-your-github-copilot-experience"
]);

async function main() {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-repo-sync" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();

  const repos = data
    .filter((repo) => !repo.private && !EXCLUDED_REPOS.has(repo.name))
    .map((repo) => ({
      name: repo.name,
      description: repo.description ?? null,
      fork: repo.fork,
      language: repo.language ?? null,
      size: repo.size,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      pushed_at: repo.pushed_at,
      html_url: repo.html_url
    }))
    .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at));

  const payload = {
    generatedAt: new Date().toISOString(),
    repos
  };

  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${repos.length} repos to ${outPath}`);
}

main().catch((error) => {
  console.error("[fetch-github-repos] failed:", error.message);
  process.exit(1);
});
