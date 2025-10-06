import clsx from "clsx"
import type { ComponentProps } from "react"
import type { ChartProps, Chart } from "react-chartjs-2"
import { merge } from "ts-deepmerge"
import type { TTelemetryDataset } from "../features/per-lap-telemetry/PerLapTelemetryComparisonView"
import { ThemedChart } from "@/shared/components/themed-chart/ThemedChart"
import { initGlobalChartConfig } from "@/shared/components/themed-chart/config"

initGlobalChartConfig()

export const SpeedtracePresetChart = (
    props: Omit<ComponentProps<typeof Chart>, "type"> & {
        data: { datasets: TTelemetryDataset }
        isUpdatingData: boolean
    },
) => {
    const hasData = !!props.data.datasets.length
    const baseChartProps = {
        type: "scatter",
        options: {
            responsive: true,
            resizeDelay: 100,
            maintainAspectRatio: false,
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
        <div className="relative h-[600px]">
            <ThemedChart
                {...mergedProps}
                className={clsx(mergedProps.className, "z-0")}
                hasData={hasData}
                noDataMessage="No laps selected"
            />
        </div>
    )
}
