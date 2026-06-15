import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maazkamal08.github.io"),
  title: {
    default: "Muhammad Maaz Kamal - AI Security Engineer",
    template: "%s | Muhammad Maaz Kamal"
  },
  description:
    "AI Security Engineer, SOC L3 analyst, GenAI automation specialist, and cybersecurity consultant building AI-native cyber defense systems.",
  keywords: [
    "AI Engineer",
    "Cybersecurity Engineer",
    "SOC Analyst",
    "Full Stack AI Engineer",
    "GenAI Engineer",
    "Agentic AI Engineer",
    "Security Automation",
    "n8n",
    "Wazuh",
    "LangChain"
  ],
  authors: [{ name: "Muhammad Maaz Kamal", url: "https://github.com/MaazKamal08" }],
  creator: "Muhammad Maaz Kamal",
  openGraph: {
    type: "website",
    url: "https://maazkamal08.github.io",
    title: "Muhammad Maaz Kamal - AI Security Engineer",
    description:
      "Portfolio for an AI Security Engineer blending SOC leadership, agentic AI, automation, and cloud-native product engineering.",
    siteName: "Muhammad Maaz Kamal Portfolio"
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Maaz Kamal - AI Security Engineer",
    description: "AI-native cyber defense, SOC automation, RAG, agents, and production n8n systems."
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
  themeColor: "#081111"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Muhammad Maaz Kamal",
    jobTitle: "AI Security Engineer",
    email: "mailto:muhammadmaazkamal@gmail.com",
    telephone: "+923363119749",
    url: "https://maazkamal08.github.io",
    sameAs: ["https://github.com/MaazKamal08", "https://www.linkedin.com/in/mmaazkamal"],
    knowsAbout: [
      "AI Engineering",
      "Cybersecurity",
      "SOC Operations",
      "Security Automation",
      "RAG",
      "Agentic AI",
      "n8n",
      "Wazuh"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
