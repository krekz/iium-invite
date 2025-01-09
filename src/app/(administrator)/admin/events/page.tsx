import UsersTable from "@/components/admin/UsersTable";
import { Events, columns } from "./columns";
import { DataTable } from "./data-table";

const data = [
	{
		id: "1",
		title: "Event 1",
		desc: "Description 1",
		bookmarks: 10,
	},
	{
		id: "2",
		title: "Event 2",
		desc: "Description 2",
		bookmarks: 20,
	},
	{
		id: "3",
		title: "Event 3",
		desc: "Description 3",
		bookmarks: 30,
	},
	{
		id: "4",
		title: "Event 4",
		desc: "Description 4",
		bookmarks: 40,
	},
	{
		id: "5",
		title: "Event 5",
		desc: "Description 5",
		bookmarks: 50,
	},
];

function Page() {
	return <DataTable columns={columns} data={data} />;
}

export default Page;
