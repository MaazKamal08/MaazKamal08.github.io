import repoData from "./github-repos.generated.json";

export type RepoSnapshot = {
  name: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  size: number;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  html_url: string;
};

// Refreshed daily by .github/workflows/refresh-content.yml (scripts/fetch-github-repos.mjs)
// using an authenticated GitHub API call, so the portfolio never hits the 60 req/hr
// unauthenticated client-side rate limit and never silently shows stale placeholder data.
export const fallbackRepos: RepoSnapshot[] = repoData.repos as RepoSnapshot[];
export const repoDataGeneratedAt: string | null = repoData.generatedAt;
