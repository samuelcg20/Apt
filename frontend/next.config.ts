import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Disable ESLint errors from failing Vercel builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
