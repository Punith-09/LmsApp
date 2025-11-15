import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // keep this if you want
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
