import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Netlify's serverless Next.js Runtime times out trying to fetch and
    // resize remote images (from Supabase Storage) through the built-in
    // /_next/image optimizer, causing every menu photo to fail with a 500.
    // Serving images directly (unoptimized) avoids that server-side step
    // entirely - Supabase already serves them via its own CDN.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coresg-normal.trae.ai",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
