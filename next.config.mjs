const isGithubPages = process.env.GITHUB_PAGES === "true";
const repository = process.env.NEXT_PUBLIC_REPOSITORY_NAME || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: isGithubPages && repository ? `/${repository}` : "",
  assetPrefix: isGithubPages && repository ? `/${repository}/` : ""
};

export default nextConfig;
