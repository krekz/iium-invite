"use client";
import { getDiscoverEvents } from "@/actions/events/get";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/lib/context/SessionProvider";
import { localDateFormat, stripHtmlTags } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BookmarkButton from "../event-detail/BookmarkButton";
import EmptyState from "./Empty";
import EventError from "./Error";
import Skeleton from "./Skeleton";

interface Event {
	id: string;
	title: string;
	description: string;
	poster_url: string[];
	date: Date;
	location: string;
	organizer: string;
	categories: string[];
	has_starpoints: boolean;
	isRecruiting: boolean;
}

type EventListProps = {
	campus: "all" | "gombak" | "kuantan" | "pagoh" | "gambang";
};

function EventList({ campus }: EventListProps) {
	const searchParams = useSearchParams();
	const queryParams = {
		q: searchParams.get("q") ?? undefined,
		category: searchParams.get("category") ?? undefined,
		campus: campus,
		fee: searchParams.get("fee") === "true" ? "true" : undefined,
		has_starpoints:
			searchParams.get("starpoints") === "true" ? "true" : undefined,
		recruitment:
			searchParams.get("recruitment") === "true" ? "true" : undefined,
	};

	const {
		data: events,
		isLoading,
		error,
	} = useQuery<Event[]>({
		queryKey: ["events", ...Object.values(queryParams)],
		queryFn: () => getDiscoverEvents(queryParams),
	});

	if (isLoading) return <Skeleton />;
	if (error) return <EventError />;
	if (!events?.length) return <EmptyState />;
	return (
		<div className="w-full">
			<div className="sm:grid sm:grid-cols-3 lg:grid-cols-4 columns-2 sm:gap-2 gap-x-2 gap-y-2 pb-5 mx-auto text-amber-900 [&>*:first-child]:z-[45]">
				<AnimatePresence mode="sync">
					{events.map((event, index) => (
						<motion.div
							key={event.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							layout
							transition={{
								opacity: { duration: 0.8 },
								layout: { duration: 0.4 },
							}}
							className="relative mb-2 bg-muted-foreground/15 sm:mb-0 break-inside-avoid-column sm:break-inside-auto rounded-lg border shadow-md"
						>
							<EventCard event={event} />
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}

function EventCard({ event }: { event: Event }) {
	const isMobile = useIsMobile();

	return (
		<div className="relative">
			<HoverCard>
				<HoverCardTrigger asChild>
					<Link
						href={`/events/${event.id}`}
						className="flex flex-col pb-3 sm:p-0 gap-2 w-full rounded-lg"
					>
						<div className="w-full relative rounded-lg overflow-hidden aspect-square ring-1 ring-amber-900/5 dark:ring-white/5">
							<Image
								className="transition-all duration-1000 hover:scale-105"
								alt={event.title}
								src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bucket-v1/${event.poster_url[0]}`}
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						</div>

						{isMobile && (
							<div className="dark:text-primary-foreground p-1">
								<h1 className="text-sm font-semibold text-primary dark:text-white/75">
									{event.title}
								</h1>
								<div className="flex gap-2 mt-1">
									{event.isRecruiting && <RecruitingBadge />}
									{event.has_starpoints && <StarpointsBadge />}
								</div>
							</div>
						)}
					</Link>
				</HoverCardTrigger>
				<HoverCardContent
					side="right"
					className="w-[20rem] h-full bg-card border backdrop-blur-sm z-[60]"
				>
					<div className="space-y-2">
						<h3 className="text-lg font-bold">{event.title}</h3>
						<div className="flex gap-2">
							{event.isRecruiting && <RecruitingBadge />}
							{event.has_starpoints && <StarpointsBadge />}
						</div>
						<p className="text-sm">
							{stripHtmlTags(event.description).slice(0, 200)}...
						</p>
						<div className="flex flex-wrap gap-1">
							{event.categories.map((category) => (
								<span
									key={category}
									className="text-xs bg-white/20 rounded-full px-2 py-0.5"
								>
									{category}
								</span>
							))}
						</div>
						<div className="flex items-center justify-between text-sm">
							<span>📅 {localDateFormat(new Date(event.date))}</span>
							<span>📍 {event.location}</span>
						</div>
						<BookmarkButton
							className="size-10 rounded-full"
							eventId={event.id}
						/>
					</div>
				</HoverCardContent>
			</HoverCard>
		</div>
	);
}

function RecruitingBadge() {
	return (
		<span className="text-[10px] bg-green-500 text-white rounded-full px-2 py-0.5">
			Recruiting
		</span>
	);
}

function StarpointsBadge({ className = "size-2" }: { className?: string }) {
	return (
		<span className="text-[10px] bg-yellow-400 text-amber-900 rounded-full px-1 py-0.5 flex items-center gap-1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className={className}
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
			Starpoints
		</span>
	);
}

export default EventList;
