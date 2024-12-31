"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface VerifiedProps {
	token: string;
}

function Verified({ token }: VerifiedProps) {
	const [isVerified, setIsVerified] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	useEffect(() => {
		const verifyEmail = async () => {
			try {
				const response = await fetch(`/api/auth/verify-email?token=${token}`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Verification failed");
				}

				setIsVerified(true);
				setError(null);

				setTimeout(() => {
					router.push("/discover");
				}, 5000);
			} catch (err) {
				setIsVerified(false);
				setError(err instanceof Error ? err.message : "Something went wrong");
			}
		};

		verifyEmail();

		return () => {
			setIsVerified(false);
			setError(null);
		};
	}, [token, router]);

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4">
				<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
					<div className="flex flex-col items-center space-y-4">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
							<svg
								className="w-8 h-8 text-red-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
						<h2 className="text-2xl font-semibold text-gray-900">
							Verification Failed
						</h2>
						<p className="text-red-500 text-center">{error}</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4">
			<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
				<div className="flex flex-col items-center space-y-4">
					{isVerified ? (
						<>
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
								<svg
									className="w-8 h-8 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<h2 className="text-2xl font-semibold text-gray-900">
								Email Verified!
							</h2>
							<p className="text-gray-600 text-center">
								Your email has been successfully verified.
							</p>
							<p className="text-gray-500 text-sm">
								Redirecting to discover page...
							</p>
						</>
					) : (
						<>
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
								<svg
									className="w-8 h-8 text-blue-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
							</div>
							<h2 className="text-2xl font-semibold text-gray-900">
								Verifying Email
							</h2>
							<p className="text-gray-600 text-center">
								Please wait while we verify your email address...
							</p>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default Verified;
