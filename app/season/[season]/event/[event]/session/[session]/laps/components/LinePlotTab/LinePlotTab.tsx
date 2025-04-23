"use client"
import { use, useCallback, useMemo, useState } from "react"
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js"
import clsx from "clsx"
import zoomPlugin from "chartjs-plugin-zoom"
import { StintSelector } from "../StintSelector"
import { LineLapsChart } from "./Chart"
import type { LapSelectionData } from "@/client/generated"

ChartJS.register(
    LineController,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
    zoomPlugin,
)

export default function LinePlotTab({ laps: lapsPromise }: { laps: Promise<LapSelectionData> }) {
    const laps = use(lapsPromise)

    const { driver_lap_data: driverLapData } = laps
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
                return (
                    laps.length
                        ? {
                              index: laps[0].stint,
                              text: `${laps[0].compound_id}, ${driverLapInstance.stints[index].total_laps || 0} laps`,
                          }
                        : null
                ) as { index: number; text: string }
            })
            .filter(Boolean),
    }))

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
                <button
                    type="button"
                    onClick={() => setIsOutliersShown(!isOutliersShown)}
                    className={clsx("btn btn-sm", isOutliersShown && "btn-active")}
                >
                    Show outliers
                </button>
            </div>
            <LineLapsChart
                isOutliersShown={isOutliersShown}
                selectedStints={driverStints}
                laps={laps}
            />
        </div>
    )
}
