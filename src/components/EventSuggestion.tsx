"use client"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useQuery } from "react-query";
import { getEvents } from "@/actions/event";
import Image from "next/image";
import Link from "next/link";

function EventSuggestion() {
    const { data: Events } = useQuery({
        queryKey: "events",
        queryFn: getEvents,
    })

    return (
        <div className="py-5">
            <h1 className="font-bold text-3xl">Events you may like</h1>
            <Carousel className="hidden md:block">
                <CarouselContent className="-ml-4">
                    {Events?.map((event, index) => (
                        <CarouselItem key={index} className="cursor-pointer pl-1 basis-1/2 lg:basis-1/4">
                            <Link href={`/events/${event.id}`}>
                                <div className="w-full aspect-square relative group">
                                    <Image
                                        alt="ceramah"
                                        width={500}
                                        height={500}
                                        className="object-cover rounded-lg w-full h-full"
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${event.poster_url[0]}`}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white text-lg font-semibold">See More</span>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            <div className="grid grid-cols-2 gap-2 md:hidden py-3 w-full">
                {Events?.slice(0, 6).map((event, index) => (
                    <Link
                        href={`/events/${event.id}`}
                        key={index}
                        className="aspect-square w-full">
                        <div className="relative w-full h-full">
                            <Image
                                alt={event.id}
                                width={500}
                                height={500}
                                className="rounded-md object-cover absolute inset-0 w-full h-full"
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${event.poster_url[0]}`} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default EventSuggestion