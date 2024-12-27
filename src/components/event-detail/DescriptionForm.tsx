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
import { useToast } from "@/lib/hooks/use-toast";
import { descSchema } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react"
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
                eventId: params.slug
            });

            toast({
                title: result.success ? "Saved" : "Error",
                description: result.message,
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
        <div className="py-2">
            <FloatingPanelRoot>
                <FloatingPanelTrigger title="Edit Description" className="flex flex-row items-center justify-center gap-2">
                    <span>Edit Description</span>
                    <SquarePen size={16} />
                </FloatingPanelTrigger>
                <FloatingPanelContent className='w-full lg:w-[50rem]'>
                    <FloatingPanelForm onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-3 px-2">
                            <div className="relative">
                                <FloatingPanelLabel htmlFor="description">
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
                                                editorClassName="focus:outline-none p-5 text-sm lg:text-normal"
                                                value={field.value}
                                                immediatelyRender={false}
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