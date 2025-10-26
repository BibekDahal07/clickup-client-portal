/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporary fix
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporary fix
  },
}

module.exports = nextConfig