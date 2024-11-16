import { auth } from "@/auth";
import PostForm from "@/components/post/post-form";
import { redirect } from "next/navigation";

async function PostPage() {
	const session = await auth();
	if (!session) {
		redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent("/post")}`);
	}
	return (
		<div>
			<div className="max-w-sm md:max-w-4xl mx-auto flex flex-col items-center gap-2">
				<h1 className="text-5xl font-bold pt-5">Post Event</h1>
				<PostForm />
			</div>
		</div>
	);
}

export default PostPage;
