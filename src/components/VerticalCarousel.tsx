"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	Carousel,
	CarouselMainContainer,
	CarouselThumbsContainer,
	SliderMainItem,
	SliderThumbItem,
} from "./ui/carousel-v2";

function VerticalCarousel({
	events,
}: { events: { id: string; title: string; poster_url: string[] }[] }) {
	const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
		"vertical",
	);

	useEffect(() => {
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleResize = () => {
		if (window.innerWidth < 768) {
			setOrientation("horizontal");
		} else {
			setOrientation("vertical");
		}
	};

	return (
		<Carousel
			orientation={orientation}
			className={`flex ${orientation === "vertical" ? "items-center" : "flex-col"} gap-0`}
		>
			<div
				className={`${orientation === "vertical" ? "basis-3/4" : "w-full"} relative`}
			>
				<CarouselMainContainer className="h-72 lg:h-[50rem]">
					{events.map((event, index) => (
						<SliderMainItem
							key={index}
							className="flex items-center justify-center h-full w-full overflow-hidden"
						>
							<Link
								href={`/events/${event.id}`}
								className="relative w-full h-full group"
							>
								<Image
									src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${event.poster_url[0]}`}
									alt={event.title}
									fill
									className="rounded-md"
								/>
								<div className="absolute cursor-pointer inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<span className="text-white text-lg font-semibold">
										See More
									</span>
								</div>
							</Link>
						</SliderMainItem>
					))}
				</CarouselMainContainer>
			</div>
			<CarouselThumbsContainer
				className={`${
					orientation === "vertical"
						? "h-72 basis-1/4 lg:w-96 lg:h-[50rem]"
						: "w-full h-24 md:h-32"
				}`}
			>
				{events.map((event, index) => (
					<SliderThumbItem
						key={index}
						index={index}
						className="rounded-md bg-transparent h-52"
					>
						<div className="border border-muted flex items-center justify-center h-full w-full rounded-md cursor-pointer bg-background overflow-hidden">
							<Image
								src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${event.poster_url[0]}`}
								alt={event.title}
								fill
								className="rounded-md"
							/>
						</div>
					</SliderThumbItem>
				))}
			</CarouselThumbsContainer>
		</Carousel>
	);
}

export default VerticalCarousel;
