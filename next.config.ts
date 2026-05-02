import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['sanity', 'next-sanity'],
  async redirects() {
    return [
      // Canonicalise to www — ensures martinarink.com always redirects to www.martinarink.com
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'martinarink.com' }],
        destination: 'https://www.martinarink.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
