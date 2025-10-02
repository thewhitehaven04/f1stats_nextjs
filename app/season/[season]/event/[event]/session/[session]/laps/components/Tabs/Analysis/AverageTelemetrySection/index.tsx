import type { Chart, ChartTypeRegistry } from "chart.js"
import { useCallback, useMemo, useRef } from "react"
import { TelemetryPresetChart } from "@/components/Chart/TelemetryPresetChart"
import { SpeedtracePresetChart } from "@/components/Chart/SpeedtracePresetChart"
import {
    getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost,
    getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet,
    type GetAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePostResponse,
    type SessionQuery,
} from "../../../../../../../../../../../../shared/client/generated"
import type { TTelemetryDataset } from "../ChartSection"
import { TimedeltaPresetChart } from "@/components/Chart/TimedeltaPresetChart"
import { Button } from "@/components/ui/button"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { ApiClient } from "../../../../../../../../../../../../shared/client"
import { getAlternativeColor } from "../../../helpers/getAlternativeColor"
import { DeltaCircuitMap } from '@/components/CircuitSection/CircuitMap'
import type { TSession } from '../../../../../hooks/useSession'

export default (props: {
    queries: SessionQuery[]
    session: TSession 
    event: string
    season: string
}) => {
    const { season, event, session, queries } = props
    const timeoutRef = useRef<NodeJS.Timeout>(null)
    const { data, isFetching } = useQuery({
        queryKey: ["averageTelemetry", season, event, session, queries],
        queryFn: async () =>
            new Promise<GetAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePostResponse>(
                (resolve) => {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current)

                    timeoutRef.current = setTimeout(() => {
                        resolve(
                            getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost(
                                {
                                    client: ApiClient,
                                    body: { queries },
                                    path: {
                                        event,
                                        session,
                                        year: season,
                                    },
                                    throwOnError: true,
                                },
                            ).then((res) => res.data),
                        )
                    }, 700)
                },
            ),
        enabled: () => !!queries.length,
    })

    const { data: geometry } = useSuspenseQuery({
        queryKey: [season, event],
        queryFn: () =>
            getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet({
                path: { year: season, event },
                client: ApiClient,
                throwOnError: true,
            }).then((res) => res.data),
    })

    const colorMap = Object.fromEntries(
        Object.keys(data?.color_map || {}).map((key) => [
            key,
            data?.color_map[key].style === "alternative"
                ? getAlternativeColor(data?.color_map[key].color)
                : data?.color_map[key].color || "#FFF",
        ]),
    )

    const telemetries = data?.telemetries

    const distanceLabels =
        telemetries?.length &&
        telemetries[0].telemetry.map((measurement) => Math.trunc(measurement.distance))

    const presets = useMemo(
        () =>
            telemetries?.map((driverMeasurements) => ({
                borderColor: colorMap[driverMeasurements.group.name],
            })) || [],
        [telemetries, colorMap],
    )

    const speedDatasets: TTelemetryDataset = useMemo(
        () =>
            telemetries?.map((stint, index) => ({
                label: stint.group.name,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.speed,
                })),
                ...presets[index],
            })) || [],
        [telemetries, presets],
    )

    const timeDeltaDatasets: TTelemetryDataset = useMemo(
        () =>
            telemetries
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
        [telemetries, presets],
    )

    const rpmDatasets: TTelemetryDataset = useMemo(
        () =>
            telemetries?.map((stint, index) => ({
                label: stint.group.name,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.rpm,
                })),
                ...presets[index],
            })) || [],
        [telemetries, presets],
    )

    const throttleDatasets: TTelemetryDataset = useMemo(
        () =>
            telemetries?.map((stint, index) => ({
                label: stint.group.name,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.throttle,
                })),
                ...presets[index],
            })) || [],
        [telemetries, presets],
    )

    const brakeDatasets: TTelemetryDataset = useMemo(
        () =>
            telemetries?.map((stint, index) => ({
                label: stint.group.name,
                data: stint.telemetry.map((measurement) => ({
                    x: measurement.distance,
                    y: measurement.brake,
                })),
                ...presets[index],
            })) || [],
        [telemetries, presets],
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
                    labels: distanceLabels || [],
                    datasets: speedDatasets,
                }}
                ref={(chart) => pushRef("speedtrace", chart)}
                isUpdatingData={isFetching}
            />
            <TimedeltaPresetChart
                data={{ labels: distanceLabels || [], datasets: timeDeltaDatasets }}
                ref={(chart) => pushRef("timedelta", chart)}
                isUpdatingData={isFetching}
            />
            <TelemetryPresetChart
                data={{
                    labels: distanceLabels || [],
                    datasets: rpmDatasets,
                }}
                options={{
                    scales: { y: { title: { display: true, text: "RPM" } } },
                }}
                ref={(chart) => pushRef("rpm", chart)}
                isUpdatingData={isFetching}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: throttleDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Throttle %" } } },
                }}
                ref={(chart) => pushRef("throttle", chart)}
                isUpdatingData={isFetching}
            />
            <TelemetryPresetChart
                data={{ labels: distanceLabels || [], datasets: brakeDatasets }}
                options={{
                    scales: { y: { title: { display: true, text: "Brake %" } } },
                }}
                ref={(chart) => pushRef("brake", chart)}
                isUpdatingData={isFetching}
            />
        </section>
    )
}
