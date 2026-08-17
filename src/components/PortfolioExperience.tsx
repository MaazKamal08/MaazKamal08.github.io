"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import {
  ArrowRight,
  Bot,
  Calendar,
  Check,
  Command,
  Download,
  ExternalLink,
  GitBranch,
  Link,
  Mail,
  Mic,
  Moon,
  Phone,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  X,
  Zap
} from "lucide-react";
import * as THREE from "three";
import {
  certifications,
  experiences,
  operatingSignals,
  profile,
  projects,
  repoHighlights,
  roadmap,
  serviceTracks,
  skillGroups,
  story
} from "@/data/portfolio";
import { fallbackRepos, repoDataGeneratedAt, type RepoSnapshot } from "@/data/githubRepos";
import { mediumGeneratedAt, mediumPosts, mediumUsername } from "@/data/mediumPosts";
import { testimonials } from "@/data/testimonials";

type Theme = "dark" | "light";

const publicBasePath = process.env.NEXT_PUBLIC_REPOSITORY_NAME ? `/${process.env.NEXT_PUBLIC_REPOSITORY_NAME}` : "";
const publicAsset = (path: string) => `${publicBasePath}${path}`;
// "testimonials" only appears in navigation once real entries exist - see src/data/testimonials.ts.
const navItems = [
  "services",
  "skills",
  "projects",
  "github",
  "writing",
  ...(testimonials.length > 0 ? ["testimonials"] : []),
  "experience",
  "systems-lab",
  "contact"
];

function slugifyProject(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatSyncDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function SignalField() {
  const points = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const positions = new Float32Array(900);
    for (let index = 0; index < positions.length; index += 3) {
      positions[index] = (Math.random() - 0.5) * 8;
      positions[index + 1] = (Math.random() - 0.5) * 4.5;
      positions[index + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.035;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#6fffd2" size={0.025} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function RadarChart() {
  const size = 270;
  const center = size / 2;
  const radius = 98;
  const points = skillGroups
    .map((group, index) => {
      const angle = (Math.PI * 2 * index) / skillGroups.length - Math.PI / 2;
      const value = group.score / 100;
      return `${center + Math.cos(angle) * radius * value},${center + Math.sin(angle) * radius * value}`;
    })
    .join(" ");

  return (
    <svg className="radar" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Skill radar chart">
      {[0.35, 0.7, 1].map((scale) => (
        <polygon
          key={scale}
          points={skillGroups
            .map((_, index) => {
              const angle = (Math.PI * 2 * index) / skillGroups.length - Math.PI / 2;
              return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(210,255,239,.16)"
        />
      ))}
      {skillGroups.map((group, index) => {
        const angle = (Math.PI * 2 * index) / skillGroups.length - Math.PI / 2;
        return (
          <g key={group.label}>
            <line
              x1={center}
              y1={center}
              x2={center + Math.cos(angle) * radius}
              y2={center + Math.sin(angle) * radius}
              stroke="rgba(210,255,239,.12)"
            />
            <text
              x={center + Math.cos(angle) * (radius + 25)}
              y={center + Math.sin(angle) * (radius + 25)}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {group.label}
            </text>
          </g>
        );
      })}
      <polygon points={points} fill="rgba(111,255,210,.22)" stroke="#6fffd2" strokeWidth="2" />
    </svg>
  );
}

function classifyRepo(repo: RepoSnapshot) {
  const text = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
  if (text.includes("wazuh") || text.includes("cve") || text.includes("virustotal") || text.includes("sophos") || text.includes("tls") || text.includes("apk")) return "Security automation";
  if (text.includes("ai") || text.includes("agent") || text.includes("copilot") || text.includes("blog")) return "AI automation";
  if (repo.fork) return "Learning / fork";
  return "Client workflow";
}

function RepoIntelligence({ query }: { query: string }) {
  // Static data refreshed daily by .github/workflows/refresh-content.yml using an
  // authenticated GitHub API call - see scripts/fetch-github-repos.mjs. This replaces the old
  // unauthenticated client-side fetch, which capped at 60 req/hr per IP (shared across every
  // visitor on the same network) and silently fell back to stale data when it was exhausted.
  const repos: RepoSnapshot[] = fallbackRepos;
  const syncedOn = formatSyncDate(repoDataGeneratedAt);

  const filtered = repos.filter((repo) => `${repo.name} ${repo.description ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  const categories = filtered.reduce<Record<string, number>>((acc, repo) => {
    const category = classifyRepo(repo);
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});
  const languages = filtered.reduce<Record<string, number>>((acc, repo) => {
    const language = repo.language ?? "Workflow";
    acc[language] = (acc[language] ?? 0) + 1;
    return acc;
  }, {});
  const latest = [...filtered].sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at)).slice(0, 6);

  return (
    <section id="github" className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">GitHub intelligence</p>
          <h2>Repository portfolio, categorized by business capability.</h2>
        </div>
        <span className="status online">{syncedOn ? `Synced ${syncedOn}` : "Synced daily via GitHub Actions"}</span>
      </div>
      <div className="github-grid">
        <div className="panel">
          <h3>Project clusters</h3>
          {Object.entries(categories).map(([label, count]) => (
            <div className="bar-row" key={label}>
              <span>{label}</span>
              <div className="bar-track"><div style={{ width: `${Math.max(18, (count / Math.max(filtered.length, 1)) * 100)}%` }} /></div>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
        <div className="panel">
          <h3>Language / artifact mix</h3>
          {Object.entries(languages).slice(0, 5).map(([label, count]) => (
            <div className="bar-row" key={label}>
              <span>{label}</span>
              <div className="bar-track amber"><div style={{ width: `${Math.max(18, (count / Math.max(filtered.length, 1)) * 100)}%` }} /></div>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
        <div className="panel span-2">
          <h3>Latest signal</h3>
          <div className="repo-list">
            {latest.map((repo) => (
              <a key={repo.html_url} href={repo.html_url} target="_blank" rel="noreferrer" className="repo-item">
                <span>{classifyRepo(repo)}</span>
                <strong>{repo.name}</strong>
                <small>{repo.description ?? "No public description"}</small>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="insight-strip">
        {repoHighlights.map((item) => <p key={item}>{item}</p>)}
      </div>
    </section>
  );
}

function WritingSection() {
  const syncedOn = formatSyncDate(mediumGeneratedAt);
  const hasPosts = mediumPosts.length > 0;

  return (
    <section id="writing" className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Writing</p>
          <h2>Architecture walkthroughs and security notes, straight from Medium.</h2>
        </div>
        <span className="status online">{syncedOn ? `Synced ${syncedOn}` : "Synced daily via GitHub Actions"}</span>
      </div>
      {hasPosts ? (
        <div className="project-grid">
          {mediumPosts.map((post) => (
            <a className="project-card writing-card" key={post.link} href={post.link} target="_blank" rel="noreferrer">
              <div className="project-top">
                <span>{post.categories[0] ?? "Article"}</span>
                <small>{post.readTime}</small>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="tag-row">{post.categories.slice(1).map((tag) => <span key={tag}>{tag}</span>)}</div>
              <small className="lesson"><ExternalLink size={14} /> Read on Medium</small>
            </a>
          ))}
        </div>
      ) : (
        <div className="panel writing-empty">
          <h3>New posts sync in automatically.</h3>
          <p>
            This section pulls directly from{" "}
            <a href={profile.medium} target="_blank" rel="noreferrer">@{mediumUsername}</a> on Medium once posts are
            published there - no manual updates needed on this site.
          </p>
        </div>
      )}
    </section>
  );
}

function TestimonialsSection() {
  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Client and colleague signal</p>
            <h2>Social proof, pending sign-off.</h2>
          </div>
        </div>
        <div className="cert-grid">
          {[0, 1, 2].map((slot) => (
            <article className="cert-card testimonial-slot" key={slot}>
              <Quote size={18} />
              <p>Open testimonial slot - add a permissioned client or colleague quote in src/data/testimonials.ts.</p>
              <strong>Awaiting a quote</strong>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Client and colleague signal</p>
          <h2>What it's like working with Maaz.</h2>
        </div>
      </div>
      <div className="cert-grid">
        {testimonials.map((testimonial) => (
          <article className="cert-card" key={`${testimonial.name}-${testimonial.company ?? ""}`}>
            <Quote size={18} />
            <p>&ldquo;{testimonial.quote}&rdquo;</p>
            <strong>{testimonial.name}</strong>
            <span>{testimonial.role}{testimonial.company ? ` · ${testimonial.company}` : ""}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PortfolioExperience() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [search, setSearch] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState("What makes Maaz different?");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("top");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [brokenScreenshots, setBrokenScreenshots] = useState<Record<string, boolean>>({});
  const [contactStatus, setContactStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const sectionLabels: Record<string, string> = {
    top: "Hero",
    services: "Services",
    skills: "Skills",
    projects: "Projects",
    github: "GitHub",
    writing: "Writing",
    testimonials: "Testimonials",
    experience: "Experience",
    "systems-lab": "Systems lab",
    contact: "Contact"
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
      if (event.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!rootRef.current || reducedMotion) return;
    gsap.fromTo(".metric-card", { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: "power3.out" });
  }, [reducedMotion]);

  useEffect(() => {
    const trackedSections = ["top", ...navItems];

    const onScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(documentHeight > 0 ? Math.min(100, (window.scrollY / documentHeight) * 100) : 0);

      const current = trackedSections
        .map((id) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY }))
        .filter((item) => item.top < window.innerHeight * 0.42)
        .sort((a, b) => b.top - a.top)[0]?.id;
      if (current) setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const filteredProjects = projects.filter((project) => {
    const haystack = `${project.title} ${project.category} ${project.problem} ${project.stack.join(" ")}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const assistantAnswer = useMemo(() => {
    const q = assistantQuery.toLowerCase();
    if (q.includes("project")) return "Start with Enterprise RAG systems, SmartPhish, the sub-90-second IP blocking pipeline, and client automation builds. Together they show AI product engineering, security depth, and delivery leadership.";
    if (q.includes("hire") || q.includes("different")) return "Maaz balances AI engineering and cybersecurity engineering: agents, RAG, APIs, and automation on one side; SOC L3, EDR/XDR, SOAR, phishing simulation, detection, response, and compliance on the other. The rare part is that he leads teams and client delivery across both.";
    if (q.includes("contact") || q.includes("book") || q.includes("consult")) return `Email ${profile.email}, call ${profile.phone}, or fill out the brief in the contact section below - every CTA on this page leads there.`;
    if (q.includes("blog") || q.includes("writing") || q.includes("article") || q.includes("medium")) return "Longer technical write-ups live in the Writing section, synced daily from Medium - architecture walkthroughs, security notes, and lessons learned.";
    return "This service guide routes recruiters and clients toward Maaz's strongest AI engineering, security automation, SOC, cloud, and client-delivery evidence.";
  }, [assistantQuery]);

  const scrollToContact = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      form.setAttribute("action", `mailto:${profile.email}`);
      form.setAttribute("method", "post");
      form.setAttribute("encType", "text/plain");
      form.submit();
      return;
    }
    setContactStatus("submitting");
    const formData = new FormData(form);
    formData.append("access_key", accessKey);
    formData.append("subject", "New portfolio contact request");
    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      const result = await response.json();
      if (result.success) {
        setContactStatus("success");
        form.reset();
      } else {
        setContactStatus("error");
      }
    } catch {
      setContactStatus("error");
    }
  };

  const startVoiceNavigation = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setCommandOpen(true);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const phrase = event.results[0][0].transcript.toLowerCase();
      const target = navItems.find((id) => phrase.includes(id) || phrase.includes(id.replace("-", " ")));
      if (target) document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    };
    recognition.start();
  };

  return (
    <main ref={rootRef} className="site-shell">
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      <div className="background-grid" />
      <nav className="top-nav" aria-label="Primary navigation">
        <a href="#top" className="brand"><ShieldCheck size={18} /> MMK</a>
        <div className="nav-links">
          {navItems.map((item) => <a key={item} className={activeSection === item ? "active" : ""} href={`#${item}`}>{item.replace("-", " ")}</a>)}
        </div>
        <div className="nav-actions">
          <button aria-label="Open command palette" className="icon-btn" onClick={() => setCommandOpen(true)}><Command size={18} /></button>
          <button aria-label="Start voice navigation" className="icon-btn" onClick={startVoiceNavigation}><Mic size={18} /></button>
          <button aria-label="Toggle theme" className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </nav>

      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">AI engineering x cybersecurity x automation leadership</p>
          <h1>{profile.name}</h1>
          <div className="role-line">
            <div className="role-rotator" aria-live="polite">
              <span>Operating as</span>
              <div className="role-window">
                <div className="role-stack">
                  {profile.roles.map((role) => <strong className={role.length > 28 ? "long-role" : undefined} key={role}>{role}</strong>)}
                </div>
              </div>
            </div>
            <span>{profile.headline}</span>
          </div>
          <p className="hero-text">
            I build AI products and security systems in parallel: RAG platforms, agentic workflows, CRM automations, and full-stack AI tools on one side; SOC triage, phishing intelligence, detection engineering, and firewall response pipelines on the other. Together, they turn business workflows and cyber threats into measurable, auditable action.
          </p>
          <div className="hero-actions">
            <a className="primary-btn" href="#contact" onClick={scrollToContact}>Get consultation <ArrowRight size={18} /></a>
            <a className="secondary-btn" href="#projects">View case studies <ArrowRight size={18} /></a>
            <a className="secondary-btn" href={publicAsset("/Maaz_Kamal_AI_Automation_Resume.pdf")} download>AI resume <Download size={18} /></a>
            <a className="secondary-btn" href={publicAsset("/Maaz_Kamal_Security_Resume.pdf")} download>Security resume <Download size={18} /></a>
          </div>
          <div className="availability"><span /> {profile.availability}</div>
        </div>
        <div className="hero-visual" aria-label="Muhammad Maaz Kamal profile and security operations signal panel">
          {!reducedMotion ? <Canvas camera={{ position: [0, 0, 4], fov: 50 }}><SignalField /></Canvas> : <div className="static-field" />}
          <div className="profile-frame">
            <img src={publicAsset("/maaz-profile.jpg")} alt="Muhammad Maaz Kamal" />
            <div className="profile-caption">
              <strong>SOC L3 / AI Security</strong>
              <span>Karachi · Remote global</span>
            </div>
          </div>
          <div className="hero-terminal">
            <Terminal size={16} />
            <p>wazuh.alert -&gt; enrich.ioc -&gt; llm.triage -&gt; firewall.block</p>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Profile statistics">
        {profile.proof.map((metric) => (
          <div className="metric-card" key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <section className="service-cta" aria-label="Consultation call to action">
        <div>
          <p className="eyebrow">AI engineering and cybersecurity services</p>
          <h2>Need an AI workflow, SOC automation, RAG system, or client ops engine built properly?</h2>
        </div>
        <a className="primary-btn" href="#contact" onClick={scrollToContact}>Book your service <ArrowRight size={18} /></a>
      </section>

      <section id="services" className="section services-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Service operating system</p>
            <h2>Four ways Maaz turns AI and security into deployed systems.</h2>
          </div>
          <div className="section-kpi">
            <strong>{Math.round(scrollProgress)}%</strong>
            <span>portfolio scanned</span>
          </div>
        </div>
        <div className="signal-grid">
          {operatingSignals.map((signal) => (
            <article className="signal-card" key={signal.label}>
              <strong>{signal.metric}</strong>
              <h3>{signal.label}</h3>
              <p>{signal.detail}</p>
            </article>
          ))}
        </div>
        <div className="service-grid">
          {serviceTracks.map((track) => (
            <article className="service-card" key={track.title}>
              <div className="service-card-top">
                <span>{track.label}</span>
                <Sparkles size={18} />
              </div>
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <ul>
                {track.outcomes.map((outcome) => <li key={outcome}><Check size={15} />{outcome}</li>)}
              </ul>
              <div className="tag-row">{track.stack.map((item) => <span key={item}>{item}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="section story-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">About</p>
            <h2>Cybersecurity instincts with AI product velocity.</h2>
          </div>
        </div>
        <div className="story-grid">
          {story.map((paragraph, index) => <p key={paragraph}><span>0{index + 1}</span>{paragraph}</p>)}
        </div>
      </section>

      <section id="skills" className="section">
        <div className="section-head">
          <div>
          <p className="eyebrow">Skills intelligence dashboard</p>
          <h2>Balanced capability map across AI, security, automation, and leadership.</h2>
          </div>
          <RadarChart />
        </div>
        <div className="skill-grid">
          {skillGroups.map((group) => (
            <article className="panel skill-panel" key={group.label}>
              <div className="panel-title"><h3>{group.label}</h3><strong>{group.score}%</strong></div>
              {group.skills.map((skill) => (
                <div className="skill-row" key={skill.name}>
                  <div><strong>{skill.name}</strong><span>{skill.proof}</span></div>
                  <div className="meter"><i style={{ width: `${skill.value}%` }} /></div>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Featured projects</p>
            <h2>Case studies that connect threats, AI, and business outcomes.</h2>
          </div>
          <label className="search-box">
            <Search size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects, tools, impact" />
          </label>
        </div>
        <div className="project-grid">
          {filteredProjects.map((project) => {
            const screenshotPath = project.screenshot ?? publicAsset(`/projects/${slugifyProject(project.title)}.png`);
            const screenshotBroken = brokenScreenshots[project.title];
            return (
              <article className="project-card" key={project.title}>
                <div className="project-top"><span>{project.category}</span><small>{project.status}</small></div>
                <h3>{project.title}</h3>
                {!screenshotBroken && (
                  <button
                    type="button"
                    className="project-screenshot"
                    onClick={() => setLightbox({ src: screenshotPath, alt: `${project.title} sanitized workflow screenshot` })}
                    aria-label={`View ${project.title} workflow screenshot`}
                  >
                    <img
                      src={screenshotPath}
                      alt=""
                      loading="lazy"
                      onError={() => setBrokenScreenshots((current) => ({ ...current, [project.title]: true }))}
                    />
                  </button>
                )}
                <p>{project.problem}</p>
                <div className="impact"><Zap size={16} />{project.impact}</div>
                <div className="architecture">
                  {project.architecture.map((step) => <span key={step}>{step}</span>)}
                </div>
                <div className="tag-row">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
                <ul>
                  {project.metrics.map((metric) => <li key={metric}><Check size={15} />{metric}</li>)}
                </ul>
                <small className="lesson">{project.lesson}</small>
              </article>
            );
          })}
        </div>
        <div className="inline-cta">
          <div>
            <strong>Want a system like these for your team?</strong>
            <span>AI agents, RAG knowledge systems, CRM automations, SOC triage, phishing simulations, and security response workflows.</span>
          </div>
          <a className="primary-btn" href="#contact" onClick={scrollToContact}>Request a build <ArrowRight size={18} /></a>
        </div>
      </section>

      {lightbox && (
        <div className="lightbox-backdrop" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close screenshot"><X size={20} /></button>
          <img src={lightbox.src} alt={lightbox.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      )}

      <RepoIntelligence query={search} />

      <WritingSection />

      <section id="experience" className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Experience timeline</p>
          <h2>AI leadership and SOC leadership, running in parallel.</h2>
          </div>
        </div>
        <div className="timeline">
          {experiences.map((item) => (
            <article key={`${item.company}-${item.role}`}>
              <span>{item.period}</span>
              <h3>{item.role}</h3>
              <strong>{item.company} · {item.location}</strong>
              <p>{item.focus}</p>
              <div>{item.wins.map((win) => <small key={win}>{win}</small>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section id="systems-lab" className="section lab-section">
        <div>
          <p className="eyebrow">Systems lab</p>
          <h2>Experimental AI and security systems with production intent.</h2>
          <p>Current lab themes: secure RAG, analyst copilots, LangGraph agents, EDR/XDR enrichment, SOAR playbooks, phishing simulation engines, LLM policy reasoning, workflow automation, and cloud-deployed services with measurable reliability.</p>
        </div>
        <div className="lab-grid">
          {["RAG security memory", "AI delivery leadership", "SOC team leadership", "EDR/XDR enrichment", "SOAR playbooks", "Phishing simulations", "Awareness automation", "Compliance automation"].map((item) => (
            <span key={item}><Sparkles size={16} />{item}</span>
          ))}
        </div>
      </section>

      <section id="certifications" className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Certifications</p>
            <h2>Security, automation, LLM security, and compliance signals.</h2>
          </div>
        </div>
        <div className="cert-grid">
          {certifications.map((cert) => (
            <article className="cert-card" key={cert.name}>
              <span>{cert.date}</span>
              <h3>{cert.name}</h3>
              <strong>{cert.issuer}</strong>
              <p>{cert.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section roadmap-section">
        <div>
          <p className="eyebrow">Roadmap</p>
          <h2>Where the portfolio can evolve next.</h2>
        </div>
        <div className="roadmap-list">{roadmap.map((item) => <p key={item}>{item}</p>)}</div>
      </section>

      <TestimonialsSection />

      <section id="contact" className="section contact-section">
        <div>
          <p className="eyebrow">Contact center</p>
          <h2>Build sharper AI systems and cyber defense with Maaz.</h2>
          <p>Best fit: AI Engineer, AI Security Engineer, Security Automation Engineer, SOC L3, GenAI Consultant, Full Stack AI Engineer, or founder-grade automation builder.</p>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`}><Mail size={18} />{profile.email}</a>
            <a href={`tel:${profile.phone.replaceAll(" ", "")}`}><Phone size={18} />{profile.phone}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><Link size={18} />LinkedIn</a>
            <a href={profile.github} target="_blank" rel="noreferrer"><GitBranch size={18} />GitHub</a>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleContactSubmit}>
          <input name="name" placeholder="Name" required />
          <input name="email" placeholder="Email" type="email" required />
          <textarea name="message" placeholder="Project, role, or collaboration details" rows={5} required />
          <button className="primary-btn" type="submit" disabled={contactStatus === "submitting"}>
            {contactStatus === "submitting" ? "Sending..." : <>Send brief <Mail size={18} /></>}
          </button>
          <a className="secondary-btn" href={`mailto:${profile.email}?subject=Consultation request`}><Calendar size={18} /> Book consultation</a>
          {contactStatus === "success" && <p className="form-status form-status-success">Thanks - your message was sent. I'll reply within a day.</p>}
          {contactStatus === "error" && <p className="form-status form-status-error">Something went wrong. Email {profile.email} directly instead.</p>}
        </form>
      </section>

      <button className="assistant-launcher" onClick={() => setAssistantOpen(true)} aria-label="Open service guide"><Bot size={22} /></button>
      <aside className="smart-hud" aria-label="Portfolio navigation status">
        <span>Current section</span>
        <strong>{sectionLabels[activeSection] ?? activeSection}</strong>
        <div><i style={{ width: `${scrollProgress}%` }} /></div>
      </aside>
      {assistantOpen && (
        <div className="assistant-panel" role="dialog" aria-label="Portfolio service guide">
          <div><strong>Service guide</strong><button onClick={() => setAssistantOpen(false)}>Close</button></div>
          <textarea value={assistantQuery} onChange={(event) => setAssistantQuery(event.target.value)} />
          <p>{assistantAnswer}</p>
        </div>
      )}

      {commandOpen && (
        <div className="command-backdrop" onClick={() => setCommandOpen(false)}>
          <div className="command-panel" onClick={(event) => event.stopPropagation()}>
            <div className="search-box"><Command size={18} /><input autoFocus placeholder="Jump to section or search projects" onChange={(event) => setSearch(event.target.value)} /></div>
            {navItems.map((item) => (
              <button key={item} onClick={() => { document.getElementById(item)?.scrollIntoView({ behavior: "smooth" }); setCommandOpen(false); }}>
                Go to {item.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
