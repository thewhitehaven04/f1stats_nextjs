import type { ScheduledEvent } from "@/client/generated"
import { EventCard } from "./EventCard"

export const EventSection = ({ events }: { events: ScheduledEvent[] }) => {
    const currentDate = new Date()
    const testingEvents = events.filter((event) =>
        event.EventFormat === "testing" && event.Session1DateUtc
            ? new Date(event.Session1DateUtc) < currentDate
            : false,
    )
    const calendarEvents = events.filter((event) =>
        event.EventFormat !== "testing" && event.Session1DateUtc
            ? new Date(event.Session1DateUtc) < currentDate
            : false,
    )
    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-lg">Pre-Season testing</h2>
            <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(330px,_1fr))] gap-4">
                {testingEvents.length ? (
                    testingEvents.map((event, index) => (
                        <EventCard key={event.EventName} {...event} RoundNumber={index + 1} />
                    ))
                ) : (
                    <div className="flex flex-col text-neutral-500 font-medium">
                        No timing data available
                    </div>
                )}
            </div>
            <h2 className="text-lg">Calendar events</h2>
            <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(330px,_1fr))] gap-4">
                {calendarEvents.length ? (
                    calendarEvents.map((event) => <EventCard key={event.EventName} {...event} />)
                ) : (
                    <div className="flex flex-col text-neutral-500 font-medium">
                        No timing data available
                    </div>
                )}
            </div>
        </section>
    )
}
