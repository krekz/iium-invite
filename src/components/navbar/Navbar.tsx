"use client";
import { logoutIIUM } from "@/actions/authentication/logout";
import LoginDialog from "@/components/LoginDialog";
import { ModeToggle } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import MobileNavbar from "./MobileNavbar";
import NavigationLinks from "./NavigationLinks";

export default ({
	session,
}: { session: { user: string | undefined | null } }) => {
	const isMobile = useIsMobile();
	const { theme } = useTheme();
	const AuthButtons = ({ isMobile = false }: { isMobile?: boolean }) => {
		const buttonClass = isMobile ? "w-full justify-center" : "";

		return !session.user ? (
			<LoginDialog>
				<Button variant="link" className="font-medium text-lg">
					Sign in
				</Button>
			</LoginDialog>
		) : (
			!isMobile && (
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							className={`rounded-full size-12 bg-transparent flex items-center justify-center ${buttonClass} p-0 hover:bg-accent`}
						>
							<User className="size-6" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-48 p-2" align="end">
						<div className="flex flex-col space-y-1">
							<Link
								href="/account"
								className="px-2 py-2 text-sm hover:bg-accent rounded-md transition-colors flex items-center gap-2"
							>
								<User size={16} />
								<span>Account Settings</span>
							</Link>
							<div className="h-[1px] bg-border my-1" />
							<button
								type="button"
								onClick={async () => {
									await logoutIIUM();
									window.location.href = "/discover";
								}}
								className="px-2 py-2 text-sm hover:bg-red-500 hover:text-black rounded-md transition-colors text-left flex items-center gap-2"
							>
								<LogOut size={16} />
								<span>Sign Out</span>
							</button>
						</div>
					</PopoverContent>
				</Popover>
			)
		);
	};

	return (
		<>
			{/* Top Navbar */}
			{!isMobile && (
				<nav className="bg-background sm:block sm:sticky sm:top-0 z-50">
					<div className="max-w-screen-xl mx-auto px-4">
						<div className="flex justify-between items-center h-24">
							<div className="flex items-center">
								<a href="/" className="flex items-center mr-6">
									<Image
										alt="logo"
										quality={50}
										priority
										src={
											theme === "dark"
												? "/eventure-light.png"
												: "/eventure-dark.png"
										}
										width={100}
										height={100}
									/>
								</a>
								<div className="flex items-center space-x-4">
									<NavigationLinks />
									<ModeToggle />
								</div>
							</div>
							{!isMobile && <AuthButtons />}
						</div>
					</div>
				</nav>
			)}
			{/* Bottom navbar for Mobile only */}
			<MobileNavbar session={session} />
		</>
	);
};
