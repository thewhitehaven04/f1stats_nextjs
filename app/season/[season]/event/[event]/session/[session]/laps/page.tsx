import {
    getSessionLaptimesFilteredSeasonYearEventEventSessionSessionLapsPost,
    type SessionIdentifier,
} from "@/client/generated"
import { LapsSection } from "./lapsSection"
import { ApiClient } from "@/client"
import { LapsTableTab } from "./components/LapsTableTab"
import LinePlotTab from "./components/LinePlotTab/LinePlotTab"
import BoxPlotTab from "./components/BoxPlotTab/LapsBoxPlot"
import { ViolinPlotTab } from "./components/ViolinPlotTab"

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{
        season: string
        event: string
        session: string
    }>
    searchParams: Promise<{
        driver: string[]
    }>
}) {
    const queries = Object.values((await searchParams).driver).map((driver) => ({
        driver,
        lap_filter: null,
    }))
    const lapSelectionData = getSessionLaptimesFilteredSeasonYearEventEventSessionSessionLapsPost({
        client: ApiClient,
        path: {
            year: (await params).season,
            event: decodeURIComponent((await params).event),
            session: decodeURIComponent((await params).session) as SessionIdentifier,
        },
        body: { queries },
        throwOnError: true,
    }).then((data) => data.data)

    return (
        <LapsSection
            tableSlot={<LapsTableTab laps={lapSelectionData} />}
            linePlotSlot={<LinePlotTab laps={lapSelectionData} />}
            boxPlotSlot={<BoxPlotTab laps={lapSelectionData} />}
            violinPlotSlot={<ViolinPlotTab laps={lapSelectionData} />}
        />
    )
}
