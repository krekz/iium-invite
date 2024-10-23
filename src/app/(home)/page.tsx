import EventCarousel from "@/components/events/EventCarousel";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VerticalCarousel from "@/components/VerticalCarousel";

async function Home() {
	const events = await prisma.event.findMany({
		take: 10,
		select: {
			id: true,
			title: true,
			date: true,
			poster_url: true,
			location: true,
		}
	})
	return (
		<main className="max-w-7xl mx-auto py-10 px-3">
			<VerticalCarousel events={events} />
			<div className="flex flex-col max-w-7xl mx-auto py-3 px-3">
				<div className="flex justify-between">
					<h3 className="text-2xl">Upcoming Event</h3>
					<Link href={"/discover"}>
						<Button variant={"secondary"}>View All</Button>
					</Link>
				</div>
				<EventCarousel events={events} />

			</div>
			<div className="flex flex-col max-w-7xl mx-auto py-3 px-3">
				<div className="flex justify-between">
					<h3 className="text-2xl">Newly Added</h3>
					<Link href={"/discover"}>
						<Button variant={"secondary"}>View All</Button>
					</Link>
				</div>
				<EventCarousel events={events} />
			</div>
		</main>
	);
}

export default Home;
