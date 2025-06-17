"use client"
import { CircuitMap } from "./CircuitMap"
import { Suspense } from "react"
import { useSession } from "../../../app/season/[season]/event/[event]/session/[session]/hooks/useSession"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet } from "@/client/generated"

export const CircuitSection = () => {
    const { season, event } = useSession()
    const { data } = useSuspenseQuery({
        queryKey: [season, event],
        queryFn: () =>
            getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet({
                path: { year: season, event },
                throwOnError: true,
            }).then((res) => res.data),
    })

    return (
        <Suspense fallback={<div>Loading circuit map...</div>}>
            <CircuitMap geometry={data} />
        </Suspense>
    )
}
