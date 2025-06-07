"use server"

import { ApiClient } from "@/client"
import {
    getAveragedTelemetryApiSeasonYearEventEventSessionSessionTelemetryAveragePost,
    getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost,
    type SessionIdentifier,
    type SessionQueryFilter,
} from "@/client/generated"

export async function getTelemetry(state: unknown, formData: FormData) {
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
                await getAveragedTelemetryApiSeasonYearEventEventSessionSessionTelemetryAveragePost(
                    {
                        client: ApiClient,
                        body: { queries },
                        path,
                        throwOnError: true,
                    },
                )
            ).data,
            tab: "averageTelemetry",
        } as const
    }

    return {
        data: (
            await getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost({
                client: ApiClient,
                body: { queries },
                path,
                throwOnError: true,
            })
        ).data,
        tab: "telemetry",
    } as const
}
