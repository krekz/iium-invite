import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { getAuth as cachedAuth } from "@/auth";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import PasswordProtection from "@/components/temporary-auth/PasswordProtection";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryProvider from "@/lib/context/ReactQueryProvider";
import NextSessionProvider from "@/lib/context/SessionProvider";

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
	style: ["normal", "italic"],
});

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
	const session = await cachedAuth();
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${poppins.className}`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<Toaster />
					<PasswordProtection>
						<ReactQueryProvider>
							<NextSessionProvider session={session}>
								<main className="w-full md:container">
									<Navbar session={{ user: session?.user?.name }} />
									<TooltipProvider>{children}</TooltipProvider>
								</main>
							</NextSessionProvider>
						</ReactQueryProvider>
					</PasswordProtection>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
