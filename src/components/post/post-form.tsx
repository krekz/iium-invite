"use client";
import { createPost } from "@/actions/events/post";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategories";
import { useFiles } from "@/hooks/useFiles";
import { useLoadingToast } from "@/hooks/useLoadingToast";
import { cn } from "@/lib/utils";
import { postSchema } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Asterisk, CalendarIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { MinimalTiptapEditor } from "../minimal-tiptap";
import CategoryComboBox from "./CategoryComboBox";
function PostForm() {
	const { toast } = useToast();
	const router = useRouter();
	const { LoadingOverlay, startLoading, stopLoading } = useLoadingToast();
	const threeDaysFromNow = new Date(
		new Date().setDate(new Date().getDate() + 3),
	);

	const form = useForm<z.infer<typeof postSchema>>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: "",
			description: "",
			location: "",
			organizer: "",
			fee: "0",
			registration_link: "",
			categories: [],
			has_starpoints: false,
			campus: "",
			isRecruiting: false,
			date: threeDaysFromNow, // set default date to 3 days from now
			contacts: [],
		},
	});

	const { selectedFiles, handleFileChange, removeFile } = useFiles(
		form.setValue,
	);
	const { selectedCategories, addCategory, removeCategory } = useCategories(
		form.setValue,
	);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const remainingSlots = 3 - selectedFiles.length;
			const filesToAdd = acceptedFiles.slice(0, remainingSlots);

			if (acceptedFiles.length > remainingSlots) {
				toast({
					title: "File Limit Exceeded",
					description: `Only the first ${remainingSlots} files were added. Maximum 3 files allowed.`,
					variant: "destructive",
				});
			}

			handleFileChange({ target: { files: filesToAdd } } as any);
		},
		[selectedFiles.length, handleFileChange, toast],
	);

	// Separate dropzone for the file input area
	const {
		getRootProps: getInputRootProps,
		getInputProps,
		isDragActive: isInputDragActive,
	} = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [],
			"image/png": [],
			"image/jpg": [],
		},
		maxFiles: 3,
		noDragEventsBubbling: true,
	});

	const { getRootProps: getPageRootProps, isDragActive: isPageDragActive } =
		useDropzone({
			onDrop,
			accept: {
				"image/jpeg": [],
				"image/png": [],
				"image/jpg": [],
			},
			maxFiles: 3,
			noClick: true,
			noDragEventsBubbling: true,
		});

	useEffect(() => {
		if (
			form.formState.isSubmitted &&
			Object.keys(form.formState.errors).length > 0
		) {
			toast({
				title: "Input Error",
				description: "Please check all required fields",
				variant: "destructive",
			});
		}
	}, [form.formState.isSubmitted, form.formState.errors, toast]);

	const onSubmit = async (values: z.infer<typeof postSchema>) => {
		startLoading();
		const formData = new FormData();

		const appendFormData = (
			key: string,
			value: z.infer<typeof postSchema>[keyof z.infer<typeof postSchema>],
		) => {
			if (Array.isArray(value)) {
				if (key === "contacts") {
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

		Object.entries(values).forEach(([key, value]) =>
			appendFormData(key, value),
		);
		selectedFiles.forEach((file, index) =>
			formData.append(`poster_url[${index}]`, file),
		);

		try {
			const { success, message, eventId } = await createPost({ formData });
			stopLoading();

			toast({
				title: success ? "Success" : "Error",
				description: message,
				variant: success ? "success" : "destructive",
			});

			if (success) {
				form.reset();
				router.push(`/events/${eventId}`);
			}
		} catch (error) {
			console.error("Error in CreatePost:", error);

			toast({
				title: "Error",
				description: "Something went wrong.",
				variant: "destructive",
			});
		}
	};

	return (
		<>
			<LoadingOverlay />
			<div
				{...getPageRootProps()}
				className={cn(
					"min-h-screen relative",
					isPageDragActive &&
						"after:absolute after:inset-0 after:bg-primary/10 after:border-2 after:border-dashed after:border-primary",
				)}
			>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full sm:max-w-4xl mx-auto space-y-8 p-4 sm:p-6  rounded-lg"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg font-semibold flex items-center">
										Event Title{" "}
										<Asterisk className="h-4 w-4 text-red-500 ml-1" />
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
										Description{" "}
										<Asterisk className="h-4 w-4 text-red-500 ml-1" />
									</FormLabel>
									<FormControl>
										<MinimalTiptapEditor
											{...field}
											throttleDelay={2000}
											className={cn("w-full", {
												"border-destructive focus-within:border-destructive":
													form.formState.errors.description,
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
										Event Poster{" "}
										<Asterisk className="h-4 w-4 text-red-500 ml-1" />
									</FormLabel>
									<FormControl>
										<div className="flex items-center justify-center w-full">
											<div
												{...getInputRootProps()}
												className={cn(
													"flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card-foreground text-primary",
													isInputDragActive && "border-primary bg-primary/10",
												)}
											>
												<input {...getInputProps()} />
												<div className="flex flex-col items-center justify-center p-5">
													<Upload className="w-10 h-10 mb-3" />
													<p className="mb-2 text-sm">
														{isInputDragActive ? (
															<span className="font-semibold">
																Drop the files here
															</span>
														) : (
															<>
																<span className="font-semibold">
																	Click to upload
																</span>{" "}
																or drag and drop
															</>
														)}
													</p>
													<p className="text-xs">(MAX. 3 files)</p>
													<p className="text-xs font-semibold text-center text-yellow-600">
														Recommended 1080x1080 pixels or Instagram square
														size{" "}
													</p>
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
															!field.value && "text-muted-foreground",
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
													disabled={(date) => date < threeDaysFromNow}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormDescription>
											Event that has more than one day need to put the start
											date only
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
											Location{" "}
											<Asterisk className="h-4 w-4 text-red-500 ml-1" />
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
											Organizer{" "}
											<Asterisk className="h-4 w-4 text-red-500 ml-1" />
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
											Contacts (Max 2){" "}
											<Asterisk className="h-4 w-4 text-red-500 ml-1" />
										</FormLabel>
										<FormControl>
											<div>
												{field.value.map((contact, index) => (
													<div
														key={index}
														className="flex space-x-2 mb-2 w-full"
													>
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
																const newContacts = field.value.filter(
																	(_, i) => i !== index,
																);
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
																field.onChange([
																	...field.value,
																	{ name: "", phone: "" },
																]);
															} else {
																toast({
																	title: "Error",
																	description:
																		"You can only add up to 2 contacts",
																	variant: "destructive",
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
								selectedCategories={selectedCategories}
								addCategory={addCategory}
								removeCategory={removeCategory}
							/>
						</div>
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-secondary/30 rounded-lg">
							<FormField
								control={form.control}
								name="has_starpoints"
								render={({ field }) => (
									<FormItem className="flex-1 w-full">
										<div className="flex items-center justify-between">
											<FormLabel className="text-sm font-medium flex items-center gap-2">
												Starpoints
											</FormLabel>
											<FormControl>
												<div
													className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
														field.value ? "bg-primary" : "bg-muted"
													}`}
													onClick={() => field.onChange(!field.value)}
												>
													<div
														className={`bg-white size-4 rounded-full shadow-sm transform transition-transform duration-200 ${
															field.value ? "translate-x-6" : "translate-x-0"
														}`}
													/>
												</div>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isRecruiting"
								render={({ field }) => (
									<FormItem className="flex-1 w-full">
										<div className="flex items-center justify-between">
											<FormLabel className="text-sm font-medium flex items-center gap-2">
												Recruitment (committee, etc..)
											</FormLabel>
											<FormControl>
												<div
													className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
														field.value ? "bg-primary" : "bg-muted"
													}`}
													onClick={() => field.onChange(!field.value)}
												>
													<div
														className={`bg-white size-4 rounded-full shadow-sm transform transition-transform duration-200 ${
															field.value ? "translate-x-6" : "translate-x-0"
														}`}
													/>
												</div>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
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
								"Create Event"
							)}
						</Button>
					</form>
				</Form>
			</div>
		</>
	);
}

export default PostForm;
