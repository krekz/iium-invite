import EventList from "@/components/discover/EventList";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Discover - All Events",
	description: "Browse and discover upcoming events from all campuses",
	openGraph: {
		title: "Discover Events",
		description: "Browse and discover upcoming events from all campuses",
		type: "website",
	},
};

function Events() {
	return <EventList campus="all" />;
}

export default Events;
