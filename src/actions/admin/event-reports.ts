"use server";

import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client/edge";

export const getEventReports = async () => {
	const reportedEvents = await prisma.eventReport.findMany({
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
	return reportedEvents;
};

// types

export type EventReports = Prisma.PromiseReturnType<typeof getEventReports>;
