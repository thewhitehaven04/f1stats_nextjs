import type { ChartData } from "chart.js"
import { useMemo, type RefObject } from "react"
import { getAlternativeColor } from "../../../helpers/getAlternativeColor"
import { TelemetryPresetChart } from "@/components/Chart/TelemetryPresetChart"
import { SpeedtracePresetChart } from "@/components/Chart/SpeedtracePresetChart"
import type { AverageTelemetryPlotData } from "@/client/generated"
import type { TSpeedDataset } from "../ChartSection"
import { TimedeltaPresetChart } from "@/components/Chart/TimedeltaPresetChart"

export const AverageTelemetrySection = (props: {
    data: AverageTelemetryPlotData[] | null
    ref: RefObject<HTMLElement | null>
}) => {
    const { data: averageTelemetry, ref } = props
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
            averageTelemetry?.map((tel, index) => ({
                label: `${tel.driver} gap to ${tel.delta?.reference}`,
                data:
                    tel.delta?.delta.map((dMeasurement) => ({
                        x: dMeasurement.distance,
                        y: dMeasurement.gap,
                    })) || [],
                ...presets[index],
            })).filter((dataset) => dataset.data.length > 0) || [],
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

    return (
        <section className="flex flex-col gap-4" ref={ref}>
            <SpeedtracePresetChart
                data={{
                    labels: distanceLabels || [],
                    datasets: speedDatasets,
                }}
                height={150}
            />
            <TimedeltaPresetChart
                data={{ labels: distanceLabels || [], datasets: timeDeltaDatasets }}
                height={60}
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
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: throttleDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Throttle %" } } },
                }}
                height={40}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: brakeDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Brake %" } } },
                }}
                height={40}
            />
        </section>
    )
}
