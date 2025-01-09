import { auth } from "@/actions/authentication/auth";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "EVENTURE - Your one-stop event platform",
	description:
		"EVENTURE is a platform for students to discover and participate in events happening around their campus.",
	icons: [
		{
			rel: "icon",
			type: "image/png",
			sizes: "32x32",
			url: "favicon-32x32.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "16x16",
			url: "favicon-16x16.png",
		},
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			url: "apple-touch-icon.png",
		},
	],
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await auth();
	return (
		<>
			<Navbar session={{ user: user?.user.name }} />
			<main className="w-full md:container pt-6 sm:pt-0">{children}</main>
			<Footer />
		</>
	);
}
