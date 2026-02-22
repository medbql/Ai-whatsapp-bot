import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Make Turbopack treat the Next.js app directory as the root
    root: __dirname,
  },
};

export default nextConfig;
