import type { Chart, ChartTypeRegistry } from "chart.js"
import { useCallback, useMemo, useRef } from "react"
import { TelemetryPresetChart } from "@/components/Chart/TelemetryPresetChart"
import { SpeedtracePresetChart } from "@/components/Chart/SpeedtracePresetChart"
import type { AverageTelemetryPlotData } from "@/client/generated"
import type { TTelemetryDataset } from "../ChartSection"
import { TimedeltaPresetChart } from "@/components/Chart/TimedeltaPresetChart"
import { Button } from "@/components/ui/button"

export default (props: {
    data: AverageTelemetryPlotData[] | null
    colorMap: Record<string, string>
}) => {
    const { data: averageTelemetry, colorMap } = props
    const distanceLabels =
        averageTelemetry?.length &&
        averageTelemetry[0].telemetry.map((measurement) => Math.trunc(measurement.distance))

    const presets = useMemo(
        () =>
            averageTelemetry?.map((driverMeasurements) => ({
                borderColor: colorMap[driverMeasurements.group.name],
            })) || [],
        [averageTelemetry, colorMap],
    )

    const speedDatasets: TTelemetryDataset = useMemo(
        () =>
            averageTelemetry?.map((stint, index) => ({
                label: stint.group.name,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.speed,
                })),
                ...presets[index],
            })) || [],
        [averageTelemetry, presets],
    )

    const timeDeltaDatasets: TTelemetryDataset = useMemo(
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

    const rpmDatasets: TTelemetryDataset = useMemo(
        () =>
            averageTelemetry?.map((stint, index) => ({
                label: stint.group.name,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.rpm,
                })),
                ...presets[index],
            })) || [],
        [averageTelemetry, presets],
    )

    const throttleDatasets: TTelemetryDataset = useMemo(
        () =>
            averageTelemetry?.map((stint, index) => ({
                label: stint.group.name,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.throttle,
                })),
                ...presets[index],
            })) || [],
        [averageTelemetry, presets],
    )

    const brakeDatasets: TTelemetryDataset = useMemo(
        () =>
            averageTelemetry?.map((stint, index) => ({
                label: stint.group.name,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.brake,
                })),
                ...presets[index],
            })) || [],
        [averageTelemetry, presets],
    )

    const chartRefs = useRef<
        Record<string, Chart<keyof ChartTypeRegistry, unknown, unknown> | null>
    >({
        speedtrace: null,
        rpm: null,
        throttle: null,
        brake: null,
        timedeltas: null,
    })

    const pushRef = useCallback(
        (
            type: keyof typeof chartRefs.current,
            chart?: Chart<keyof ChartTypeRegistry, unknown, unknown> | null,
        ) => {
            if (chart) {
                chartRefs.current[type] = chart
            }

            return () => {
                chartRefs.current[type] = null
            }
        },
        [],
    )

    return (
        <section className="flex flex-col gap-4">
            <div className="flex flex-row justify-end">
                <Button
                    type="button"
                    size="md"
                    variant="secondary"
                    onClick={() => {
                        Object.values(chartRefs.current).forEach((chart) =>
                            chart ? chart.resetZoom() : null,
                        )
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
                ref={(chart) => pushRef("speedtrace", chart)}
            />
            <TimedeltaPresetChart
                data={{ labels: distanceLabels || [], datasets: timeDeltaDatasets }}
                height={60}
                ref={(chart) => pushRef("timedelta", chart)}
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
                ref={(chart) => pushRef("rpm", chart)}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: throttleDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Throttle %" } } },
                }}
                height={40}
                ref={(chart) => pushRef("throttle", chart)}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: brakeDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Brake %" } } },
                }}
                height={40}
                ref={(chart) => pushRef("brake", chart)}
            />
        </section>
    )
}
