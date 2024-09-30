import Hero from "@/components/homepage/Hero";
import EventList from "@/components/homepage/EventList";
import EventCarousel from "@/components/events/EventCarousel";
import prisma from "@/lib/prisma";

async function Home() {
	const events = await prisma.event.findMany({
		take: 10,
		select: {
			id: true,
			title: true,
			date: true,
			poster_url: true
		}
	})
	return (
		<div>
			{/* <TailwindEditor /> */}
			<Hero />
			{/* <EventList /> */}
			<div className="flex flex-col max-w-7xl mx-auto py-10 px-3">
				<h3 className="text-2xl">Upcoming Event</h3>
				<p>Event that will be held in less than 2 weeks</p>
				<EventCarousel events={events} />

			</div>
			<div className="flex flex-col max-w-7xl mx-auto py-10 px-3">
				<h3 className="text-2xl">Newly Added</h3>
				<p>
					Discover the latest events added to our platform. Be the first to
					know and RSVP!
				</p>
				<EventCarousel events={events} />
			</div>
			<div className="flex flex-col max-w-7xl mx-auto py-10 px-3">
				<h3 className="text-2xl">Social Gatherings</h3>
				<p>
					Enjoy casual and fun events where you can meet and mingle with others.
					Great for socializing!
				</p>
				<EventCarousel events={events} />
			</div>
			<div className="flex flex-col max-w-7xl mx-auto py-10 px-3">
				<h3 className="text-2xl">Sports & Fitness</h3>
				<p>
					Participate in athletic and fitness events to stay active and healthy.{" "}
				</p>
				<EventCarousel events={events} />
			</div>
		</div>
	);
}

export default Home;
