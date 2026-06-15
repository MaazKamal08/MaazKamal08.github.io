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

export const fallbackRepos: RepoSnapshot[] = [
  { name: "n8n-cve-daily-reporter-1gcs7", description: "Automates fetching, filtering, and emailing daily vulnerability reports.", fork: false, language: null, size: 7, stargazers_count: 0, forks_count: 0, open_issues_count: 0, pushed_at: "2026-05-26T00:00:00Z", html_url: "https://github.com/MaazKamal08/n8n-cve-daily-reporter-1gcs7" },
  { name: "n8n-email-ip-virustotal-jira-automation-1g9pn", description: "Extracts IPs from security emails, scans with VirusTotal, and routes into Jira.", fork: false, language: null, size: 5, stargazers_count: 0, forks_count: 0, open_issues_count: 0, pushed_at: "2026-05-26T00:00:00Z", html_url: "https://github.com/MaazKamal08/n8n-email-ip-virustotal-jira-automation-1g9pn" },
  { name: "n8n-wazuh-ip-blocker-1q6od", description: "Automatically blocks malicious IPs from Wazuh alerts on pfSense.", fork: false, language: null, size: 6, stargazers_count: 0, forks_count: 0, open_issues_count: 0, pushed_at: "2026-05-25T00:00:00Z", html_url: "https://github.com/MaazKamal08/n8n-wazuh-ip-blocker-1q6od" },
  { name: "sophos-xg-block-wan-ip-18pvo", description: "Automates blocking specified IP addresses on Sophos XG firewall.", fork: false, language: null, size: 4, stargazers_count: 0, forks_count: 0, open_issues_count: 0, pushed_at: "2026-05-25T00:00:00Z", html_url: "https://github.com/MaazKamal08/sophos-xg-block-wan-ip-18pvo" },
  { name: "apk-static-analysis-keenu-1j4iq", description: "Automated static analysis for Android APKs identifying security issues.", fork: false, language: null, size: 5, stargazers_count: 0, forks_count: 0, open_issues_count: 0, pushed_at: "2026-05-24T00:00:00Z", html_url: "https://github.com/MaazKamal08/apk-static-analysis-keenu-1j4iq" },
  { name: "tls-version-scanner-auto-loop-1h8kr", description: "Automates scanning IP addresses for TLS versions.", fork: false, language: null, size: 3, stargazers_count: 0, forks_count: 0, open_issues_count: 0, pushed_at: "2026-05-24T00:00:00Z", html_url: "https://github.com/MaazKamal08/tls-version-scanner-auto-loop-1h8kr" },
  { name: "Ai-agent-with-google-drive-", description: "Agent retrieves data from Google Drive and answers user questions.", fork: false, language: null, size: 8, stargazers_count: 0, forks_count: 0, open_issues_count: 0, pushed_at: "2025-05-30T00:00:00Z", html_url: "https://github.com/MaazKamal08/Ai-agent-with-google-drive-" },
  { name: "automated-bulk-Product-meta-title-and-description-update-", description: "Agent workflow fetches product metadata and updates descriptions.", fork: false, language: null, size: 8, stargazers_count: 0, forks_count: 0, open_issues_count: 0, pushed_at: "2025-05-30T00:00:00Z", html_url: "https://github.com/MaazKamal08/automated-bulk-Product-meta-title-and-description-update-" },
  { name: "wazuh-whatsapp-integration.", description: "Wazuh integration with WhatsApp.", fork: false, language: null, size: 0, stargazers_count: 0, forks_count: 0, open_issues_count: 0, pushed_at: "2025-05-29T19:28:54Z", html_url: "https://github.com/MaazKamal08/wazuh-whatsapp-integration." },
  { name: "generative-ai-for-beginners", description: "Fork of Microsoft generative AI learning material.", fork: true, language: null, size: 131425, stargazers_count: 0, forks_count: 0, open_issues_count: 0, pushed_at: "2025-05-12T03:57:34Z", html_url: "https://github.com/MaazKamal08/generative-ai-for-beginners" }
];
