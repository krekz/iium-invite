import EventFilter from "@/components/EventFilter";
import EventList from "@/components/homepage/EventList";
import prisma from "@/lib/prisma";

async function Events() {
	const events = await prisma.event.findMany({
		select: {
			id: true,
			title: true,
			organizer: true,
			location: true,
			categories: true,
			date: true,
			poster_url: true,
			has_starpoints: true,
		}
	})
	return (
		<div className="flex flex-row-reverse min-h-dvh">
			{/* <div className="flex justify-center text-3xl font-bold p-3">Events</div> */}
			<EventList events={events} />
			{/* <aside>
				<EventFilter />
			</aside> */}
		</div>
	);
}

export default Events;
