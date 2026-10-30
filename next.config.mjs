const nextConfig = {
  images: {
    remotePatterns: [new URL('https://placehold.co/**'), new URL('https://t4.ftcdn.net/**')]
  },
  async rewrites() {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333').replace(/\/+$/, '')
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`
      }
    ]
  }
}

export default nextConfig
