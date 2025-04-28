"use client"
import type { ChartData } from "chart.js"
import { useMemo, type ReactNode } from "react"
import { Chart, type ChartProps } from "react-chartjs-2"
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js"
import zoom from "chartjs-plugin-zoom"
import { getAlternativeColor } from "../../../laps/components/helpers/getAlternativeColor"
import { getSpeedTraceOptions, BASE_CHART_OPTIONS } from "./config"
import type { DriverTelemetryMeasurement } from "@/client/generated"

ChartJS.register([
    LineController,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
    zoom,
])

export function TelemetryChartSection(props: {
    telemetryMeasurements: DriverTelemetryMeasurement[]
    telemetryComparisonSlot: ReactNode
}) {
    const { telemetryMeasurements } = props
    const distanceLabels = telemetryMeasurements[0].lap.telemetry.map(
        (measurement) => measurement.distance,
    )
    const maxDistance = telemetryMeasurements[0].lap.telemetry.at(-1)?.distance || 0

    const speedTraceOptions = useMemo(
        () => getSpeedTraceOptions({ trackLength: maxDistance }),
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
            },
        },
        interaction: {
            mode: "x",
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                includeInvisible: false,
                axis: "x",
                mode: "nearest",
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
                    wheel: {
                        enabled: true,
                    },
                },
            },
        },
    } satisfies ChartProps<"line">["options"]

    const presets = useMemo(
        () =>
            telemetryMeasurements.map((driverMeasurements) => ({
                borderWidth: driverMeasurements.style === "alternative" ? 2.5 : 2,
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
                    y: measurement.throttle,
                })),
                ...presets[index],
            })),
        [telemetryMeasurements, presets],
    )

    return (
        <>
            <section>
                <h2 className="divider divider-start text-lg">Speed trace</h2>
                <Chart
                    type="line"
                    data={{
                        labels: distanceLabels,
                        datasets: speedDatasets,
                    }}
                    options={speedTraceOptions}
                    height={120}
                />
            </section>
            {props.telemetryComparisonSlot}
            <section>
                <h2 className="divider divider-start text-lg">RPM</h2>
                <Chart
                    type="line"
                    data={{
                        labels: distanceLabels,
                        datasets: rpmDatasets,
                    }}
                    options={chartOptions}
                    height={30}
                />
            </section>
            <section>
                <h2 className="divider divider-start text-lg">Throttle application</h2>
                <Chart
                    type="line"
                    data={{ labels: distanceLabels, datasets: throttleDatasets }}
                    options={chartOptions}
                    height={25}
                />
            </section>
            <section>
                <h2 className="divider divider-start text-lg">Brake application</h2>
                <Chart
                    type="line"
                    data={{ labels: distanceLabels, datasets: brakeDatasets }}
                    options={chartOptions}
                    height={25}
                />
            </section>
        </>
    )
}
