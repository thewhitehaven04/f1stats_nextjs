import { fetchSeasonStandings } from "@/modules/season-standings/models/standings"
import { SeasonStandingsScreen } from "@/modules/season-standings/SeasonStandingsScreen"

export default async function SeasonStatisticsPage(props: { params: Promise<{ season: string }> }) {
    const standings = await fetchSeasonStandings({ season: Number((await props.params).season) })
    return <SeasonStandingsScreen standings={standings} />
}
