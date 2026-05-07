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
