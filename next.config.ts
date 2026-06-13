// cache-bust: 2026-06-13
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ['sanity', 'next-sanity'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],   // AVIF first, WebP fallback (CLAUDE.md mandate)
    qualities: [80, 90],                       // Next 16: allowlist the non-default qualities in use
    minimumCacheTTL: 2678400,                  // 31 days — cache optimised variants longer
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
  },
  async redirects() {
    return [
      // Canonicalise to apex — www.martinarink.com always redirects to martinarink.com
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.martinarink.com' }],
        destination: 'https://martinarink.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
