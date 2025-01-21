import EventList from "@/components/discover/EventList";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { z } from "zod";

const campusSchema = z.object({
	campus: z.enum(["kuantan", "gambang", "gombak", "pagoh"]),
});

export async function generateMetadata({
	params,
}: { params: { campus: string } }): Promise<Metadata> {
	const { error, data } = campusSchema.safeParse({ campus: params.campus });
	if (error) return notFound();

	const capitalizedCampus =
		data.campus.charAt(0).toUpperCase() + data.campus.slice(1);

	return {
		title: `Discover - ${capitalizedCampus} Events`,
		description: `Browse and discover upcoming events at IIUM ${capitalizedCampus} campus`,
		openGraph: {
			title: `${capitalizedCampus} Events`,
			description: `Browse and discover upcoming events at IIUM ${capitalizedCampus} campus`,
			type: "website",
		},
	};
}

async function Campus({ params }: { params: Promise<{ campus: string }> }) {
	const campus = (await params).campus;
	const { error, data } = campusSchema.safeParse({ campus });
	if (error) {
		notFound();
	}

	return (
		<>
			<EventList campus={data.campus} />
		</>
	);
}

export default Campus;
