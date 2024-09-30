"use client";
import { useRouter } from 'next/navigation';
import React from 'react'
import { Button } from './ui/button'
import { deletePost } from '@/actions/event';

function DeletePostButton({ eventId, userId }: { eventId: string, userId: number }) {
    const router = useRouter();
    const handlePostDeletion = async () => {
        try {
            const result = await deletePost({ eventId, userId })
            if (result.success) {
                router.push("/discover");
            } else {
                throw new Error("Failed to delete post");
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Button onClick={handlePostDeletion} className="bg-red-500 p-3 rounded-lg hover:bg-red-500/80">Delete Post</Button>
    )
}
export default DeletePostButton