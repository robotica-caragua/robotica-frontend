const nextConfig = {
  images: {
    remotePatterns: [
      new URL('https://placehold.co/**'),
      new URL('https://t4.ftcdn.net/**'),
      new URL('https://res.cloudinary.com/**'),
      new URL('http://localhost:3333/**')
    ]
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
