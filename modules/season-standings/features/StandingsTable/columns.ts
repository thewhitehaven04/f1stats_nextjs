import { createColumnHelper } from "@tanstack/react-table"
import type { IDriverStandingsTableRow } from './types'


const columns = createColumnHelper<IDriverStandingsTableRow>()

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
        id: 'team',
        header: 'Team name'
    }),
    columns.display({
        id: 'points',
        header: 'Points'
    }),
]
