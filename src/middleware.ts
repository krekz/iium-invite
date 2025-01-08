import { auth } from "@/actions/authentication/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cache } from "react";
import prisma from "./lib/prisma";

export const getEventAccess = cache(async (eventId: string) => {
	return prisma.event.findUnique({
		where: { id: eventId },
		select: {
			isActive: true,
			authorId: true,
		},
		cacheStrategy: { ttl: 60 },
	});
});

export const PROTECTED_ROUTES = {
	POST: "/post",
	ACCOUNT: "/account",
} as const;

export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const session = await auth();

	// helper func
	const createRedirectResponse = (path: string) => {
		return NextResponse.redirect(new URL(path, request.url));
	};

	// early return for public routes
	const isProtectedRoute = Object.values(PROTECTED_ROUTES).some((route) =>
		pathname.startsWith(route),
	);

	if (!isProtectedRoute) {
		return NextResponse.next();
	}

	// auth checks
	if (!session?.user.name && isProtectedRoute) {
		return createRedirectResponse("/login");
	}

	// event page logic
	if (pathname.startsWith("/events")) {
		const eventId = pathname.split("/").pop();
		if (!eventId) return createRedirectResponse("/404");

		try {
			const event = await getEventAccess(eventId);

			if (!event) return createRedirectResponse("/404");

			if (!event.isActive) {
				const isAuthorized =
					session?.user && session.user.id === event.authorId;
				if (!isAuthorized) return createRedirectResponse("/404");
			}
		} catch (error) {
			console.error("Error accessing event:", error);
			return createRedirectResponse("/500");
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/events/:path*", "/post/:path*", "/account/:path*"],
};
