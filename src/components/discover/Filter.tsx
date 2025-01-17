"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { fixedCategories } from "@/lib/constant";
import { SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import SearchInput from "../SearchInput";

const FILTER_OPTIONS = {
	categories: fixedCategories.map((category) => category.category),
	additionalFilters: [
		{ id: "fee", label: "Fee" },
		{ id: "starpoints", label: "Starpoints" },
		{ id: "recruitment", label: "Recruitment" },
	],
};

function Filter() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();

	const getActiveFiltersCount = () => {
		let count = 0;
		const categories = searchParams.get("category")?.split(",") || [];
		count += categories.length;
		if (searchParams.get("fee")) count++;
		if (searchParams.get("starpoints")) count++;
		return count;
	};

	const updateSearchParams = (key: string, value: string | boolean) => {
		const params = new URLSearchParams(searchParams.toString());
		if (key === "category") {
			const currentCategories =
				params.get("category")?.split(",").filter(Boolean) || [];
			const valueStr = value.toString();

			if (currentCategories.includes(valueStr)) {
				// remove if alr exist
				const newCategories = currentCategories.filter(
					(cat) => cat !== valueStr,
				);
				if (newCategories.length === 0) {
					params.delete(key);
				} else {
					params.set(key, newCategories.join(","));
				}
			} else if (value) {
				// add if not exist
				const newCategories = [...currentCategories, valueStr];
				params.set(key, newCategories.join(","));
			}
		} else {
			const currentValue = params.get(key);
			if (currentValue === value.toString()) {
				params.delete(key);
			} else {
				params.set(key, value.toString());
			}
		}
		history.pushState(null, "", `?${params.toString()}`); // no useRouter coz it slow af
	};

	const clearAllFilters = () => {
		router.replace("?");
	};

	const CheckboxFilter = ({
		id,
		label,
		paramKey = id.toLowerCase(),
		getValue = (value: string) => value.toLowerCase(),
	}: {
		id: string;
		label: string;
		paramKey?: string;
		getValue?: (value: string) => string;
	}) => {
		const currentValue = getValue(id);
		const isChecked =
			paramKey === "category"
				? searchParams.get(paramKey)?.split(",").includes(currentValue)
				: searchParams.get(paramKey) === currentValue;

		return (
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2 w-full">
					<Checkbox
						id={id}
						checked={isChecked}
						onCheckedChange={() => updateSearchParams(paramKey, currentValue)}
					/>
					<Label className="cursor-pointer w-full" htmlFor={id}>
						{label}
					</Label>
				</div>
			</div>
		);
	};

	const FilterSection = ({
		title,
		items,
		paramKey,
		getValue,
	}: {
		title: string;
		items: string[];
		paramKey?: string;
		getValue?: (value: string) => string;
	}) => (
		<div className="space-y-4">
			<h3 className="font-medium">{title}</h3>
			{items.map((item) => (
				<CheckboxFilter
					key={item}
					id={item}
					label={item}
					paramKey={paramKey}
					getValue={getValue}
				/>
			))}
		</div>
	);

	const FilterContent = () => (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="font-semibold text-md">Select</h2>
				{getActiveFiltersCount() > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearAllFilters}
						className="text-muted-foreground hover:text-primary h-0 flex gap-2"
					>
						Clear all
						<span className="bg-muted text-muted-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
							{getActiveFiltersCount()}
						</span>
					</Button>
				)}
			</div>

			<hr className="border-border" />
			<FilterSection
				title="Categories"
				items={FILTER_OPTIONS.categories}
				paramKey="category"
			/>
			<hr className="border-border" />
			<div className="space-y-4">
				<h3 className="font-medium">Additional Filters</h3>
				{FILTER_OPTIONS.additionalFilters.map(({ id, label }) => (
					<CheckboxFilter
						key={id}
						id={id}
						label={label}
						getValue={() => "true"}
					/>
				))}
			</div>
		</div>
	);

	const activeFilters = getActiveFiltersCount();

	return (
		<>
			{/* Mobile View */}
			{isMobile && (
				<div className="flex gap-2 w-full">
					<div className="flex-1">
						<SearchInput page="Discover" />
					</div>
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="shrink-0 relative"
							>
								<SlidersHorizontal className="h-4 w-4" />
								{activeFilters > 0 && (
									<span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
										{activeFilters}
									</span>
								)}
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-[280px] sm:w-[320px]">
							<SheetHeader>
								<SheetTitle>Filter Events</SheetTitle>
								<SheetDescription>
									Filter events by category, fee and starpoints
								</SheetDescription>
							</SheetHeader>
							<div className="py-6">
								<FilterContent />
							</div>
						</SheetContent>
					</Sheet>
				</div>
			)}
			{/* Desktop View */}
			{!isMobile && (
				<div className="w-full">
					<SearchInput page="Discover" />
					<FilterContent />
				</div>
			)}
		</>
	);
}

export default Filter;
