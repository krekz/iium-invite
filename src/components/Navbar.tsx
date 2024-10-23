"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "./theme-switch";

export default () => {
	const [state, setState] = useState(false);

	const navigation = [
		{ title: "Discover", path: "/discover" },
		// { title: "Create Event", path: "/post" },
	];

	useEffect(() => {
		document.onclick = (e) => {
			const target = e.target as Element;
			if (!target.closest(".menu-btn")) setState(false);
		};
	}, []);

	return (
		<nav className="bg-background">
			<div className="max-w-screen-xl mx-auto px-4">
				<div className="flex justify-between items-center h-24">
					<div className="flex items-center">
						<Link href="/" className="flex items-center mr-6">
							<span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 animate-shimmer">EVENTURE</span>
						</Link>
						<div className="hidden sm:flex sm:items-center space-x-4">
							{navigation.map((item, idx) => (
								<Link
									key={idx}
									href={item.path}
									className="px-3 py-2 rounded-md text-sm font-light hover:opacity-70 transition duration-150 ease-in-out"
								>
									{item.title}
								</Link>
							))}
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
						<button
							disabled
							className="px-4 py-2 rounded-md text-sm font-medium opacity-50 cursor-not-allowed transition duration-150 ease-in-out"
						>
							Log in
						</button>
					</div>
					<div className="flex items-center sm:hidden">
						<button
							className="menu-btn inline-flex items-center justify-center p-2 rounded-md text-amber-600 hover:text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
							onClick={() => setState(!state)}
						>
							{state ? (
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
			</div>
			<div className={`sm:hidden ${state ? 'block' : 'hidden'}`}>
				<div className="px-2 pt-2 pb-3 space-y-1">
					{navigation.map((item, idx) => (
						<Link
							key={idx}
							href={item.path}
							className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-100 transition duration-150 ease-in-out"
						>
							{item.title}
						</Link>
					))}
					<Link
						href="/login"
						className="block px-3 py-2 rounded-md text-base font-medium text-amber-800 hover:text-amber-900 hover:bg-amber-100 transition duration-150 ease-in-out"
					>
						Log in
					</Link>
					<Link
						href="/signup"
						className="block px-3 py-2 rounded-md text-base font-medium text-white bg-amber-700 hover:bg-amber-800 transition duration-150 ease-in-out"
					>
						Sign up
					</Link>
					<div className="px-3 py-2">
						<ModeToggle />
					</div>
				</div>
			</div>
		</nav>
	);
};
