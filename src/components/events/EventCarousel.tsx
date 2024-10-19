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
			className="w-full py-3"
		>
			<CarouselContent>
				{shuffledEvents.map((event, index) => (
					<CarouselItem
						onClick={() => router.push(`/events/${event.id}`)}
						key={index}
						className="cursor-pointer hover:opacity-80 transition-all delay-100 basis-1/2 lg:basis-[23%]"
					>
						{/* <div className="">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-3xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div> */}
						<div className="w-full aspect-square">
							<Image
								alt="ceramah"
								width={500}
								height={500}
								className="object-cover rounded-lg w-full h-full"
								src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${event.poster_url[0]}`}
							/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<div className="flex justify-center mt-10 gap-0">
					<CarouselPrevious className="relative mr-2" />
					<CarouselNext className="relative ml-2" />
				</div>
		</Carousel>
	);
}

export default EventCarousel;
