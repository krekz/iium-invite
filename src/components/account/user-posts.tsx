"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface UserPost {
	id: string;
	title: string;
	organizer: string;
	location: string;
	poster_url: string[];
	isActive: string;
}

function UserPosts() {
	const { data: posts, isLoading } = useQuery<UserPost[]>({
		queryKey: ["user-posts"],
		queryFn: async () => {
			const res = await fetch("/api/user/posts");
			if (!res.ok) {
				throw new Error("Failed to fetch posts");
			}
			return res.json();
		},
	});
	return (
		<>
			{isLoading ? (
				<div className="flex justify-center">
					<div className="text-center">
						<div
							className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-100 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
							role="status"
						>
							<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
								Loading...
							</span>
						</div>
						<p className="mt-4 text-lg font-semibold">Loading posts...</p>
					</div>
				</div>
			) : !posts || posts.length === 0 ? (
				<div className="flex justify-center items-center min-h-[200px]">
					<div className="text-center">
						<p className="text-lg font-semibold text-gray-500">No posts yet</p>
						<p className="text-sm text-gray-400">
							Create your first event to see it here
						</p>
					</div>
				</div>
			) : (
				<div className="grid md:grid-cols-3 grid-cols-2 w-full gap-x-2 gap-y-4">
					{posts.map((post) => (
						<Link
							href={`/events/${post.id}`}
							key={post.title}
							className={!post.isActive ? "opacity-50" : ""}
						>
							<div className="aspect-square w-full relative overflow-hidden rounded-lg">
								<Image
									src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bucket-v1/${post.poster_url[0]}`}
									alt={post.title}
									fill
									quality={60}
									priority
									sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
									className={`overflow-hidden hover:scale-105 transition-all duration-700 ${!post.isActive}? 'grayscale' : ''}`}
								/>
								{!post.isActive && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/30">
										<span className="text-white font-semibold px-3 py-1 rounded-full bg-black/50">
											Expired
										</span>
									</div>
								)}
							</div>
							<p className="font-semibold">{post.title}</p>
						</Link>
					))}
				</div>
			)}
		</>
	);
}

export default UserPosts;
