import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import PasswordProtection from "@/components/temporary-auth/PasswordProtection";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryProvider from "@/lib/context/ReactQueryProvider";
import { SessionProvider } from "@/lib/context/SessionProvider";

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
	style: ["normal", "italic"],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
						<SessionProvider>
							<ReactQueryProvider>
								<TooltipProvider>{children}</TooltipProvider>
							</ReactQueryProvider>
						</SessionProvider>
					</PasswordProtection>
				</ThemeProvider>
			</body>
		</html>
	);
}
