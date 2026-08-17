# Muhammad Maaz Kamal - AI Security Engineer Portfolio

Premium static-export portfolio built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, GSAP, React Three Fiber, Vercel Analytics, and daily-automated GitHub + Medium content sync.

## Architecture

- `src/app` - Next app router, SEO metadata (OG image, favicon, JSON-LD), sitemap, robots.
- `src/components/PortfolioExperience.tsx` - Main interactive portfolio experience.
- `src/data` - Editable content model for profile, skills, case studies, timeline, certifications, testimonials, and the generated GitHub/Medium snapshots.
- `public` - Resume PDFs, profile photo, OG image, and `public/projects/` for project screenshots.
- `scripts/` - Node scripts that refresh GitHub repo and Medium post data; `render-images.mjs` regenerates the OG image/favicon from the HTML templates if you ever want to restyle them.
- `.github/workflows/deploy.yml` - GitHub Pages deployment (builds on every push to `main`).
- `.github/workflows/refresh-content.yml` - Daily cron (06:00 UTC) that re-fetches GitHub repos and Medium posts, commits the changes, and that commit triggers `deploy.yml` automatically. Also runnable on demand from the Actions tab ("Run workflow").

## Adding project screenshots

Each project card automatically looks for a sanitized screenshot at `public/projects/<slug>.png`, where `<slug>` is the project title lowercased with spaces replaced by hyphens. No code changes needed - just drop a correctly named file in:

| Project | Expected filename |
| --- | --- |
| Automated IP Blocking Pipeline | `public/projects/automated-ip-blocking-pipeline.png` |
| SOC AI Triage System | `public/projects/soc-ai-triage-system.png` |
| SmartPhish | `public/projects/smartphish.png` |
| FirewallAI | `public/projects/firewallai.png` |
| Enterprise RAG & Agentic Systems | `public/projects/enterprise-rag-agentic-systems.png` |
| WooCommerce Bulk AI SEO Updater | `public/projects/woocommerce-bulk-ai-seo-updater.png` |

If no file exists at that path, the card simply shows no screenshot (no broken-image icon). Per the portfolio audit: only add real screenshots after rebuilding the workflow in a sandbox with fake IPs/payloads (never screenshot a production console), and get client sign-off before showing the RAG or WooCommerce workflow canvases.

## Adding repository workflow screenshots

The `/repos` page (all public GitHub repos, `src/components/AllRepos.tsx`) follows the same convention for any repo, not just the 6 case studies above: drop a screenshot at `public/workflows/<repo-slug>.png`, where `<repo-slug>` is the repo name lowercased with any non-alphanumeric run collapsed to a single hyphen (e.g. `n8n-wazuh-ip-blocker-1q6od` -> `public/workflows/n8n-wazuh-ip-blocker-1q6od.png`). No code changes needed, and repos without a file simply show no screenshot. Same redaction rule applies: sandbox/mock data only, never a real production console or client-identifying details.

## Testimonials

`src/data/testimonials.ts` is empty by default and the site will never show a fabricated quote. While empty, the Testimonials section shows honest "awaiting a quote" placeholder slots. Add an entry only once you have the person's permission to publish their name and quote:

```ts
export const testimonials: Testimonial[] = [
  { quote: "...", name: "Jane Doe", role: "Operations Lead", company: "Acme Inc" }
];
```

## Writing (Medium sync)

The Writing section is populated from `src/data/medium-posts.generated.json`, refreshed daily by `scripts/fetch-medium-posts.mjs` against `https://medium.com/feed/@muhammadmaazkamal` (set via the `MEDIUM_USERNAME` env var in `refresh-content.yml`). No manual updates needed - publish on Medium and it appears here within a day, or trigger the workflow manually for an instant sync.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
```

The static site is exported to `out/`.

## GitHub Pages

1. Create a repository, for example `maaz-ai-portfolio`.
2. Push this source code.
3. In GitHub, enable Pages with source `GitHub Actions`.
4. Set repository variable `NEXT_PUBLIC_REPOSITORY_NAME` to the repo name if deploying under `https://MaazKamal08.github.io/<repo>/`.
5. Set repository variable `NEXT_PUBLIC_WEB3FORMS_KEY` (Settings -> Secrets and variables -> Actions -> Variables) to enable the contact form (see "Contact form" below).
6. The workflow builds with `GITHUB_PAGES=true` and publishes `out/`.

For a user site repository named `MaazKamal08.github.io`, leave `NEXT_PUBLIC_REPOSITORY_NAME` empty.

## Contact form

The contact form submits via [Web3Forms](https://web3forms.com/) (free tier, no backend needed):

1. Get a free access key at [web3forms.com](https://web3forms.com/).
2. Local dev: copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_WEB3FORMS_KEY`.
3. Production: set the `NEXT_PUBLIC_WEB3FORMS_KEY` repository variable in GitHub Actions (Settings -> Secrets and variables -> Actions -> Variables tab -> New repository variable). It's read at build time, so redeploy after setting it.

Without a key configured, the form falls back to opening the visitor's own mail client via `mailto:`.

## Vercel

Import the repository into Vercel. The default build command is:

```bash
npm run build
```

Vercel Analytics is already wired in `src/app/layout.tsx`.

## Cloudflare Pages

Use:

- Build command: `npm run build`
- Output directory: `out`
- Node version: 20+

## SEO Strategy

- Person JSON-LD structured data (includes GitHub, LinkedIn, and Medium as `sameAs`).
- Open Graph and Twitter card metadata, including a generated 1200x630 `og-image.png` social preview.
- Favicon and Apple touch icon (`src/app/icon.png`, `apple-icon.png`, `favicon.ico`) auto-served by Next's file-based metadata convention. Regenerate them anytime with `node scripts/render-images.mjs` after editing `scripts/render-og.html` / `render-icon.html`.
- `sitemap.xml` and `robots.txt` generated by Next metadata routes, with `lastModified` stamped at build time.
- Keyword coverage: AI Engineer, Cybersecurity Engineer, SOC Analyst, Full Stack Developer, GenAI Engineer, Agentic AI Engineer, Security Automation, Wazuh, n8n, LangChain.
- Case-study copy focuses on business impact, architecture, metrics, and lessons learned.

## Performance Plan

- Static export for low-latency hosting.
- GitHub repo and Medium post data is fetched once a day at build time (see `refresh-content.yml`), not on every page load, so there is no client-side rate-limit exposure or CORS dependency.
- Reduced-motion fallback disables the WebGL field for accessibility.
- SVG charts avoid heavy charting dependencies.
- Project screenshots lazy-load and are optional per project (see "Adding project screenshots").

## OpenAI-Ready Assistant

The assistant widget is currently rule-based for GitHub Pages compatibility. To connect OpenAI:

1. Add a serverless API route on Vercel or Cloudflare Workers.
2. Store `OPENAI_API_KEY` as an environment secret.
3. Send the assistant query plus selected portfolio data to the route.
4. Return short, recruiter-safe answers with no private data beyond the public portfolio content.

## Future Roadmap

- Publish sanitized SmartPhish demo modules.
- Add a FirewallAI approval-first interactive demo.
- Add signed PDF case studies where client confidentiality permits.
- Swap in real client testimonials once approved (see "Testimonials" above).
- Point a custom domain (e.g. `maazkamal.dev`) at GitHub Pages: buy the domain, add a `public/CNAME` file containing the domain, and set it in repo Settings -> Pages.
- Add an OpenAI/Anthropic-backed portfolio assistant via a serverless edge function once an API key and safety policy are configured (see "OpenAI-Ready Assistant" above).
