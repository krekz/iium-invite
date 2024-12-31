import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/server-only";
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

		const posts = await prisma.event.findMany({
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
			cacheStrategy: {
				ttl: 10,
			},
		});

		return NextResponse.json(posts);
	} catch (error) {
		console.error("Fetch posts error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch posts" },
			{ status: 500 },
		);
	}
}
