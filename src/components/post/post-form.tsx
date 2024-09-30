"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postSchema } from "@/lib/validations/post";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { fixedCategories } from "@/lib/constant";
import Image from "next/image";
import { X, Upload, Link, CalendarIcon, Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CreatePost } from "@/actions/event";
import { draftToMarkdown } from "markdown-draft-js";
import { useRouter, useSearchParams } from "next/navigation";
import { EventsProps } from "@/lib/types";
import { useFiles } from "@/lib/hooks/useFiles";
import { useCategories } from "@/lib/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { MinimalTiptapEditor } from "../minimal-tiptap";

type EventFormProps = {
	editablePost?: EventsProps
};

function PostForm({ editablePost }: EventFormProps) {
	const { toast } = useToast();
	const router = useRouter()
	const searchParams = useSearchParams();

	if (searchParams.has('type', "create")) {
		console.log("page for create post")
	}

	const form = useForm<z.infer<typeof postSchema>>({
		resolver: zodResolver(postSchema),
		defaultValues: editablePost ? {
			title: editablePost.title,
			description: editablePost.description,
			location: editablePost.location,
			organizer: editablePost.organizer,
			fee: editablePost.fee || "0",
			registration_link: editablePost.registration_link || "",
			categories: editablePost.categories,
			has_starpoints: editablePost.has_starpoints,
			campus: editablePost.campus,
			date: editablePost.date,
		} : {
			title: "",
			description: "",
			location: "",
			organizer: "",
			fee: "0",
			registration_link: "",
			categories: [],
			has_starpoints: false,
			campus: "",
			date: new Date(),
		},
	});

	const { selectedFiles, handleFileChange, removeFile } = useFiles(form.setValue);
	const { selectedCategories, addCategory, removeCategory } = useCategories(form.setValue);

	const onSubmit = async (values: z.infer<typeof postSchema>) => {
		// if (form.formState.isSubmitting) return;
		const formData = new FormData();

		Object.entries(values).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				value.forEach((item) => formData.append(key, item));
			} else if (value instanceof Date) {
				formData.append(key, value.toISOString());
			} else if (typeof value === 'boolean') {
				formData.append(key, value.toString()); // Convert boolean to string
			} else if (value !== null && value !== undefined) {
				formData.append(key, String(value));
			}
		});

		// Handle file uploads
		selectedFiles.forEach((file, index) => {
			formData.append(`poster_url[${index}]`, file);
		});

		try {
			const newPost = await CreatePost({ formData, userId: 123 });
			if (!newPost) throw new Error("Failed to create post");
			toast({
				title: "Event Created",
				description: "Your event has been created successfully",
				variant: "success"
			})
			router.push(`/events/${newPost.id}`);
		} catch (error) {
			console.error("Error in CreatePost:", error);
			toast({
				title: "Error",
				description: "Failed to create event",
				variant: "destructive"
			})
		}
	};

	useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			if (name === 'description') {
				console.log("Description changed:", value.description);
			}
		});
		return () => subscription.unsubscribe();
	}, [form.watch]);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="max-w-3xl mx-auto space-y-8 p-6 bg-white shadow-lg rounded-lg text-gray-800"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-semibold">
								Event Title
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter event title"
									className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-semibold">
								Description
							</FormLabel>
							<FormControl>
								<MinimalTiptapEditor
									{...field}
									throttleDelay={2000}
									className={cn('w-full', {
										'border-destructive focus-within:border-destructive': form.formState.errors.description
									})}
									editorContentClassName="some-class"
									output="html"
									placeholder="Type your description here..."
									autofocus={true}
									editorClassName="focus:outline-none p-5"
									value={field.value}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="poster_url"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-semibold">
								Event Poster
							</FormLabel>
							<FormControl>
								<div className="flex items-center justify-center w-full">
									<label
										htmlFor="dropzone-file"
										className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-white"
									>
										<div className="flex flex-col items-center justify-center pt-5 pb-6">
											<Upload className="w-10 h-10 mb-3 text-gray-400" />
											<p className="mb-2 text-sm text-gray-500">
												<span className="font-semibold">Click to upload</span>{" "}
												or drag and drop
											</p>
											<p className="text-xs text-gray-500">
												(MAX. 3 files)
											</p>
											<p className="text-xs font-semibold text-yellow-800">Recommended 1080x1080 pixels or Instagram square size </p>
										</div>
										<Input
											id="dropzone-file"
											type="file"
											className="hidden"
											multiple
											accept="image/png,image/jpeg,image/jpg"
											onChange={handleFileChange}
										/>
									</label>
								</div>
							</FormControl>
							<FormMessage />
							{selectedFiles.length > 0 && (
								<div className="flex flex-wrap gap-4 mt-4">
									{selectedFiles.map((file, index) => (
										<div
											key={index}
											onClick={() => removeFile(index)}
											className="relative group cursor-pointer"
										>
											<Image
												src={URL.createObjectURL(file)}
												alt={`Selected file ${index + 1}`}
												className="rounded-lg object-cover w-32 h-32"
												width={128}
												height={128}
											/>
											<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
												<button type="button" className="text-red-500">
													<X size={32} />
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						control={form.control}
						name="campus"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-semibold">
									Campus
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a Campus" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="Gombak">Gombak</SelectItem>
										<SelectItem value="Kuantan">Kuantan</SelectItem>
										<SelectItem value="Pagoh">Pagoh</SelectItem>
										<SelectItem value="Gambang">Gambang</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel className="text-lg font-semibold">
									Date
								</FormLabel>								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-full pl-3 text-left font-normal",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value ? (
													format(field.value, "PPP")
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date < new Date()
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormDescription>
									Event that has more than one day need to put the start date only
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-semibold">
									Location
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Event location"
										className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="organizer"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-semibold">
									Organizer
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Event organizer"
										className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						control={form.control}
						name="fee"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-semibold">
									Fee (RM)
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="0"
										className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
										{...field}
									/>
								</FormControl>
								<FormDescription className="text-sm text-gray-500">
									Leave it as 0 if it's free.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="registration_link"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-semibold">
									Registration Link
								</FormLabel>
								<FormControl>
									<Input
										placeholder="https://example.com/register"
										className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div>
					<h4 className="text-lg font-semibold mb-2">Categories</h4>
					{selectedCategories.length === 0 && (
						<div className="p-2 bg-blue-100 text-blue-800 rounded-lg mb-2">
							No categories selected
						</div>
					)}
					{form.formState.errors.categories && (
						<div className="p-2 bg-red-100 text-red-800 rounded-lg mb-2">
							{form.formState.errors.categories.message}
						</div>
					)}
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
					<div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
						{fixedCategories.map(
							(cate, index) =>
								!selectedCategories.includes(cate) && (
									<div
										key={index}
										className="rounded-full bg-gray-200 text-gray-800 px-3 py-1 text-sm cursor-pointer hover:bg-gray-300 transition-colors"
										onClick={() => addCategory(cate)}
									>
										{cate}
									</div>
								),
						)}
					</div>
				</div>

				<FormField
					control={form.control}
					name="has_starpoints"
					render={({ field }) => (
						<FormItem className="flex flex-col space-y-2">
							<div className="flex items-center space-x-2">
								<FormLabel className="text-sm font-medium text-gray-700">
									Starpoints
								</FormLabel>
								<FormControl>
									<div
										className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer ${field.value ? "bg-indigo-600" : "bg-gray-300"
											}`}
										onClick={() =>
											field.onChange(!field.value)
										}
									>
										<div
											className={`bg-white size-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${field.value ? "translate-x-7" : ""
												}`}
										></div>
									</div>
								</FormControl>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>


				<Button
					className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
					type="submit"
					disabled={form.formState.isSubmitting}
				>
					{form.formState.isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Creating...
						</>
					) : (
						editablePost ? "Update Event" : "Create Event"
					)}
				</Button>
			</form>
		</Form>
	);
}

export default PostForm;
