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
      "xrbqgdlmzlftnsjslcww.supabase.co"
    ]
  },
  experimental: {
    workerThreads: false,
  }
};

export default nextConfig;
