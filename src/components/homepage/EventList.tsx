"use client";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";


type EventsProps = {
	events: {
		id: string;
		title: string;
		poster_url: string[];
		date: Date;
		location: string;
		organizer: string;
		categories: string[];
		has_starpoints: boolean;
	}[]
};

function EventList({ events }: EventsProps) {
	return (
		<div className="lg:container">
			<div className="p-3 max-w-7xl gap-y-2 gap-x-1 mx-auto md:py-8 md:pt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 text-amber-900">
				{events.map((event, e_index) => (
					<Link
						// scroll={false}
						href={`/events/${event.id}`}
						key={e_index}
						className="flex flex-col p-1 gap-1 w-full rounded-lg relative"
					>
						<div className="w-full relative rounded-md overflow-hidden aspect-square">
							<Image
								className="object-cover transition-transform duration-1000 hover:scale-105"
								alt={`${event.title}`}
								src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bucket-v1/${event.poster_url[0]}`}
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
							{event.has_starpoints && (
								<div className="absolute top-2 right-2 bg-yellow-400 text-amber-900 rounded-full p-1">
									<svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								</div>
							)}

						</div>
						{event.categories.some(cat => ["Recruitment", "Committee"].includes(cat)) && (
							<div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-full p-2">
								<p className="text-xs font-extrabold whitespace-nowrap">Open for Recruitment</p>
							</div>
						)}
						<div className="dark:text-primary-foreground">
							<h1 className="text-sm md:text-lg font-semibold text-primary">
								{event.title}
							</h1>

							<p className="text-xs md:text-sm mt-2">📍 {event.location}</p>

							<div className="flex justify-between">
								<p className="text-xs md:text-sm">🫂 {event.organizer}</p>
								<p className="text-[11px] md:text-sm italic">🗓️ {format(new Date(event.date).toLocaleDateString(), "dd/M/yy")}</p>
							</div>
							<div className="flex flex-wrap gap-1 mt-2">
								{event.categories.map((tag, t_index) => (
									<span
										key={t_index}
										className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 text-[8px] font-medium md:text-xs"
									>
										{tag}
									</span>
								))}
							</div>

						</div>
					</Link>
				))}
			</div>
		</div >
	);
}

export default EventList;
