import EventCarousel from "@/components/events/EventCarousel";
import prisma from "@/lib/prisma";
import Link from "next/link";
import VerticalCarousel from "@/components/VerticalCarousel";
import { ChevronRight } from "lucide-react";
import Hero from "@/components/homepage/Hero";
import FeaturedEvent from "@/components/homepage/FeaturedEvent";

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
			<Hero />
			<FeaturedEvent />
			{/* <VerticalCarousel events={events} /> */}
			<div className="flex flex-col max-w-7xl mx-auto py-7 px-3">
				<div className="flex justify-between">
					<Link href={"/discover"} className="flex items-center gap-2">
						<h3 className="text-2xl font-semibold">Upcoming Event</h3>
						<ChevronRight className="h-5 w-5" />
					</Link>
				</div>
				<EventCarousel events={events} />

			</div>
			<div className="flex flex-col max-w-7xl mx-auto py-7 px-3">
				<div className="flex justify-between">
					<Link href={"/discover"} className="flex items-center gap-2">
						<h3 className="text-2xl font-semibold">Newly Added</h3>
						<ChevronRight className="h-5 w-5" />
					</Link>
				</div>
				<EventCarousel events={events} />
			</div>
		</main>
	);
}

export default Home;
