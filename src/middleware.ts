import { auth } from "@/auth";
import { NextResponse } from "next/server";
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
	VERIFY_EMAIL: "/verify-email",
	// EVENTS: '/events'
} as const;

export default auth(async (request) => {
	const { pathname, searchParams } = request.nextUrl;
	const user = request.auth?.user;

	// helper func
	const createRedirectResponse = (path: string) => {
		return NextResponse.redirect(new URL(path, request.url));
	};

	const getSignInUrl = (callbackPath: string) => {
		const url = new URL("/api/auth/signin", request.url);
		url.searchParams.set("callbackUrl", callbackPath);
		return url;
	};

	// early return for public routes
	const isProtectedRoute = Object.values(PROTECTED_ROUTES).some((route) =>
		pathname.startsWith(route),
	);

	// public route for email verification with "token" query param
	if (
		pathname.startsWith(PROTECTED_ROUTES.VERIFY_EMAIL) &&
		searchParams.has("token")
	) {
		return NextResponse.next();
	}

	if (!isProtectedRoute) {
		return NextResponse.next();
	}

	// auth checks
	if (!user && isProtectedRoute) {
		return NextResponse.redirect(getSignInUrl(pathname));
	}

	// specific route logic
	if (pathname.startsWith(PROTECTED_ROUTES.POST) && !user?.isVerified) {
		return createRedirectResponse("/verify-email");
	}

	if (pathname.startsWith(PROTECTED_ROUTES.VERIFY_EMAIL) && user?.isVerified) {
		return createRedirectResponse("/404");
	}

	// event page logic
	if (pathname.startsWith("/events")) {
		const eventId = pathname.split("/").pop();
		if (!eventId) return createRedirectResponse("/404");

		try {
			const event = await getEventAccess(eventId);

			if (!event) return createRedirectResponse("/404");

			if (!event.isActive) {
				const isAuthorized = user && user.id === event.authorId;
				if (!isAuthorized) return createRedirectResponse("/404");
			}
		} catch (error) {
			console.error("Error accessing event:", error);
			return createRedirectResponse("/500");
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: [
		"/events/:path*",
		"/post/:path*",
		"/account/:path*",
		"/verify-email/:path*",
	],
};
