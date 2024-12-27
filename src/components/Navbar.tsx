"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./theme-switch";
import { Button } from "./ui/button";
import { SignIn, SignOut } from "@/actions/login-signout";
import { LogOut, User, Home, Search, MoreHorizontal, Plus, Bookmark, Building2 } from "lucide-react";
import Marquee from 'react-fast-marquee'
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Sheet, SheetContent, SheetClose, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "./ui/sheet";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';


const MobileNavbar = ({ session }: { session: { user: string | undefined | null } }) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	if (!session.user) {
		return (
			<div className="fixed bottom-0 left-0 right-0 bg-background border-t sm:hidden">
				<div className="flex justify-around items-center h-14 px-4">
					<Link href="/" className={cn("flex flex-col items-center gap-0.5", {
						"text-amber-600": pathname === "/"
					})}>
						<Home className="h-5 w-5" />
						<span className="text-[10px]">Home</span>
					</Link>
					<Link href="/discover" className={cn("flex flex-col items-center gap-0.5", {
						"text-amber-600": pathname === "/discover"
					})}>
						<Search className="h-5 w-5" />
						<span className="text-[10px]">Discover</span>
					</Link>
					<Link href="/post" className={cn("flex flex-col items-center gap-0.5", {
						"text-amber-600": pathname === "/post"
					})}>
						<Plus className="h-5 w-5" />
						<span className="text-[10px]">Post</span>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-background border-t sm:hidden">
			<div className="flex justify-around items-center h-14 px-4">
				<Link href="/" className={cn("flex flex-col items-center gap-0.5", {
					"text-amber-600": pathname === "/"
				})}>
					<Home className="h-5 w-5" />
					<span className="text-[10px]">Home</span>
				</Link>
				<Link href="/discover" className={cn("flex flex-col items-center gap-0.5", {
					"text-amber-600": pathname === "/discover"
				})}>
					<Search className="h-5 w-5" />
					<span className="text-[10px]">Discover</span>
				</Link>
				<Link href="/post" className={cn("flex flex-col items-center gap-0.5", {
					"text-amber-600": pathname === "/post"
				})}>
					<Plus className="h-5 w-5" />
					<span className="text-[10px]">Post</span>
				</Link>
				<Sheet>
					<SheetTrigger asChild>
						<button className={cn("flex flex-col items-center gap-0.5", {
							"text-amber-600": pathname === "/account"
						})}>
							<MoreHorizontal className="h-5 w-5" />
							<span className="text-[10px]">More</span>
						</button>
					</SheetTrigger>
					<SheetContent side="bottom" className="h-[50vh] p-2">
						<SheetHeader>
							<SheetTitle>Menu</SheetTitle>
							<SheetDescription>
								Access additional options and settings
							</SheetDescription>
						</SheetHeader>
						<div className="flex flex-col gap-4 mt-4">
							<SheetClose asChild>
								<Link href="/account" className={cn("flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md", {
									"text-amber-600": pathname === "/account" && !searchParams.get("option")
								})}>
									<User size={16} />
									<span>Account Settings</span>
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link href="/account?option=posts" className={cn("flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md", {
									"text-amber-600": pathname === "/account" && searchParams.get("option") === "posts"
								})}>
									<Plus size={16} />
									<span>My Posts</span>
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link href="/account?option=bookmarks" className={cn("flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md", {
									"text-amber-600": pathname === "/account" && searchParams.get("option") === "bookmarks"
								})}>
									<Bookmark size={16} />
									<span>Bookmarks</span>
								</Link>
							</SheetClose>
							<div className="h-[1px] bg-border my-2" />
							<button
								onClick={async () => await SignOut({ redirectTo: "/" })}
								className="flex items-center gap-2 px-4 py-2 hover:bg-destructive hover:text-destructive-foreground rounded-md text-left text-destructive"
							>
								<LogOut size={16} />
								<span>Sign Out</span>
							</button>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
};

export default ({ session }: { session: { user: string | undefined | null } }) => {
	const navigation = [
		{ title: "Discover", path: "/discover" },
	];

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

	const NavigationLinks = () => {
		return (
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Discover</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid gap-3 gap-y-0 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
								<li className="row-span-4">
									<NavigationMenuLink asChild>
										<Link
											className="hover:opacity-80 from-muted/50 to-muted flex size-full select-none flex-col justify-center rounded-md bg-gradient-to-b p-3 no-underline outline-none focus:shadow-md"
											href="/discover"
										>
											<Building2 className="self-center size-32 text-muted-foreground " />
											<div className="mb-2 mt-4 text-md font-medium">Explore All Events</div>
											<p className="text-muted-foreground text-sm leading-tight">
												Find events happening in all IIUM campuses.
											</p>
										</Link>
									</NavigationMenuLink>
								</li>
								<ListItem href="/discover/gombak" title="Gombak">
									Main campus of IIUM
								</ListItem>
								<ListItem href="/discover/kuantan" title="Kuantan">
									Health and Science campus.
								</ListItem>
								<ListItem href="/discover/pagoh" title="Pagoh">
									Language and management campus.
								</ListItem>
								<ListItem href="/discover/gambang" title="Gambang">
									CFS campus for foundation studies.
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>


				</NavigationMenuList>
			</NavigationMenu>
		);
	};

	const ListItem = React.forwardRef<
		React.ElementRef<'a'>,
		React.ComponentPropsWithoutRef<'a'>
	>(({ className, title, children, ...props }, ref) => {
		return (
			<li className="">
				<NavigationMenuLink asChild>
					<Link
						className={cn(
							'h-full w-full hover:bg-accent hover:text-accent-foreground focus:bg-accent p-2 focus:text-accent-foreground block select-none space-y-1 rounded-md leading-none no-underline outline-none transition-colors',
							className,
						)}
						href={props.href!}
						ref={ref}

						{...props}
					>
						<div className="text-md font-medium leading-none">{title}</div>
						<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
							{children}
						</p>
					</Link>
				</NavigationMenuLink>
			</li>
		)
	})
	ListItem.displayName = 'ListItem'

	return (
		<div className="sticky top-0 z-50">
			<div className="bg-amber-700 text-white overflow-hidden whitespace-nowrap">
				<div className="inline-block w-full">
					<Marquee className="inline-block py-1 px-4">BETA ACCESS • BETA ACCESS • BETA ACCESS • BETA ACCESS • BETA ACCESS • BETA ACCESS • BETA ACCESS • BETA ACCESS • BETA ACCESS • BETA ACCESS • BETA ACCESS • BETA ACCESS • BETA ACCESS </Marquee>
				</div>
			</div>
			<nav className="bg-background">
				<div className="max-w-screen-xl mx-auto px-4">
					<div className="flex justify-between items-center h-24">
						<div className="flex items-center">
							<a href="/" className="flex items-center mr-6">
								<Image alt="logo" src="/eventure-logo.png" width={100} height={100} />
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
			<MobileNavbar session={session} />
		</div>
	);
};
