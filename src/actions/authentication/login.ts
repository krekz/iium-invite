"use server";

import prisma from "@/lib/prisma";
import { LoginCredentialsSchema } from "@/lib/validations/post";
import got from "got";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { CookieJar } from "tough-cookie";
import { getProfile } from "./profile";

const IMALUUM_LOGIN_PAGE =
	"https://cas.iium.edu.my:8448/cas/login?service=https%3a%2f%2fimaluum.iium.edu.my%2fhome?service=https%3a%2f%2fimaluum.iium.edu.my%2fhome";
const IIUM_PAGE =
	"https://cas.iium.edu.my:8448/cas/login?service=https%3a%2f%2fimaluum.iium.edu.my%2fhome";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is not set");
}

export async function loginIIUM(input: FormData) {
	const values = Object.fromEntries(input.entries());
	values.matricNo = input.get("matricNo") as string;
	values.password = input.get("password") as string;

	const { matricNo, password } = LoginCredentialsSchema.parse(values);

	const cookiesPass = await cookies();
	const cookieJar = new CookieJar();

	try {
		// get laravel session cookie
		await got(IIUM_PAGE, {
			cookieJar,
			https: { rejectUnauthorized: false },
			followRedirect: false,
			headers: {
				"Accept-Language": "en-US",
				"User-Agent": "Mozilla/5.0",
			},
		});

		const formData = new URLSearchParams({
			username: matricNo,
			password: password,
			execution: "e1s1",
			_eventId: "submit",
			geolocation: "",
		});

		// login request with cookies
		const { headers } = await got.post(IMALUUM_LOGIN_PAGE, {
			cookieJar,
			https: { rejectUnauthorized: false },
			body: formData.toString(),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Accept-Language": "en-US",
				"User-Agent": "Mozilla/5.0",
				Referer: IIUM_PAGE,
			},
			followRedirect: false,
		});

		if (!headers.location) {
			throw new Error("Login failed: Missing location header");
		}

		//  request with ticket
		await got(headers.location, {
			cookieJar,
			https: { rejectUnauthorized: false },
			followRedirect: false,
			headers: {
				"Accept-Language": "en-US",
				"User-Agent": "Mozilla/5.0",
			},
		});

		const cookies = cookieJar.toJSON()?.cookies;
		const modAuthCasCookie = cookies?.find(
			(cookie) => cookie.key === "MOD_AUTH_CAS",
		);

		if (!modAuthCasCookie) {
			throw new Error("Login failed: Missing MOD_AUTH_CAS cookie");
		}

		const iiumToken = modAuthCasCookie.value;
		if (!iiumToken) {
			throw new Error("Login failed: Unable to parse MOD_AUTH_CAS cookie");
		}

		const userProfile = await getProfile(`MOD_AUTH_CAS=${iiumToken}`);
		const getExistingUser = await prisma.user.findUnique({
			where: { matricNo: userProfile.data.matricNo },
		});

		if (!userProfile.data || !userProfile)
			throw new Error("Invalid user profile data");

		if (!getExistingUser) {
			// save user into db to post event
			await prisma.user.create({
				data: {
					// we dont store any password. tq
					matricNo: userProfile.data.matricNo,
					name: userProfile.data.name,
					image: userProfile.data.imageURL,
					email: userProfile.data.email,
					iiumEmail: userProfile.data.iiumEmail,
				},
			});
		}

		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict" as const,
			maxAge: 3600 * 24,
			path: "/",
		};

		cookiesPass.set("MOD_AUTH_CAS", iiumToken, cookieOptions);

		const jwtPayload = {
			matricNo: userProfile.data.matricNo,
			name: userProfile.data.name,
			imageURL: userProfile.data.imageURL,
			email: userProfile.data.email,
			iiumEmail: userProfile.data.iiumEmail,
			sessionId: iiumToken,
			iat: Math.floor(Date.now() / 1000),
		};

		if (!jwtPayload.matricNo) {
			throw new Error("Invalid user profile data");
		}

		const secret = new TextEncoder().encode(JWT_SECRET);
		const eventureToken = await new SignJWT(jwtPayload)
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("24h")
			.sign(secret);

		cookiesPass.set("eventure_auth", eventureToken, cookieOptions);
		return {
			success: true,
		};
	} catch (error) {
		console.error("Login error:", error);
		return {
			success: false,
			error: "Login failed",
			details: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
