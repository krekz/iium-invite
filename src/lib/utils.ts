import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { fixedCategories } from "./constant";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function localDateFormat(date: Date) {
	return format(new Date(date).toLocaleDateString(), "dd/M/yy");
}

export function sortedCategories() {
	return fixedCategories
		.flatMap((cate) =>
			[...cate.subsets].map((subset) => ({
				category: cate.category,
				subset: subset,
			})),
		)
		.sort((a, b) => a.subset.localeCompare(b.subset));
}
