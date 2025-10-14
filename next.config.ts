import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config) {
    // --- Existing SVG loader ---
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // --- Safely ignore documentation folder ---
    const existingIgnored =
      Array.isArray(config.watchOptions?.ignored) ? config.watchOptions.ignored : [];

    config.watchOptions = {
      ...(config.watchOptions || {}),
      ignored: [
        ...existingIgnored,
        path.resolve(__dirname, "documentation"),
      ],
    };

    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
