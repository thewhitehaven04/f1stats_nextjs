"use client"
import { formatTime } from "@/core/helpers/formatTime"
import type { ChartConfiguration } from "chart.js"
import { useMemo } from "react"
import { Chart } from "react-chartjs-2"
import { initGlobalChartConfig } from "@/components/Chart/config"
import { getColorFromColorMap } from "@/components/Chart/helpers"
import type { SessionLapsData } from "@/client/generated"
initGlobalChartConfig()

export function LapsBoxChart({
    isOutliersShown,
    selectedStints,
    laps,
}: {
    isOutliersShown: boolean
    selectedStints: Record<string, number | undefined>
    laps: SessionLapsData
}) {
    const { color_map } = laps
    const sessionData = useMemo(
        () => ({
            labels: ["Laptime"],
            datasets: laps.driver_lap_data.map((driver) => {
                const stint_index = (selectedStints[driver.driver] as number) - 1
                return {
                    label: driver.driver,
                    data: [
                        selectedStints[driver.driver]
                            ? {
                                  min: driver.stints[stint_index].min_time ?? 0,
                                  q1: driver.stints[stint_index].low_quartile ?? 0,
                                  q3: driver.stints[stint_index].high_quartile ?? 0,
                                  max: driver.stints[stint_index].max_time ?? 0,
                                  median: driver.stints[stint_index].median ?? 0,
                                  mean: driver.stints[stint_index].avg_time ?? 0,
                                  items: driver.laps
                                      .filter(
                                          (driverData) =>
                                              driverData.stint === selectedStints[driver.driver],
                                      )
                                      .map((driverData) => driverData.laptime)
                                      .filter((time) => time !== null),
                              }
                            : {
                                  min: driver.session_data.min_time ?? 0,
                                  q1: driver.session_data.low_quartile ?? 0,
                                  q3: driver.session_data.high_quartile ?? 0,
                                  max: driver.session_data.max_time ?? 0,
                                  median: driver.session_data.median ?? 0,
                                  mean: driver.session_data.avg_time ?? 0,
                                  items: driver.laps
                                      .map((driverData) => driverData.laptime)
                                      .filter((time) => time !== null),
                              },
                    ],
                    borderColor: getColorFromColorMap(color_map, driver.driver),
                }
            }),
        }),
        [laps, selectedStints, color_map],
    ) satisfies ChartConfiguration<"boxplot">["data"]

    const selectionMin = isOutliersShown
        ? Math.min(
              ...sessionData.datasets.flatMap((dataset) => dataset.data.map((data) => data.min)),
          ) - 0.1
        : laps.low_decile || 0

    return (
        <div className="relative w-full flex flex-col">
            <Chart
                type="boxplot"
                data={sessionData}
                height={laps.driver_lap_data.length * 25}
                options={{
                    responsive: true,
                    resizeDelay: 100,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            bounds: "ticks",
                            min: selectionMin,
                            ticks: {
                                callback(tickValue) {
                                    return typeof tickValue === "number"
                                        ? formatTime(tickValue)
                                        : tickValue
                                },
                            },
                        },
                    },
                    elements: {
                        boxandwhiskers: {
                            borderWidth: 2,
                            backgroundColor: "rgba(190, 190, 190, 0.12)",
                            itemRadius: 5,
                            itemHitRadius: 5,
                            itemStyle: "circle",
                            itemBorderWidth: 1.5,
                            itemBorderColor(ctx) {
                                if (typeof ctx.dataset.borderColor === "string") {
                                    return ctx.dataset.borderColor
                                }
                                return "grey"
                            },
                            meanStyle: "rectRot",
                            meanBorderColor(ctx) {
                                if (typeof ctx.dataset.borderColor === "string") {
                                    return ctx.dataset.borderColor
                                }
                                return "grey"
                            },
                            meanBorderWidth: 1.5,
                            meanRadius: 10,
                        },
                    },
                    plugins: {
                        zoom: {
                            limits: {
                                x: {
                                    min: laps.min_time || 0 - 1,
                                    max: laps.max_time || 0 + 1,
                                },
                            },
                            zoom: {
                                drag: {
                                    enabled: true,
                                },
                                mode: "x",
                            },
                        },
                        tooltip: {
                            callbacks: {
                                /** @ts-ignore */
                                label: ({
                                    dataset,
                                    dataIndex,
                                }: {
                                    dataset: (typeof sessionData)["datasets"][number]
                                    dataIndex: number
                                }) =>
                                    `Min time: ${formatTime(dataset.data[dataIndex].min || 0)}, ` +
                                    `max time: ${formatTime(dataset.data[dataIndex].max || 0)}, ` +
                                    `25% quantile: ${formatTime(dataset.data[dataIndex].q1 || 0)}, ` +
                                    `75% quantile: ${formatTime(dataset.data[dataIndex].q3 || 0)}, ` +
                                    `mean: ${formatTime(dataset.data[dataIndex].mean || 0)}, ` +
                                    `median: ${formatTime(dataset.data[dataIndex].median || 0)}`,
                            },
                        },
                    },
                    indexAxis: "y",
                    minStats: "whiskerMin",
                    maxStats: "whiskerMax",
                }}
            />
        </div>
    )
}
