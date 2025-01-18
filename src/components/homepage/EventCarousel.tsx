"use client";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { localDateFormat, posterFullUrl } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type EventsProps = {
	events: {
		id: string;
		title: string;
		date: Date;
		poster_url: string[] | string;
		location: string;
	}[];
};

function EventCarousel({ events }: EventsProps) {
	const router = useRouter();
	const shuffledEvents = [...events].sort(() => Math.random() - 0.5);
	return (
		<Carousel
			opts={{
				align: "start",
				dragFree: true,
				duration: 50,
			}}
			className="w-full pt-2"
		>
			<CarouselContent>
				{shuffledEvents.map((event, index) => (
					<CarouselItem
						onClick={() => router.push(`/events/${event.id}`)}
						key={index}
						className="cursor-pointer hover:opacity-80 transition-all delay-100 basis-7/12 lg:basis-[23%]"
					>
						<div className="w-full aspect-square">
							<Image
								alt="ceramah"
								width={200}
								height={200}
								className="rounded-lg w-full h-full"
								src={posterFullUrl(event.poster_url[0])}
							/>
						</div>
						<h3 className="text-md font-bold">{event.title}</h3>
						<div className="text-xs flex justify-between">
							<p>📍 {event.location}</p>
							<p className="text-gray-500">{localDateFormat(event.date)}</p>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="hidden lg:flex" />
			<CarouselNext className="hidden lg:flex" />
		</Carousel>
	);
}

export default EventCarousel;
