import type { Chart, ChartData, ChartTypeRegistry } from "chart.js"
import { useCallback, useMemo, useRef, type RefObject } from "react"
import { TelemetryPresetChart } from "@/components/Chart/TelemetryPresetChart"
import { SpeedtracePresetChart } from "@/components/Chart/SpeedtracePresetChart"
import type { AverageTelemetryPlotData, PlotColor } from "@/client/generated"
import type { TSpeedDataset } from "../ChartSection"
import { TimedeltaPresetChart } from "@/components/Chart/TimedeltaPresetChart"
import { getColorFromColorMap } from "@/components/Chart/helpers"
import { Button } from "@/components/ui/button"

export default (props: {
    data: AverageTelemetryPlotData[] | null
    colorMap: Record<string, PlotColor>
    ref: RefObject<HTMLElement | null>
}) => {
    const { data: averageTelemetry, ref, colorMap } = props
    const distanceLabels =
        averageTelemetry?.length &&
        averageTelemetry[0].telemetry.map((measurement) => Math.trunc(measurement.distance))

    const presets = useMemo(
        () =>
            averageTelemetry?.map((driverMeasurements) => ({
                borderColor: getColorFromColorMap(colorMap, driverMeasurements.driver),
                borderDash:
                    colorMap[driverMeasurements.driver].style === "alternative"
                        ? [6, 1.5]
                        : undefined,
            })) || [],
        [averageTelemetry, colorMap],
    )

    const speedDatasets: TSpeedDataset = useMemo(
        () =>
            averageTelemetry?.map((stint, index) => ({
                label: `${stint.driver}, ${stint.stint_length} laps`,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.speed,
                })),
                ...presets[index],
            })) || [],
        [averageTelemetry, presets],
    )

    const timeDeltaDatasets: ChartData<"scatter">["datasets"] = useMemo(
        () =>
            averageTelemetry
                ?.map((tel, index) => ({
                    label: `${tel.driver} gap to ${tel.delta?.reference}`,
                    data:
                        tel.delta?.delta.map((dMeasurement) => ({
                            x: dMeasurement.distance,
                            y: dMeasurement.gap,
                        })) || [],
                    ...presets[index],
                }))
                .filter((dataset) => dataset.data.length > 0) || [],
        [averageTelemetry, presets],
    )

    const rpmDatasets: ChartData<"scatter">["datasets"] = useMemo(
        () =>
            averageTelemetry?.map((stint, index) => ({
                label: stint.driver,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.rpm,
                })),
                ...presets[index],
            })) || [],
        [averageTelemetry, presets],
    )

    const throttleDatasets: ChartData<"scatter">["datasets"] = useMemo(
        () =>
            averageTelemetry?.map((stint, index) => ({
                label: stint.driver,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.throttle,
                })),
                ...presets[index],
            })) || [],
        [averageTelemetry, presets],
    )

    const brakeDatasets: ChartData<"scatter">["datasets"] = useMemo(
        () =>
            averageTelemetry?.map((stint, index) => ({
                label: stint.driver,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.brake,
                })),
                ...presets[index],
            })) || [],
        [averageTelemetry, presets],
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
        <section className="flex flex-col gap-4" ref={ref}>
            <div className="flex flex-row justify-end">
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
                    labels: distanceLabels || [],
                    datasets: speedDatasets,
                }}
                height={150}
                ref={pushRef}
            />
            <TimedeltaPresetChart
                data={{ labels: distanceLabels || [], datasets: timeDeltaDatasets }}
                height={60}
                ref={pushRef}
            />
            <TelemetryPresetChart
                data={{
                    labels: distanceLabels || [],
                    datasets: rpmDatasets,
                }}
                height={50}
                options={{
                    scales: { y: { title: { display: true, text: "RPM" } } },
                }}
                ref={pushRef}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: throttleDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Throttle %" } } },
                }}
                height={40}
                ref={pushRef}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: brakeDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Brake %" } } },
                }}
                height={40}
                ref={pushRef}
            />
        </section>
    )
}
