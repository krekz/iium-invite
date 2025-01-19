import { auth } from "@/actions/authentication/auth";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const bookmarks = await unstable_cache(
			async () =>
				await prisma.bookmark.findMany({
					where: {
						userId: session.user.id,
						event: {
							id: { not: undefined },
							isActive: true,
						},
					},
					select: {
						event: {
							select: {
								id: true,
								title: true,
								poster_url: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				}),
			["user-bookmarks", session.user?.id],
			{
				revalidate: 60 * 60, // 1 hour
				tags: ["events", "user-bookmarks"],
			},
		)();

		return NextResponse.json(bookmarks);
	} catch (error) {
		console.error("Fetch bookmarks error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
