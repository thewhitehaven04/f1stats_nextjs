"use client"
import type { ChartData } from "chart.js"
import { useMemo, type ReactNode, type RefObject } from "react"
import { getAlternativeColor } from "../../helpers/getAlternativeColor"
import type { ChartProps } from "react-chartjs-2"
import type { DriverTelemetryPlotData } from "@/client/generated"
import { SpeedtracePresetChart } from "@/components/Chart/SpeedtracePresetChart"
import { TelemetryPresetChart } from "@/components/Chart/TelemetryPresetChart"

export function TelemetryChartSection(props: {
    telemetryMeasurements: DriverTelemetryPlotData[] | null
    ref: RefObject<HTMLElement | null>
}) {
    const { telemetryMeasurements, ref } = props
    const distanceLabels = telemetryMeasurements
        ? telemetryMeasurements[0].lap.telemetry.map((measurement) => measurement.distance)
        : []

    const maxDistance = telemetryMeasurements
        ? telemetryMeasurements[0].lap.telemetry.at(-1)?.distance
        : 0

    const speedTraceOptions = useMemo(
        () =>
            ({
                plugins: {
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
                    x: { max: maxDistance },
                },
            }) satisfies ChartProps<"line">["options"],
        [maxDistance],
    )

    const presets = useMemo(
        () =>
            telemetryMeasurements?.map((driverMeasurements) => ({
                borderColor:
                    driverMeasurements.style === "alternative"
                        ? getAlternativeColor(driverMeasurements.team.color)
                        : driverMeasurements.team.color,
            })) || [],
        [telemetryMeasurements],
    )

    const speedDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            telemetryMeasurements?.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.speed,
                })),
                ...presets[index],
            })) || [],
        [telemetryMeasurements, presets],
    )

    const rpmDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            telemetryMeasurements?.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.rpm,
                })),
                ...presets[index],
            })) || [],
        [telemetryMeasurements, presets],
    )

    const throttleDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            telemetryMeasurements?.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.throttle,
                })),
                ...presets[index],
            })) || [],
        [telemetryMeasurements, presets],
    )

    const brakeDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            telemetryMeasurements?.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.brake * 100,
                })),
                ...presets[index],
            })) || [],
        [telemetryMeasurements, presets],
    )

    const timeDeltaDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            telemetryMeasurements?.map((comp, index) => ({
                label: `${comp.driver} vs ${comp.delta?.reference}`,
                data:
                    comp.delta?.delta.map((measurement) => ({
                        x: measurement.distance,
                        y: measurement.gap,
                    })) || [],
                ...presets[index],
            })) || [],
        [telemetryMeasurements, presets],
    )

    return (
        <section ref={ref} className="flex flex-col gap-2">
            <SpeedtracePresetChart
                data={{
                    labels: distanceLabels,
                    datasets: speedDatasets,
                }}
                options={speedTraceOptions}
                height={120}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels, datasets: timeDeltaDatasets }}
                options={{
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: "Time delta, s",
                            },
                        },
                    },
                }}
                height={60}
            />
            <TelemetryPresetChart
                data={{
                    labels: distanceLabels,
                    datasets: rpmDatasets,
                }}
                options={{
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: "RPM",
                            },
                        },
                    },
                }}
                height={60}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels, datasets: throttleDatasets }}
                options={{
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: "Throttle application, %",
                            },
                            min: 0,
                            max: 100,
                        },
                    },
                }}
                height={45}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels, datasets: brakeDatasets }}
                options={{
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: "Brake application, %",
                            },
                            min: 0,
                            max: 100,
                        },
                    },
                }}
                height={45}
            />
        </section>
    )
}
