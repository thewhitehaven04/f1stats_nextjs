export interface IDriverStandingsTableRow {
    driver: string
    points: number
}

export interface ITeamStandingsTableRow {
    team: string
    points: number
}

export type TStandingsTableProps =
    | {
          type: "driver"
          rows: IDriverStandingsTableRow[]
      }
    | {
          type: "team"
          rows: ITeamStandingsTableRow[]
      }
