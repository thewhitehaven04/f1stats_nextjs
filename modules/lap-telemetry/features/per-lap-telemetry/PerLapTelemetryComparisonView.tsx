"use client"
import type { Chart, ChartDataset, ChartTypeRegistry } from "chart.js"
import { useCallback, useMemo, useRef } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { DeltaCircuitMap } from "@/modules/lap-telemetry/components/DeltaCircuitMap"
import { Button } from "@/uiComponents/button"
import { getAlternativeColor, getColorFromColorMap } from "@/shared/components/themed-chart/helpers"
import { TimedeltaPresetChart } from "../../components/TimedeltaPresetChart"
import { SpeedtracePresetChart } from "../../components/SpeedtracePresetChart"
import { TelemetryPresetChart } from "../../components/TelemetryPresetChart"
import {
    getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet,
} from "@/shared/client/generated"
import { ApiClient } from "@/shared/client"
import { useSession, type TSession } from "@/shared/hooks/useSession"
import { usePerLapTelemetry } from "../../hooks/queries/usePerLapTelemetry"

export type TTelemetryDataset = ChartDataset<
    "scatter",
    {
        x: number
        y: number
    }[]
>[]

export default function PerLapTelemetryComparisonView() {
    const { season, event, session } = useSession()
    const { data, isFetching } = usePerLapTelemetry({ season, event, session })
    const telemetries = data?.telemetries
    const colorMap = Object.fromEntries(
        Object.keys(data?.color_map || {}).map((key) => [
            key,
            data?.color_map[key].style === "alternative"
                ? getAlternativeColor(data?.color_map[key].color)
                : data?.color_map[key].color || "#FFF",
        ]),
    )

    const distanceLabels =
        telemetries
            ?.flatMap((lap) =>
                lap.lap.telemetry.map((measurement) => Math.trunc(measurement.distance)),
            )
            .sort((a, b) => a - b) ?? []

    const presets = useMemo(
        () =>
            telemetries?.map((driverMeasurements) => ({
                borderColor: getColorFromColorMap(data?.color_map || {}, driverMeasurements.driver),
                borderDash:
                    data?.color_map[driverMeasurements.driver].style === "alternative"
                        ? [6, 1.5]
                        : undefined,
            })) || [],
        [data, telemetries],
    )

    const speedDatasets: TTelemetryDataset = useMemo(
        () =>
            telemetries?.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.speed,
                })),
                ...presets[index],
            })) || [],
        [telemetries, presets],
    )

    const rpmDatasets: TTelemetryDataset = useMemo(
        () =>
            telemetries?.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.rpm,
                })),
                ...presets[index],
            })) || [],
        [telemetries, presets],
    )

    const throttleDatasets: TTelemetryDataset = useMemo(
        () =>
            telemetries?.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.throttle,
                })),
                ...presets[index],
            })) || [],
        [telemetries, presets],
    )

    const brakeDatasets: TTelemetryDataset = useMemo(
        () =>
            telemetries?.map((lap, index) => ({
                label: lap.driver,
                data: lap.lap.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.brake * 100,
                })),
                ...presets[index],
            })) || [],
        [telemetries, presets],
    )

    const timeDeltaDatasets: TTelemetryDataset = useMemo(
        () =>
            telemetries
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
        [telemetries, presets],
    )

    const { data: geometry } = useSuspenseQuery({
        queryKey: [season, event],
        queryFn: () =>
            getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet({
                path: { year: season, event },
                client: ApiClient,
                throwOnError: true,
            }).then((res) => res.data),
    })

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
        <section className="flex flex-col gap-2">
            <DeltaCircuitMap
                geometry={geometry}
                driverDeltas={data?.delta || []}
                colorMap={colorMap}
            />
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
                    labels: distanceLabels,
                    datasets: speedDatasets,
                }}
                height={150}
                ref={(chart) => pushRef("speedtrace", chart)}
                isUpdatingData={isFetching}
            />
            <TimedeltaPresetChart
                data={{ labels: distanceLabels, datasets: timeDeltaDatasets }}
                height={60}
                ref={(chart) => pushRef("timedelta", chart)}
                isUpdatingData={isFetching}
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
                ref={(chart) => pushRef("rpm", chart)}
                isUpdatingData={isFetching}
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
                ref={(chart) => pushRef("throttle", chart)}
                isUpdatingData={isFetching}
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
                ref={(chart) => pushRef("brake", chart)}
                isUpdatingData={isFetching}
            />
        </section>
    )
}
