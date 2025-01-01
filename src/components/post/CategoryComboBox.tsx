"use client";
import type { fixedCategories } from "@/lib/constant";
import { useCategories } from "@/lib/hooks/useCategories";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "../ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type ComboBoxProps = {
	categories: typeof fixedCategories;
	addCategory: (cate: string) => void;
	removeCategory: (cate: string) => void;
	selectedCategories: string[];
};

function CategoryComboBox({
	categories,
	addCategory,
	removeCategory,
	selectedCategories,
}: ComboBoxProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{selectedCategories.length > 0
						? `${selectedCategories.length} selected`
						: "Select categories..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search categories..." />
					<CommandList>
						<CommandEmpty>No category found.</CommandEmpty>
						<CommandGroup>
							{categories.flatMap((cate) =>
								cate.subsets.map((subset) => (
									<CommandItem
										key={subset}
										value={subset.toLowerCase()}
										onSelect={(currentValue) => {
											if (!selectedCategories.includes(currentValue)) {
												addCategory(currentValue);
											} else {
												removeCategory(currentValue);
											}
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedCategories.includes(subset.toLowerCase())
													? "opacity-100"
													: "opacity-0",
											)}
										/>
										{subset}
									</CommandItem>
								)),
							)}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export default CategoryComboBox;
