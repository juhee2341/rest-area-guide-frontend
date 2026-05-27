import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.ex.co.kr" },
    ],
  },
};

export default nextConfig;
