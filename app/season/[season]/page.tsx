import type { Metadata } from "next"
import { SeasonCalendarScreen } from "@/modules/season-calendar/SeasonCalendarScreen"
import { getSeasonEvents } from "@/modules/season-calendar/models/season-events"
import { fetchSeasons } from "@/modules/season-calendar/models/seasons"

export const revalidate = 3600

export async function generateMetadata({
    params,
}: { params: Promise<{ season: string }> }): Promise<Metadata> {
    return {
        title: `F1Stats | Season ${(await params).season}`,
    }
}

export async function generateStaticParams() {
    return (await fetchSeasons({ seasons: { orderBy: "desc" } })).map((season) => ({
        season: String(season.season_year),
    }))
}

export default async function SeasonPage({ params }: { params: Promise<{ season: string }> }) {
    const season = (await params).season
    const events = await getSeasonEvents({ season })
    return <SeasonCalendarScreen events={events} season={season} />
}
