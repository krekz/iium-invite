import PostForm from "@/components/post/post-form";

export const maxDuration = 45;

async function PostPage() {
	return (
		<div>
			<div className="w-full md:max-w-4xl mx-auto flex flex-col items-center gap-6">
				<div className="flex flex-col items-center gap-2 py-5">
					<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
						Post Event
					</h1>
					<p className="text-muted-foreground text-sm md:text-base text-center">
						Share your upcoming event with the IIUM community
					</p>
				</div>
				<PostForm />
			</div>
		</div>
	);
}

export default PostPage;
