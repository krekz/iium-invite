import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import LeftSide from "@/components/event-detail/LeftSide";
import EventSuggestion from "@/components/EventSuggestion";
import PostInfo from "@/components/event-detail/PostInfo";
import { auth } from "@/auth";
import { EventProvider } from "@/lib/context/EventContextProvider";

async function EventDetails(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const session = await auth();

	const event = await prisma.event.findUnique({
		where: {
			id: params.slug,
			OR: [
				{
					isActive: true
				},
				{
					authorId: session?.user?.id
				}
			]
		},
		select: {
			Author: {
				select: {
					name: true,
				}
			},
			id: true,
			title: true,
			description: true,
			poster_url: true,
			campus: true,
			organizer: true,
			date: true,
			location: true,
			createdAt: true,
			registration_link: true,
			fee: true,
			has_starpoints: true,
			categories: true,
			contacts: true,
			bookmarks: {
				where: {
					userId: session?.user?.id,
				},
				select: {
					userId: true,
				}
			},
			isActive: true,
		},
		cacheStrategy: {
			ttl: 60
		}
	})

	if (!event) return notFound();

	const isAuthor = event?.Author?.name === session?.user?.name;

	return (
		<div className="max-w-screen-xl mx-auto px-4">
			<h1 className="text-3xl md:text-3xl lg:text-4xl font-bold">{event.title}</h1>
			<p className="text-xs">By <span className="italic text-blue-500">{event.Author!.name}</span></p>
			<div className="flex flex-col lg:flex-row gap-5 py-5">
				<EventProvider value={{
					event: event,
					userId: session?.user?.id,
					isAuthor: isAuthor,
					isActive: event.isActive,
					slug: params.slug
				}}>
					<LeftSide />
					<PostInfo device="desktop" />
				</EventProvider>
			</div>
			<EventSuggestion />
		</div>
	);
}

export default EventDetails;
