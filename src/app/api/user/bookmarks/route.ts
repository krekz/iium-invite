import { auth } from "@/actions/authentication/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/server-only";
import { revalidateTag, unstable_cache } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bookmarkSchema = z.object({
	eventId: z.string().regex(/^[a-zA-Z0-9_-]{21}$/),
});

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

export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (
			!checkRateLimit(session.user.id, {
				maxRequests: 50,
				windowMs: 30 * 1000,
			})
		) {
			return NextResponse.json({ error: "Too many requests" }, { status: 429 });
		}

		const body = await request.json();
		const validationResult = bookmarkSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}

		const { eventId } = validationResult.data;

		const event = await prisma.event.findUnique({
			where: { id: eventId },
		});

		if (!event) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		const existingBookmark = await prisma.bookmark.findFirst({
			where: {
				userId: session.user.id,
				eventId,
			},
		});

		if (existingBookmark) {
			return NextResponse.json(
				{ error: "Event already bookmarked" },
				{ status: 400 },
			);
		}

		await prisma.$transaction(async (tx) => {
			await tx.bookmark.create({
				data: {
					userId: session.user.id ?? "",
					eventId,
				},
			});
		});

		revalidateTag("events");

		return NextResponse.json({ message: "Bookmarked" }, { status: 201 });
	} catch (error) {
		console.error("Bookmark creation error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (
			!checkRateLimit(session.user.id, { maxRequests: 50, windowMs: 30 * 1000 })
		) {
			return NextResponse.json({ error: "Too many requests" }, { status: 429 });
		}

		const body = await request.json();
		const validationResult = bookmarkSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}

		const { eventId } = validationResult.data;

		const result = await prisma.$transaction(async (tx) => {
			return await tx.bookmark.deleteMany({
				where: {
					userId: session.user.id,
					eventId,
				},
			});
		});

		if (result.count === 0) {
			return NextResponse.json(
				{ error: "Bookmark not found" },
				{ status: 404 },
			);
		}
		revalidateTag("events");
		return NextResponse.json({ message: "Bookmark removed" }, { status: 200 });
	} catch (error) {
		console.error("Remove bookmark error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
