"use client";

import type { AuthUser } from "@/actions/authentication/auth";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";

function Sidebar({ user }: { user: AuthUser | undefined }) {
	const searchParams = useSearchParams();
	const currentOption = searchParams.get("option") || "informations";

	const handleOptionClick = (option: string) => {
		const params = new URLSearchParams(searchParams.toString());
		option
			? params.set("option", option.toLowerCase().replace(" ", "-"))
			: params.delete("option");
		history.pushState(null, "", `?${params.toString()}`);
	};

	return (
		<nav className="hidden md:flex w-full md:w-1/3 flex-col items-center md:items-start">
			<Image
				src={user?.imageURL || "/default-avatar.png"}
				alt="thumbnail"
				width={96}
				height={96}
				className="rounded-full size-24 object-cover"
			/>
			<p className="text-xl mt-1 font-medium text-center md:text-left">
				{user?.name}
			</p>
			<p className="text-sm font-thin text-center md:text-left">
				{user?.iiumEmail}
			</p>

			<div className="flex flex-col mt-10 text-md gap-1">
				<p
					onClick={() => handleOptionClick("informations")}
					className={`cursor-pointer hover:text-amber-800 ${currentOption === "informations" ? "text-amber-600 font-medium" : ""}`}
				>
					Account Information
				</p>
				<p
					onClick={() => handleOptionClick("posts")}
					className={`cursor-pointer hover:text-amber-800 ${currentOption === "posts" ? "text-amber-600 font-medium" : ""}`}
				>
					Posts
				</p>
				<p
					onClick={() => handleOptionClick("bookmarks")}
					className={`cursor-pointer hover:text-amber-800 ${currentOption === "bookmarks" ? "text-amber-600 font-medium" : ""}`}
				>
					Bookmarks
				</p>
			</div>
		</nav>
	);
}

export default Sidebar;
