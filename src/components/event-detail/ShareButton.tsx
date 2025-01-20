"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Link as LinkIcon, Share2 } from "lucide-react";
import {
	FaFacebook,
	FaLinkedin,
	FaWhatsapp,
	FaXTwitter,
} from "react-icons/fa6";
import { Button } from "../ui/button";

function ShareButton() {
	const shareUrl = typeof window !== "undefined" ? window.location.href : "";
	const { toast } = useToast();

	const handleShare = async (platform: string) => {
		switch (platform) {
			case "facebook":
				window.open(
					`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
				);
				break;
			case "twitter":
				window.open(
					`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
				);
				break;
			case "linkedin":
				window.open(
					`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
				);
				break;
			case "whatsapp":
				window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`);
				break;
			case "copy":
				await navigator.clipboard.writeText(shareUrl);
				toast({
					description: "Link copied to clipboard",
				});
				break;
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="w-full hover:bg-accent"
				>
					<Share2 className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="flex min-w-64 w-full p-2 gap-2"
			>
				<DropdownMenuItem
					onClick={() => handleShare("facebook")}
					className="p-2 flex size-full items-center justify-center"
				>
					<FaFacebook className="h-4 w-4 text-[#1877F2]" />
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleShare("twitter")}
					className="p-2 flex size-full items-center justify-center"
				>
					<FaXTwitter className="h-4 w-4 text-black dark:text-white" />
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleShare("whatsapp")}
					className="p-2 flex size-full items-center justify-center"
				>
					<FaWhatsapp className="h-4 w-4 text-[#25D366]" />
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleShare("copy")}
					className="p-2 flex size-full items-center justify-center"
				>
					<LinkIcon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default ShareButton;
