import { Poppins } from "next/font/google";
import "../../globals.css";
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

export default async function DashboardLayout({
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
						<SessionProvider>
							<ReactQueryProvider>
								<main className="w-full md:container pt-6 sm:pt-0">
									<TooltipProvider>{children}</TooltipProvider>
								</main>
							</ReactQueryProvider>
						</SessionProvider>
					</PasswordProtection>
				</ThemeProvider>
			</body>
		</html>
	);
}
