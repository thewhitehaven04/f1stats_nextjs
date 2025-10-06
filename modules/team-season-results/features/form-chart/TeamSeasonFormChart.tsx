"use client"

import type { ChartData } from "chart.js"
import { useMemo } from "react"
import dynamic from "next/dynamic"
import { initGlobalChartConfig } from '@/shared/components/themed-chart/config'
import { rollingSum } from '@/shared/helpers/rollingSum'
import type { TDriverRow } from '../../types'

initGlobalChartConfig()

// thanks stackoverflow
const getBackgroundColor = (stringInput: string) => {
    const stringUniqueHash = [...stringInput].reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
    return `hsl(${stringUniqueHash % 360}, 90%, 70%)`
}

const ThemedChart = dynamic(
    async () => (await import("@/shared/components/themed-chart/ThemedChart")).ThemedChart,
    {
        ssr: false,
    },
)

export const TeamSeasonFormChart = ({
    points,
    events,
    driverCount,
}: {
    points: TDriverRow[]
    events: string[]
    driverCount: number
}) => {
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
    return (
        <ThemedChart
            type="line"
            data={data}
            options={{
                interaction: { mode: "index", intersect: false },
                scales: { y: { beginAtZero: true } },
            }}
            hasData
        />
    )
}
