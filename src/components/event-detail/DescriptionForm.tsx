"use client"
import { updateDescription } from "@/actions/event";
import {
    FloatingPanelCloseButton,
    FloatingPanelContent,
    FloatingPanelFooter,
    FloatingPanelForm,
    FloatingPanelLabel,
    FloatingPanelRoot,
    FloatingPanelSubmitButton,
    FloatingPanelTrigger,
} from "@/components/ui/floating-panel"
import { useToast } from "@/hooks/use-toast";
import { descSchema } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilRuler } from "lucide-react"
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Markdown from "../Markdown";
import { MinimalTiptapEditor } from '@/components/minimal-tiptap'
import { cn } from "@/lib/utils";



function DescriptionForm({ event }: { event: { description: string } }) {
    const params = useParams<{ slug: string }>()



    const { toast } = useToast()

    const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<z.infer<typeof descSchema>>({
        resolver: zodResolver(descSchema),
        defaultValues: {
            description: event.description
        },
    });


    const onSubmit = async (data: z.infer<typeof descSchema>) => {
        const formData = new FormData();

        formData.append("description", data.description)

        try {
            const result = await updateDescription({
                formData,
                userId: "123",
                eventId: params.slug
            });

            toast({
                title: result.success ? "Saved" : "Error",
                description: result.success
                    ? result.message
                    : result.message,
                variant: result.success ? "success" : "destructive"
            });

        } catch (error) {
            console.error("Error updating event details:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive"
            });
        }
    };


    return (
        <div>
            <FloatingPanelRoot>
                <FloatingPanelTrigger title="Edit Event Detail"><PencilRuler /></FloatingPanelTrigger>
                <FloatingPanelContent className='w-full lg:w-[28rem] max-w-[90vw]'>
                    <FloatingPanelForm onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-3 px-2 text-black">
                            <div className="relative">
                                <FloatingPanelLabel htmlFor="description" className="absolute -top-2 left-2 px-1 text-xs text-gray-600">
                                    Description
                                </FloatingPanelLabel>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <MinimalTiptapEditor
                                                {...field}
                                                throttleDelay={2000}
                                                className={cn('w-full', {
                                                    'border-destructive focus-within:border-destructive': errors.description
                                                })}
                                                editorContentClassName="some-class"
                                                output="html"
                                                placeholder="Type your description here..."
                                                autofocus={true}
                                                editorClassName="focus:outline-none p-5"
                                                value={field.value}
                                            />
                                            {errors.description && (
                                                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                                            )}
                                        </>)}
                                />

                            </div>
                        </div>
                        <FloatingPanelFooter>
                            <FloatingPanelCloseButton />
                            <FloatingPanelSubmitButton disabled={isSubmitting} className='bg-blue-700 text-white px-5 hover:bg-blue-700/90 hover:text-white' />
                        </FloatingPanelFooter>
                    </FloatingPanelForm>
                </FloatingPanelContent>
            </FloatingPanelRoot>
        </div>
    )
}

export default DescriptionForm