"use client";
import { updateDetailsPost } from "@/actions/event";
import {
	FloatingPanelCloseButton,
	FloatingPanelContent,
	FloatingPanelFooter,
	FloatingPanelForm,
	FloatingPanelLabel,
	FloatingPanelRoot,
	FloatingPanelSubmitButton,
	FloatingPanelTrigger,
} from "@/components/ui/floating-panel";
import { fixedCategories } from "@/lib/constant";
import { useEvent } from "@/lib/context/EventContextProvider";
import { useToast } from "@/lib/hooks/use-toast";
import { useCategories } from "@/lib/hooks/useCategories";
import { detailSchema } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk, SquarePen, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type * as z from "zod";
import CategoryComboBox from "../post/CategoryComboBox";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

function EventDetailForm() {
	const { toast } = useToast();
	const { event } = useEvent();
	const params = useParams() as { slug: string };

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm<z.infer<typeof detailSchema>>({
		resolver: zodResolver(detailSchema),
		defaultValues: {
			title: event.title,
			location: event.location,
			organizer: event.organizer,
			campus: event.campus,
			fee: event.fee || "0",
			categories: event.categories,
			contacts: event.contacts,
			registration_link: event.registration_link || "",
			has_starpoints: event.has_starpoints,
		},
	});

	const { selectedCategories, addCategory, removeCategory } = useCategories(
		setValue,
		event.categories,
	);

	const onSubmit = async (data: z.infer<typeof detailSchema>) => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				if (key === "contacts") {
					formData.append(key, JSON.stringify(value));
				} else {
					value.forEach((item) => formData.append(key, item as string));
				}
			} else {
				formData.append(key, value as string);
			}
		});

		try {
			const result = await updateDetailsPost({
				formData,
				eventId: params.slug,
			});

			toast({
				title: result.success ? "Saved" : "Error",
				description: result.message,
				variant: result.success ? "success" : "destructive",
			});
		} catch (error) {
			console.error("Error updating event details:", error);
			toast({
				title: "Error",
				description: "Too many requests. Please try again later.",
				variant: "destructive",
			});
		}
	};

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			toast({
				title: "Invalid Input",
				description: "Please check your inputs and try again.",
				variant: "destructive",
			});
			return;
		}
	}, [errors, toast]);

	return (
		<>
			<FloatingPanelRoot className="">
				<FloatingPanelTrigger
					title="Edit Details"
					className="flex flex-row items-center justify-center gap-2"
				>
					<span>Edit Details</span>
					<SquarePen size={16} />
				</FloatingPanelTrigger>
				<div className="w-full">
					<FloatingPanelContent className="w-full lg:w-[28rem]">
						<FloatingPanelForm onSubmit={handleSubmit(onSubmit)}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2">
								{[
									{ id: "title", label: "Title", required: true },
									{ id: "location", label: "Location", required: true },
									{ id: "organizer", label: "Organizer", required: true },
									{ id: "campus", label: "Campus", required: true },
									{ id: "fee", label: "Fee", required: false },
									{
										id: "registration_link",
										label: "Registration Link",
										required: false,
									},
								].map(({ id, label, required }) => (
									<div key={id} className="relative">
										<FloatingPanelLabel htmlFor={id}>
											{label}
											{required && (
												<Asterisk
													size={12}
													className="inline-block ml-1 text-red-500"
												/>
											)}
										</FloatingPanelLabel>
										<Controller
											name={id as keyof z.infer<typeof detailSchema>}
											control={control}
											render={({ field }) => {
												switch (id) {
													case "campus":
														return (
															<Select
																onValueChange={field.onChange}
																defaultValue={field.value?.toString()}
															>
																<SelectTrigger className="w-full">
																	<SelectValue
																		placeholder={field.value?.toString()}
																	/>
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Gombak">Gombak</SelectItem>
																	<SelectItem value="Kuantan">
																		Kuantan
																	</SelectItem>
																	<SelectItem value="Pagoh">Pagoh</SelectItem>
																	<SelectItem value="Gambang">
																		Gambang
																	</SelectItem>
																</SelectContent>
															</Select>
														);
													default:
														return (
															<>
																<Input
																	{...field}
																	value={
																		typeof field.value === "string"
																			? field.value
																			: ""
																	}
																	id={id}
																	type="text"
																	className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
																/>
																{id === "registration_link" && (
																	<label
																		htmlFor="registration_link"
																		className="text-xs"
																	>
																		Leave it empty if there's no link
																	</label>
																)}
																{id === "fee" && (
																	<label htmlFor="fee" className="text-xs">
																		Leave it empty if no fee
																	</label>
																)}
															</>
														);
												}
											}}
										/>
										{errors[id as keyof z.infer<typeof detailSchema>] && (
											<p className="text-red-500 text-xs mt-1">
												{
													errors[id as keyof z.infer<typeof detailSchema>]
														?.message
												}
											</p>
										)}
									</div>
								))}
							</div>
							<div className="px-2 mt-3">
								<div className="relative">
									<FloatingPanelLabel htmlFor="contacts">
										Contacts
										<Asterisk
											size={12}
											className="inline-block ml-1 text-red-500"
										/>
									</FloatingPanelLabel>
									<Controller
										name="contacts"
										control={control}
										render={({ field }) => (
											<div>
												{field.value &&
													Array.isArray(field.value) &&
													field.value.map((contact, index) => (
														<div
															key={index}
															className="flex flex-col sm:flex-row gap-2 mb-2"
														>
															<Input
																placeholder="Name"
																value={
																	typeof contact === "object"
																		? contact.name
																		: ""
																}
																onChange={(e) => {
																	const newContacts = [
																		...(field.value as Array<{
																			name: string;
																			phone: string;
																		}>),
																	];
																	newContacts[index].name = e.target.value;
																	field.onChange(newContacts);
																}}
															/>
															<Input
																placeholder="Phone"
																value={
																	typeof contact === "object"
																		? contact.phone
																		: ""
																}
																onChange={(e) => {
																	const newContacts = [
																		...(field.value as Array<{
																			name: string;
																			phone: string;
																		}>),
																	];
																	newContacts[index].phone = e.target.value;
																	field.onChange(newContacts);
																}}
															/>
															{field.value.length > 1 && (
																<Button
																	type="button"
																	onClick={() => {
																		if (Array.isArray(field.value)) {
																			const newContacts = field.value.filter(
																				(_, i) => i !== index,
																			);
																			field.onChange(newContacts);
																		}
																	}}
																	className="w-full sm:w-auto"
																>
																	Remove
																</Button>
															)}
														</div>
													))}
												{field.value && field.value.length < 2 && (
													<Button
														type="button"
														className="bg-primary w-full sm:w-auto"
														onClick={() => {
															const currentValue = Array.isArray(field.value)
																? field.value
																: [];
															field.onChange([
																...currentValue,
																{ name: "", phone: "" },
															]);
														}}
													>
														Add Contact
													</Button>
												)}
											</div>
										)}
									/>
								</div>
							</div>
							<div className="px-2 mt-3">
								<div className="flex flex-wrap gap-2 pb-3">
									{selectedCategories.map((cate, index) => (
										<div
											key={index}
											className="rounded-full bg-accent brightness-125 px-3 py-1 text-sm cursor-pointer hover:opacity-80 transition-all duration-300"
											onClick={() => removeCategory(cate)}
										>
											{cate} <X size={14} className="inline ml-1" />
										</div>
									))}
								</div>
								<CategoryComboBox
									addCategory={addCategory}
									removeCategory={removeCategory}
									selectedCategories={selectedCategories}
								/>
							</div>
							<Controller
								name="has_starpoints"
								control={control}
								render={({ field }) => (
									<div className="flex flex-row items-center justify-between rounded-lg mt-3 px-2">
										<label
											htmlFor="starpoints"
											className="text-base font-medium"
										>
											Starpoints
										</label>
										<Switch
											id="starpoints"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</div>
								)}
							/>
							<FloatingPanelFooter>
								<FloatingPanelCloseButton />
								<FloatingPanelSubmitButton
									disabled={isSubmitting}
									className="bg-blue-700 text-white px-5 hover:bg-blue-700/90 hover:text-white"
								/>
							</FloatingPanelFooter>
						</FloatingPanelForm>
					</FloatingPanelContent>
				</div>
			</FloatingPanelRoot>
		</>
	);
}

export default EventDetailForm;
