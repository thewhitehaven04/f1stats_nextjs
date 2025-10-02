import dbClient from "@/shared/client/db"
import { TeamSeasonResultsScreen } from "@/modules/TeamSeasonResults/TeamSeasonResultsScreen"

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
    return <TeamSeasonResultsScreen season={season} team={team} />
}
