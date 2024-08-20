import EventLists from "@/components/events/event-list";

function Events() {
  return (
    <div className="container">
      <div className="flex justify-center text-3xl font-bold p-3">
        Events
      </div>
      <EventLists />
    </div>
  )
}

export default Events;
