"use client"
import Markdown from "@/components/Markdown";
import Image from "next/image";
import DescriptionForm from "./DescriptionForm";


type LeftSideProps = {
    event: {
        title: string;
        description: string;
        poster_url: string[];
    };
};
function LeftSide({ event }: LeftSideProps) {
    return (
        <div className="flex flex-col w-full lg:w-[60%] break-words">
            <div className='overflow-hidden aspect-[9/9] relative '>
                {event.poster_url.map((url, index) => (
                    <Image
                        key={index}
                        className='rounded-md object-cover'
                        alt={event.title}
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bucket-v1/${event.poster_url[0]}`}
                        fill
                    />
                ))}
            </div>
            <DescriptionForm event={event} />
            <div className="py-5 md:py-10">
                <Markdown>
                    {event?.description || ""}
                </Markdown>
            </div>
        </div>
    )
}

export default LeftSide