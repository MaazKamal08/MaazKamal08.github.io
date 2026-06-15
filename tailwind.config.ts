import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-geist-mono)", "SFMono-Regular", "Consolas", "monospace"]
      },
      colors: {
        ink: "#081111",
        panel: "#0d1716",
        line: "rgba(210, 255, 239, 0.16)",
        mint: "#6fffd2",
        amber: "#f6c76e",
        coral: "#ff7f6e",
        sky: "#88c8ff"
      },
      boxShadow: {
        glow: "0 0 36px rgba(111, 255, 210, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
