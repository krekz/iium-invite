"use client";
import type React from "react";
import { createContext, useContext } from "react";
import type { PostPageProps } from "../types";

type EventContextType = {
	event: PostPageProps;
	userId: string | undefined;
	isAuthor: boolean;
	isActive: boolean;
	slug: string;
};

const EventContext = createContext<EventContextType | null>(null);

export function EventProvider({
	children,
	value,
}: {
	children: React.ReactNode;
	value: EventContextType;
}) {
	return (
		<EventContext.Provider value={value}>{children}</EventContext.Provider>
	);
}

export function useEvent() {
	const context = useContext(EventContext);
	if (!context) {
		throw new Error("useEvent must be used within an EventProvider");
	}
	return context;
}
