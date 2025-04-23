import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { useParams } from "react-router"
import { ApiClient } from "~/client"
import {
    getSessionLapDriverTelemetrySeasonYearRoundRoundNumberSessionSessionIdentifierLapLapDriverDriverTelemetryGet,
    getTestingSessionLapDriverTelemetrySeasonYearTestingRoundRoundNumberDayDayLapLapDriverDriverTelemetryGet,
    type SessionIdentifier,
} from "~/client/generated"
import { getLapTelemetryQueryKey } from "~/features/session/laps/queries"

export function usePrefetchTelemetry(isTesting: boolean) {
    const queryClient = useQueryClient()
    const params = useParams()
    const prefetch = useCallback(
        ({ driver, lap }: { driver: string; lap: string }) =>
            queryClient.prefetchQuery({
                queryKey: getLapTelemetryQueryKey({
                    session: isTesting ? params.day || "" : (params.session as SessionIdentifier),
                    round: params.round || "",
                    year: params.year || "",
                    driver,
                    lap,
                }),
                queryFn: () =>
                    isTesting
                        ? getTestingSessionLapDriverTelemetrySeasonYearTestingRoundRoundNumberDayDayLapLapDriverDriverTelemetryGet(
                              {
                                  throwOnError: true,
                                  client: ApiClient,
                                  path: {
                                      driver,
                                      lap,
                                      round_number: params.round || "",
                                      year: params.year || "",
                                      day: Number.parseInt(params.day || "0"),
                                  },
                              },
                          ).then((response) => response.data)
                        : getSessionLapDriverTelemetrySeasonYearRoundRoundNumberSessionSessionIdentifierLapLapDriverDriverTelemetryGet(
                              {
                                  throwOnError: true,
                                  client: ApiClient,
                                  path: {
                                      driver,
                                      lap,
                                      round_number: params.round || "",
                                      year: params.year || "",
                                      session_identifier: params.session as SessionIdentifier,
                                  },
                              },
                          ).then((response) => response.data),
                staleTime: Number.POSITIVE_INFINITY,
            }),
        [params, queryClient, isTesting],
    )

    return { prefetch }
}
