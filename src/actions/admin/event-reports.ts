"use server";

import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client/edge";
import { unstable_cache } from "next/cache";

export const getEventReports = async () => {
	return unstable_cache(
		async () => {
			return await prisma.eventReport.findMany({
				select: {
					reportedBy: true,
					reason: true,
					status: true,
					type: true,
					createdAt: true,
					event: {
						select: {
							title: true,
							poster_url: true,
							description: true,
							id: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		},
		["event-reports"],
		{
			tags: ["event-reports"],
			revalidate: 5 * 60,
		},
	)();
};

// types

export type EventReports = Prisma.PromiseReturnType<typeof getEventReports>;
