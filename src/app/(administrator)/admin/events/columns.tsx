"use client";

import type { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Events = {
	id: string;
	title: string;
	desc: string;
	bookmarks: number;
};

export const columns: ColumnDef<Events>[] = [
	{
		accessorKey: "id",
		header: "Id",
	},
	{
		accessorKey: "title",
		header: "Title",
	},
	{
		accessorKey: "desc",
		header: "Description",
	},
	{
		accessorKey: "bookmarks",
		header: "Bookmarks",
	},
];
