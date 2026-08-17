# Deployment Guide

Step-by-step instructions to take this repo from a fresh clone to a live GitHub Pages site, including every environment variable, workflow, and command involved.

## 1. Prerequisites

- Node.js 20+ and npm
- Git
- A GitHub account with a repository created for this project (for a user site, the repo must be named `<your-username>.github.io`)
- (Optional but recommended) [GitHub CLI](https://cli.github.com/) (`gh`) for the commands below — everything it does can also be done through the GitHub web UI

Check versions:

```bash
node -v
npm -v
git --version
gh --version
```

## 2. Clone and install

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

## 3. Environment variables

Create `.env.local` for local development (copy `.env.example`):

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Optional | Enables real contact-form submissions via [Web3Forms](https://web3forms.com/). Without it, the form falls back to a `mailto:` link. Get a free key at web3forms.com. |
| `NEXT_PUBLIC_REPOSITORY_NAME` | Only for project-page repos | Set to the repo name if deploying to `https://<username>.github.io/<repo>/` instead of a root user site. Leave empty/unset for a `<username>.github.io` repo. |
| `MEDIUM_USERNAME` | Optional | Medium handle to sync blog posts from (defaults to `muhammadmaazkamal` inside `scripts/fetch-medium-posts.mjs` — change that default if forking). |
| `GITHUB_TOKEN` / `GH_TOKEN` | Only for manual script runs | Used by `scripts/fetch-github-repos.mjs` for authenticated API calls (5,000 req/hr instead of 60). In CI this is supplied automatically; locally, use `gh auth token`. |

## 4. Local development

```bash
npm run dev
```

Open `http://localhost:3000`.

Other useful commands:

```bash
npm run typecheck   # tsc --noEmit
npm run build       # production build -> static export in out/
```

## 5. One-time GitHub Pages setup

1. Push the repo to GitHub (see step 7 if it's not initialized yet).
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
   - If it's currently set to "Deploy from a branch" (the legacy default), switch it — otherwise GitHub's own branch-build pipeline runs *in addition to* this repo's `deploy.yml` workflow and can serve stale/incorrect content.
   - Via CLI instead of the UI:
     ```bash
     gh api -X PUT repos/<owner>/<repo>/pages -f build_type=workflow
     ```
3. (Only for a project-page repo, not a `<username>.github.io` root site) Go to **Settings → Secrets and variables → Actions → Variables** and add:
   - `NEXT_PUBLIC_REPOSITORY_NAME` = `<repo-name>`
4. (Optional, to enable the contact form) In the same **Variables** tab, add:
   - `NEXT_PUBLIC_WEB3FORMS_KEY` = `<your Web3Forms access key>`

## 6. Deploying

Deployment is fully automated by `.github/workflows/deploy.yml`: any push to `main` triggers a build (`npm ci` → `npm run build` with `GITHUB_PAGES=true`) and publishes the `out/` directory to Pages.

```bash
git add -A
git commit -m "your message"
git push origin main
```

To trigger a rebuild without a new commit (e.g., after changing a repo Variable):

```bash
gh workflow run deploy.yml --repo <owner>/<repo>
```

Watch a run:

```bash
gh run list --repo <owner>/<repo> --limit 1
gh run watch <run-id> --repo <owner>/<repo> --exit-status
```

Your site is live at `https://<username>.github.io/` (or `https://<username>.github.io/<repo>/` for a project-page repo).

## 7. First-time repo setup (if not already a git repo)

```bash
git init
git remote add origin https://github.com/<owner>/<repo>.git
git add -A
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

If push is rejected with `refusing to allow an OAuth App to create or update workflow` — the token lacks the `workflow` scope needed to push `.github/workflows/*` files for the first time:

```bash
gh auth refresh -h github.com -s workflow
```

This opens a device-code flow in your browser; after approving, re-run the push.

## 8. Daily content sync (automated)

`.github/workflows/refresh-content.yml` runs on a schedule (06:00 UTC daily) and on demand:

```bash
gh workflow run refresh-content.yml --repo <owner>/<repo>
```

It re-fetches your GitHub repos and Medium posts, commits any changes to `src/data/*.generated.json`, and pushes — which in turn triggers `deploy.yml` to rebuild the live site. No manual steps needed once it's running; the first real posts/repos may not appear until this workflow's first run if the generated JSON files start empty.

## 9. Adding screenshots

Two conventions, both simple drop-in-a-file — no code changes:

- **Featured case studies** (the 6 cards on the home page): `public/projects/<slug>.png`, where `<slug>` is the project title lowercased with spaces → hyphens (see the table in `README.md`).
- **Any GitHub repo** (on the `/repos` page): `public/workflows/<repo-name-slugified>.png`, where the repo name is lowercased with any non-alphanumeric run collapsed to a single hyphen.

Missing files simply show no screenshot (no broken-image icon). Only use sandboxed/mock data in screenshots — never a real production console, real IPs/hostnames, or client-identifying details.

## 10. Custom domain (optional)

1. Buy a domain.
2. Add a `public/CNAME` file containing just the domain, e.g. `maazkamal.dev`.
3. In **Settings → Pages**, set the custom domain and enable "Enforce HTTPS" once DNS propagates.
4. Point your domain's DNS at GitHub Pages (A records to GitHub's IPs, or a CNAME record to `<username>.github.io` for a subdomain) — see [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for exact records.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Site shows raw/broken content instead of the built app | Pages source is set to "Deploy from a branch" instead of "GitHub Actions" | Step 5.2 above |
| Push rejected: OAuth App workflow scope error | `gh` token lacks `workflow` scope | `gh auth refresh -h github.com -s workflow` |
| Contact form opens the visitor's email client instead of submitting | `NEXT_PUBLIC_WEB3FORMS_KEY` not set (or not set at build time) | Step 5.4, then rebuild (step 6) |
| Writing/GitHub sections show placeholder data | `refresh-content.yml` hasn't run yet (new repo) | `gh workflow run refresh-content.yml --repo <owner>/<repo>` |
| `npm run lint` errors with "Invalid project directory" | Known issue with `next lint` in this Next.js version, unrelated to project code | Ignore, or run ESLint directly instead |
