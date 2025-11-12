import dbClient from "@/shared/client/db"
import { fetchTeamSeasonForm } from "@/modules/team-season-results/fetcher"
import { TeamSeasonResultsScreen } from "@/modules/team-season-results/TeamSeasonResultsScreen"

export async function generateMetadata({
    params,
}: { params: Promise<{ season: string; team: string }> }) {
    const team = await dbClient.teams.findUniqueOrThrow({
        where: { id: Number.parseInt((await params).team) },
    })

    return {
        title: `${team.team_display_name} ${(await params).season} season form`,
    }
}

export default async function TeamSeasonFormPage(props: {
    params: Promise<{ season: string; team: string }>
}) {
    const { season, team } = await props.params
    const data = await fetchTeamSeasonForm(season, team)
    return <TeamSeasonResultsScreen {...data} />
}
