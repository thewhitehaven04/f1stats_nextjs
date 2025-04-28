import { Suspense } from "react"
import { TelemetryChartFallback } from "../components/ChartSection/fallback"
import type { ISessionPathnameParams } from "../../types"
import { buildQueries } from "../../laps/helpers"
import {
    getLapTelemetriesApiPySeasonYearEventEventSessionSessionTelemetriesPost,
    type SessionIdentifier,
} from "@/client/generated"
import { ApiClient } from "@/client"
import dynamic from "next/dynamic"

const TelemetryChartSection = dynamic(() => import("./../components/ChartSection/index"))

export default async function TelemetryPage({
    params,
    searchParams,
}: {
    params: Promise<ISessionPathnameParams>
    searchParams: Promise<Record<string, string | string[]>>
}) {
    const queries = buildQueries(await searchParams)

    const { data: telemetryMeasurements } =
        await getLapTelemetriesApiPySeasonYearEventEventSessionSessionTelemetriesPost({
            body: { queries },
            path: {
                event: decodeURIComponent((await params).event),
                session: decodeURIComponent((await params).session) as SessionIdentifier,
                year: (await params).season,
            },
            throwOnError: true,
            client: ApiClient,
        })

    return (
        <TelemetryChartSection
            telemetryMeasurements={telemetryMeasurements}
            telemetryComparisonSlot={
                <Suspense
                    fallback={<TelemetryChartFallback height={50} sectionTitle="Time delta" />}
                >
                    <span>placeholder</span>
                    {/* <TimeDeltaComparison comparison={loaderData.telemetryComparison} /> */}
                </Suspense>
            }
        />
    )
}
