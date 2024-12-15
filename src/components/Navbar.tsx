"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "./theme-switch";
import { Button } from "./ui/button";
import { SignIn } from "@/actions/login-signout";
import { User } from "lucide-react";
import Marquee from 'react-fast-marquee'
import Image from "next/image";

export default ({ session }: { session: { user: string | undefined | null } }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

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
			<Link
				href="/account"
				className={`rounded-full size-12 bg-transparent flex items-center justify-center ${buttonClass}`}
			>
				<User className="size-6" />
			</Link>
		);
	};

	const NavigationLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
		const linkClass = isMobile
			? "block px-3 py-2 rounded-md text-base font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-100"
			: "px-3 py-2 rounded-md text-sm font-light hover:opacity-70";

		return navigation.map((item, idx) => (
			<Link
				key={idx}
				href={item.path}
				className={`${linkClass} transition duration-150 ease-in-out`}
			>
				{item.title}
			</Link>
		));
	};

	useEffect(() => {
		document.onclick = (e) => {
			const target = e.target as Element;
			if (!target.closest(".menu-btn")) setIsMenuOpen(false);
		};
	}, []);

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
							<Link href="/" className="flex items-center mr-6">
								<Image alt="logo" src="/eventure-logo.png" width={100} height={100} />
							</Link>
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
						<button
							className="menu-btn sm:hidden inline-flex items-center justify-center p-2 rounded-md text-amber-600 hover:text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? (
								<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							) : (
								<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
								</svg>
							)}
						</button>
					</div>
				</div>
				<div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
					<div className="px-2 pt-2 pb-3 space-y-1">
						<NavigationLinks isMobile />
						<div className="px-3 py-2">
							<Link
								href="/post"
								className="block w-full px-4 py-4 rounded-full text-center text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 transition duration-150 ease-in-out"
							>
								Post
							</Link>
						</div>
						<div className="px-3 py-2">
							<AuthButtons isMobile />
						</div>
						<div className="px-3 py-2">
							<ModeToggle />
						</div>
					</div>
				</div>
			</nav>
		</div>
	);
};
