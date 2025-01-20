"use client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/context/SessionProvider";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface BookmarkButtonProps {
	eventId: string;
	className?: string;
}

type GetBookmark = {
	event: {
		id: string;
		title: string;
		poster_url: string;
	};
};

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
	eventId,
	className: customClassName,
}) => {
	const { toast } = useToast();
	const router = useRouter();
	const { session } = useSession();
	const queryClient = useQueryClient();

	const { data: bookmark } = useQuery<GetBookmark>({
		queryKey: ["bookmark", eventId],
		queryFn: async () => {
			if (!session?.user) return null;
			const response = await fetch(`/api/user/bookmarks/${eventId}`);
			if (response.status === 404) {
				return null;
			}
			if (!response.ok) {
				throw new Error("Something went wrong");
			}
			return response.json();
		},
	});

	const isBookmarked = !!bookmark;

	const { mutate: toggleBookmark } = useMutation({
		mutationFn: async (newBookmarkState: boolean) => {
			if (!session?.user) {
				router.push("/login");
				return false;
			}

			const response = await fetch(`/api/user/bookmarks/${eventId}`, {
				method: newBookmarkState ? "POST" : "DELETE",
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Something went wrong");
			}

			return newBookmarkState;
		},
		onMutate: async (newBookmarkState) => {
			if (!session?.user) return;

			await queryClient.cancelQueries({ queryKey: ["bookmark", eventId] });

			const previousBookmark = queryClient.getQueryData(["bookmark", eventId]);

			queryClient.setQueryData(
				["bookmark", eventId],
				newBookmarkState ? { event: { id: eventId } } : null,
			);

			return { previousBookmark };
		},
		onError: (err, _, context) => {
			queryClient.setQueryData(
				["bookmark", eventId],
				context?.previousBookmark,
			);

			toast({
				title: "Error",
				description: "Bookmark failed",
				variant: "destructive",
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["bookmark", eventId] });
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
		<Button
			onClick={handleBookmarkClick}
			type="button"
			className={cn(
				"flex items-center justify-center w-full p-2 transition-colors duration-200",
				isBookmarked
					? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
					: "bg-gray-100 text-gray-600 hover:bg-gray-200",
				customClassName,
			)}
			aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
		>
			<BookmarkIcon
				className={cn("w-6 h-6", isBookmarked && "fill-yellow-600")}
			/>
		</Button>
	);
};

export default BookmarkButton;
