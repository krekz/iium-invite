import EventList from "@/components/discover/EventList";
import { notFound } from "next/navigation";
import React from "react";
import { z } from "zod";

const campusSchema = z.object({
	campus: z.enum(["kuantan", "gambang", "gombak", "pagoh"]),
});

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
