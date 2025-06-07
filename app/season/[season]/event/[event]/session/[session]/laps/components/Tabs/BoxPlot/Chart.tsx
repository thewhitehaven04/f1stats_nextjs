'use client'
import type { LapSelectionData } from "@/client/generated"
import { formatTime } from "@/core/helpers/formatTime"
import type { ChartConfiguration } from "chart.js"
import { useMemo } from "react"
import { Chart } from "react-chartjs-2"
import { getAlternativeColor } from "../../helpers/getAlternativeColor"
import { initGlobalChartConfig } from "@/components/Chart/config"
initGlobalChartConfig()

export function LapsBoxChart({
    isOutliersShown,
    selectedStints,
    laps,
}: {
    isOutliersShown: boolean
    selectedStints: Record<string, number | undefined>
    laps: LapSelectionData
}) {
    const sessionData = useMemo(
        () => ({
            labels: ["Laptime"],
            datasets: laps.driver_lap_data.map((driver) => ({
                label: driver.driver,
                data: [
                    selectedStints[driver.driver]
                        ? {
                              min:
                                  driver.stints[(selectedStints[driver.driver] as number) - 1]
                                      .min_time ?? 0,
                              q1:
                                  driver.stints[(selectedStints[driver.driver] as number) - 1]
                                      .low_quartile ?? 0,
                              q3:
                                  driver.stints[(selectedStints[driver.driver] as number) - 1]
                                      .high_quartile ?? 0,
                              max:
                                  driver.stints[(selectedStints[driver.driver] as number) - 1]
                                      .max_time ?? 0,
                              median:
                                  driver.stints[(selectedStints[driver.driver] as number) - 1]
                                      .median ?? 0,
                              mean:
                                  driver.stints[(selectedStints[driver.driver] as number) - 1]
                                      .avg_time ?? 0,
                              items: driver.laps
                                  .filter(
                                      (driverData) =>
                                          driverData.stint === selectedStints[driver.driver],
                                  )
                                  .map((driverData) => driverData.laptime),
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
                                  .filter(Boolean),
                          },
                ],
                borderColor:
                    driver.style === "alternative"
                        ? getAlternativeColor(driver.team.color)
                        : driver.team.color,
            })),
        }),
        [laps, selectedStints],
    ) satisfies ChartConfiguration<"boxplot">["data"]

    const selectionMax = isOutliersShown
        ? laps.high_decile || 0
        : Math.max(
              ...sessionData.datasets.flatMap((dataset) =>
                  dataset.data.flatMap((data) => data.items),
              ),
          ) + 0.1

    const selectionMin = isOutliersShown
        ? laps.low_decile || 0
        : Math.min(
              ...sessionData.datasets.flatMap((dataset) =>
                  dataset.data.flatMap((data) => data.items),
              ),
          ) - 0.1

    return (
        <Chart
            type="boxplot"
            data={sessionData}
            height={laps.driver_lap_data.length * 25}
            options={{
                responsive: true,
                scales: {
                    x: {
                        min: selectionMin,
                        max: selectionMax,
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
    )
}
