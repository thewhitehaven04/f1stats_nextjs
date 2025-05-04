import { initGlobalChartConfig } from "@/components/Chart/config"
import clsx from "clsx"
import { type ChartProps, Chart } from "react-chartjs-2"
import { merge } from "ts-deepmerge"
initGlobalChartConfig()

export const SpeedtracePresetChart = (props: Omit<ChartProps<"line">, "type">) => {
    const hasData = !!props.data.datasets.length
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
            layout: {
                autoPadding: false,
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
    return (
        <div className="relative">
            <div className={clsx(!hasData && "absolute backdrop-blur-xs z-10 w-full h-full")} />
            <Chart {...mergedProps} className={clsx(mergedProps.className, "z-0")} />
        </div>
    )
}
