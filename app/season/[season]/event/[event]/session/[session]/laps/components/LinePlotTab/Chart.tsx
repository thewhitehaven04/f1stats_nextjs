"use client"
import type { Compound, LapSelectionData } from "@/client/generated"
import type { ChartData, TooltipItem } from "chart.js"
import { useMemo } from "react"
import { Chart } from "react-chartjs-2"
import { formatTime } from "@/core/helpers/formatTime"
import { TYRE_COLOR_MAP } from "../helpers/colorMap"
import { getAlternativeColor } from "../helpers/getAlternativeColor"

type TPlotData = {
    x: number
    y: number
    compound: Compound
}

const CHART_EDGE_OFFSET = 0.15

export function LineLapsChart(props: {
    isOutliersShown: boolean
    selectedStints: Record<string, number | undefined>
    laps: LapSelectionData
}) {
    const { isOutliersShown, selectedStints, laps } = props
    console.log(laps)
    const datasets = useMemo(
        () =>
            laps.driver_lap_data.map((driverData) => ({
                label: driverData.driver,
                data: driverData.laps
                    .filter((lap) =>
                        selectedStints[driverData.driver]
                            ? lap.stint === selectedStints[driverData.driver]
                            : true,
                    )
                    .map((lap, index) => ({
                        x: index,
                        y: isOutliersShown
                            ? lap.laptime
                            : lap.laptime > (laps.high_decile || 0) * 1.02
                              ? Number.NaN
                              : lap.laptime,
                        compound: lap.compound_id,
                    })),
                teamColor: driverData.team.color,
                style: driverData.style,
            })),
        [laps, isOutliersShown, selectedStints],
    ) satisfies ChartData<"line", TPlotData[]>["datasets"]

    const maxX =
        Math.max(...datasets.map((dataset) => dataset.data[dataset.data.length - 1].x)) +
        CHART_EDGE_OFFSET
    const minX = Math.min(...datasets.map((dataset) => dataset.data[0].x)) - CHART_EDGE_OFFSET

    return (
        <Chart
            type="line"
            data={{ datasets: datasets }}
            options={{
                elements: {
                    point: {
                        radius: 6,
                        borderWidth: 1,
                        backgroundColor(ctx) {
                            const data = ctx.dataset.data[ctx.dataIndex] as TPlotData
                            return TYRE_COLOR_MAP[data.compound] || "grey"
                        },
                        borderColor: "black",
                        hoverRadius: 7,
                        hoverBorderWidth: 1,
                    },
                    line: {
                        borderWidth: 2.0,
                        borderColor({ dataset }: { dataset: (typeof datasets)[number] }) {
                            return dataset.style === "default"
                                ? `#${dataset.teamColor}`
                                : getAlternativeColor(dataset.teamColor)
                        },
                    },
                },
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                scales: {
                    y: {
                        type: "linear",
                        title: {
                            text: "Lap time (s)",
                            display: true,
                        },
                        bounds: "data",
                    },
                    x: {
                        type: "linear",
                        title: {
                            text: "Lap number",
                        },
                        ticks: {
                            align: "center",
                        },
                        bounds: "data",
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label(tooltipItem: TooltipItem<"line">) {
                                const item = tooltipItem.dataset.data[
                                    tooltipItem.dataIndex
                                ] as TPlotData
                                return `${tooltipItem.dataset.label}: ${formatTime(item.y)} (${item.compound})`
                            },
                        },
                    },
                    zoom: {
                        limits: {
                            x: {
                                min: minX,
                                max: maxX,
                                minRange: 2,
                            },
                        },
                        zoom: {
                            drag: {
                                enabled: true,
                            },
                            mode: "x",
                            wheel: {
                                enabled: true,
                                speed: 0.01,
                            },
                        },
                    },
                },
            }}
            height={120}
        />
    )
}
