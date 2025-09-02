import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Allow production builds even if there are ESLint errors (agents will lint separately)
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Fail the build on type errors to ensure quality
    ignoreBuildErrors: false,
  },
}

export default nextConfig

