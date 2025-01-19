"use client";

import type { EventReports } from "@/actions/admin/event-reports";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn, posterFullUrl, stripHtmlTags } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

export const columns: ColumnDef<EventReports[number]>[] = [
	{
		accessorKey: "event.title",
		header: "Title",
		cell: ({ row }) => (
			<div className="max-w-32 truncate " title={row.original.event.title}>
				{row.original.event.title}
			</div>
		),
	},
	{
		accessorKey: "event.poster_url",
		header: "Poster",
		cell: ({ row }) => {
			const posterUrl = row.original.event.poster_url;
			return (
				<Image
					src={posterFullUrl(posterUrl[0])}
					alt="Event poster"
					className="w-24 h-24 object-cover rounded-md"
					width={150}
					height={100}
				/>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<span
					className={`px-2 py-1 rounded-full text-xs font-medium ${
						status === "pending"
							? "bg-yellow-100 text-yellow-800"
							: status === "resolved"
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800"
					}`}
				>
					{status}
				</span>
			);
		},
	},
	{
		accessorKey: "type",
		header: "Type",
	},
	{
		accessorKey: "reason",
		header: "Reason",
	},
	{
		accessorKey: "reportedBy",
		header: "Reported By",
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt);
			return date.toLocaleString("en-GB", {
				day: "2-digit",
				month: "2-digit",
				year: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			});
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const event = row.original.event;
			return (
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm">
							View Details
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>{event.title}</DialogTitle>
						</DialogHeader>
						<div className="mt-4 space-y-4">
							<div className="relative aspect-square">
								<Image
									src={posterFullUrl(event.poster_url[0])}
									alt="Event poster"
									className="rounded-lg"
									fill
								/>
							</div>
							<p className="text-sm text-muted-foreground">
								{stripHtmlTags(event.description)}
							</p>
						</div>
						<Link
							href={`/events/${event.id}`}
							target="_blank"
							className={cn(buttonVariants({ variant: "default" }), "mt-4")}
						>
							View Page
						</Link>
					</DialogContent>
				</Dialog>
			);
		},
	},
];
