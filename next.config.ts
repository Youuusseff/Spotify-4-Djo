import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "ybhsvnshukhekbulfrdb.supabase.co"
    ]
  },
  experimental: {
    workerThreads: false,
    cpus: 1
  }
};

export default nextConfig;
