import EventCarousel from "@/components/events/EventCarousel";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import Hero from "@/components/homepage/Hero";
import FeaturedEvent from "@/components/homepage/FeaturedEvent";
import Image from "next/image";

interface Event {
	id: string;
	title: string;
	date: Date;
	poster_url: string[] | string;
	location: string;
}

interface EventSection {
	title: string;
	href: string;
	events: Event[];
}

async function Home() {
	const events = await prisma.event.findMany({
		take: 10,
		select: {
			id: true,
			title: true,
			date: true,
			poster_url: true,
			location: true,
			categories: true,
			has_starpoints: true
		},
		orderBy: {
			date: 'asc'
		},
		cacheStrategy: {
			ttl: 60 * 5 // 5 minutes
		}

	});

	const today = new Date();
	const threeDaysFromNow = new Date(today);
	threeDaysFromNow.setDate(today.getDate() + 3);

	const filterEventsByDate = (event: any, startDate: Date, endDate?: Date) => {
		const eventDate = new Date(event.date);
		if (endDate) {
			return eventDate >= startDate && eventDate <= endDate;
		}
		return eventDate.toDateString() === startDate.toDateString();
	};

	const upcomingEvents = events.filter(event => filterEventsByDate(event, today, threeDaysFromNow));
	const newlyAddedEvents = [...events].sort((a, b) => Number(b.id) - Number(a.id));
	const weekendEvents = events.filter(event => {
		const eventDate = new Date(event.date);
		const dayOfWeek = eventDate.getDay();
		return (dayOfWeek === 0 || dayOfWeek === 6) && eventDate >= today;
	});
	const ongoingEvents = events.filter(event => filterEventsByDate(event, today));
	const recruitmentEvents = events.filter(event => event.categories.includes('Recruitment'));
	const starpointEvents = events.filter(event => event.has_starpoints);
	const randomEvents = [...events].sort(() => Math.random() - 0.5).slice(0, 3);

	const eventSections: EventSection[] = [
		...(upcomingEvents.length > 0 ? [{
			title: "Upcoming Events",
			href: "/discover",
			events: upcomingEvents
		}] : []),
		...(newlyAddedEvents.length > 0 ? [{
			title: "Newly Added",
			href: "/discover",
			events: newlyAddedEvents
		}] : []),
		...(weekendEvents.length > 0 ? [{
			title: "This Weekend",
			href: "/discover",
			events: weekendEvents
		}] : []),
		...(ongoingEvents.length > 0 ? [{
			title: "Ongoing Events",
			href: "/discover",
			events: ongoingEvents
		}] : []),
		...(recruitmentEvents.length > 0 ? [{
			title: "Committee Recruitment",
			href: "/discover",
			events: recruitmentEvents
		}] : []),
		...(starpointEvents.length > 0 ? [{
			title: "Events with Starpoints",
			href: "/discover",
			events: starpointEvents
		}] : [])
	];

	return (
		<main className="max-w-7xl mx-auto py-10 px-3">
			<Hero />
			<FeaturedEvent />

			{eventSections.slice(0, 3).map((section) => (
				<div key={section.title} className="flex flex-col max-w-7xl mx-auto py-7 px-3">
					<div className="flex justify-between">
						<Link href={section.href} className="flex items-center gap-2">
							<h3 className="text-2xl font-semibold">{section.title}</h3>
							<ChevronRight className="h-5 w-5" />
						</Link>
					</div>
					<EventCarousel events={section.events} />
				</div>
			))}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-3 py-10">
				{randomEvents.map((event) => (
					<Link
						href={`/events/${event.id}`}
						key={event.id}
						className="flex flex-col rounded-xl hover:opacity-50 duration-300 overflow-hidden cursor-pointer backdrop-blur-sm">
						<div className="relative aspect-square max-h-96">
							<Image
								key={event.id}
								alt={event.title}
								width={400}
								height={400}
								className="size-full rounded-md hover:scale-105 duration-1000 transition-all"
								src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${event.poster_url[0]}`}
							/>
						</div>
						<div className="p-4 space-y-2 ">
							<h3 className="font-semibold text-lg line-clamp-2">
								{event.title}
							</h3>
							<div className="flex items-center text-amber-700 text-sm gap-1">
								<MapPin className="w-4 h-4" />
								<span className="line-clamp-1">{event.location}</span>
							</div>
							<div className="flex items-center text-amber-700 text-sm gap-1">
								<Calendar className="w-4 h-4" />
								<span>{new Date(event.date).toLocaleDateString()}</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{event.categories.slice(0, 4).map((category: string) => (
									<span key={category} className="px-2 py-1 bg-amber-100/80 text-amber-700 rounded-full text-xs">
										{category}
									</span>
								))}
							</div>
						</div>
					</Link>
				))}
			</div>

			{eventSections.slice(3, 5).map((section) => (
				<div key={section.title} className="flex flex-col max-w-7xl mx-auto py-7 px-3">
					<div className="flex justify-between">
						<Link href={section.href} className="flex items-center gap-2">
							<h3 className="text-2xl font-semibold">{section.title}</h3>
							<ChevronRight className="h-5 w-5" />
						</Link>
					</div>
					<EventCarousel events={section.events} />
				</div>
			))}

		</main>
	);
}

export default Home;
