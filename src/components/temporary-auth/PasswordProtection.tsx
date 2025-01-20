"use client";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

interface PasswordProtectionProps {
	children: React.ReactNode;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({
	children,
}) => {
	const [password, setPassword] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isChecking, setIsChecking] = useState(true);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axios.get("/api/auth/beta-access", {
					withCredentials: true,
				});

				if (res.status === 200) {
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.error("Auth check failed:", error);
			} finally {
				setIsChecking(false);
			}
		};

		checkAuth();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const res = await axios.post(
				"/api/auth/beta-access",
				{ password },
				{
					withCredentials: true, // Important for cookies
					headers: { "Content-Type": "application/json" },
				},
			);

			if (res.data.success) {
				toast({
					title: "Access Granted",
					description: "Welcome to Eventure",
					variant: "success",
					duration: 2000,
				});
				setIsAuthenticated(true);
				router.refresh();
			} else {
				toast({
					title: "Access Denied",
					description: res.data.message || "Incorrect password",
					variant: "destructive",
					duration: 1500,
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Something went wrong. Please try again later.",
				variant: "destructive",
				duration: 1500,
			});
		}
	};

	if (isChecking) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
					<p className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
						Checking permissions...
					</p>
				</div>
			</div>
		);
	}

	if (isAuthenticated) {
		return <>{children}</>;
	}

	return (
		<div className="p-3 flex items-center justify-center min-h-screen bg-gradient-to-br from-brown-900 to-amber-800">
			<div className="max-w-md w-full p-8 bg-brown-800 bg-opacity-70 backdrop-blur-sm rounded-xl shadow-2xl border border-brown-700">
				<div className="mb-8 text-center">
					<h1 className="text-4xl font-extrabold text-white mb-2">Eventure</h1>
					<p className="text-amber-300 text-lg">Beta Access</p>
				</div>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium mb-2"
						>
							Enter Beta Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-3 bg-brown-700 border border-brown-600 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200"
							placeholder="••••••••"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-brown-600 text-white rounded-lg font-semibold shadow-md hover:from-amber-500 hover:to-brown-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition duration-200"
					>
						Access Beta
					</button>
				</form>
				<p className="mt-6 text-center text-sm">
					Authorized users only. Contact admin for access.
				</p>
			</div>
		</div>
	);
};

export default PasswordProtection;
