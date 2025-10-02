import type { Chart, ChartProps } from "react-chartjs-2"
import { merge } from "ts-deepmerge"
import type { TTelemetryDataset } from "../../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/ChartSection"
import type { ComponentProps } from "react"
import { ThemedChart } from "@/shared/components/themed-chart/ThemedChart"

export const TimedeltaPresetChart = (
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
            scales: {
                x: {
                    max: (props.data.labels?.at(-1) as number) || 0,
                },
                y: {
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
                    position: "bottom",
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
                            return `${tooltipItem.dataset.label} ${raw.y.toFixed(3)}`
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
        <div className="relative h-[300px]">
            <ThemedChart
                {...merge(baseChartProps, props)}
                hasData={hasData}
                noDataMessage="No laps selected"
            />
        </div>
    )
}
