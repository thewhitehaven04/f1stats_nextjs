import { useMemo, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { ApiClient } from "@/shared/client"
import {
    type LapTelemetryQuery,
    type GetLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPostResponse,
    getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost,
} from "@/shared/client/generated"
import type { TSession } from "@/shared/hooks/useSession"
import { useLapSelection } from "../useLapSelectionAtom"

interface UsePerLapTelemetryProps {
    season: string
    event: string
    session: TSession
}

export function usePerLapTelemetry({ season, event, session }: UsePerLapTelemetryProps) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const { selection } = useLapSelection()

    const queries = useMemo(() => {
        const groups: LapTelemetryQuery[] = []
        for (const selectionInstance of selection) {
            const foundGroup = groups.find((g) => g.driver === selectionInstance.driver)
            if (foundGroup) {
                foundGroup.lap_id_filter.push(selectionInstance.lapId)
            } else {
                groups.push({
                    driver: selectionInstance.driver,
                    lap_id_filter: [selectionInstance.lapId],
                })
            }
        }
        return groups
    }, [selection])

    const { data, isFetching } = useQuery({
        queryKey: ["telemetry", season, event, session, queries],
        queryFn: async () =>
            new Promise<GetLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPostResponse>(
                (resolve) => {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current)

                    timeoutRef.current = setTimeout(() => {
                        resolve(
                            getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost({
                                client: ApiClient,
                                body: { queries: queries },
                                path: {
                                    event,
                                    session,
                                    year: season,
                                },
                                throwOnError: true,
                            }).then((res) => res.data),
                        )
                    }, 700)
                },
            ),
        enabled: () => !!queries.length,
    })

    return { data, isFetching, queries }
}
