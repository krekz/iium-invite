import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider"
import PasswordProtection from "@/components/temporary-auth/PasswordProtection";
import Footer from "@/components/Footer";


const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
	style: ["normal", "italic"],
});

export const metadata: Metadata = {
	title: "EVENTURE - Your one-stop event platform",
	description: "EVENTURE is a platform for students to discover and participate in events happening around their campus.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
							<Navbar />
							<TooltipProvider>
								{children}
							</TooltipProvider>
						</ReactQueryProvider>
					</PasswordProtection>
					<Footer />
				</ThemeProvider>

			</body>
		</html>
	);
}
