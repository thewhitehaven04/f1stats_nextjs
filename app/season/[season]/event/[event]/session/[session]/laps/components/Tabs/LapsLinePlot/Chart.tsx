"use client"
import type { TooltipItem } from "chart.js"
import type { ComponentProps } from "react"
import { Chart, type ChartProps } from "react-chartjs-2"
import { formatTime } from "@/core/helpers/formatTime"
import type { TLapsLinePlotDataset } from "./LinePlotTab"
import { merge } from "ts-deepmerge"
import { initGlobalChartConfig } from "@/components/Chart/config"
import { TYRE_COLOR_MAP } from '../../helpers/colorMap'

initGlobalChartConfig()

export const LineLapsChart = (props: Omit<ComponentProps<typeof Chart>, "type">) => {
    return (
        <Chart
            {...merge(
                {
                    type: "line" as const,
                    height: 150,
                    options: {
                        elements: {
                            point: {
                                radius: 7,
                                hoverRadius: 7,
                                borderWidth: 2,
                                hoverBorderWidth: 2,
                                backgroundColor(ctx) {
                                    const data = ctx.dataset.data[
                                        ctx.dataIndex
                                    ] as TLapsLinePlotDataset
                                    return TYRE_COLOR_MAP[data.compound] || "grey"
                                },
                                borderColor({
                                    dataset,
                                }: { dataset: (typeof props.data.datasets)[number] }) {
                                    return dataset.style === "default"
                                        ? dataset.teamColor
                                        : getAlternativeColor(dataset.teamColor)
                                },
                            },
                            line: {
                                borderColor({
                                    dataset,
                                }: { dataset: (typeof props.data.datasets)[number] }) {
                                    return dataset.style === "default"
                                        ? dataset.teamColor
                                        : getAlternativeColor(dataset.teamColor)
                                },
                            },
                        },
                        interaction: {
                            ...props.options?.interaction,
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
                                    display: true,
                                    text: "Lap number",
                                },
                                ticks: {
                                    align: "center",
                                    maxTicksLimit: 20,
                                    stepSize: 3,
                                },
                                bounds: "data",
                            },
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label({ dataset, dataIndex }: TooltipItem<"line">) {
                                        const item = dataset.data[dataIndex] as TLapsLinePlotDataset
                                        return `${dataset.label}: ${formatTime(item.y)} (${item.compound})`
                                    },
                                },
                            },
                            zoom: {
                                limits: {
                                    x: {
                                        minRange: 2,
                                    },
                                },
                            },
                        },
                    },
                } satisfies ChartProps<"line">,
                props,
            )}
        />
    )
}
