"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer() {
	const { theme } = useTheme();
	return (
		<footer className="bg- brightness-125 shadow pb-16 sm:pb-0">
			<div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
				<div className="sm:flex sm:items-center sm:justify-between">
					<Link href="/" className="flex items-center mr-6">
						{/* <Image
							alt="logo"
							src={
								theme === "dark" ? "/eventure-light.png" : "/eventure-dark.png"
							}
							width={100}
							quality={50}
							height={100}
						/> */}
					</Link>
					<ul className="flex flex-wrap items-center mb-6 text-sm font-medium">
						<li>
							<Link href="#" className="hover:underline me-4 md:me-6">
								About
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:underline me-4 md:me-6">
								Privacy Policy
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:underline me-4 md:me-6">
								Licensing
							</Link>
						</li>
						<li>
							<Link href="#" className="hover:underline">
								Contact
							</Link>
						</li>
					</ul>
				</div>
				<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
				<span className="block text-sm sm:text-center">
					© {new Date().getFullYear()}{" "}
					<Link href="/" className="hover:underline">
						Eventure
					</Link>
					. All Rights Reserved.
				</span>
			</div>
		</footer>
	);
}
export default Footer;
