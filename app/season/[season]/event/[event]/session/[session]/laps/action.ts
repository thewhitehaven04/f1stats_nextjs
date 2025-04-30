"use server"

import { ApiClient } from "@/client"
import {
    getAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePost,
    type DriverTelemetryMeasurement,
    type SessionIdentifier,
    type SessionQueryFilter,
} from "@/client/generated"
import { redirect } from "next/navigation"

export async function getTelemetry(state: null | DriverTelemetryMeasurement[], formData: FormData) {
    const intent = formData.get("intent")
    const entries = formData.entries()

    if (intent === "avgTelemetryComparison") {
        const queryFilter = entries
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

        const data = (
            await getAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePost({
                client: ApiClient,
                path: {
                    year: formData.get("season") as string,
                    event: formData.get("event") as string,
                    session: formData.get("session") as SessionIdentifier,
                },
                body: {
                    queries: queryFilter,
                },
                throwOnError: true,
            })
        ).data

        return data
    }
    const search = new URLSearchParams(Object.entries(formData))
    return redirect(`telemetry?${search.toString()}`)
}
