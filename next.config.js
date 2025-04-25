/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
    // Next 13+
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",          // or "/**" to cover all paths
      },
    ],
    // Next 12 and earlier:
    // domains: ["avatars.githubusercontent.com"],
  },
}

module.exports = nextConfig
