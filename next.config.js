/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/tmp/:path*',
        destination: '/api/serve-image/:path*',
      },
    ];
  },
}

module.exports = nextConfig