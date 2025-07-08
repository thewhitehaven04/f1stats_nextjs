import dbClient from "@/client/db"
import { cache } from "react"
export const fetchEventsWithSessions = cache(async (season: number) => {
    return (
        await dbClient.events.findMany({
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
    ).map((evt) => ({
        name: evt.event_name,
        officialName: evt.event_official_name,
        format: evt.event_format_name,
        sessions: evt.event_sessions.map((session) => ({
            type: session.session_type_id,
        })),
        dateStart: evt.date_start,
        country: evt.country,
        season: evt.season_year,
    }))
})
