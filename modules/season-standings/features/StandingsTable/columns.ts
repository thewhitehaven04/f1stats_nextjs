import { createColumnHelper } from "@tanstack/react-table"
import type { IDriverStandingsTableRow, ITeamStandingsTableRow } from "./types"

const columns = createColumnHelper<IDriverStandingsTableRow | ITeamStandingsTableRow>()

export const DRIVER_STANDINGS_COLUMNS = [
    columns.display({
        id: "driver",
        header: "Driver",
    }),
    columns.display({
        id: "points",
        header: "Points",
    }),
]

export const TEAM_STANDINGS_COLUMNS = [
    columns.display({
        id: "team",
        header: "Team name",
    }),
    columns.display({
        id: "points",
        header: "Points",
    }),
]
