/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/auth/google/callback",
        destination: "/google-callback",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3003/:path*",
      },
    ];
  },
  images: {
    domains: ["trimio-barbershop-images.s3.eu-west-1.amazonaws.com"],
  },
};

export default nextConfig;
