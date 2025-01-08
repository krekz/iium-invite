"use server";

import { cookies } from "next/headers";

export async function logoutIIUM() {
	try {
		const cookieStore = cookies();

		(await cookieStore).delete("MOD_AUTH_CAS");
		(await cookieStore).delete("eventure_auth");

		return {
			success: true,
		};
	} catch (error) {
		console.error("Logout error:", error);
		return {
			success: false,
			error: "Logout failed",
			details: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
