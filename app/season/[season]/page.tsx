import dbClient from "../../../shared/client/db"
import { SeasonCalendarScreen } from "../../../modules/SeasonCalendar/SeasonCalendarScreen"
import type { Metadata } from "next"
import { fetchSeasonEvents } from '@/modules/SeasonCalendar/fetcher'

// revalidate calendar data every 30 minutes
export const revalidate = 1800

export async function generateMetadata({
    params,
}: { params: Promise<{ season: string }> }): Promise<Metadata> {
    return {
        title: `F1Stats | Season ${(await params).season}`,
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

export default async function SeasonPage({ params }: { params: Promise<{ season: string }> }) {
    const events = await fetchSeasonEvents({ season: (await params).season })
    return <SeasonCalendarScreen events={events} />
}
