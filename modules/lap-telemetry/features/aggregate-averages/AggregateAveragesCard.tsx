import { useQuery } from "@tanstack/react-query"
import { useLapGroupSelection } from "../../hooks/useLapGroupSelectionAtom"
import {
    getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsAggregatesPost,
    type AggregateLapDataQuery,
} from "@/shared/client/generated"
import { useMemo } from "react"
import { Laptime } from "@/shared/components/laptime/Laptime"
import { useSession } from "@/shared/hooks/useSession"
import { AggregateAverageDisplayCard } from "./components/AggregateAverageDisplayCard"

export const AggregateAveragesCardRow = () => {
    const { event, session, season } = useSession()
    const { selection } = useLapGroupSelection()
    const queries = useMemo(() => {
        const queries: AggregateLapDataQuery[] = []
        for (const selectionInstance of selection) {
            const foundGroup = queries.find((q) => q.group_name === selectionInstance.group)
            if (foundGroup) {
                foundGroup.lap_id_filter.push(selectionInstance.lapId)
            } else {
                queries.push({
                    group_name: selectionInstance.group,
                    lap_id_filter: [selectionInstance.lapId],
                })
            }
        }
        return queries
    }, [selection])

    const { data } = useQuery({
        queryKey: ["aggregateAverages", selection],
        queryFn: async () =>
            getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsAggregatesPost({
                body: {
                    queries,
                },
                path: {
                    event,
                    session,
                    year: season,
                },
                throwOnError: true,
            }).then((res) => res.data),
    })

    return (
        <section className="w-full grid grid-cols-[repeat(auto-fill,_minmax(330px,_1fr))] gap-4">
            {data
                ? data.map((d) => (
                      <AggregateAverageDisplayCard
                          key={d.group}
                          groupName={d.group}
                          averageTime={<Laptime value={d.avg_time} />}
                          slope={<Laptime value={d.slope} />}
                          slowestLap={<Laptime isSessionBest={false} value={d.max_time} />}
                          bestLap={<Laptime isPersonalBest value={d.min_time} />}
                      />
                  ))
                : null}
        </section>
    )
}
