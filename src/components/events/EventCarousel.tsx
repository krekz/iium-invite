"use client";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type EventsProps = {
	events: {
		id: string;
		title: string;
		date: Date;
		poster_url: string[];
		location: string;
	}[];
}


function EventCarousel({ events }: EventsProps) {
	const router = useRouter();
	const shuffledEvents = [...events].sort(() => Math.random() - 0.5);
	return (
		<Carousel
			opts={{
				align: "start",
			}}
			className="w-full pt-2"
		>
			<CarouselContent>
				{shuffledEvents.map((event, index) => (
					<CarouselItem
						onClick={() => router.push(`/events/${event.id}`)}
						key={index}
						className="cursor-pointer hover:opacity-80 transition-all delay-100 basis-10/12 lg:basis-[23%]"
					>
						<div className="w-full aspect-square">
							<Image
								alt="ceramah"
								width={200}
								height={200}
								className="rounded-lg w-full h-full"
								src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${event.poster_url[0]}`}
							/>
						</div>
						<h3 className="text-lg font-bold">{event.title}</h3>
						<div className="flex justify-between">
							<p>📍 {event.location}</p>
							<p className="text-xs text-gray-500">
								{new Date(event.date).toLocaleDateString()}
							</p>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}

export default EventCarousel;
