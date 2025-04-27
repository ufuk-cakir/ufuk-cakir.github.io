/** @type {import('next').NextConfig} */
const nextConfig = {
swcMinify: true,
  reactStrictMode: true,
  images: {
domains: ["avatars.githubusercontent.com", "images.unsplash.com"],
    // Next 13+
    remotePatterns: [
{
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**", // Allow any path on this host
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // Allow any path on this host
      },
    ],
    // Next 12 and earlier:
    // domains: ["avatars.githubusercontent.com"],
  },
}

module.exports = nextConfig
