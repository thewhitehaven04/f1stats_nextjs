export interface IDriverStandingsTableRow {
    position: number
    driver: string
    points: number
}

export interface ITeamStandingsTableRow {
    position: number
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
