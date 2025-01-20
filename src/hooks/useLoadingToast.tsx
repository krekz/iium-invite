import { useCallback, useEffect, useState } from "react";

export function useLoadingToast() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentMessage, setCurrentMessage] = useState("");

	const LOADING_MESSAGES = [
		"🚀 Validating your content...",
		"📸 Processing your images...",
		"✨ Please do not leave this page...",
		"📅 Setting up your event details...",
		"🎉 This may take some time...",
	] as const;

	const getRandomMessage = useCallback(() => {
		return LOADING_MESSAGES[
			Math.floor(Math.random() * LOADING_MESSAGES.length)
		];
	}, [LOADING_MESSAGES]);

	useEffect(() => {
		let interval: NodeJS.Timer | undefined;

		if (isSubmitting) {
			setCurrentMessage(getRandomMessage());
			interval = setInterval(() => {
				setCurrentMessage(getRandomMessage());
			}, 2000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [isSubmitting, getRandomMessage]);

	const startLoading = useCallback(() => {
		setIsSubmitting(true);
	}, []);

	const stopLoading = useCallback(() => {
		setIsSubmitting(false);
	}, []);

	const LoadingOverlay = useCallback(() => {
		if (!isSubmitting) return null;

		return (
			<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
				<div className="animate-pulse text-white text-center">
					<div className="h-8 w-8 animate-spin mx-auto mb-4">
						<svg
							className="animate-spin"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					</div>
					<p className="text-lg font-medium">{currentMessage}</p>
				</div>
			</div>
		);
	}, [isSubmitting, currentMessage]);

	return {
		LoadingOverlay,
		startLoading,
		stopLoading,
	};
}
