import { initGlobalChartConfig } from "@/components/Chart/config"
import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { useRef, type ComponentProps } from "react"
import { type ChartProps, Chart } from "react-chartjs-2"
import { merge } from "ts-deepmerge"
import type { TSpeedDataset } from "../../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/ChartSection"
import type { Chart as ChartJS } from "chart.js"

initGlobalChartConfig()

export const SpeedtracePresetChart = (
    props: Omit<ComponentProps<typeof Chart>, "type"> & { data: { datasets: TSpeedDataset } },
) => {
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
                    yAlign: "top",
                    xAlign: "center",
                    callbacks: {
                        title(tooltipItem) {
                            const raw = tooltipItem[0].raw as TSpeedDataset[number]["data"][number]
                            return `${Math.trunc(raw.x).toString()} m`
                        },
                        label(tooltipItem) {
                            const raw = tooltipItem.raw as TSpeedDataset[number]["data"][number]
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

    const speedChartRef = useRef<ChartJS>(null)
    return (
        <div className="relative">
            <div className="flex flex-row justify-end">
                <Button
                    type="button"
                    size="md"
                    variant="secondary"
                    onClick={() => {
                        if (speedChartRef.current) {
                            speedChartRef.current.resetZoom()
                        }
                    }}
                >
                    Reset zoom
                </Button>
            </div>
            <div className={clsx(!hasData && "absolute backdrop-blur-xs z-10 w-full h-full")} />
            {!hasData && (
                <h1 className="absolute z-10 h-full w-full text-center text-lg font-bold top-[50%]">
                    No laps selected
                </h1>
            )}
            <Chart
                {...mergedProps}
                className={clsx(mergedProps.className, "z-0")}
                ref={speedChartRef}
            />
        </div>
    )
}
