"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Search, ShieldCheck } from "lucide-react";
import { classifyRepo, fallbackRepos, repoDataGeneratedAt, type RepoCategory } from "@/data/githubRepos";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function slugifyRepoName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const publicBasePath = process.env.NEXT_PUBLIC_REPOSITORY_NAME ? `/${process.env.NEXT_PUBLIC_REPOSITORY_NAME}` : "";

const CATEGORIES: Array<RepoCategory | "All"> = ["All", "Security automation", "AI automation", "Client workflow", "Learning / fork"];

export function AllRepos() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [brokenScreenshots, setBrokenScreenshots] = useState<Record<string, boolean>>({});

  const repos = fallbackRepos;
  const syncedOn = repoDataGeneratedAt
    ? new Date(repoDataGeneratedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const filtered = useMemo(() => {
    return repos
      .filter((repo) => `${repo.name} ${repo.description ?? ""}`.toLowerCase().includes(query.toLowerCase()))
      .filter((repo) => category === "All" || classifyRepo(repo) === category)
      .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at));
  }, [repos, query, category]);

  const counts = useMemo(() => {
    return repos.reduce<Record<string, number>>((acc, repo) => {
      const c = classifyRepo(repo);
      acc[c] = (acc[c] ?? 0) + 1;
      return acc;
    }, {});
  }, [repos]);

  return (
    <main className="site-shell repos-page">
      <div className="background-grid" />
      <nav className="top-nav" aria-label="Primary navigation">
        <Link href="/" className="brand"><ShieldCheck size={18} /> MMK</Link>
        <div className="nav-links">
          <Link href="/#github">back to portfolio</Link>
        </div>
      </nav>

      <section className="section repos-hero">
        <Link href="/" className="back-link"><ArrowLeft size={16} /> Back to portfolio</Link>
        <p className="eyebrow">GitHub intelligence - complete list</p>
        <h1>Every public repository, in one place.</h1>
        <p>
          {repos.length} public repositories across security automation, AI engineering, and client delivery.{" "}
          {syncedOn ? `Synced ${syncedOn} via GitHub Actions.` : "Synced daily via GitHub Actions."}
        </p>
        <label className="search-box">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all repositories" />
        </label>
        <div className="repo-filter-tabs">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}{c !== "All" ? ` (${counts[c] ?? 0})` : ` (${repos.length})`}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="repo-full-grid">
          {filtered.map((repo) => {
            const screenshotPath = `${publicBasePath}/workflows/${slugifyRepoName(repo.name)}.png`;
            const screenshotBroken = brokenScreenshots[repo.name];
            return (
              <a key={repo.html_url} href={repo.html_url} target="_blank" rel="noreferrer" className="repo-item repo-full-item">
                {!screenshotBroken && (
                  <img
                    className="repo-full-item-screenshot"
                    src={screenshotPath}
                    alt=""
                    loading="lazy"
                    onError={() => setBrokenScreenshots((current) => ({ ...current, [repo.name]: true }))}
                  />
                )}
                <div className="repo-full-item-head">
                  <span>{classifyRepo(repo)}</span>
                  <ExternalLink size={14} />
                </div>
                <strong>{repo.name}</strong>
                <small>{repo.description ?? "No public description"}</small>
                <div className="repo-full-item-meta">
                  <span>{repo.language ?? "Workflow"}</span>
                  <span>Updated {formatDate(repo.pushed_at)}</span>
                </div>
              </a>
            );
          })}
        </div>
        {filtered.length === 0 && <p className="repo-empty">No repositories match that search.</p>}
      </section>
    </main>
  );
}
