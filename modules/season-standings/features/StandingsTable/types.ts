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
          position: number
          type: "driver"
          rows: IDriverStandingsTableRow[]
      }
    | {
          position: number
          type: "team"
          rows: ITeamStandingsTableRow[]
      }
