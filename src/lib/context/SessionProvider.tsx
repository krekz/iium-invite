"use client";

import type { AuthUser, Session } from "@/actions/authentication/auth";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface SessionContextType {
	session: Session;
	loading: boolean;
	refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useSession() {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
}

interface SessionProviderProps {
	children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
	const [session, setSession] = useState<Session>(null);
	const [loading, setLoading] = useState(true);

	const refresh = useCallback(async () => {
		try {
			const response = await fetch("/api/auth/session");
			const data = await response.json();
			setSession(data);
		} catch (error) {
			console.error("Failed to refresh session:", error);
			setSession(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return (
		<SessionContext.Provider value={{ session, loading, refresh }}>
			{children}
		</SessionContext.Provider>
	);
}
