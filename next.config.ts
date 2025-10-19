import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'clsx', 'tailwind-merge'],
    largePageDataBytes: 128 * 1000,
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  // Middleware configuration for authentication
  async redirects() {
    return [
      {
        source: '/signup',
        destination: '/cadastro',
        permanent: true,
      },
    ];
  },
  // Environment variables for analytics
  env: {
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_AW_ID: process.env.NEXT_PUBLIC_AW_ID,
    NEXT_PUBLIC_FB_PIXEL_ID: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    NEXT_PUBLIC_HOTJAR_ID: process.env.NEXT_PUBLIC_HOTJAR_ID,
  },
};

export default nextConfig;
