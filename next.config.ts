import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: process.env.CLOUDFRONT_DOMAIN as string,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
    ], // ✅ 외부 이미지 허용 도메인
  },
};

export default nextConfig;
