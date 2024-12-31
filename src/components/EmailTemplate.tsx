import type React from "react";

interface EmailTemplateProps {
	verificationToken: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
	verificationToken,
}) => (
	<div
		style={{
			fontFamily:
				'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			backgroundColor: "#f9f9f9",
			padding: "40px 20px",
			maxWidth: "600px",
			margin: "0 auto",
		}}
	>
		<div
			style={{
				backgroundColor: "#ffffff",
				borderRadius: "8px",
				padding: "40px",
				boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
			}}
		>
			<h1
				style={{
					color: "#333",
					fontSize: "24px",
					fontWeight: "600",
					marginBottom: "24px",
					textAlign: "center",
				}}
			>
				Welcome to Eventure!
			</h1>
			<p
				style={{
					color: "#666",
					fontSize: "16px",
					lineHeight: "24px",
					marginBottom: "32px",
					textAlign: "center",
				}}
			>
				Please click the button below to verify your email address.
			</p>
			<div
				style={{
					textAlign: "center",
				}}
			>
				<a
					href={`${process.env.AUTH_URL}/verify-email?token=${verificationToken}`}
					style={{
						backgroundColor: "#007bff",
						color: "#ffffff",
						padding: "12px 24px",
						borderRadius: "4px",
						textDecoration: "none",
						fontWeight: "500",
						display: "inline-block",
					}}
				>
					Verify Email
				</a>
			</div>
			<p
				style={{
					color: "#999",
					fontSize: "14px",
					marginTop: "32px",
					textAlign: "center",
				}}
			>
				If you didn't request this verification, please ignore this email.
			</p>
		</div>
	</div>
);
