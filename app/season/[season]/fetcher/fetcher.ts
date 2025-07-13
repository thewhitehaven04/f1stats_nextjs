import dbClient from "@/client/db"
import { cache } from "react"
export const fetchEventsWithSessions = cache(async (season: string) => {
    return (
        await dbClient.events.findMany({
            where: {
                season_year: Number.parseInt(season),
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
    ).filter((e) => e.event_sessions.length > 0)
})

export type TSeasonEvent = Awaited<ReturnType<typeof fetchEventsWithSessions>>[number]
