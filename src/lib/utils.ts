import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function localDateFormat(date: Date) {
	return format(new Date(date).toLocaleDateString(), "dd/M/yy");
}
