import dbClient from "@/client/db"
import { EventSection } from "./components/EventSection"
import type { Metadata } from "next"

// revalidate calendar data every 30 minutes
export const revalidate = 1800

export async function generateMetadata({
    params,
}: { params: { season: string } }): Promise<Metadata> {
    return {
        title: `F1Stats | Season ${params.season}`,
    }
}

export async function generateStaticParams() {
    // cache every season other than the current one
    const seasons = await dbClient.seasons.findMany({
        orderBy: {
            season_year: "desc",
        },
        skip: 1,
    })
    return seasons.map((season) => ({
        season: season.season_year.toString(),
    }))
}

export const fetchEventsWithSessions = async (season: number) => {
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
}

export type TEventWithSessions = Awaited<ReturnType<typeof fetchEventsWithSessions>>[number]

export default async function SeasonPage({ params }: { params: Promise<{ season: string }> }) {
    const seasonInt = Number.parseInt((await params).season)
    const events = await fetchEventsWithSessions(seasonInt)
    return <EventSection events={events} />
}
