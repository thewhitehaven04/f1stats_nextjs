"use server"

import { ApiClient } from "@/client"
import {
    getAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePost,
    getLapTelemetriesApiPySeasonYearEventEventSessionSessionTelemetriesPost,
    type AverageTelemetryPlotData,
    type DriverTelemetryPlotData,
    type SessionIdentifier,
    type SessionQueryFilter,
} from "@/client/generated"

export async function getTelemetry(
    _:
        | { data: DriverTelemetryPlotData[] | null; tab: "telemetry" }
        | { data: AverageTelemetryPlotData[] | null; tab: "telemetry" },
    formData: FormData,
) {
    const intent = formData.get("intent")
    const entries = formData.entries()
    const path = {
        year: formData.get("season") as string,
        event: formData.get("event") as string,
        session: formData.get("session") as SessionIdentifier,
    }
    // horrific crutch
    const queries = entries
        .filter(
            ([key]) =>
                !key.startsWith("$") && !["intent", "season", "event", "session"].includes(key),
        )
        .reduce(
            (acc, [key, value]) => {
                const driverLapArray = acc.find((query) => query.driver === key)
                if (driverLapArray) {
                    driverLapArray.lap_filter?.push(Number.parseInt(value as string))
                } else {
                    acc.push({
                        driver: key,
                        lap_filter: [Number.parseInt(value as string)],
                    })
                }
                return acc
            },
            [] as SessionQueryFilter["queries"],
        )

    if (intent === "avgTelemetryComparison") {
        return {
            data: (
                await getAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePost(
                    {
                        client: ApiClient,
                        path,
                        body: { queries },
                        throwOnError: false,
                    },
                )
            ).data,
            tab: "averageTelemetry",
        } as const
    }

    return {
        data: (
            await getLapTelemetriesApiPySeasonYearEventEventSessionSessionTelemetriesPost({
                body: { queries },
                path,
                throwOnError: true,
                client: ApiClient,
            })
        ).data,
        tab: "telemetry",
    } as const
}
