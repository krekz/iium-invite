"use client";
import DeletePostButton from "@/components/DeletePostButton";
import CustomButton from "@/components/event-detail/CustomButton";
import EventDetailItem from "@/components/event-detail/EventDetailItem";
import { useEvent } from "@/lib/context/EventContextProvider";
import { cn, localDateFormat } from "@/lib/utils";
import { ExternalLink, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import BookmarkButton from "./BookmarkButton";
import EventDetailForm from "./EventDetailForm";
import ShareButton from "./ShareButton";

function PostInfo({ device }: { device: "mobile" | "desktop" }) {
	const params = useParams() as { slug: string };
	if (!params) throw new Error("Slug is required");
	const { event, isAuthor, userId, isActive } = useEvent();
	const eventDetails = [
		{
			label: "Event Date",
			value: localDateFormat(event.date),
		},
		{ label: "Location", value: event.location },
		{ label: "Organizer", value: event.organizer },
		{ label: "Campus", value: event.campus },
	];
	return (
		<div
			className={cn(
				"w-full lg:w-[40%] lg:sticky lg:top-10 lg:self-start py-3",
				device === "mobile" ? "lg:hidden" : "hidden lg:block",
			)}
		>
			<div className="flex flex-col gap-2 w-full">
				{/* Edit form */}
				<div className="flex justify-between w-full">
					{isAuthor && isActive && <EventDetailForm />}
					{isAuthor && <DeletePostButton eventId={params.slug} />}
				</div>

				{event.isRecruiting && (
					<p className="text-xs bg-indigo-500 text-white font-extrabold rounded-full p-1 text-center">
						Open for Recruitment
					</p>
				)}
				{event.has_starpoints && (
					<p className="italic font-bold text-yellow-300">
						⭐️ Starpoints provided ⭐️{" "}
					</p>
				)}
				{eventDetails.map((detail, index) => (
					<EventDetailItem
						key={index}
						label={detail.label}
						value={detail.value}
					/>
				))}
				{/* Add a separate check for fee */}
				{event.fee != null && Number(event.fee) > 0 && (
					<EventDetailItem label="Fee" value={`RM ${event.fee}`} />
				)}

				<div className="flex flex-col gap-1">
					<p>Tags</p>
					<div className="flex flex-wrap gap-1">
						{event.categories.map((category, index) => {
							return (
								<span
									key={index}
									className="bg-card border dark:bg-amber-900 rounded-full px-3 py-1 text-xs font-medium"
								>
									{category}
								</span>
							);
						})}
					</div>
				</div>
				<div className="flex gap-2 w-full">
					<BookmarkButton
						eventId={event.id}
						initialBookmarked={Boolean(
							event.bookmarks[0] && event.bookmarks[0].userId === userId,
						)}
					/>
					<ShareButton />
				</div>
				<div className="space-y-1">
					{event.registration_link && (
						<CustomButton
							variant="default"
							href={event.registration_link}
							icon={ExternalLink}
						>
							Register Now
						</CustomButton>
					)}
					{event.contacts.map((contact, index) => (
						<CustomButton
							href={`https://wa.me/+60${contact.phone}`}
							key={index}
							icon={MessageCircle}
							variant="whatsapp"
						>
							WhatsApp {contact.name}
						</CustomButton>
					))}
				</div>
			</div>
		</div>
	);
}

export default PostInfo;
