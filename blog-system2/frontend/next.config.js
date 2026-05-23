/** @type {import('next').NextConfig} */

const repoName = process.env.REPO_NAME || "tryal";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? `/${repoName}` : "",
  assetPrefix: isGitHubPages ? `/${repoName}/` : "",
  
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    unoptimized: true,
    domains: [
      "localhost",
      "127.0.0.1",
      "cdn.wuyilin18.top",
      "cdn.jsdelivr.net",
      "api.wuyilin18.top",
    ],
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 86400,
    formats: ["image/webp"],
  },

  webpack: (config, { isServer, dev }) => {
    config.plugins.push(
      new (require('webpack')).IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    return config;
  },
};

module.exports = nextConfig;
