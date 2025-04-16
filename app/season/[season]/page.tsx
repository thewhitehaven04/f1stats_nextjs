import { dbClient } from "@/client/db"
import { EventSection } from "./components/EventSection"
import { eventsPopulatedWithSessionDataModel } from "../../validation"

const fetchEventsWithSessions = async (season: number) => {
    const events = await dbClient.events.findMany({
        where: {
            season_year: season,
            event_format_name: {
                not: "testing",
            },
        },
        include: {
            event_sessions: {
                select: {
                    session_type_id: true,
                },
            },
        },
        orderBy: {
            date_start: "asc",
        },
    })
    return await eventsPopulatedWithSessionDataModel.parseAsync(events)
}

export type TEventWithSessions = Awaited<ReturnType<typeof fetchEventsWithSessions>>[number]

export default async function SeasonPage({ params }: { params: Promise<{ season: string }> }) {
    const seasonInt = Number.parseInt((await params).season)
    const events = await fetchEventsWithSessions(seasonInt)
    return <EventSection events={events} />
}
