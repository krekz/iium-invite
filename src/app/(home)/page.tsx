import Hero from "@/components/homepage/Hero";
import EventList from "@/components/homepage/EventList";
import EventCarousel from "@/components/events/EventCarousel";
import prisma from "@/lib/prisma";
import ImageCarousel from "@/components/event-detail/ImageCarousel";
import {
	Carousel,
	CarouselMainContainer,
	CarouselThumbsContainer,
	SliderMainItem,
	SliderThumbItem,
} from "@/components/ui/carousel-v2";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
		<>
			{/* <TailwindEditor /> */}
			<Hero />
			{/* <EventList /> */}
			<div className="flex flex-col max-w-7xl mx-auto py-10 px-3">
				<h3 className="text-2xl">Upcoming Event</h3>
				<p>Event that will be held in less than 2 weeks</p>
				{/* <ImageCarousel posters={events.flatMap(event => event.poster_url)} /> */}
				<Carousel orientation="vertical" className="flex items-center gap-2">
					<div className="relative basis-3/4">
						<CarouselMainContainer className="h-60">
							{events.map((event, index) => (
								<SliderMainItem
									key={index}
									className="border border-muted flex items-center justify-center h-full w-full rounded-md overflow-hidden"
								>
									<div className="relative w-full h-full">
										<Image
											src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${event.poster_url[0]}`}
											alt={event.title}
											layout="fill"
											objectFit="cover"
										/>
									</div>
								</SliderMainItem>
							))}
						</CarouselMainContainer>
					</div>
					<CarouselThumbsContainer className="h-60 basis-1/4">
						{events.map((event, index) => (
							<SliderThumbItem
								key={index}
								index={index}
								className="rounded-md bg-transparent"
							>
								<div
									className="border border-muted flex items-center justify-center h-full w-full rounded-md cursor-pointer bg-background overflow-hidden"
								>
									<Image
										src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${event.poster_url[0]}`}
										alt={event.title}
										layout="fill"
										objectFit="cover"
									/>
								</div>
							</SliderThumbItem>
						))}
					</CarouselThumbsContainer>
				</Carousel>
			</div>
			<div className="flex flex-col max-w-7xl mx-auto py-10 px-3">
				<div className="flex justify-between">
					<h3 className="text-2xl">Upcoming Event</h3>
					<Link href={"/discover"}>
						<Button variant={"secondary"}>View All</Button>
					</Link>
				</div>
				<p>Hurry up!</p>
				<EventCarousel events={events} />

			</div>
			<div className="flex flex-col max-w-7xl mx-auto py-10 px-3">
				<div className="flex justify-between">
					<h3 className="text-2xl">Newly Added</h3>
					<Link href={"/discover"}>
						<Button variant={"secondary"}>View All</Button>
					</Link>
				</div>
				<p>
					Discover the latest events
				</p>
				<EventCarousel events={events} />
			</div>
		</>
	);
}

export default Home;
