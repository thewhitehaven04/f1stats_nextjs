"use client"
import { Chart } from "react-chartjs-2"
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
    type ChartConfiguration,
} from "chart.js"
import { use, useMemo, useState } from "react"
import { Violin, ViolinController } from "@sgratzl/chartjs-chart-boxplot"
import type { LapSelectionData } from "@/client/generated"
import { initGlobalChartConfig } from "@/components/Chart/config"
import { Button } from "@/components/ui/button"

ChartJS.register(Violin, ViolinController, LinearScale, CategoryScale, Legend, Tooltip)
initGlobalChartConfig()

export function ViolinPlotTab({ laps: lapsPromise }: { laps: Promise<LapSelectionData> }) {
    const laps = use(lapsPromise)
    const [isOutliersShown, setIsOutliersShown] = useState(false)

    const plotData: ChartConfiguration<"violin">["data"] = useMemo(
        () => ({
            labels: ["Laptimes"],
            datasets: laps.driver_lap_data.map((driver) => ({
                label: driver.driver,
                data: [driver.laps.map((driverData) => driverData.laptime).filter(Boolean)],
                borderColor: driver.team.color,
                style: driver.style,
            })),
        }),
        [laps],
    )

    return (
        <div className="overflow-x-scroll">
            <div className="flex flex-row justify-end gap-4">
                <Button
                    type="button"
                    size="md"
                    variant="secondary"
                    onClick={() => setIsOutliersShown(!isOutliersShown)}
                >
                    Show outliers
                </Button>
            </div>
            <Chart
                type="violin"
                data={plotData}
                options={{
                    scales: {
                        y: {
                            min: isOutliersShown
                                ? Math.floor(laps.min_time || 0)
                                : Math.floor(laps.min_time || 0),
                            max: isOutliersShown
                                ? Math.ceil(laps.max_time || 0)
                                : Math.ceil(laps.high_decile || 0) + 0.5,
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
            />
        </div>
    )
}
