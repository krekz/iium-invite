"use client";
import { cn } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

const featuredEvents = [
	{
		id: 1,
		title: "International Culture Festival",
		description:
			"Experience diverse cultures through food, music, and performances.",
		date: "May 5, 2024",
		image: "/carousel-3.webp",
		highlight: "30+ Countries Represented",
	},
	{
		id: 2,
		title: "Innovation Summit 2024",
		description:
			"Join industry leaders and innovators in this groundbreaking event.",
		date: "May 10, 2024",
		image: "/carousel-2.webp",
		highlight: "Keynote by Tech Leaders",
	},
	{
		id: 3,
		title: "Sports Championship",
		description:
			"Annual inter-university sports competition with exciting matches.",
		date: "May 15, 2024",
		image: "/carousel-1.webp",
		highlight: "15 Universities Competing",
	},
];

function FeaturedEvent() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isHovered, setIsHovered] = useState(false);
	const [progress, setProgress] = useState<number>(0);
	const progressInterval = useRef<NodeJS.Timeout | number | NodeJS.Timer>(
		undefined,
	);
	const lastProgressRef = useRef<number>(0);

	const nextSlide = useCallback(() => {
		setActiveIndex((current) => (current + 1) % featuredEvents.length);
		setProgress(0);
		lastProgressRef.current = 0;
	}, []);

	const prevSlide = () => {
		setActiveIndex(
			(current) =>
				(current - 1 + featuredEvents.length) % featuredEvents.length,
		);
		setProgress(0);
		lastProgressRef.current = 0;
	};

	useEffect(() => {
		const startProgress = () => {
			progressInterval.current = setInterval(() => {
				setProgress((prev) => {
					const newProgress = prev + 1;
					lastProgressRef.current = newProgress;

					if (newProgress >= 100) {
						clearInterval(progressInterval.current as number);
						nextSlide();
						return 0;
					}

					return newProgress;
				});
			}, 50); // 5000ms / 100 steps = 50ms per step
		};

		if (!isHovered) {
			startProgress();
		}

		return () => {
			clearInterval(progressInterval.current as number);
		};
	}, [isHovered, nextSlide]);
	return (
		<div
			className="relative max-w-7xl mx-auto h-[700px] md:h-[400px] overflow-hidden"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{featuredEvents.map((event, index) => (
				<div
					key={event.id}
					className={cn(
						"absolute w-full transition-all duration-500 ease-in-out",
						index === activeIndex
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-full pointer-events-none",
					)}
				>
					<div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
						<div className="relative group">
							{/* Simple elegant progress bar */}
							<div className="absolute inset-0 rounded-2xl overflow-hidden">
								{/* Progress bar with glow effect */}
								<div
									className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.8)]"
									style={{
										width: `${progress}%`,
										transition: "width 50ms linear",
									}}
								/>

								{/* Subtle corner accents */}
								<div className="absolute top-0 left-0 w-8 h-8">
									<div className="absolute top-0 left-0 w-1 h-8 bg-primary/30" />
									<div className="absolute top-0 left-0 h-1 w-8 bg-primary/30" />
								</div>
								<div className="absolute top-0 right-0 w-8 h-8">
									<div className="absolute top-0 right-0 w-1 h-8 bg-primary/30" />
									<div className="absolute top-0 right-0 h-1 w-8 bg-primary/30" />
								</div>
							</div>
							<div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors rounded-2xl" />
							<div className="relative w-[full] h-[250px] md:h-[500px]">
								<Image
									src={event.image}
									alt={event.title}
									fill
									className="rounded-2xl shadow-xl object-fill"
								/>
							</div>
						</div>
						<div className="space-y-4 md:space-y-6 px-4 md:px-0">
							<div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full">
								{event.date}
							</div>
							<h3 className="text-2xl md:text-3xl font-bold">{event.title}</h3>
							<p className="text-base md:text-lg text-muted-foreground">
								{event.description}
							</p>
							<div className="bg-secondary p-4 rounded-lg">
								<div className="text-sm text-muted-foreground mb-1">
									Event Highlight
								</div>
								<div className="text-base md:text-lg font-semibold">
									{event.highlight}
								</div>
							</div>
							<Button size="lg" className="w-full md:w-auto">
								Learn More
							</Button>
						</div>
					</div>
				</div>
			))}

			<div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
				<Button
					variant="outline"
					size="icon"
					onClick={prevSlide}
					className="rounded-full h-10 w-10"
				>
					<ArrowUpCircle className="h-6 w-6" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={nextSlide}
					className="rounded-full h-10 w-10"
				>
					<ArrowDownCircle className="h-6 w-6" />
				</Button>
			</div>
		</div>
	);
}

export default FeaturedEvent;
