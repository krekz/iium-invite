"use client"
import Markdown from "@/components/Markdown";
import Image from "next/image";
import DescriptionForm from "./DescriptionForm";
import ImageCarousel from "./ImageCarousel";


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
            <ImageCarousel posters={event.poster_url} />
            <DescriptionForm event={event} />
            <Markdown>
                {event?.description || ""}
            </Markdown>
            <hr className="md:hidden my-8 border-t-1 border-gray-300" />
        </div>
    )
}

export default LeftSide