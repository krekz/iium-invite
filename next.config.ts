import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname:
					process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(8) ??
					"https://supabase.com", //slice to remove "https://" from env variable
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "smartcard.iium.edu.my",
			},
		],
	},
};

export default nextConfig;
