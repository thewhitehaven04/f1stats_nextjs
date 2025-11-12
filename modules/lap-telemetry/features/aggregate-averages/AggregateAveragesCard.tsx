import { useQuery } from "@tanstack/react-query"
import { useLapGroupSelection } from "../../hooks/useLapGroupSelectionAtom"
import {
    getAggregateLaptimeDataApiSeasonYearEventEventSessionSessionAggregatesPost,
    type AggregateLapDataQuery,
} from "@/shared/client/generated"
import { useMemo } from "react"
import { Laptime } from "@/shared/components/laptime/Laptime"
import { useSession } from "@/shared/hooks/useSession"
import { AggregateAverageDisplayCard } from "./components/AggregateAverageDisplayCard"
import { SectorTime } from "@/shared/components/sector-time/SectorTime"

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
            getAggregateLaptimeDataApiSeasonYearEventEventSessionSessionAggregatesPost({
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
        placeholderData: queries.map((q) => ({
            group: q.group_name,
            avg_time: null,
            slope: null,
            max_time: null,
            min_time: null,
            avg_s1_time: null,
            avg_s2_time: null,
            avg_s3_time: null,
        })),
    })
    console.log(data)

    return (
        <section className="w-full grid grid-cols-[repeat(auto-fill,_minmax(275px,_1fr))] gap-4">
            {data
                ? data.map((d) => (
                      <AggregateAverageDisplayCard
                          key={d.group}
                          groupName={d.group}
                          averageTime={<Laptime value={d.avg_time} />}
                          slope={<div className="px-1">{d.slope?.toFixed(3)}</div>}
                          slowestLap={<Laptime isSessionBest={false} value={d.max_time} />}
                          bestLap={<Laptime isPersonalBest value={d.min_time} />}
                          averageS1={<SectorTime value={d.avg_s1_time} />}
                          averageS2={<SectorTime value={d.avg_s2_time} />}
                          averageS3={<SectorTime value={d.avg_s3_time} />}
                      />
                  ))
                : null}
        </section>
    )
}
