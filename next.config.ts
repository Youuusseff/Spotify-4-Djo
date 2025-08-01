import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "ybhsvnshukhekbulfrdb.supabase.co"
    ]
  },
  experimental: {
    workerThreads: false,
  }
};

export default nextConfig;
