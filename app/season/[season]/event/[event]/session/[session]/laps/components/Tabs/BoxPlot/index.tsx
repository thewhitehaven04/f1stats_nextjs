"use client"
import { useMemo, useState } from "react"
import { StintSelector } from "../../StintSelector"
import { LapsBoxChart } from "./Chart"
import { initGlobalChartConfig } from "@/components/Chart/config"
import { Button } from "@/components/ui/button"
import type { SessionLapsData } from '@/client/generated'

initGlobalChartConfig()

export default function BoxPlotTab({ laps }: { laps: SessionLapsData }) {
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
                if (laps.length === 0) return false
                return {
                    index: laps[0].stint,
                    text: `${laps[0].compound_id}, ${driverLapInstance.stints[index].total_laps || 0} laps`,
                }
            })
            .filter((val) => val !== false),
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
            <LapsBoxChart
                selectedStints={driverStints}
                laps={laps}
                isOutliersShown={isOutliersShown}
            />
        </div>
    )
}
