import clsx from "clsx"
import { Chart, type ChartProps } from "react-chartjs-2"
import { merge } from "ts-deepmerge"
import type { TSpeedDataset } from "../../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/ChartSection"

export const TimedeltaPresetChart = (props: Omit<ChartProps<"scatter">, "type">) => {
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
                        label(tooltipItem) {
                            const raw = tooltipItem.raw as TSpeedDataset[number]["data"][number]
                            return raw.y.toFixed(3)
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
                <h1 className="absolute z-10 h-full w-full text-center text-lg font-bold top-[50%]">
                    No laps selected
                </h1>
            )}
            <Chart {...merge(baseChartProps, props)} />
        </div>
    )
}
