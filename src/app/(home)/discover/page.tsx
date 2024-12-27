import Filter from "@/components/discover/Filter";
import EventList from "@/components/homepage/EventList";

 function Events() {
	return (
		<div className="min-h-dvh w-full px-4 md:px-6 lg:px-8 py-3">
			<div className="flex flex-col lg:flex-row gap-4">
				<aside className="w-full lg:w-64">
					<Filter />
				</aside>
				<div className="flex-1">
					<EventList />
				</div>
			</div>
		</div>
	);
}

export default Events;
