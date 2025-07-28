import { initGlobalChartConfig } from "@/components/Chart/config"
import clsx from "clsx"
import type { ChartProps } from "react-chartjs-2"
import { merge } from "ts-deepmerge"
import type { TTelemetryDataset } from "../../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/ChartSection"
import { ThemedChart } from "@/components/Chart/ThemedChart"
import type { ComponentProps } from "react"
initGlobalChartConfig()

export const TelemetryPresetChart = (
    props: Omit<ComponentProps<typeof ThemedChart>, "type"> & {
        data: { datasets: TTelemetryDataset }
    },
) => {
    const hasData = !!props.data.datasets.length
    const baseChartProps = {
        type: "scatter",
        options: {
            showLine: true,
            elements: {
                point: {
                    radius: 0,
                },
            },
            scales: {
                x: {
                    max: (props.data.labels?.at(-1) as number) || 0,
                },
                y: {
                    title: {
                        display: true,
                        text: "Time delta, s",
                    },
                    ticks: {
                        format: {
                            roundingMode: "halfCeil",
                        },
                    },
                },
            },
            layout: {
                autoPadding: false,
            },
            interaction: {
                mode: "x",
                axis: "x",
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    includeInvisible: false,
                    axis: "x",
                    mode: "nearest",
                    intersect: false,
                    callbacks: {
                        title(tooltipItem) {
                            const raw = tooltipItem[0]
                                .raw as TTelemetryDataset[number]["data"][number]
                            return `${Math.trunc(raw.x).toString()} m`
                        },
                        label(tooltipItem) {
                            const raw = tooltipItem.raw as TTelemetryDataset[number]["data"][number]
                            return `${tooltipItem.dataset.label}: ${Math.trunc(raw.y as number).toString()}`
                        },
                    },
                },
                zoom: {
                    zoom: {
                        mode: "x",
                        drag: {
                            enabled: true,
                        },
                    },
                    limits: {
                        x: {
                            min: 0,
                            minRange: 50,
                        },
                    },
                },
            },
        },
    } satisfies Partial<ChartProps<"scatter">>

    return (
        <div className="relative">
            <div className={clsx(!hasData && "absolute backdrop-blur-xs z-10 w-full h-full")} />
            {!hasData && (
                <div className="absolute z-10 w-full top-[50%] translate-y-[-50%]">
                    <h1 className="text-center text-lg font-bold">No laps selected</h1>
                </div>
            )}
            <ThemedChart {...merge(baseChartProps, props)} />
        </div>
    )
}
