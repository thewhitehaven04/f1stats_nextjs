import dbClient from "@/shared/client/db"
import type { ISeasonStandings } from "./types"

export const fetchSeasonStandings = async ({
    season,
}: { season: number }): Promise<ISeasonStandings> => {
    return {
        season: season,
        standings: (
            await dbClient.season_standings.findMany({
                where: {
                    season_year: season,
                },
            })
        ).map((standing) => ({
            driver: standing.driver_id,
            points: Number(standing.sum) ?? 0,
        })),
    }
}
