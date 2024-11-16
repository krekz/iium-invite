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
import { useToast } from '@/lib/hooks/use-toast';
import { Trash2 } from 'lucide-react';


function DeletePostButton({ eventId }: { eventId: string }) {
    const { toast } = useToast();
    const router = useRouter();
    const handlePostDeletion = async () => {
        try {
            const result = await deletePost({ eventId })
            if (result.success) {
                toast({
                    title: "Post Deleted",
                    variant: "default"
                })
                router.push("/discover");
            } else {
                toast({
                    title: "Failed to delete post",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger className='bg-red-500 hover:bg-red-500/80' asChild><Button><Trash2 /></Button></AlertDialogTrigger>
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