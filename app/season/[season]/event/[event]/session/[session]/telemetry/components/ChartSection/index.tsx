"use client"
import type { ChartData } from "chart.js"
import { useMemo, type ReactNode } from "react"
import { getAlternativeColor } from "../../../laps/components/helpers/getAlternativeColor"
import { INTERACTION_CONFIG, getDistanceLabelInTooltipTitleCallback } from "./config"
import type { DriverTelemetryMeasurement } from "@/client/generated"
import type { ChartProps } from "react-chartjs-2"
import dynamic from "next/dynamic"
import { TICKS_FONT_CONFIG, TOOLTIP_CONFIG } from "@/components/Chart/config"

export const Chart = dynamic(async () => (await import("./ZoomableChart")).ZoomableChart, {
    ssr: false,
})

export default function TelemetryChartSection(props: {
    telemetryMeasurements: DriverTelemetryMeasurement[]
    telemetryComparisonSlot: ReactNode
}) {
    const { telemetryMeasurements } = props
    const distanceLabels = telemetryMeasurements[0].lap.telemetry.map(
        (measurement) => measurement.distance,
    )
    const maxDistance = telemetryMeasurements[0].lap.telemetry.at(-1)?.distance || 0

    const speedTraceOptions = useMemo(
        () =>
            ({
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                interaction: INTERACTION_CONFIG,
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                    tooltip: {
                        ...TOOLTIP_CONFIG,
                        callbacks: { title: getDistanceLabelInTooltipTitleCallback },
                    },
                    zoom: {
                        limits: {
                            x: {
                                min: 0,
                                max: maxDistance,
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        type: "linear",
                        max: maxDistance,
                        title: {
                            text: "Distance (m)",
                            display: true,
                        },
                        min: 0,
                        ticks: {
                            format: {
                                roundingMode: "halfCeil",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            },
                        },
                    },
                    y: {
                        type: "linear",
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
            }) satisfies ChartProps<"line">["options"],
        [maxDistance],
    )

    const chartOptions = {
        ...BASE_CHART_OPTIONS,
        showLine: true,
        scales: {
            x: {
                type: "linear",
                min: 0,
                max: maxDistance,
                ticks: {
                    font: TICKS_FONT_CONFIG,
                    format: {
                        roundingMode: "halfCeil",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    },
                },
            },
            y: {
                ticks: {
                    font: TICKS_FONT_CONFIG,
                    format: {
                        roundingMode: "halfCeil",
                    },
                },
            },
        },
        interaction: INTERACTION_CONFIG,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                ...TOOLTIP_CONFIG,
                callbacks: { title: getDistanceLabelInTooltipTitleCallback },
            },
            zoom: {
                limits: {
                    x: {
                        min: 0,
                        max: maxDistance,
                    },
                },
                zoom: {
                    drag: {
                        enabled: true,
                    },
                    mode: "x",
                },
            },
        },
    } satisfies ChartProps<"line">["options"]

    const presets = useMemo(
        () =>
            telemetryMeasurements.map((driverMeasurements) => ({
                borderColor:
                    driverMeasurements.style === "alternative"
                        ? getAlternativeColor(driverMeasurements.team.color)
                        : driverMeasurements.team.color,
                borderDash: driverMeasurements.style === "alternative" ? [6, 1.5] : undefined,
            })),
        [telemetryMeasurements],
    )

    const speedDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            telemetryMeasurements.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.speed,
                })),
                ...presets[index],
            })),
        [telemetryMeasurements, presets],
    )

    const rpmDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            telemetryMeasurements.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.rpm,
                })),
                ...presets[index],
            })),
        [telemetryMeasurements, presets],
    )

    const throttleDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            telemetryMeasurements.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.throttle,
                })),
                ...presets[index],
            })),
        [telemetryMeasurements, presets],
    )

    const brakeDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            telemetryMeasurements.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.brake,
                })),
                ...presets[index],
            })),
        [telemetryMeasurements, presets],
    )

    return (
        <section>
            <h2 className="divider divider-start text-lg">Telemetry</h2>
            <Chart
                type="line"
                data={{
                    labels: distanceLabels,
                    datasets: speedDatasets,
                }}
                options={speedTraceOptions}
                height={120}
            />
            {props.telemetryComparisonSlot}
            <Chart
                type="line"
                data={{
                    labels: distanceLabels,
                    datasets: rpmDatasets,
                }}
                options={chartOptions}
                height={50}
            />
            <Chart
                type="line"
                data={{ labels: distanceLabels, datasets: throttleDatasets }}
                options={chartOptions}
                height={30}
            />
            <Chart
                type="line"
                data={{ labels: distanceLabels, datasets: brakeDatasets }}
                options={chartOptions}
                height={30}
            />
        </section>
    )
}
