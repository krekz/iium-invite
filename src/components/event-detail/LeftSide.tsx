"use client"
import Markdown from "@/components/Markdown";
import DescriptionForm from "./DescriptionForm";
import ImageCarousel from "./ImageCarousel";
import PostInfo from "./PostInfo";
import { useParams } from "next/navigation";
import { PostPageProps } from "@/lib/types";


type LeftSideProps = {
    event: PostPageProps
};
function LeftSide({ event }: LeftSideProps) {
    const { slug } = useParams();
    return (
        <div className="flex flex-col w-full lg:w-[60%] break-words">
            <ImageCarousel posters={event.poster_url} />
            <PostInfo params={{ slug: slug as string }} device="mobile" event={event} />
            <DescriptionForm event={event} />
            <Markdown>
                {event?.description || ""}
            </Markdown>
            <hr className="md:hidden my-8 border-t-1 border-gray-300" />
        </div>
    )
}

export default LeftSide