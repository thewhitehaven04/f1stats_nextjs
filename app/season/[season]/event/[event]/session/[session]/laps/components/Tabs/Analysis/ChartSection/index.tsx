"use client"
import type { ChartData, ChartDataset } from "chart.js"
import { useMemo, type RefObject } from "react"
import { getAlternativeColor } from "../../../helpers/getAlternativeColor"
import type { DriverTelemetryPlotData } from "@/client/generated"
import { SpeedtracePresetChart } from "@/components/Chart/SpeedtracePresetChart"
import { TelemetryPresetChart } from "@/components/Chart/TelemetryPresetChart"
import { TimedeltaPresetChart } from "@/components/Chart/TimedeltaPresetChart"

export type TSpeedDataset = ChartDataset<
    "scatter",
    {
        x: number
        y: number
    }[]
>[]

export function TelemetryChartSection(props: {
    data: DriverTelemetryPlotData[] | null
    ref: RefObject<HTMLElement | null>
}) {
    const { data: telemetryMeasurements, ref } = props
    const distanceLabels = telemetryMeasurements
        ?.flatMap((lap) => lap.lap.telemetry.map((measurement) => Math.trunc(measurement.distance)))
        .sort((a, b) => a - b)

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

    const speedDatasets: TSpeedDataset = useMemo(
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

    const rpmDatasets: ChartData<"scatter">["datasets"] = useMemo(
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

    const throttleDatasets: ChartData<"scatter">["datasets"] = useMemo(
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

    const brakeDatasets: ChartData<"scatter">["datasets"] = useMemo(
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

    const timeDeltaDatasets: ChartData<"scatter">["datasets"] = useMemo(
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

    console.log(timeDeltaDatasets)

    return (
        <section ref={ref} className="flex flex-col gap-2">
            <SpeedtracePresetChart
                data={{
                    labels: distanceLabels,
                    datasets: speedDatasets,
                }}
                height={150}
            />
            <TimedeltaPresetChart
                data={{ labels: distanceLabels, datasets: timeDeltaDatasets }}
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
