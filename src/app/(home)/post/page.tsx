import PostForm from "@/components/post/post-form"

function PostPage() {
    return (
        <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-bold py-5">Post Event</h1>
            <PostForm />
        </div>
    )
}

export default PostPage
