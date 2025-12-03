export interface IDriverStandingsTableRow {
    driver: string
    points: number
}

export interface ITeamStandingsTableRow {
    team: {
        name: string
        color: string
    }
    points: number
}

export interface IStandingsTableProps {
    rows: IDriverStandingsTableRow[]
}