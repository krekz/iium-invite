"use client"
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselMainContainer,
    CarouselNext,
    CarouselPrevious,
    SliderMainItem,
    CarouselThumbsContainer,
    SliderThumbItem,
} from "@/components/ui/carousel-v2";
import Image from "next/image";
import { useRef } from "react";

const ImageCarousel = ({ posters }: { posters: string[] }) => {
    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false })
    )

    return (
        <Carousel
            carouselOptions={{ loop: true }}
            plugins={[plugin.current]}
            className="flex flex-col"
        >
            <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-2" />
            <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-2" />
            <CarouselMainContainer className="aspect-square relative">
                {posters.map((poster_url, index) => (
                    <SliderMainItem key={index} className="bg-transparent">
                        <div className="relative w-full h-full">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bucket-v1/${poster_url}`}
                                alt="poster"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </SliderMainItem>
                ))}
            </CarouselMainContainer>
            <CarouselThumbsContainer className="mt-4 h-20">
                {posters.map((poster_url, index) => (
                    <SliderThumbItem key={index} index={index} className="cursor-pointer hover:opacity-50 transition-all duration-500 bg-transparent w-full h-full">
                        <div className="relative w-full h-full">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bucket-v1/${poster_url}`}
                                alt="poster"
                                fill
                                className="object-cover overflow-visible"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    </SliderThumbItem>
                ))}
            </CarouselThumbsContainer>
        </Carousel>
    );
};

export default ImageCarousel;