import { initGlobalChartConfig } from "@/components/Chart/config"
import clsx from "clsx"
import { type ChartProps, Chart } from "react-chartjs-2"
import { merge } from "ts-deepmerge"
initGlobalChartConfig()

export const TelemetryPresetChart = (props: Omit<ChartProps<"line">, "type">) => {
    const hasData = !!props.data.datasets.length
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

    return (
        <div className="relative">
            <div className={clsx(!hasData && "absolute backdrop-blur-xs z-10 w-full h-full")} />
            {!hasData && (
                <h1 className="absolute z-10 h-full w-full text-center text-lg font-bold top-[50%]">No laps selected</h1>
            )}
            <Chart {...merge(baseChartProps, props)} />
        </div>
    )
}
