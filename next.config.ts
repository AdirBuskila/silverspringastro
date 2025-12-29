import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from Supabase storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'mlwhoofvipgwnmiiaatw.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Configure image quality options used in the app
    qualities: [75, 85, 90, 95],
  },
};

export default nextConfig;
