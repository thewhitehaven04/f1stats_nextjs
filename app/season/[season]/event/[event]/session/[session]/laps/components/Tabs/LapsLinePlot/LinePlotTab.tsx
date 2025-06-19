"use client"
import { useMemo, useState } from "react"
import { LineLapsChart } from "./Chart"
import type { Compound, LapSelectionData, PlotColor } from "@/client/generated"
import type { ChartData } from "chart.js"
import { Button } from "@/components/ui/button"
import { StintSelector } from "../../StintSelector"

export type TLapsLinePlotDataset = {
    x: number
    y: number
    compound: Compound
}

export type TLinePlotTabBoxChartDataset = ChartData<
    "line",
    TLapsLinePlotDataset[]
>["datasets"][number] &
    PlotColor

export default function LinePlotTab({
    laps,
}: { laps: LapSelectionData }) {
    const { driver_lap_data: driverLapData, color_map } = laps
    const [isOutliersShown, setIsOutliersShown] = useState(true)

    const initialDriverState = useMemo(
        () => Object.fromEntries(driverLapData.map((lap) => [lap.driver, undefined])),
        [driverLapData],
    )

    const [driverStints, setDriverStints] =
        useState<Record<string, number | undefined>>(initialDriverState)

    const stintData = driverLapData.map((driverLapInstance) => ({
        driver: driverLapInstance.driver,
        stints: Array.from({ length: driverLapInstance.stints.length })
            .map((_, index) => {
                const laps = driverLapInstance.laps.filter((lap) => lap.stint === index + 1)
                if (laps.length === 0) return false
                return {
                    index: laps[0].stint,
                    text: `${laps[0].compound_id}, ${driverLapInstance.stints[index].total_laps || 0} laps`,
                }
            })
            .filter((val) => val !== false),
    }))

    const datasets: TLinePlotTabBoxChartDataset[] = useMemo(
        () =>
            laps.driver_lap_data.map((driverData) => ({
                label: driverData.driver,
                data: driverData.laps
                    .filter((lap) =>
                        driverStints[driverData.driver]
                            ? lap.stint === driverStints[driverData.driver]
                            : true,
                    )
                    .map((lap, index) => ({
                        x: index,
                        y: isOutliersShown
                            ? (lap.laptime ?? Number.NaN)
                            : (lap.laptime || Number.NaN) > (laps.high_decile || 0) * 1.02
                              ? Number.NaN
                              : (lap.laptime ?? Number.NaN),
                        compound: lap.compound_id,
                    })),
                ...color_map[driverData.driver],
            })),
        [laps, isOutliersShown, driverStints, color_map],
    )

    return (
        <div className="overflow-x-scroll">
            <div className="flex flex-row justify-end gap-4">
                <StintSelector
                    driverStints={stintData}
                    onChange={({ driver, stint }) =>
                        setDriverStints((prev) => ({ ...prev, [driver]: stint }))
                    }
                    onReset={() => setDriverStints(initialDriverState)}
                    selectionValues={driverStints}
                />
                <Button
                    type="button"
                    onClick={() => setIsOutliersShown(!isOutliersShown)}
                    size="md"
                    variant="secondary"
                    className="w-32"
                >
                    {isOutliersShown ? "Hide outliers" : "Show outliers"}
                </Button>
            </div>
            <LineLapsChart data={{ datasets }} />
        </div>
    )
}
