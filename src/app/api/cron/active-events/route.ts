import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	if (
		request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		await prisma.event.updateMany({
			where: {
				OR: [
					{
						registrationEndDate: { lte: new Date() },
						isActive: true,
					},
					{
						date: { lte: new Date() },
						isActive: true,
					},
				],
			},
			data: {
				isActive: false,
			},
		});
		revalidateTag("events");
		return new Response("Cron job ran successfully");
	} catch (error) {
		console.error("Error updating events", error);
		return new Response("Error updating events", { status: 500 });
	}
}
