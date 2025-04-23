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
import clsx from "clsx"
import type { LapSelectionData } from "@/client/generated"

ChartJS.register([Violin, ViolinController, LinearScale, CategoryScale, Legend, Tooltip])

export function ViolinPlotTab({ laps: lapsPromise }: { laps: Promise<LapSelectionData> }) {
    const laps = use(lapsPromise)
    const [isOutliersShown, setIsOutliersShown] = useState(false)

    const plotData: ChartConfiguration<"violin">["data"] = useMemo(
        () => ({
            labels: ["Laptimes"],
            datasets: laps.driver_lap_data.map((driver) => ({
                label: driver.driver,
                data: [driver.laps.map((driverData) => driverData.laptime)],
            })),
        }),
        [laps],
    )

    return (
        <div className="overflow-x-scroll">
            <div className="flex flex-row justify-end gap-4">
                <button
                    type="button"
                    className={clsx("btn btn-sm", isOutliersShown && "btn-active")}
                    onClick={() => setIsOutliersShown(!isOutliersShown)}
                >
                    Show outliers
                </button>
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
                            itemRadius: 3.5,
                            itemHitRadius: 6,
                            itemStyle: "circle",
                            itemBorderWidth: 1,
                            itemBorderColor(ctx) {
                                return typeof ctx.dataset.borderColor === "string"
                                    ? ctx.dataset.borderColor
                                    : "grey"
                            },
                            meanRadius: 10,
                        },
                    },
                }}
                height={160}
            />
        </div>
    )
}
