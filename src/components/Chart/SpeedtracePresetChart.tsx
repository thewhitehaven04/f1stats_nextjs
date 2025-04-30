import { initGlobalChartConfig } from "@/components/Chart/config"
import { type ChartProps, Chart } from "react-chartjs-2"
import { merge } from "ts-deepmerge"
initGlobalChartConfig()

export const SpeedtracePresetChart = (props: Omit<ChartProps<"line">, "type">) => {
    const baseChartProps = {
        type: "line",
        options: {
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
                        label(tooltipItem) {
                            return `${tooltipItem.dataset.label}: ${Math.trunc(tooltipItem.raw?.y as number).toString()} kph`
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
    } satisfies Partial<ChartProps<"line">>

    const mergedProps = merge(baseChartProps, props)
    return <Chart {...mergedProps} />
}
