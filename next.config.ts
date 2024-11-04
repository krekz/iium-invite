import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_SUPABASE_URL!.slice(8), //slice to remove "https://" from env variable
            }
        ]
    }
};

export default nextConfig;
