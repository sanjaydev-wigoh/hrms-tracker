import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // 👇 Add your tunnel URL here (change if your tunnel URL changes)
    // allowedDevOrigins: ["https://major-dancers-heal.loca.lt"], // Removed due to type incompatibility
  },
};

module.exports = {
  webpack: (config: { cache: boolean; }) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
