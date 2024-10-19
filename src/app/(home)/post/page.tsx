import PostForm from "@/components/post/post-form";

function PostPage() {
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
