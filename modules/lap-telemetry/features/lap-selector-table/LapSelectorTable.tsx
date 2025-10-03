"use client"
import { createColumnHelper } from "@tanstack/react-table"
import { memo, useMemo } from "react"
import { Speedtrap } from "@/components/Speedtrap"
import { SectorTime } from "@/components/SectorTime"
import { NaLabel } from "@/components/ValueOrNa"
import { Laptime } from "@/components/Laptime"
import type { SessionLapsData } from "@/shared/client/generated"
import type { ITableLapData } from './models/types'
import { mapLapsToTableLapData } from './models/table-lap-data'
import { LapsTable } from './components/LapsTable'
import { getTyreComponentByCompound } from '../../../../app/season/[season]/event/[event]/session/[session]/laps/components/helpers/getTyreIconByCompound'
import { LapCheckbox } from './components/LapCheckbox'
export const columnHelper = createColumnHelper<ITableLapData>()


function LapSelectorTable(props: { laps: SessionLapsData }) {
    const { laps } = props
    const flattenedLaps = useMemo(() => mapLapsToTableLapData(laps.driver_lap_data), [laps])

    const tableColumns = useMemo(
        () => [
            columnHelper.group({
                header: "Lap",
                enablePinning: true,
                columns: [
                    columnHelper.display({
                        id: "lap",
                        cell: (cell) => cell.row.index + 1,
                    }),
                ],
            }),
            ...laps.driver_lap_data.flatMap(({ driver: driverName }) =>
                columnHelper.group({
                    header: driverName,
                    id: driverName,
                    columns: [
                        columnHelper.display({
                            id: `${driverName}.selector`,
                            cell: (cell) => {
                                return <LapCheckbox cell={cell} driverName={driverName} />
                            },
                            enableHiding: false,
                        }),
                        columnHelper.accessor((row) => row[`${driverName}.LapTime`], {
                            id: `${driverName}.laptime`,
                            header: "Time",
                            cell: (info) => (
                                <Laptime
                                    value={info.getValue()}
                                    isPersonalBest={
                                        info.row.original[`${driverName}.IsPB`] === true ||
                                        undefined
                                    }
                                    className="h-full"
                                />
                            ),
                        }),
                        columnHelper.accessor((row) => row[`${driverName}.Sector1Time`], {
                            id: `${driverName}.sector1`,
                            header: "S1",
                            cell: (info) => (
                                <SectorTime
                                    value={info.getValue()}
                                    isSessionBest={info.row.original[`${driverName}.IsBestS1`]}
                                    isPersonalBest={info.row.original[`${driverName}.IsPBS1`]}
                                />
                            ),
                        }),
                        columnHelper.accessor((row) => row[`${driverName}.ST1`], {
                            id: `${driverName}.ST1`,
                            header: "ST1",
                            cell: (info) => (
                                <Speedtrap
                                    value={info.getValue()}
                                    isSessionBest={info.row.original[`${driverName}.IsBestST1`]}
                                />
                            ),
                        }),
                        columnHelper.accessor((row) => row[`${driverName}.Sector2Time`], {
                            id: `${driverName}.sector2`,
                            header: "S2",
                            cell: (info) => (
                                <SectorTime
                                    value={info.getValue()}
                                    isSessionBest={info.row.original[`${driverName}.IsBestS2`]}
                                    isPersonalBest={info.row.original[`${driverName}.IsPBS2`]}
                                />
                            ),
                        }),
                        columnHelper.accessor((row) => row[`${driverName}.ST2`], {
                            id: `${driverName}.ST2`,
                            header: "ST2",
                            cell: (info) => (
                                <Speedtrap
                                    value={info.getValue()}
                                    isSessionBest={info.row.original[`${driverName}.IsBestST2`]}
                                />
                            ),
                        }),
                        columnHelper.accessor((row) => row[`${driverName}.Sector3Time`], {
                            id: `${driverName}.sector3`,
                            header: "S3",
                            cell: (info) => (
                                <SectorTime
                                    value={info.getValue()}
                                    isSessionBest={info.row.original[`${driverName}.IsBestS3`]}
                                    isPersonalBest={info.row.original[`${driverName}.IsPBS3`]}
                                />
                            ),
                        }),
                        columnHelper.accessor((row) => row[`${driverName}.ST3`], {
                            id: `${driverName}.ST3`,
                            header: "FL",
                            cell: (info) => (
                                <Speedtrap
                                    value={info.getValue()}
                                    isSessionBest={info.row.original[`${driverName}.IsBestST3`]}
                                />
                            ),
                        }),
                        columnHelper.accessor((row) => row[`${driverName}.Compound`], {
                            id: `${driverName}.Compound`,
                            header: "Tyre",
                            cell: (info) => {
                                const Icon = getTyreComponentByCompound(info.getValue())
                                return Icon ? (
                                    <div className="w-full flex flex-row justify-center">
                                        <Icon className="w-6 py-0" />
                                    </div>
                                ) : (
                                    <NaLabel />
                                )
                            },
                        }),
                    ],
                }),
            ),
        ],
        [laps],
    )

    const initialState = useMemo(
        () => ({
            columnVisibility: laps.driver_lap_data.reduce<Record<string, boolean>>(
                (curr, { driver }) => {
                    curr[`${driver}.ST1`] = false
                    curr[`${driver}.ST2`] = false
                    curr[`${driver}.ST3`] = false

                    return curr
                },
                {},
            ),
        }),
        [laps],
    )

    return (
        <>
            <LapsTable columns={tableColumns} data={flattenedLaps} initialState={initialState} />
            <LapsTableTelemetryTutorial />
        </>
    )
}

export const LapsTableSection = memo(LapSelectorTable)
