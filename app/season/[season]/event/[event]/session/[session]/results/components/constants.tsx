import { Gap } from "@/components/Gap"
import { Laptime } from "@/components/Laptime"
import { SectorTime } from "@/components/SectorTime"
import { ValueOrNa } from "@/components/ValueOrNa"
import { createColumnHelper } from "@tanstack/react-table"
import {
    ESessionType,
    type IBaseResultsData,
    type IPracticeData,
    type IQualifyingData,
    type IRaceData,
} from "./types"
import { Checkbox } from "@/components/ui/checkbox"

const baseColumnHelper = createColumnHelper<IBaseResultsData>()
const practiceHelper = createColumnHelper<IPracticeData>()
const qualiHelper = createColumnHelper<IQualifyingData>()
const raceHelper = createColumnHelper<IRaceData>()

const BASE_COLUMNS = [
    baseColumnHelper.display({
        id: "selector",
        cell: ({ row }) => (
            <Checkbox
                name="driver"
                value={row.getValue('driver.id')}
                onCheckedChange={row.getToggleSelectedHandler()}
                checked={row.getIsSelected()}
            />
        ),
    }),
    baseColumnHelper.display({
        id: "position",
        header: () => "Pos",
        cell: ({ row }) => row.index + 1,
    }),
]

const PRACTICE_COLUMNS_DEF = [
    ...BASE_COLUMNS,
    practiceHelper.accessor("driver", {
        header: () => <span>Driver</span>,
        enableSorting: true,
        cell: (ctx) => (
            <div className="flex flex-col gap-1 items-start">
                <div>{ctx.getValue().name}</div>
                <div className="text-neutral-400 text-sm">{ctx.getValue().country}</div>
            </div>
        ),
    }),
    practiceHelper.accessor("teamName", {
        header: () => <span>Team</span>,
        enableSorting: true,
    }),
    practiceHelper.accessor("time", {
        header: () => <span>Time</span>,
        cell: (info) => <Laptime value={info.getValue()} />,
        enableSorting: true,
    }),
    practiceHelper.accessor("gap", {
        header: () => <span>Gap to leader</span>,
        cell: (info) => <Gap value={info.getValue()} />,
        enableSorting: true,
    }),
]

const QUALI_COLUMNS_DEF = [
    ...BASE_COLUMNS,
    qualiHelper.accessor("driver", {
        header: () => <span>Driver</span>,
        enableSorting: true,
        cell: (ctx) => (
            <div className="flex flex-col gap-1 items-start">
                <div>{ctx.getValue().name}</div>
                <div className="text-neutral-400 text-sm">{ctx.getValue().country}</div>
            </div>
        ),
    }),
    qualiHelper.accessor("teamName", {
        header: () => <span>Team</span>,
        enableSorting: true,
        cell: (info) => <ValueOrNa value={info.getValue()} />,
    }),
    qualiHelper.accessor("q1Time", {
        header: () => <span>Q1 Time</span>,
        cell: (info) => <SectorTime value={info.getValue()} />,
        enableSorting: true,
    }),
    qualiHelper.accessor("q2Time", {
        header: () => <span>Q2 Time</span>,
        cell: (info) => <SectorTime value={info.getValue()} />,
        enableSorting: true,
    }),
    qualiHelper.accessor("q3Time", {
        header: () => <span>Q3 Time</span>,
        cell: (info) => <SectorTime value={info.getValue()} />,
        enableSorting: true,
    }),
]

export const RACE_COLUMNS_DEF = [
    ...BASE_COLUMNS,
    raceHelper.accessor("driver", {
        header: () => <span>Driver</span>,
        enableSorting: true,
        cell: (ctx) => (
            <div className="flex flex-col gap-1 items-start">
                <div>{ctx.getValue().name}</div>
                <div className="text-neutral-400 text-sm">{ctx.getValue().country}</div>
            </div>
        ),
    }),
    raceHelper.accessor("teamName", {
        header: () => <span>Team</span>,
        enableSorting: true,
    }),
    raceHelper.accessor("gridPosition", {
        header: () => <span>Grid</span>,
        enableSorting: true,
    }),
    raceHelper.accessor("time", {
        header: () => <span>Time</span>,
        cell: (info) => <Laptime value={info.getValue()} />,
        enableSorting: true,
    }),
    raceHelper.accessor("gap", {
        header: () => <span>Gap</span>,
        cell: (info) => <Gap value={info.getValue()} />,
        enableSorting: true,
    }),
    raceHelper.accessor("points", {
        header: () => <span>Points</span>,
        enableSorting: true,
        cell: (info) => <ValueOrNa value={info.getValue()} />,
    }),
    raceHelper.accessor("status", {
        header: () => <span>Classification</span>,
        cell: (info) => <ValueOrNa value={info.getValue()} />,
    }),
]

export const SESSION_TYPE_TO_RESULT_COLUMN_MAP = {
    [ESessionType.PRACTICE]: PRACTICE_COLUMNS_DEF,
    [ESessionType.QUALIFYING]: QUALI_COLUMNS_DEF,
    [ESessionType.RACE]: RACE_COLUMNS_DEF,
} as const
