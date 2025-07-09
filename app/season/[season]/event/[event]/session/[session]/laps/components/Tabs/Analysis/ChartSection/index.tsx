"use client"
import type { Chart, ChartData, ChartDataset, ChartTypeRegistry } from "chart.js"
import { useCallback, useMemo, useRef, type RefObject } from "react"
import type { DriverTelemetryPlotData, PlotColor } from "@/client/generated"
import { SpeedtracePresetChart } from "@/components/Chart/SpeedtracePresetChart"
import { TelemetryPresetChart } from "@/components/Chart/TelemetryPresetChart"
import { TimedeltaPresetChart } from "@/components/Chart/TimedeltaPresetChart"
import { getColorFromColorMap } from "@/components/Chart/helpers"
import { Button } from '@/components/ui/button'

export type TSpeedDataset = ChartDataset<
    "scatter",
    {
        x: number
        y: number
    }[]
>[]

export default function TelemetryChartSection(props: {
    data: DriverTelemetryPlotData[] | null
    colorMap: Record<string, PlotColor>
    ref: RefObject<HTMLElement | null>
}) {
    const { data: telemetryMeasurements, colorMap, ref } = props
    const distanceLabels = telemetryMeasurements
        ?.flatMap((lap) => lap.lap.telemetry.map((measurement) => Math.trunc(measurement.distance)))
        .sort((a, b) => a - b)

    const presets = useMemo(
        () =>
            telemetryMeasurements?.map((driverMeasurements) => ({
                borderColor: getColorFromColorMap(colorMap, driverMeasurements.driver),
                borderDash:
                    colorMap[driverMeasurements.driver].style === "alternative"
                        ? [6, 1.5]
                        : undefined,
            })) || [],
        [telemetryMeasurements, colorMap],
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
            telemetryMeasurements
                ?.map((comp, index) => ({
                    label: `${comp.driver} vs ${comp.delta?.reference}`,
                    data:
                        comp.delta?.delta.map((measurement) => ({
                            x: measurement.distance,
                            y: measurement.gap,
                        })) || [],
                    ...presets[index],
                }))
                .filter((tMeasurements) => tMeasurements.data.length > 0) || [],
        [telemetryMeasurements, presets],
    )

    const chartRefs = useRef<Chart<keyof ChartTypeRegistry, unknown, unknown>[]>([])

    const pushRef = useCallback(
        (chart?: Chart<keyof ChartTypeRegistry, unknown, unknown> | null) => {
            if (chart) {
                chartRefs.current.push(chart)
            }
        },
        [],
    )

    return (
        <section ref={ref} className="flex flex-col gap-2">
            <div className="flex flex-col justify-end">
                <Button
                    type="button"
                    size="md"
                    variant="secondary"
                    onClick={() => {
                        chartRefs.current.forEach((chart) => chart.resetZoom())
                    }}
                >
                    Reset zoom
                </Button>
            </div>
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
                height={50}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels, datasets: throttleDatasets }}
                options={{
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: "Throttle %",
                            },
                            min: 0,
                            max: 100,
                        },
                    },
                }}
                height={30}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels, datasets: brakeDatasets }}
                options={{
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: "Brake %",
                            },
                            min: 0,
                            max: 100,
                        },
                    },
                }}
                height={30}
            />
        </section>
    )
}
