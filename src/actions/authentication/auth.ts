"use server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export type AuthUser = {
	id: string;
	name: string;
	imageURL: string;
	email: string;
	iiumEmail: string;
};

export type Session = {
	user: AuthUser;
} | null;

export async function auth(): Promise<Session> {
	const cookieStore = await cookies();
	const iiumToken = cookieStore.get("MOD_AUTH_CAS");
	const eventureToken = cookieStore.get("eventure_auth");

	if (!iiumToken?.value || !eventureToken?.value) {
		return null;
	}

	const JWT_SECRET = process.env.JWT_SECRET;
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET environment variable is not set");
	}

	try {
		const secret = new TextEncoder().encode(JWT_SECRET);
		const { payload } = await jwtVerify(eventureToken.value, secret);

		// Type assertion for payload
		const decoded = payload as {
			matricNo: string;
			name: string;
			imageURL: string;
			email: string;
			iiumEmail: string;
			sessionId: string;
			iat: number;
		};

		// Validate the iiumToken matches the one in the JWT
		if (decoded.sessionId !== iiumToken.value) {
			console.error("Session token mismatch");
			return null;
		}

		const expirationTime = decoded.iat + 24 * 60 * 60; // 24 hours in seconds
		if (Date.now() / 1000 > expirationTime) {
			console.error("Token expired");
			return null;
		}

		return {
			user: {
				id: decoded.matricNo,
				name: decoded.name,
				imageURL: decoded.imageURL,
				email: decoded.email,
				iiumEmail: decoded.iiumEmail,
			},
		};
	} catch (error) {
		console.error("Token verification failed:", error);
		return null;
	}
}
