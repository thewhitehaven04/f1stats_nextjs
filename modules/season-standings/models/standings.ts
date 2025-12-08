import dbClient from "@/shared/client/db"
import type { ISeasonStandings } from "./types"

export const fetchDriverSeasonStandings = async ({
    season,
}: {
    season: number
}): Promise<ISeasonStandings> => {
    const [teamStandings, driverStandings] = await Promise.all([
        dbClient.teams_season_standings.findMany({
            where: {
                season_year: season,
            },
            orderBy: {
                sum: "desc",
            },
        }),
        dbClient.season_standings.findMany({
            where: {
                season_year: season,
            },
            orderBy: {
                sum: "desc",
            },
        }),
    ])
    return {
        season: season,
        driverStandings: driverStandings.map((standing, index) => ({
            driver: standing.driver_id,
            points: Number(standing.sum),
            position: index + 1,
        })),
        teamStandings: teamStandings.map((standing, index) => ({
            team: standing.team_display_name,
            points: Number(standing.sum),
            position: index + 1,
        })),
    }
}
