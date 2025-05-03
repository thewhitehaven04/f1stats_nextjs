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
    telemetryComparisonSlot: ReactNode
    ref: RefObject<HTMLElement | null>
}) {
    const { telemetryMeasurements, ref } = props
    console.log(telemetryMeasurements)
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
                borderDash: driverMeasurements.style === "alternative" ? [6, 1.5] : undefined,
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
                    y: measurement.brake,
                })),
                ...presets[index],
            })) || [],
        [telemetryMeasurements, presets],
    )

    return (
        <section ref={ref} className="flex flex-col gap-4">
            <SpeedtracePresetChart
                data={{
                    labels: distanceLabels,
                    datasets: speedDatasets,
                }}
                options={speedTraceOptions}
                height={120}
            />
            <TelemetryPresetChart
                data={{
                    labels: distanceLabels,
                    datasets: rpmDatasets,
                }}
                height={60}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels, datasets: throttleDatasets }}
                height={45}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels, datasets: brakeDatasets }}
                height={45}
            />
        </section>
    )
}
