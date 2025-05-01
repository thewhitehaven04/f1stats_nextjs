import type { TelemetryPlotData } from "@/client/generated"
import type { ChartData } from "chart.js"
import { useMemo, type RefObject } from "react"
import type { ChartProps } from "react-chartjs-2"
import { getAlternativeColor } from "../../helpers/getAlternativeColor"
import { TelemetryPresetChart } from "@/components/Chart/TelemetryPresetChart"
import { SpeedtracePresetChart } from "@/components/Chart/SpeedtracePresetChart"

export const AverageTelemetrySection = ({
    averageTelemetry,
    ref,
}: { averageTelemetry: TelemetryPlotData[] | null; ref: RefObject<HTMLElement | null> }) => {
    const distanceLabels =
        averageTelemetry?.length &&
        averageTelemetry[0].telemetry.map((measurement) => Math.trunc(measurement.distance))
    const maxDistance = averageTelemetry?.length && averageTelemetry[0].telemetry.at(-1)?.distance

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
            averageTelemetry?.map((lap, index) => ({
                label: lap.driver,
                data: lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.speed,
                })),
                ...presets[index],
            })) || [],
        [averageTelemetry, presets],
    )

    const rpmDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            averageTelemetry?.map((lap, index) => ({
                label: lap.driver,
                data: lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.rpm,
                })),
                ...presets[index],
            })) || [],
        [averageTelemetry, presets],
    )

    const throttleDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            averageTelemetry?.map((lap, index) => ({
                label: lap.driver,
                data: lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.throttle,
                })),
                ...presets[index],
            })) || [],
        [averageTelemetry, presets],
    )

    const brakeDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            averageTelemetry?.map((lap, index) => ({
                label: lap.driver,
                data: lap.telemetry.map((measurement) => ({
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
                options={speedTraceOptions}
                height={120}
            />
            <TelemetryPresetChart
                data={{
                    labels: distanceLabels || [],
                    datasets: rpmDatasets,
                }}
                height={40}
                options={{
                    scales: { y: { title: { display: true, text: "RPM" } } },
                }}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: throttleDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Throttle" } } },
                }}
                height={35}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: brakeDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Brake" } } },
                }}
                height={35}
            />
        </section>
    )
}
