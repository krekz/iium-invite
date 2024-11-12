import DeletePostButton from "@/components/DeletePostButton";
import CustomButton from "@/components/events/CustomButton";
import EventDetailItem from "@/components/events/EventDetailItem";
import { format } from "date-fns";
import { ExternalLink, MessageCircle, } from "lucide-react";
import EventDetailForm from "./EventDetailForm";
import { cn } from "@/lib/utils";
import { PostPageProps } from "@/lib/types";

type RightSideProps = {
    event: PostPageProps
    params: {
        slug: string;
    };
    device: "mobile" | "desktop";
}


function PostInfo({ event, params, device }: RightSideProps) {
    const eventDetails = [
        { label: "Event Date", value: format(new Date(event.date).toLocaleDateString(), "dd/M/yy") },
        { label: "Location", value: event.location },
        { label: "Organizer", value: event.organizer },
        { label: "Campus", value: event.campus },
    ];
    return (
        <div className={cn("w-full lg:w-[35%] lg:sticky lg:top-10 lg:self-start py-3",
            device === "mobile" ? "lg:hidden" : "hidden lg:block"
        )}>
            <div className="flex flex-col gap-2 w-full">

                {/* Edit form */}
                <EventDetailForm params={params} event={event} />

                {event.categories.some(cat => ["Recruitment", "Committee"].includes(cat)) && <p className="text-xs bg-indigo-500 text-white font-extrabold rounded-full p-1 text-center">Open for Recruitment</p>}
                {event.has_starpoints && <p className="italic font-bold text-yellow-300">⭐️ Starpoints provided ⭐️ </p>}
                {eventDetails.map((detail, index) => (
                    <EventDetailItem key={index} label={detail.label} value={detail.value} />
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
                                <span key={index} className="bg-amber-100 text-black rounded-full px-3 py-1 text-xs font-medium">
                                    {category}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-1 mt-4">
                    {event.registration_link && <CustomButton
                        variant="default"
                        href={event.registration_link}
                        icon={ExternalLink}
                    >
                        Register Now
                    </CustomButton>}
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

                {/* Editable content for author of this post */}
                <div className="flex w-full">
                    <DeletePostButton eventId={params.slug} userId={123} />
                </div>
            </div>
        </div>
    )
}

export default PostInfo