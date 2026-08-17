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

export type RepoCategory = "Security automation" | "AI automation" | "Client workflow" | "Learning / fork";

export function classifyRepo(repo: RepoSnapshot): RepoCategory {
  const text = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
  if (text.includes("wazuh") || text.includes("cve") || text.includes("virustotal") || text.includes("sophos") || text.includes("tls") || text.includes("apk") || text.includes("phishing") || text.includes("incident") || text.includes("kaspersky"))
    return "Security automation";
  if (text.includes("ai") || text.includes("agent") || text.includes("copilot") || text.includes("blog") || text.includes("rag") || text.includes("langgraph") || text.includes("langsmith") || text.includes("llm"))
    return "AI automation";
  if (repo.fork) return "Learning / fork";
  return "Client workflow";
}
