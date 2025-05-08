import type { ChartData } from "chart.js"
import { useMemo, type RefObject } from "react"
import { getAlternativeColor } from "../../../helpers/getAlternativeColor"
import { TelemetryPresetChart } from "@/components/Chart/TelemetryPresetChart"
import { SpeedtracePresetChart } from "@/components/Chart/SpeedtracePresetChart"
import type { AverageTelemetryPlotData } from "@/client/generated"

export const AverageTelemetrySection = ({
    averageTelemetry,
    ref,
}: { averageTelemetry: AverageTelemetryPlotData[] | null; ref: RefObject<HTMLElement | null> }) => {
    const distanceLabels =
        averageTelemetry?.length &&
        averageTelemetry[0].telemetry.map((measurement) => Math.trunc(measurement.distance))

    const presets = useMemo(
        () =>
            averageTelemetry?.map((driverMeasurements) => ({
                borderColor:
                    driverMeasurements.style === "alternative"
                        ? getAlternativeColor(driverMeasurements.team.color)
                        : driverMeasurements.team.color,
                borderDash: driverMeasurements.style === "alternative" ? [6, 1.5] : undefined,
            })) || [],
        [averageTelemetry],
    )

    const speedDatasets: ChartData<"line">["datasets"] = useMemo(
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

    const rpmDatasets: ChartData<"line">["datasets"] = useMemo(
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

    const throttleDatasets: ChartData<"line">["datasets"] = useMemo(
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

    const brakeDatasets: ChartData<"line">["datasets"] = useMemo(
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

    return (
        <section className="flex flex-col gap-4" ref={ref}>
            <SpeedtracePresetChart
                data={{
                    labels: distanceLabels || [],
                    datasets: speedDatasets,
                }}
                height={150}
            />
            <TelemetryPresetChart
                data={{
                    labels: distanceLabels || [],
                    datasets: rpmDatasets,
                }}
                height={45}
                options={{
                    scales: { y: { title: { display: true, text: "RPM" } } },
                }}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: throttleDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Throttle application, %" } } },
                }}
                height={30}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: brakeDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Brake application, %" } } },
                }}
                height={30}
            />
        </section>
    )
}
