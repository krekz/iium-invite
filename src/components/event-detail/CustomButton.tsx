import { Button } from "@/components/ui/button"; // Import the Button component
import Link from "next/link";
import type React from "react";

// ... existing code ...

const CustomButton = ({
	children,
	variant = "default",
	icon: Icon,
	href,
}: {
	children: React.ReactNode;
	variant: "default" | "whatsapp";
	icon?: React.ElementType;
	href: string;
}) => {
	return (
		<Button
			className={`w-full p-6 rounded-lg transition-all hover:translate-x-1 duration-300 delay-100 ${
				variant === "whatsapp"
					? "bg-green-500 hover:bg-green-600"
					: "bg-blue-500 hover:bg-blue-600"
			}`}
			asChild
		>
			<Link
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center justify-center"
			>
				{Icon && <Icon className="mr-2 h-4 w-4" />}
				{children}
			</Link>
		</Button>
	);
};
export default CustomButton;
