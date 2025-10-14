import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.pinimg.com"],
  },
   eslint: {
    // ❌ Bỏ qua lỗi/warning ESLint khi chạy `next build`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
