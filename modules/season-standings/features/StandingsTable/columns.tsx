import { createColumnHelper } from "@tanstack/react-table"
import type { IDriverStandingsTableRow, ITeamStandingsTableRow } from "./types"

const columns = createColumnHelper<IDriverStandingsTableRow | ITeamStandingsTableRow>()

const BASE_COLUMNS = [
    columns.accessor("position", {
        header: "Position",
        cell: ({ row }) => <span>{row.index + 1}</span>,
        size: 5,
    }),
    columns.accessor("points", {
        header: "Points",
        cell: ({ row }) => <span>{row.getValue("points")}</span>,
        size: 5,
    }),
]

export const DRIVER_STANDINGS_COLUMNS = [
    ...BASE_COLUMNS,
    columns.accessor("driver", {
        header: "Driver",
        cell: ({ row }) => <span>{row.getValue("driver")}</span>,
        size: 600,
    }),
]


export const TEAM_STANDINGS_COLUMNS = [
    ...BASE_COLUMNS,
    columns.accessor("team", {
        header: "Team name",
        cell: ({ row }) => <span>{row.getValue("team")}</span>,
        size: 600,
    }),
]

export const DRIVER_STANDINGS_COLUMN_ORDER = ["position", "driver", "points"]
export const TEAM_STANDINGS_COLUMN_ORDER = ["position", "team", "points"]
