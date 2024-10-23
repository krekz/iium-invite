"use client";
import Link from 'next/link';
import { Carousel, CarouselMainContainer, CarouselThumbsContainer, SliderMainItem, SliderThumbItem } from './ui/carousel-v2'
import Image from 'next/image'

function VerticalCarousel({ events }: { events: { id: string, title: string, poster_url: string[] }[] }) {
    return (
        <Carousel
            orientation="vertical"
            className="flex items-center gap-0">
            <div className="relative basis-3/4">
                <CarouselMainContainer className="h-72 lg:h-[50rem]">
                    {events.map((event, index) => (
                        <SliderMainItem
                            key={index}
                            className="flex items-center justify-center h-full w-full overflow-hidden"
                        >
                            <Link href={`/events/${event.id}`} className="relative w-full h-full group ">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${event.poster_url[0]}`}
                                    alt={event.title}
                                    fill
                                    className='rounded-md'
                                />
                                <div className="absolute cursor-pointer inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white text-lg font-semibold">See More</span>
                                </div>
                            </Link>
                            {/* </Link> */}
                        </SliderMainItem>
                    ))}
                </CarouselMainContainer>
            </div>
            <CarouselThumbsContainer className="h-72 basis-1/4 lg:w-96 lg:h-[50rem]">
                {events.map((event, index) => (
                    <SliderThumbItem
                        key={index}
                        index={index}
                        className="rounded-md bg-transparent h-52"
                    >
                        <div
                            className="border border-muted flex items-center justify-center h-full w-full rounded-md cursor-pointer bg-background overflow-hidden"
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${event.poster_url[0]}`}
                                alt={event.title}
                                fill
                                className='rounded-md'
                            />
                        </div>
                    </SliderThumbItem>
                ))}
            </CarouselThumbsContainer>
        </Carousel>
    )
}

export default VerticalCarousel