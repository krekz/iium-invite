import { auth } from "@/actions/authentication/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/server-only";
import { unstable_cache } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!checkRateLimit(session.user.id)) {
			return NextResponse.json({ error: "Too many requests" }, { status: 429 });
		}

		const posts = await unstable_cache(
			async () =>
				await prisma.event.findMany({
					where: {
						authorId: session.user?.id,
					},
					select: {
						id: true,
						title: true,
						organizer: true,
						location: true,
						poster_url: true,
						isActive: true,
					},
					orderBy: {
						isActive: "desc",
					},
				}),
			["user-posts", session.user?.id],
			{
				revalidate: 60 * 60, // 1 hour
				tags: ["events", "user-posts"],
			},
		)();

		return NextResponse.json(posts);
	} catch (error) {
		console.error("Fetch posts error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch posts" },
			{ status: 500 },
		);
	}
}
