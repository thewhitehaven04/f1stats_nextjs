"use client"
import { createColumnHelper } from "@tanstack/react-table"
import { use, useMemo } from "react"
import type { LapSelectionData, LapTimingData } from "@/client/generated"
import { Speedtrap } from "@/components/Speedtrap"
import { SectorTime } from "@/components/SectorTime"
import { NaLabel } from "@/components/ValueOrNa"
import { LapsTable } from "./table"
import { LapsTableTelemetryTutorial } from "./TelemetryTutorial"
import { Laptime } from "@/components/Laptime"
import { Checkbox } from "@/components/ui/checkbox"
import { getTyreComponentByCompound } from "../../../helpers/getTyreIconByCompound"
import { mapLapsToTableLapData } from "../../../helpers/mapLapsToTableLapData"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TooltipButton } from "./components/TooltipButton"

export interface ILapData {
    [key: `${string}.LapId`]: LapTimingData["id"]
    [key: `${string}.LapTime`]: LapTimingData["laptime"]
    [key: `${string}.IsPB`]: LapTimingData["is_pb"]
    [key: `${string}.Sector1Time`]: LapTimingData["sector_1_time"]
    [key: `${string}.ST1`]: LapTimingData["speedtrap_1"]
    [key: `${string}.Sector2Time`]: LapTimingData["sector_2_time"]
    [key: `${string}.ST2`]: LapTimingData["speedtrap_2"]
    [key: `${string}.Sector3Time`]: LapTimingData["sector_3_time"]
    [key: `${string}.ST3`]: LapTimingData["speedtrap_fl"]
    [key: `${string}.IsBestS1`]: LapTimingData["is_best_s1"]
    [key: `${string}.IsBestS2`]: LapTimingData["is_best_s2"]
    [key: `${string}.IsBestS3`]: LapTimingData["is_best_s3"]
    [key: `${string}.IsBestST1`]: LapTimingData["is_best_st1"]
    [key: `${string}.IsBestST2`]: LapTimingData["is_best_st2"]
    [key: `${string}.IsBestST3`]: LapTimingData["is_best_stfl"]
    [key: `${string}.IsPBS1`]: LapTimingData["is_personal_best_s1"]
    [key: `${string}.IsPBS2`]: LapTimingData["is_personal_best_s2"]
    [key: `${string}.IsPBS3`]: LapTimingData["is_personal_best_s3"]
    [key: `${string}.Compound`]: LapTimingData["compound_id"]
}
export const columnHelper = createColumnHelper<ILapData>()

export function LapsTableSection({ laps: lapsPromise }: { laps: Promise<LapSelectionData> }) {
    const laps = use(lapsPromise)

    const flattenedLaps = mapLapsToTableLapData(laps.driver_lap_data)
    // const { hasSelected, updateSelection } = useLapSelection()

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
                                const lap = cell.row.index + 1
                                return (
                                    <Checkbox
                                        name={driverName}
                                        value={lap}
                                        disabled={!cell.row.original[`${driverName}.LapTime`]}
                                    />
                                )
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

    return (
        <>
            <LapsTable
                columns={tableColumns}
                data={flattenedLaps}
                initialState={{
                    columnVisibility: laps.driver_lap_data.reduce<Record<string, boolean>>(
                        (curr, { driver }) => {
                            curr[`${driver}.ST1`] = false
                            curr[`${driver}.ST2`] = false
                            curr[`${driver}.ST3`] = false

                            return curr
                        },
                        {},
                    ),
                }}
                toolbar={
                    <TooltipProvider>
                        <TooltipButton
                            type="submit"
                            variant="secondary"
                            size="md"
                            name="intent"
                            value="lapTelemetry"
                            tooltipText="You must select at least one lap to compare telemetry"
                        >
                            Compare per-lap telemetry
                        </TooltipButton>
                        <TooltipButton
                            type="submit"
                            variant="secondary"
                            size="md"
                            name="intent"
                            value="avgTelemetryComparison"
                            tooltipText="You must select at least one lap to compare telemetry"
                        >
                            Compare average telemetry per driver
                        </TooltipButton>
                    </TooltipProvider>
                }
            />
            <LapsTableTelemetryTutorial />
        </>
    )
}
