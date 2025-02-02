"use client";
import { eventSuggestions } from "@/actions/ai/recommendations";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { posterFullUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import SkeletonSuggestions from "./event-detail/SkeletonSuggestions";

function EventSuggestion({ categories }: { categories: string[] }) {
	const isMobile = useIsMobile();
	const { slug: currentPostId } = useParams();
	const { data: Events, isLoading } = useQuery({
		queryKey: ["events", currentPostId],
		queryFn: () => eventSuggestions(currentPostId as string, categories),
	});

	return (
		<div className="py-5">
			{isLoading ? (
				<SkeletonSuggestions />
			) : Events && Events.length > 0 ? (
				<>
					<h1 className="font-bold text-3xl">Events you may like</h1>
					{!isMobile && (
						<Carousel
							opts={{
								dragFree: true,
							}}
						>
							<CarouselContent className="-ml-4">
								{Events?.map((event, index) => (
									<CarouselItem
										key={index}
										className="cursor-pointer pl-1 basis-1/2 lg:basis-[25%]"
									>
										<Link href={`/events/${event.id}`}>
											<div className="w-full aspect-square relative group">
												<Image
													alt="ceramah"
													width={500}
													height={500}
													className="object-cover rounded-lg w-full h-full"
													src={posterFullUrl(event.poster_url[0])}
												/>
												<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
													<span className="text-white text-lg font-semibold">
														See More
													</span>
												</div>
											</div>
										</Link>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					)}

					{isMobile && (
						<div className="grid grid-cols-2 gap-2 py-3 w-full">
							{Events?.slice(0, 6).map((event, index) => (
								<Link
									href={`/events/${event.id}`}
									key={index}
									className="aspect-square w-full"
								>
									<div className="relative w-full h-full">
										<Image
											alt={event.id}
											width={500}
											height={500}
											className="rounded-md object-cover absolute inset-0 w-full h-full"
											src={posterFullUrl(event.poster_url[0])}
										/>
									</div>
								</Link>
							))}
						</div>
					)}
				</>
			) : null}
		</div>
	);
}

export default EventSuggestion;
