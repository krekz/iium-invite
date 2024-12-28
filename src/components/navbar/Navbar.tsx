"use client";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../theme-switch";
import { Button } from "../ui/button";
import { SignIn, SignOut } from "@/actions/login-signout";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import MobileNavbar from "./MobileNavbar";
import NavigationLinks from "./NavigationLinks";

export default ({ session }: { session: { user: string | undefined | null } }) => {
	const AuthButtons = ({ isMobile = false }: { isMobile?: boolean }) => {
		const buttonClass = isMobile ? "w-full justify-center" : "";

		return !session.user ? (
			<Button
				onClick={async () => await SignIn()}
				className={buttonClass}
				variant={"link"}
			>
				Sign in
			</Button>
		) : (
			<div className="hidden sm:block">
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
								onClick={async () => await SignOut({ redirectTo: "/" })}
								className="px-2 py-2 text-sm hover:bg-red-500 hover:text-black rounded-md transition-colors text-left flex items-center gap-2"
							>
								<LogOut size={16} />
								<span>Sign Out</span>
							</button>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		);
	};


	return (
		<div className="sm:sticky sm:top-0 z-50">
			{/* Top Navbar */}
			<nav className="bg-background">
				<div className="max-w-screen-xl mx-auto px-4">
					<div className="flex justify-between items-center h-24">
						<div className="flex items-center">
							<a href="/" className="flex items-center mr-6">
								<Image alt="logo" quality={50} priority src="/eventure-logo.png" width={100} height={100} />
							</a>
							<div className="hidden sm:flex sm:items-center space-x-4">
								<NavigationLinks />
								<ModeToggle />
							</div>
						</div>
						<div className="hidden sm:flex sm:items-center space-x-4">
							<Link
								href="/post"
								className="px-4 py-4 rounded-full w-32 text-center text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 transition duration-150 ease-in-out"
							>
								Post
							</Link>
							<AuthButtons />
						</div>
						<div className="sm:hidden flex items-center gap-4">
							<ModeToggle />
							{!session.user && <AuthButtons />}
						</div>
					</div>
				</div>
			</nav>
			{/* Bottom navbar for Mobile only */}
			<MobileNavbar session={session} />
		</div>
	);
};
