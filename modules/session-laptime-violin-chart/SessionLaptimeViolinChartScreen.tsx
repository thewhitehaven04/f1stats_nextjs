"use client"
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
    type ChartConfiguration,
} from "chart.js"
import { useMemo, useState } from "react"
import { Violin, ViolinController } from "@sgratzl/chartjs-chart-boxplot"
import { ThemedChart } from "@/shared/components/themed-chart/ThemedChart"
import type { SessionLapsData } from "@/shared/client/generated"
import { initGlobalChartConfig } from "@/shared/components/themed-chart/config"
import { getColorFromColorMap } from "@/shared/components/themed-chart/helpers"
import { formatTime } from "@/shared/helpers/formatTime"
import { Button } from "@/uiComponents/button"

ChartJS.register(Violin, ViolinController, LinearScale, CategoryScale, Legend, Tooltip)
initGlobalChartConfig()

export default function ViolinPlotTab({ laps }: { laps: SessionLapsData }) {
    const { color_map } = laps
    const [isOutliersShown, setIsOutliersShown] = useState(false)

    const plotData: ChartConfiguration<"violin">["data"] = useMemo(
        () => ({
            labels: ["Laptimes"],
            datasets: laps.driver_lap_data.map((driver) => ({
                label: driver.driver,
                data: [
                    driver.laps
                        .map((driverData) => driverData.laptime)
                        .filter((laptime) => laptime !== null),
                ],
                tyreCompound: driver.laps.map((driverData) => driverData.compound_id),
                borderColor: getColorFromColorMap(color_map, driver.driver),
            })),
        }),
        [laps, color_map],
    )

    return (
        <div className="overflow-x-scroll">
            <div className="flex flex-row justify-end gap-4">
                <Button
                    type="button"
                    size="md"
                    variant="secondary"
                    onClick={() => setIsOutliersShown(!isOutliersShown)}
                    className="w-32"
                >
                    {isOutliersShown ? "Hide outliers" : "Show outliers"}
                </Button>
            </div>
            <div className="relative flex flex-col">
                <ThemedChart
                    type="violin"
                    data={plotData}
                    options={{
                        responsive: true,
                        resizeDelay: 100,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                bounds: "ticks",
                                ticks: {
                                    callback(tickValue) {
                                        return typeof tickValue === "number"
                                            ? formatTime(tickValue)
                                            : tickValue
                                    },
                                },
                                min: Math.floor(laps.min_time || 0),
                                max: isOutliersShown
                                    ? Math.ceil(laps.max_time || 0)
                                    : Math.ceil(laps.high_decile || 0) + 1,
                            },
                        },
                        elements: {
                            violin: {
                                borderWidth: 2,
                                itemRadius: 5,
                                itemHitRadius: 5,
                                itemStyle: "circle",
                                itemBorderWidth: 1.5,
                                itemBorderColor(ctx) {
                                    return typeof ctx.dataset.borderColor === "string"
                                        ? ctx.dataset.borderColor
                                        : "grey"
                                },
                                meanRadius: 10,
                                meanBorderWidth: 1.5,
                                meanBorderColor(ctx) {
                                    return typeof ctx.dataset.borderColor === "string"
                                        ? ctx.dataset.borderColor
                                        : "grey"
                                },
                            },
                        },
                    }}
                    height={160}
                    hasData={true}
                />
            </div>
        </div>
    )
}
