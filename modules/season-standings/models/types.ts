export interface ISeasonStandings {
    season: number
    driverStandings: {
        driver: string
        points: number
        position: number
    }[]
    teamStandings: {
        team: string
        points: number
        position: number
    }[]
}
