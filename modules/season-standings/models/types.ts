export interface ISeasonStandings {
    season: number
    driverStandings: {
        driver: string
        points: number
    }[]
    teamStandings: {
        team: string
        points: number
    }[]
}
