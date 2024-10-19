"use client";
import { useRouter } from 'next/navigation';
import React from 'react'
import { Button } from './ui/button'
import { deletePost } from '@/actions/event';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';


function DeletePostButton({ eventId, userId }: { eventId: string, userId: number }) {
    const { toast } = useToast();
    const router = useRouter();
    const handlePostDeletion = async () => {
        try {
            const result = await deletePost({ eventId, userId })
            if (result.success) {
                toast({
                    title: "Post Deleted",
                    variant: "destructive"
                })
                router.push("/discover");
            } else {
                throw new Error("Failed to delete post");
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild><Button>Delete Post</Button></AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure want to <strong className='text-destructive'>Delete</strong>  this post?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are not able to request any refund for this action.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePostDeletion} type='submit' className='bg-destructive'>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}
export default DeletePostButton