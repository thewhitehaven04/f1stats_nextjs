import { useMemo, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { ApiClient } from "@/shared/client"
import {
    type AverageTelemetryQuery,
    type GetAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePostResponse,
    getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost,
} from "@/shared/client/generated"
import type { TSession } from "@/shared/hooks/useSession"
import { useLapGroupSelection } from "../useLapGroupSelectionAtom"
import type { TGroup } from "../../models/types"

interface UseAverageTelemetryProps {
    season: string
    event: string
    session: TSession
    groups: TGroup[]
}

export function useAverageTelemetry({ season, event, session, groups }: UseAverageTelemetryProps) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const { selection } = useLapGroupSelection()

    const queries = useMemo(() => {
        const groupsMap = new Map<string, AverageTelemetryQuery>()
        for (const selectionInstance of selection) {
            let foundGroup = groupsMap.get(selectionInstance.group)
            if (foundGroup) {
                foundGroup.lap_id_filter.push(selectionInstance.lapId)
            } else {
                foundGroup = {
                    group: {
                        name: selectionInstance.group,
                        color: groups.find((g) => g.name === selectionInstance.group)?.color || "",
                    },
                    lap_id_filter: [selectionInstance.lapId],
                }
                groupsMap.set(selectionInstance.group, foundGroup)
            }
        }
        return Array.from(groupsMap.values())
    }, [selection, groups])

    const { data, isFetching } = useQuery({
        queryKey: ["averageTelemetry", season, event, session, queries],
        queryFn: async () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)

            return new Promise<GetAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePostResponse>(
                (resolve, reject) => {
                    timeoutRef.current = setTimeout(async () => {
                        try {
                            const res =
                                await getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost(
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
                                )
                            resolve(res.data)
                        } catch (error) {
                            reject(error)
                        } finally {
                            timeoutRef.current = null // Clear the ref after execution
                        }
                    }, 700)
                },
            )
        },
        enabled: !!queries.length,
    })

    return { data, isFetching, queries }
}
