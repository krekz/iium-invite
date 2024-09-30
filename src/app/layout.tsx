import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip";


const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
	style: ["normal", "italic"],
});

export const metadata: Metadata = {
	title: "Eventure - Your one-stop event platform",
	description: "Eventure is a platform for students to discover and participate in events happening around their campus.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`bg-amber-950 text-white ${poppins.className}`}>
				<ReactQueryProvider>
					<Navbar />
					<TooltipProvider>
						{children}
					</TooltipProvider>
					<Toaster />
				</ReactQueryProvider>
			</body>
		</html>
	);
}
