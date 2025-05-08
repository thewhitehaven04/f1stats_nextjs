import {
    getSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPost,
    type SessionIdentifier,
} from "@/client/generated"
import { ApiClient } from "@/client"
import { ViolinPlotTab } from "./components/Tabs/ViolinPlot"
import type { ILapsQueryParams, ISessionPathnameParams } from "../types"
import BoxPlotTab from "./components/Tabs/BoxPlot"
import { AnalysisTab } from "./components/Tabs/Analysis"
import LinePlotTab from "./components/Tabs/LapsLinePlot/LinePlotTab"
import { LapsTabs } from "./components/Tabs/tabs"
import { Suspense } from "react"

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<ISessionPathnameParams>
    searchParams: Promise<ILapsQueryParams>
}) {
    const queries = Object.values((await searchParams).driver).map((driver) => ({
        driver,
        lap_filter: null,
    }))
    const lapSelectionData =
        getSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPost({
            client: ApiClient,
            path: {
                year: (await params).season,
                event: decodeURIComponent((await params).event),
                session: decodeURIComponent((await params).session) as SessionIdentifier,
            },
            body: { queries },
            throwOnError: true,
            cache: "force-cache",
        }).then((data) => data.data)

    return (
        <LapsTabs
            analysisSlot={<AnalysisTab laps={lapSelectionData} />}
            linePlotSlot={<LinePlotTab laps={lapSelectionData} />}
            boxPlotSlot={<BoxPlotTab laps={lapSelectionData} />}
            violinPlotSlot={<ViolinPlotTab laps={lapSelectionData} />}
        />
    )
}
