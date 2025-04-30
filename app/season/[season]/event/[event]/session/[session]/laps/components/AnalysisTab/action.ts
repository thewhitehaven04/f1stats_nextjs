"use server"

import { ApiClient } from "@/client"
import {
    getAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePost,
    type SessionIdentifier,
    type SessionQueryFilter,
    type TelemetryPlotData,
} from "@/client/generated"
import { redirect } from "next/navigation"

export async function getTelemetry(state: null | TelemetryPlotData[], formData: FormData) {
    const intent = formData.get("intent")
    const entries = formData.entries()
    const path = {
        year: formData.get("season") as string,
        event: formData.get("event") as string,
        session: formData.get("session") as SessionIdentifier,
    }

    if (intent === "avgTelemetryComparison") {
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

        return getAveragedTelemetryApiPySeasonYearEventEventSessionSessionTelemetryAveragePost({
            client: ApiClient,
            path,
            body: { queries },
            throwOnError: false,
        }).then((response) => response.data)
    }
    const search = new URLSearchParams(Object.entries(formData))
    return redirect(
        `/season/${path.year}/event/${path.event}/session/${path.session}telemetry?${search.toString()}`,
    )
}
