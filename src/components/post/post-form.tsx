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
import { fixedCategories } from "@/lib/constant";
import Image from "next/image";
import { X, Upload, CalendarIcon, Loader2, Asterisk } from "lucide-react";
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
import { add, format } from "date-fns";
import { CreatePost } from "@/actions/event";
import { useRouter } from "next/navigation";
import { EventsProps } from "@/lib/types";
import { useFiles } from "@/lib/hooks/useFiles";
import { useCategories } from "@/lib/hooks/useCategories";
import { useToast } from "@/lib/hooks/use-toast";
import { MinimalTiptapEditor } from "../minimal-tiptap";
import { useCallback, useEffect } from "react";
import CategoryComboBox from "./CategoryComboBox";
import { useDropzone } from 'react-dropzone';

type EventFormProps = {
	editablePost?: EventsProps
};

function PostForm({ editablePost }: EventFormProps) {
	const { toast } = useToast();
	const router = useRouter()

	const form = useForm<z.infer<typeof postSchema>>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: editablePost?.title ?? "",
			description: editablePost?.description ?? "",
			location: editablePost?.location ?? "",
			organizer: editablePost?.organizer ?? "",
			fee: editablePost?.fee ?? "0",
			registration_link: editablePost?.registration_link ?? "",
			categories: editablePost?.categories ?? [],
			has_starpoints: editablePost?.has_starpoints ?? false,
			campus: editablePost?.campus ?? "",
			date: editablePost?.date ?? new Date(new Date().setDate(new Date().getDate() + 1)), // set default date to tomorrow
			contacts: editablePost?.contacts ?? [],
		},
	});

	const { selectedFiles, handleFileChange, removeFile } = useFiles(form.setValue);
	const { selectedCategories, addCategory, removeCategory } = useCategories(form.setValue);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const remainingSlots = 3 - selectedFiles.length;
		const filesToAdd = acceptedFiles.slice(0, remainingSlots);

		if (acceptedFiles.length > remainingSlots) {
			toast({
				title: "File Limit Exceeded",
				description: "Only the first " + remainingSlots + " files were added. Maximum 3 files allowed.",
				variant: "destructive"
			});
		}

		handleFileChange({ target: { files: filesToAdd } } as any);
	}, [selectedFiles.length, handleFileChange, toast]);

	// Separate dropzone for the file input area
	const { getRootProps: getInputRootProps, getInputProps, isDragActive: isInputDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/jpeg': [],
			'image/png': [],
			'image/jpg': []
		},
		maxFiles: 3,
		noDragEventsBubbling: true,
	});

	const { getRootProps: getPageRootProps, isDragActive: isPageDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/jpeg': [],
			'image/png': [],
			'image/jpg': []
		},
		maxFiles: 3,
		noClick: true,
		noDragEventsBubbling: true,
	});

	useEffect(() => {
		if (form.formState.isSubmitted && Object.keys(form.formState.errors).length > 0) {
			toast({
				title: "Input Error",
				description: "Please check all required fields",
				variant: "destructive"
			});
		}
	}, [form.formState.isSubmitted, form.formState.errors]);

	const onSubmit = async (values: z.infer<typeof postSchema>) => {
		const formData = new FormData();

		const appendFormData = (key: string, value: any) => {
			if (Array.isArray(value)) {
				if (key === 'contacts') {
					formData.append(key, JSON.stringify(value));
				} else {
					value.forEach((item) => formData.append(key, item as string));
				}
			} else if (value instanceof Date) {
				formData.append(key, value.toISOString());
			} else if (value != null) {
				formData.append(key, String(value));
			}
		};

		Object.entries(values).forEach(([key, value]) => appendFormData(key, value));
		selectedFiles.forEach((file, index) => formData.append(`poster_url[${index}]`, file));

		try {
			const newPost = await CreatePost({ formData });

			toast({
				title: newPost.success ? "Success" : "Error",
				description: newPost.message,
				variant: newPost.success ? "success" : "destructive"
			});

			router.push(`/events/${newPost.eventId}`);
		} catch (error) {
			console.error("Error in CreatePost:", error);

			toast({
				title: "Error",
				description: "Something went wrong.",
				variant: "destructive"
			});
		}
	};

	return (
		<div
			{...getPageRootProps()}
			className={cn(
				"min-h-screen relative",
				isPageDragActive && "after:absolute after:inset-0 after:bg-primary/10 after:border-2 after:border-dashed after:border-primary"
			)}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="max-w-3xl mx-auto space-y-8 p-6 border rounded-lg "
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-semibold flex items-center">
									Event Title <Asterisk className="h-4 w-4 text-red-500 ml-1" />
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
								<FormLabel className="text-lg font-semibold flex items-center">
									Description <Asterisk className="h-4 w-4 text-red-500 ml-1" />
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
										immediatelyRender={false}
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
								<FormLabel className="text-lg font-semibold flex items-center">
									Event Poster <Asterisk className="h-4 w-4 text-red-500 ml-1" />
								</FormLabel>
								<FormControl>
									<div className="flex items-center justify-center w-full">
										<div
											{...getInputRootProps()}
											className={cn(
												"flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-accent transition-colors",
												isInputDragActive && "border-primary bg-primary/10"
											)}
										>
											<input {...getInputProps()} />
											<div className="flex flex-col items-center justify-center pt-5 pb-6">
												<Upload className="w-10 h-10 mb-3" />
												<p className="mb-2 text-sm">
													{isInputDragActive ? (
														<span className="font-semibold">Drop the files here</span>
													) : (
														<>
															<span className="font-semibold">Click to upload</span>{" "}
															or drag and drop
														</>
													)}
												</p>
												<p className="text-xs">
													(MAX. 3 files)
												</p>
												<p className="text-xs font-semibold text-yellow-600">Recommended 1080x1080 pixels or Instagram square size </p>
											</div>
										</div>
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
									<FormLabel className="text-lg font-semibold flex items-center">
										Campus <Asterisk className="h-4 w-4 text-red-500 ml-1" />
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
									<FormLabel className="text-lg font-semibold flex items-center">
										Date <Asterisk className="h-4 w-4 text-red-500 ml-1" />
									</FormLabel>
									<Popover>
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
													date <= new Date()
												}
												// defaultMonth={new Date(new Date().setDate(new Date().getDate() + 1))}
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
									<FormLabel className="text-lg font-semibold flex items-center">
										Location <Asterisk className="h-4 w-4 text-red-500 ml-1" />
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
									<FormLabel className="text-lg font-semibold flex items-center">
										Organizer <Asterisk className="h-4 w-4 text-red-500 ml-1" />
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
									<FormDescription>
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
						<FormField
							control={form.control}
							name="contacts"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg font-semibold flex items-center">
										Contacts (Max 2) <Asterisk className="h-4 w-4 text-red-500 ml-1" />
									</FormLabel>
									<FormControl>
										<div>
											{field.value.map((contact, index) => (
												<div key={index} className="flex space-x-2 mb-2 w-full">
													<Input
														placeholder="Name"
														value={contact.name}
														onChange={(e) => {
															const newContacts = [...field.value];
															newContacts[index].name = e.target.value;
															field.onChange(newContacts);
														}}
														className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
													/>
													<Input
														placeholder="Phone"
														value={contact.phone}
														onChange={(e) => {
															const newContacts = [...field.value];
															newContacts[index].phone = e.target.value;
															field.onChange(newContacts);
														}}
														className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
													/>
													<Button
														type="button"
														onClick={() => {
															const newContacts = field.value.filter((_, i) => i !== index);
															field.onChange(newContacts);
														}}
														variant="destructive"
													>
														Remove
													</Button>
												</div>
											))}
											{field.value.length < 2 && (
												<Button
													type="button"
													onClick={() => {
														if (field.value.length < 2) {
															field.onChange([...field.value, { name: '', phone: '' }]);
														} else {
															toast({
																title: "Error",
																description: "You can only add up to 2 contacts",
																variant: "destructive"
															});
														}
													}}
													variant="outline"
													className="mt-2 w-full bg-accent"
												>
													Add Contact
												</Button>
											)}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div>
						<h4 className="text-lg font-semibold mb-2 flex items-center">
							Categories <Asterisk className="h-4 w-4 text-red-500 ml-1" />
						</h4>
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
									className="rounded-full bg-secondary px-3 py-1 text-sm cursor-pointer transition-colors"
									onClick={() => removeCategory(cate)}
								>
									{cate} <X size={14} className="inline ml-1" />
								</div>
							))}
						</div>
						<CategoryComboBox
							categories={fixedCategories}
							selectedCategories={selectedCategories}
							addCategory={addCategory}
							removeCategory={removeCategory} />
					</div>

					<FormField
						control={form.control}
						name="has_starpoints"
						render={({ field }) => (
							<FormItem className="flex flex-col space-y-2">
								<div className="flex items-center space-x-2">
									<FormLabel className="text-sm font-medium">
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
						className="w-full bg-primary text-white font-bold py-2 px-4 rounded transition-colors"
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
		</div>
	);
}

export default PostForm;
