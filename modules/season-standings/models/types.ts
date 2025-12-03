export interface ISeasonStandings {
    season: number
    standings: {
        driver: string
        points: number
    }[]
}
