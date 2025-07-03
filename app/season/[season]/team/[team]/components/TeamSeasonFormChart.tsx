"use client"

import type { TDriverRow } from "../types"
import type { ChartData } from "chart.js"
import { useMemo } from "react"
import { initGlobalChartConfig } from "@/components/Chart/config"
import { rollingSum } from "@/core/helpers/rollingSum"
import { Chart } from "react-chartjs-2"

initGlobalChartConfig()

// thanks stackoverflow
const getBackgroundColor = (stringInput: string) => {
    const stringUniqueHash = [...stringInput].reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
    return `hsl(${stringUniqueHash % 360}, 90%, 70%)`
}

export const TeamSeasonFormChart = ({
    points,
    events,
    driverCount,
}: { points: TDriverRow[]; events: string[]; driverCount: number }) => {
    const data: ChartData<"line"> = useMemo(
        () => ({
            labels: events,
            datasets: Array.from({ length: driverCount }).map((_, index) => ({
                label: points[0][index].driverId,
                data: rollingSum(points.map((p) => p[index].points)).map((pts, index) => ({
                    x: index + 1,
                    y: pts,
                })),
                borderColor: getBackgroundColor(points[0][index].driverId),
            })),
        }),
        [points, events, driverCount],
    )
    return <Chart type="line" data={data} options={{ interaction: { mode: 'index', intersect: false } }} />
}
