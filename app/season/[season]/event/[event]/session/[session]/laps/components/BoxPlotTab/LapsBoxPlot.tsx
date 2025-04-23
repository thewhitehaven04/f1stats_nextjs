'use client'
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js"
import { use, useState } from "react"
import clsx from "clsx"
import { BoxAndWiskers, BoxPlotController } from "@sgratzl/chartjs-chart-boxplot"
import Zoom from "chartjs-plugin-zoom"
import { StintSelector } from "../StintSelector"
import { LapsBoxChart } from "./Chart"
import type { LapSelectionData } from "@/client/generated"

ChartJS.register([
    BoxPlotController,
    BoxAndWiskers,
    LinearScale,
    CategoryScale,
    Legend,
    Tooltip,
    Zoom,
])

export default function BoxPlotTab({ laps: lapsPromise }: { laps: Promise<LapSelectionData> }) {
    const laps = use(lapsPromise)
    const [isOutliersShown, setIsOutliersShown] = useState(false)

    const [driverStints, setDriverStints] = useState<Record<string, number | undefined>>(
        Object.fromEntries(laps.driver_lap_data.map((lapData) => [lapData.driver, undefined])),
    )

    const stintData = laps.driver_lap_data.map((driverLapData) => ({
        driver: driverLapData.driver,
        stints: Array.from({ length: driverLapData.stints.length })
            .map((_, index) => {
                const laps = driverLapData.laps.filter((lap) => lap.stint === index + 1)
                return (
                    laps.length
                        ? {
                              index: laps[0].stint,
                              text: `${laps[0].compound_id}, ${driverLapData.stints[index].total_laps || 0} laps`,
                          }
                        : null
                ) as { index: number; text: string }
            })
            .filter(Boolean),
    }))

    return (
        <div className="overflow-x-scroll flex flex-col gap-4">
            <div className="flex flex-row justify-end gap-4">
                <StintSelector
                    driverStints={stintData}
                    onChange={({ driver, stint }) =>
                        setDriverStints((prev) => ({ ...prev, [driver]: stint }))
                    }
                    onReset={() =>
                        setDriverStints(
                            Object.fromEntries(
                                laps.driver_lap_data.map((lapData) => [lapData.driver, undefined]),
                            ),
                        )
                    }
                    selectionValues={driverStints}
                />
                <button
                    type="button"
                    className={clsx("btn btn-sm", isOutliersShown && "btn-active")}
                    onClick={() => setIsOutliersShown(!isOutliersShown)}
                >
                    Show outliers
                </button>
            </div>
            <LapsBoxChart
                selectedStints={driverStints}
                laps={laps}
                isOutliersShown={isOutliersShown}
            />
        </div>
    )
}
