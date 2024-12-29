import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

function SkeletonCarousel() {
    return (
        <div className="flex flex-col max-w-7xl mx-auto py-7 px-3">

            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-semibold bg-gray-50/15 animate-pulse h-7 w-32 rounded"></h3>
                    <div className="bg-gray-50/15 animate-pulse h-5 w-5 rounded"></div>
                </div>
            </div>
            <div className="mt-4">
                <Carousel
                    opts={{
                        align: "start",
                        dragFree: true,
                        duration: 50,
                    }}
                    className="w-full pt-2"
                >
                    <CarouselContent>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <CarouselItem
                                key={index}
                                className="cursor-pointer hover:opacity-80 transition-all delay-100 basis-7/12 lg:basis-[23%]"
                            >
                                <div className="w-full aspect-square bg-gray-50/15 animate-pulse rounded-lg"></div>
                                <h3 className="text-md font-bold bg-gray-50/15 animate-pulse h-5 w-3/4 mt-2 rounded"></h3>
                                <div className="text-xs flex justify-between mt-1">
                                    <p className="bg-gray-50/15 animate-pulse h-4 w-1/3 rounded"></p>
                                    <p className="bg-gray-50/15 animate-pulse h-4 w-1/4 rounded"></p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:flex" />
                    <CarouselNext className="hidden lg:flex" />
                </Carousel>
            </div>
        </div>
    )
}

function Skeleton() {
    return (
        <>

            {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCarousel key={index} />
            ))}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 py-10">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex flex-col rounded-xl overflow-hidden cursor-pointer backdrop-blur-sm animate-pulse"
                    >
                        <div className="relative aspect-square max-h-96 bg-gray-50/15 rounded-md"></div>
                        <div className="p-4 space-y-2">
                            <h3 className="font-semibold text-lg bg-gray-50/15 h-6 w-3/4 rounded"></h3>
                            <div className="flex items-center text-sm gap-1">
                                <div className="w-4 h-4 bg-gray-50/15 rounded"></div>
                                <span className="bg-gray-50/15 h-4 w-1/2 rounded"></span>
                            </div>
                            <div className="flex items-center text-sm gap-1">
                                <div className="w-4 h-4 bg-gray-50/15 rounded"></div>
                                <span className="bg-gray-50/15 h-4 w-1/3 rounded"></span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-gray-50/15 h-5 w-12 rounded-full text-xs"
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <SkeletonCarousel />
        </>

    )
}

export default Skeleton