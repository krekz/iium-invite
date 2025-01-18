"use server";

import { auth } from "@/actions/authentication/auth";
import { fixedCategories } from "@/lib/constant";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

type SearchParams = {
	q?: string;
	category?: string;
	campus?: string;
	fee?: string;
	has_starpoints?: string;
	recruitment?: string;
};

export const getEventHomepage = unstable_cache(
	async () => {
		return prisma.event.findMany({
			where: {
				isActive: true,
			},
			take: 15,
			select: {
				id: true,
				title: true,
				date: true,
				poster_url: true,
				location: true,
				categories: true,
				has_starpoints: true,
			},
			orderBy: {
				date: "asc",
			},
		});
	},
	["events-homepage"],
	{
		revalidate: 60 * 60,
		tags: ["events", "events-homepage"],
	},
);

export const getEventDetails = unstable_cache(
	async (slug: string, userId?: string) => {
		return await prisma.event.findUnique({
			where: {
				id: slug,
				OR: [{ isActive: true }, { authorId: userId }],
			},
			select: {
				Author: {
					select: { name: true },
				},
				id: true,
				title: true,
				description: true,
				poster_url: true,
				campus: true,
				organizer: true,
				date: true,
				location: true,
				createdAt: true,
				registration_link: true,
				fee: true,
				has_starpoints: true,
				categories: true,
				contacts: true,
				isRecruiting: true,
				bookmarks: {
					where: { userId: userId },
					select: { userId: true },
				},
				isActive: true,
				reports: {
					where: {
						AND: [{ reportedBy: "AI" }, { status: "pending" }],
					},
					select: {
						type: true,
					},
				},
			},
		});
	},
	["event-data"],
	{
		revalidate: 3600,
		tags: ["event-details", "events"],
	},
);

function getCategorySubsets(categoryName: string): string[] {
	const category = fixedCategories.find(
		(c) => c.category.toLowerCase() === categoryName.toLowerCase(),
	);
	return category
		? [
				...category.subsets.map((subset) => subset.toLowerCase()),
				category.category.toLowerCase(),
			]
		: [categoryName.toLowerCase()];
}

export async function getDiscoverEvents(searchParams?: SearchParams) {
	const searchQuery = searchParams?.q?.trim() || undefined;
	const categories =
		searchParams?.category?.toLowerCase().split(",").filter(Boolean) || [];
	const campus = searchParams?.campus?.toLowerCase();
	const fee = searchParams?.fee;
	const has_starpoints = searchParams?.has_starpoints === "true";
	const isRecruiting = searchParams?.recruitment === "true";
	const session = await auth();
	const getCachedEvents = unstable_cache(
		async () => {
			try {
				const events = await prisma.event.findMany({
					where: {
						isActive: true,
						AND: [
							searchQuery
								? {
										OR: [
											{ title: { contains: searchQuery, mode: "insensitive" } },
											{
												description: {
													contains: searchQuery,
													mode: "insensitive",
												},
											},
											{
												organizer: {
													contains: searchQuery,
													mode: "insensitive",
												},
											},
											{
												location: {
													contains: searchQuery,
													mode: "insensitive",
												},
											},
											{ categories: { hasSome: [searchQuery.toLowerCase()] } },
										],
										NOT: {
											AND: [
												{
													title: {
														not: { contains: searchQuery },
														mode: "insensitive",
													},
												},
												{
													description: {
														not: { contains: searchQuery },
														mode: "insensitive",
													},
												},
												{
													organizer: {
														not: { contains: searchQuery },
														mode: "insensitive",
													},
												},
												{
													location: {
														not: { contains: searchQuery },
														mode: "insensitive",
													},
												},
											],
										},
									}
								: {},
							categories.length > 0
								? {
										OR: categories.map((category) => ({
											categories: {
												hasSome: getCategorySubsets(category), // e.g sports category -> [friendly, gaming, tournament, etc]
											},
										})),
									}
								: {},
							campus
								? {
										campus: {
											equals: campus === "all" ? undefined : campus,
											mode: "insensitive",
										},
									}
								: {},
							fee
								? {
										fee: fee === "0" ? "0" : { gt: "0" },
									}
								: {},
							has_starpoints
								? {
										has_starpoints: true,
									}
								: {},
							isRecruiting
								? {
										isRecruiting: true,
									}
								: {},
						],
					},
					orderBy: [
						{ title: "asc" },
						{ description: "asc" },
						{ categories: "asc" },
						{ location: "asc" },
						{ organizer: "asc" },
					],
					select: {
						id: true,
						title: true,
						organizer: true,
						location: true,
						categories: true,
						date: true,
						poster_url: true,
						has_starpoints: true,
						isRecruiting: true,
						description: true,
						bookmarks: {
							select: {
								userId: true,
							},
							where: {
								userId: session?.user?.id,
							},
						},
					},
				});
				return events;
			} catch (error) {
				console.error("Error fetching events:", error);
				return [];
			}
		},
		[
			"events-list",
			searchQuery || "",
			categories.join(",") || "",
			campus || "",
			fee || "",
			has_starpoints.toString(),
			isRecruiting.toString(),
		],
		{
			revalidate: 60 * 60,
			tags: ["events-discover", "events"],
		},
	);

	return getCachedEvents();
}
