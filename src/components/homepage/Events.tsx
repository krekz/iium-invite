import { getEventHomepage } from "@/actions/events/get";
import EventCarousel from "@/components/homepage/EventCarousel";
import { posterFullUrl } from "@/lib/utils";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventSection {
	title: string;
	href: string;
	events: Event[];
}

interface Event {
	id: string;
	title: string;
	date: Date;
	poster_url: string[] | string;
	location: string;
}

async function Events() {
	const events = await getEventHomepage();
	const today = new Date();
	const endOfWeek = new Date(today);
	endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // get next sunday
	endOfWeek.setHours(23, 59, 59, 999);

	const newlyAddedEvents = [...events].sort(
		(a, b) => Number(b.id) - Number(a.id),
	);
	const thisWeekEvents = events.filter((event) => {
		const eventDate = new Date(event.date);
		return eventDate >= today && eventDate <= endOfWeek;
	});
	const recruitmentEvents = events.filter((event) =>
		event.categories.includes("recruitment"),
	);
	const starpointEvents = events.filter((event) => event.has_starpoints);
	const randomEvents = [...events].sort(() => Math.random() - 0.5).slice(0, 3);

	const eventSections: EventSection[] = [
		...(newlyAddedEvents.length > 0
			? [
					{
						title: "Newly Added",
						href: "/discover",
						events: newlyAddedEvents,
					},
				]
			: []),
		...(thisWeekEvents.length > 4
			? [
					{
						title: "This Week",
						href: "/discover",
						events: thisWeekEvents,
					},
				]
			: []),
		...(recruitmentEvents.length > 0
			? [
					{
						title: "Committee Recruitment",
						href: "/discover",
						events: recruitmentEvents,
					},
				]
			: []),
		...(starpointEvents.length > 0
			? [
					{
						title: "Events with Starpoints",
						href: "/discover",
						events: starpointEvents,
					},
				]
			: []),
	];
	return (
		<>
			{eventSections.slice(0, 2).map((section) => (
				<div key={section.title} className="flex flex-col mx-auto py-7 pl-3">
					<div className="flex justify-between">
						<Link href={section.href} className="flex items-center gap-2">
							<h3 className="text-2xl font-semibold">{section.title}</h3>
							<ChevronRight className="h-5 w-5" />
						</Link>
					</div>
					<EventCarousel events={section.events} />
				</div>
			))}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-3 py-10 px-3">
				{randomEvents.map((event) => (
					<Link
						href={`/events/${event.id}`}
						key={event.id}
						className="flex flex-col rounded-xl hover:opacity-50 duration-300 overflow-hidden cursor-pointer backdrop-blur-sm"
					>
						<div className="relative aspect-square max-h-96">
							<Image
								key={event.id}
								alt={event.title}
								width={400}
								height={400}
								className="size-full rounded-md hover:scale-105 duration-1000 transition-all"
								src={posterFullUrl(event.poster_url[0])}
							/>
						</div>
						<div className="p-4 space-y-2 ">
							<h3 className="font-semibold text-lg line-clamp-2">
								{event.title}
							</h3>
							<div className="flex items-center text-sm gap-1">
								<MapPin className="w-4 h-4" />
								<span className="line-clamp-1">{event.location}</span>
							</div>
							<div className="flex items-center text-sm gap-1">
								<Calendar className="w-4 h-4" />
								<span>{new Date(event.date).toLocaleDateString()}</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{event.categories.slice(0, 4).map((category: string) => (
									<span
										key={category}
										className="px-2 py-1 bg-card border dark:bg-amber-900 rounded-full text-xs"
									>
										{category}
									</span>
								))}
							</div>
						</div>
					</Link>
				))}
			</div>

			{eventSections.slice(2, 4).map((section) => (
				<div
					key={section.title}
					className="flex flex-col max-w-7xl mx-auto py-7 pl-3"
				>
					<div className="flex justify-between">
						<Link href={section.href} className="flex items-center gap-2">
							<h3 className="text-2xl font-semibold">{section.title}</h3>
							<ChevronRight className="h-5 w-5" />
						</Link>
					</div>
					<EventCarousel events={section.events} />
				</div>
			))}
		</>
	);
}

export default Events;
