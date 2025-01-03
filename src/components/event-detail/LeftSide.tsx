"use client";
import Markdown from "@/components/Markdown";
import { useEvent } from "@/lib/context/EventContextProvider";
import DescriptionForm from "./DescriptionForm";
import ImageCarousel from "./ImageCarousel";
import PostInfo from "./PostInfo";

function LeftSide() {
	const { event, isAuthor, isActive } = useEvent();
	return (
		<div className="flex flex-col w-full break-words">
			<ImageCarousel posters={event.poster_url} />
			<PostInfo device="mobile" />
			{isAuthor && isActive && <DescriptionForm event={event} />}
			<Markdown>{event?.description || ""}</Markdown>
			<hr className="md:hidden my-8 border-t-1 border-gray-300" />
		</div>
	);
}

export default LeftSide;
