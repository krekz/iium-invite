"use client";

import { useToast } from "@/lib/hooks/use-toast";
import { emailSchema } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

type EmailFormValues = z.infer<typeof emailSchema>;

function Form() {
	const { toast } = useToast();
	const [cooldown, setCooldown] = useState(0);
	const [attempts, setAttempts] = useState(0);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<EmailFormValues>({
		resolver: zodResolver(emailSchema),
	});

	useEffect(() => {
		if (cooldown > 0) {
			const timer = setTimeout(() => {
				setCooldown((prev) => prev - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [cooldown]);

	const verifyEmailMutation = useMutation({
		mutationFn: async (email: EmailFormValues) => {
			try {
				const response = await axios.post("/api/auth/verify-email", email);
				return response.data;
			} catch (error) {
				console.error("Verification error:", error);
			}
		},
		onSuccess: (data) => {
			reset();
			setAttempts(data.count);
			setCooldown(data.cooldown);
			toast({
				title: "Success",
				description: data.message || "Verification email sent successfully",
			});
		},
		onError: (error) => {
			if (axios.isAxiosError(error)) {
				const responseData = error.response?.data;
				console.error(
					"Verification error:",
					responseData?.message || error.message,
				);

				if (error.response?.status === 429) {
					setAttempts(responseData?.count || attempts);
					setCooldown(responseData?.cooldown || 0);
				}

				toast({
					variant: "destructive",
					title: "Error",
					description:
						responseData?.message || "Failed to send verification email",
				});
			}
		},
	});

	const formatTime = (seconds: number) => {
		if (seconds >= 3600) {
			const hours = Math.floor(seconds / 3600);
			const remainingSeconds = seconds % 3600;
			const minutes = Math.floor(remainingSeconds / 60);

			if (minutes > 0) {
				return `${hours} ${hours === 1 ? "hour" : "hours"} and ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
			}
			return `${hours} ${hours === 1 ? "hour" : "hours"}`;
		}
		if (seconds >= 60) {
			const minutes = Math.floor(seconds / 60);
			return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
		}
		return `${seconds} seconds`;
	};

	const getAttemptsMessage = () => {
		const remainingAttempts = 3 - attempts;
		if (remainingAttempts <= 0) {
			return `You've exceeded the maximum attempts. Please try again in ${formatTime(cooldown)} hours.`;
		}
		return `You have ${remainingAttempts} ${remainingAttempts === 1 ? "attempt" : "attempts"} remaining`;
	};

	return (
		<div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-sm  p-8 rounded-lg shadow-md dark:border-2">
				{cooldown > 0 ? (
					<div className="text-center">
						<h2 className="text-2xl font-medium">Please Wait</h2>
						<p className="mt-4 text-sm">
							{attempts >= 3
								? "Too many attempts. Please try again later."
								: "Please wait before requesting another verification email."}
						</p>
						<p className="mt-2 text-sm">
							Time remaining:{" "}
							<span className="font-medium text-blue-500">
								{formatTime(cooldown)}
							</span>
						</p>
						{attempts > 0 && attempts < 3 && (
							<p className="mt-2 text-sm text-red-600">
								{getAttemptsMessage()}
							</p>
						)}
					</div>
				) : (
					<>
						<div className="text-center">
							<h2 className="text-2xl font-medium">Verify Email</h2>
							<p className="mt-2 text-sm">
								Enter your IIUM email to verify your account before you can
								submit an event
							</p>
							{attempts > 0 && (
								<p className="mt-2 text-sm text-red-600">
									{getAttemptsMessage()}
								</p>
							)}
						</div>

						<form
							onSubmit={handleSubmit((email) =>
								verifyEmailMutation.mutate(email),
							)}
							className="mt-6"
						>
							<div className="space-y-2">
								<label htmlFor="email" className="text-sm font-medium">
									Email address
								</label>
								<input
									{...register("email")}
									type="email"
									id="email"
									className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
									placeholder="name@live.iium.edu.my"
								/>
								{errors.email && (
									<p className="text-sm text-red-500">{errors.email.message}</p>
								)}
							</div>

							<button
								type="submit"
								disabled={verifyEmailMutation.isPending || attempts >= 3}
								className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{verifyEmailMutation.isPending
									? "Verifying..."
									: "Verify Email"}
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}

export default Form;
