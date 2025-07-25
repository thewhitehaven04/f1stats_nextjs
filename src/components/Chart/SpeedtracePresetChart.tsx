import { initGlobalChartConfig } from "@/components/Chart/config"
import clsx from "clsx"
import type { ComponentProps } from "react"
import type { ChartProps, Chart } from "react-chartjs-2"
import { merge } from "ts-deepmerge"
import type { TTelemetryDataset } from "../../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/ChartSection"
import { ThemedChart } from "@/components/Chart/ThemedChart"

initGlobalChartConfig()

export const SpeedtracePresetChart = (
    props: Omit<ComponentProps<typeof Chart>, "type"> & { data: { datasets: TTelemetryDataset } },
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
            interaction: {
                mode: "x",
                axis: "x",
                intersect: false,
            },
            layout: {
                autoPadding: false,
            },
            plugins: {
                legend: {
                    position: "bottom",
                },
                tooltip: {
                    includeInvisible: false,
                    axis: "r",
                    mode: "x",
                    intersect: false,
                    yAlign: "top",
                    xAlign: "center",
                    callbacks: {
                        title(tooltipItem) {
                            const raw = tooltipItem[0]
                                .raw as TTelemetryDataset[number]["data"][number]
                            return `${Math.trunc(raw.x).toString()} m`
                        },
                        label(tooltipItem) {
                            const raw = tooltipItem.raw as TTelemetryDataset[number]["data"][number]
                            return `${tooltipItem.dataset.label}: ${Math.trunc(raw?.y as number).toString()} kph`
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
            scales: {
                x: {
                    title: {
                        text: "Distance (m)",
                        display: true,
                    },
                    min: 0,
                    max: (props.data.labels?.at(-1) as number) || 0,
                    ticks: {
                        format: {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        },
                    },
                },
                y: {
                    title: {
                        text: "Speed",
                        display: true,
                    },
                    ticks: {
                        format: {
                            roundingMode: "halfCeil",
                        },
                        stepSize: 25,
                    },
                },
            },
        },
    } satisfies Partial<ChartProps<"scatter">>

    const mergedProps = merge(baseChartProps, props)

    return (
        <div className="relative">
            <div className={clsx(!hasData && "absolute backdrop-blur-xs z-10 w-full h-full")} />
            {!hasData && (
                <div className="absolute z-10 w-full top-[50%] translate-y-[-50%]">
                    <h1 className="text-center text-lg font-bold">No laps selected</h1>
                </div>
            )}
            <ThemedChart {...mergedProps} className={clsx(mergedProps.className, "z-0")} />
        </div>
    )
}
