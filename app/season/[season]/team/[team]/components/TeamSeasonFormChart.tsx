"use client"

import { Chart } from "react-chartjs-2"
import type { TDriverRow } from "../types"
import type { ChartData } from "chart.js"
import { useMemo } from "react"
import { initGlobalChartConfig } from "@/components/Chart/config"

initGlobalChartConfig()

// thanks stackoverflow
const getBackgroundColor = (stringInput: string) => {
    const stringUniqueHash = [...stringInput].reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
    return `hsl(${stringUniqueHash % 360}, 90%, 70%)`
}

const MAX_POINTS_PER_SESSION = 26

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
                data: points.map((_, roundNumber) => ({
                    x: roundNumber,
                    y: points[roundNumber][index].points,
                })),
                borderColor: getBackgroundColor(points[0][index].driverId),
            })),
        }),
        [points, events, driverCount],
    )
    return <Chart type="line" data={data} options={{ scales: { y: { max: MAX_POINTS_PER_SESSION } } }} />
}
