import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main>
			<SidebarProvider>
				<AppSidebar />
				<main className="w-full md:container pt-6 sm:pt-0">
					<TooltipProvider>{children}</TooltipProvider>
				</main>
			</SidebarProvider>
		</main>
	);
}
