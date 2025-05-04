import { initGlobalChartConfig } from "@/components/Chart/config"
import { type ChartProps, Chart } from "react-chartjs-2"
import { merge } from "ts-deepmerge"
initGlobalChartConfig()

export const TelemetryPresetChart = (props: Omit<ChartProps<"line">, "type">) => {
    const baseChartProps = {
        type: "line",
        options: {
            showLine: true,
            elements: {
                point: {
                    radius: 0,
                },
            },
            scales: {
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
                padding: {
                    left: -28
                }
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
                        label(tooltipItem) {
                            return `${tooltipItem.dataset.label}: ${Math.trunc(tooltipItem.raw?.y as number).toString()}`
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
    } satisfies Partial<ChartProps<"line">>

    return <Chart {...merge(baseChartProps, props)} />
}
