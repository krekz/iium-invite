import { getEventReports } from "@/actions/admin/event-reports";
import React from "react";
import { DataTable } from "../../_components/data-table";
import { columns } from "./columns";

async function EventReports() {
	const reportedEvents = await getEventReports();
	return (
		<div className="pt-3">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Event Reports</h1>
				<p className="text-muted-foreground">
					Manage reported events and take action
				</p>
			</div>
			<div className="border rounded-lg bg-card">
				<DataTable columns={columns} data={reportedEvents} />
			</div>
		</div>
	);
}

export default EventReports;
