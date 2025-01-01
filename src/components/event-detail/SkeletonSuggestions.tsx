import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonSuggestions() {
	return (
		<div className="py-5">
			<Skeleton className="h-10 w-64 mb-4 bg-card-foreground/20" />
			{/* desktop carousel skeleton */}
			<Carousel className="hidden md:block">
				<CarouselContent className="-ml-4">
					{Array.from({ length: 4 }).map((_, index) => (
						<CarouselItem key={index} className="pl-1 basis-1/2 lg:basis-[25%]">
							<Skeleton className="bg-card-foreground/20 w-full aspect-square rounded-lg" />
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
			{/* mobile grid skeleton */}
			<div className="grid grid-cols-2 gap-2 md:hidden py-3 w-full">
				{Array.from({ length: 6 }).map((_, index) => (
					<Skeleton
						key={index}
						className="bg-card-foreground/20 w-full aspect-square rounded-md"
					/>
				))}
			</div>
		</div>
	);
}
