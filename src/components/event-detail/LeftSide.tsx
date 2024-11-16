"use client"
import Markdown from "@/components/Markdown";
import DescriptionForm from "./DescriptionForm";
import ImageCarousel from "./ImageCarousel";
import PostInfo from "./PostInfo";
import { useParams } from "next/navigation";
import { useEvent } from "@/lib/context/EventContextProvider";


function LeftSide() {
    const { event, isAuthor } = useEvent()
    return (
        <div className="flex flex-col w-full lg:w-[60%] break-words">
            <ImageCarousel posters={event.poster_url} />
            <PostInfo device="mobile" />
            {isAuthor && <DescriptionForm event={event} />}
            <Markdown>
                {event?.description || ""}
            </Markdown>
            <hr className="md:hidden my-8 border-t-1 border-gray-300" />
        </div>
    )
}

export default LeftSide