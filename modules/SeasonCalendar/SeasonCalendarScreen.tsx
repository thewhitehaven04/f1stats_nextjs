import type { TMappedSeasonEvent } from "../../app/season/[season]/fetcher/types"
import { EventCard } from './components/EventCard'

export const SeasonCalendarScreen = ({ events }: { events: TMappedSeasonEvent[] }) => {
    const testingEvents = events.filter((event) => event.format === "testing")
    const calendarEvents = events.filter((event) => event.format !== "testing")
    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-lg">Pre-Season testing</h2>
            <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(330px,_1fr))] gap-4">
                {testingEvents.length ? (
                    testingEvents.map((event) => event && <EventCard key={event.officialName} {...event} />)
                ) : (
                    <div className="flex flex-col text-muted-foreground font-medium">
                        No timing data available
                    </div>
                )}
            </div>
            <h2 className="text-lg">Calendar events</h2>
            <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(330px,_1fr))] gap-4">
                {calendarEvents.length ? (
                    calendarEvents.map((event) => event && <EventCard key={event.officialName} {...event} />)
                ) : (
                    <div className="flex flex-col font-medium">No timing data available</div>
                )}
            </div>
        </section>
    )
}
