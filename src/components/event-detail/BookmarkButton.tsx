"use client";
import { useSession } from "@/lib/context/SessionProvider";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { BookmarkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BookmarkButtonProps {
	eventId: string;
	initialBookmarked: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
	eventId,
	initialBookmarked,
}) => {
	const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
	const { toast } = useToast();
	const router = useRouter();
	const { session } = useSession();

	const { mutate: toggleBookmark } = useMutation({
		mutationFn: async (newBookmarkState: boolean) => {
			if (!session?.user) {
				router.push("/login");
				return false;
			}

			const response = await fetch("/api/user/bookmarks", {
				method: newBookmarkState ? "POST" : "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ eventId }),
			});

			if (!response.ok) {
				throw new Error("Something went wrong");
			}

			return newBookmarkState;
		},
		onMutate: (newBookmarkState) => {
			if (!session?.user) return;
			setIsBookmarked(newBookmarkState);
		},
		onError: (err) => {
			setIsBookmarked(!isBookmarked); // Revert on error
			toast({
				title: "Error",
				description: (err as Error).message,
				variant: "destructive",
			});
		},
	});

	const handleBookmarkClick = () => {
		if (!session?.user) {
			router.push("/login");
			return;
		}
		toggleBookmark(!isBookmarked);
	};

	return (
		<button
			onClick={handleBookmarkClick}
			type="button"
			className={cn(
				"flex items-center justify-center w-[10%] p-2 rounded-full transition-colors duration-200",
				isBookmarked
					? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
					: "bg-gray-100 text-gray-600 hover:bg-gray-200",
			)}
			aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
		>
			<BookmarkIcon
				className={cn("w-6 h-6", isBookmarked && "fill-yellow-600")}
			/>
		</button>
	);
};

export default BookmarkButton;
