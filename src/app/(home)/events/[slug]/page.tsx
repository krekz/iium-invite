
import prisma from "@/lib/prisma";

import { notFound } from "next/navigation";
import RightSide from "@/components/event-detail/RightSide";
import LeftSide from "@/components/event-detail/LeftSide";
import EventSuggestion from "@/components/EventSuggestion";

async function EventDetails({ params }: { params: { slug: string } }) {
	// TODO: Auth check for editable content for the author

	const event = await prisma.event.findUnique({
		where: {
			id: params.slug,

		},
		select: {
			title: true,
			description: true,
			poster_url: true,
			campus: true,
			organizer: true,
			date: true,
			location: true,
			createdAt: true,
			registration_link: true,
			fee: true,
			has_starpoints: true,
			categories: true,
			contacts: true,
		},

	})

	if (!event) {
		return notFound();
	}

	return (
		<div className="max-w-screen-xl mx-auto px-4 py-8">
			<h1 className="text-3xl md:text-3xl lg:text-4xl font-bold">{event.title}</h1>
			<p className="text-xs md:text-sm">Organized by: <span className="italic">{event.organizer}</span></p>
			<div className="flex flex-col lg:flex-row gap-5 py-5">
				<LeftSide event={event} />
				<RightSide event={event} params={params} />
			</div>
			<EventSuggestion />
		</div>
	);
}

export default EventDetails;
