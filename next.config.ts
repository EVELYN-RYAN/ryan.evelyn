import type { NextConfig } from "next";
import path from "node:path";

// Separate Vercel deployment of the secret-santa repo (multi-zones), served under /secret-santa.
const secretSantaUrl = process.env.SECRET_SANTA_URL;

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    if (!secretSantaUrl) return [];
    return [
      { source: "/secret-santa", destination: `${secretSantaUrl}/secret-santa` },
      { source: "/secret-santa/:path+", destination: `${secretSantaUrl}/secret-santa/:path+` },
    ];
  },
};

export default nextConfig;
