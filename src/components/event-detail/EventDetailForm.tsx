"use client"
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
import { useEffect } from 'react'
import { PencilRuler, X } from 'lucide-react'
import { fixedCategories } from '@/lib/constant';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '../ui/select';
import { updateDetailsPost } from '@/actions/event';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from "@/lib/hooks/useCategories";
import { detailSchema } from "@/lib/validations/post";
import { Controller, useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

type EventDetailFormProps = {
    event: {
        title: string;
        location: string;
        organizer: string;
        campus: string;
        fee: string | null;
        categories: string[];
    };
    params: {
        slug: string;
    };
}

function EventDetailForm({ event, params }: EventDetailFormProps) {
    const { toast } = useToast()

    const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<z.infer<typeof detailSchema>>({
        resolver: zodResolver(detailSchema),
        defaultValues: {
            title: event.title,
            location: event.location,
            organizer: event.organizer,
            campus: event.campus,
            fee: event.fee || "0",
            categories: event.categories,
        },
    });

    const { selectedCategories, addCategory, removeCategory } = useCategories(setValue, event.categories);

    const onSubmit = async (data: z.infer<typeof detailSchema>) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(val => formData.append(key, val));
            } else {
                formData.append(key, value as string);
            }
        });

        try {
            const result = await updateDetailsPost({
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

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            toast({
                title: "Invalid Input",
                description: "Please check your inputs and try again.",
                variant: "destructive"
            });
            return;
        }
    }, [errors]);

    return (
        <div className='self-start'>
            <FloatingPanelRoot>
                <FloatingPanelTrigger title="Edit Event Detail"><PencilRuler /></FloatingPanelTrigger>
                <FloatingPanelContent className='w-full lg:w-[28rem] max-w-[90vw]'>
                    <FloatingPanelForm onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-3 px-2 text-black">
                            {[
                                { id: "title", label: "Title" },
                                { id: "location", label: "Location" },
                                { id: "organizer", label: "Organizer" },
                                { id: "campus", label: "Campus" },
                                { id: "fee", label: "Fee" },
                            ].map(({ id, label }) => (
                                <div key={id} className="relative">
                                    <FloatingPanelLabel htmlFor={id} className="absolute -top-2 left-2 px-1 text-xs text-gray-600">
                                        {label}
                                    </FloatingPanelLabel>
                                    <Controller
                                        name={id as keyof z.infer<typeof detailSchema>}
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id={id}
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                                            />
                                        )}
                                    />
                                    {errors[id as keyof z.infer<typeof detailSchema>] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[id as keyof z.infer<typeof detailSchema>]?.message}</p>
                                    )}
                                </div>
                            ))}
                            <>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedCategories.map((cate, index) => (
                                        <div
                                            key={index}
                                            className="rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-sm cursor-pointer hover:bg-indigo-200 transition-colors"
                                            onClick={() => removeCategory(cate)}
                                        >
                                            {cate} <X size={14} className="inline ml-1" />
                                        </div>
                                    ))}
                                </div>
                                <div className="relative">
                                    <FloatingPanelLabel htmlFor="categories" className="absolute -top-2 left-2 px-1 text-xs text-gray-600">
                                        Categories
                                    </FloatingPanelLabel>
                                    <Select
                                        onValueChange={(value) => addCategory(value)}
                                        value=""
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fixedCategories.map((cate) => (
                                                !selectedCategories.includes(cate) && (
                                                    <SelectItem key={cate} value={cate}>
                                                        {cate}
                                                    </SelectItem>
                                                )
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
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

export default EventDetailForm