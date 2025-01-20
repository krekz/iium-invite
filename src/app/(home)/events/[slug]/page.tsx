import { auth } from "@/actions/authentication/auth";
import { getEventDetails } from "@/actions/events/get";
import EventSuggestion from "@/components/EventSuggestion";
import LeftSide from "@/components/event-detail/LeftSide";
import PostInfo from "@/components/event-detail/PostInfo";
import { EventProvider } from "@/lib/context/EventContextProvider";
import { posterFullUrl, stripHtmlTags } from "@/lib/utils";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

// cache to avoid multiple requests
const getCachedEventDetails = cache(async (slug: string, userId?: string) => {
	return getEventDetails(slug, userId);
});

export async function generateMetadata(
	{ params }: { params: Promise<{ slug: string }> },
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const slug = (await params).slug;
	const event = await getCachedEventDetails(slug);

	if (!event) return notFound();

	const previousImages = (await parent).openGraph?.images || [];

	return {
		title: event.title,
		description: stripHtmlTags(event.description).slice(0, 50),
		openGraph: {
			title: event.title,
			description: stripHtmlTags(event.description).slice(0, 50),
			type: "article",
			authors: [event.Author?.name || ""],
			images: [
				{
					url: posterFullUrl(event.poster_url[0]) || "/default-event-image.jpg",
					width: 1200,
					height: 630,
					alt: event.title,
				},
				...previousImages,
			],
		},
		twitter: {
			card: "summary_large_image",
			title: event.title,
			description: stripHtmlTags(event.description).slice(0, 50),
			images: [
				posterFullUrl(event.poster_url[0]) || "/default-event-image.jpg",
			],
		},
	};
}

async function EventDetails(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const session = await auth();

	const event = await getCachedEventDetails(params.slug, session?.user?.id);

	if (!event) return notFound();

	const isAuthor = event?.Author?.matricNo === session?.user?.id;
	if (!event.isActive && !isAuthor) return notFound();

	return (
		<div className="max-w-screen-xl mx-auto px-4">
			{isAuthor && event.reports.length > 0 && (
				<p className="text-sm text-center text-yellow-600 bg-yellow-50 p-2 rounded-md mt-1">
					Note: Your event is currently under review by our admins.
				</p>
			)}
			<h1 className="text-3xl md:text-3xl lg:text-4xl font-bold">
				{event.title}
			</h1>
			<p className="text-xs">
				By <span className="italic text-blue-500">{event.Author?.name}</span>
			</p>
			<div className="flex flex-col lg:flex-row gap-5 py-5">
				<EventProvider
					value={{
						event: event,
						userId: session?.user?.id,
						isAuthor: isAuthor,
						isActive: event.isActive,
						slug: params.slug,
					}}
				>
					<LeftSide />
					<PostInfo device="desktop" />
				</EventProvider>
			</div>
			<EventSuggestion categories={event.categories} />
		</div>
	);
}

export default EventDetails;
