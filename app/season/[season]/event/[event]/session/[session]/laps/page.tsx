import {
    getSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPost,
    type SessionIdentifier,
} from "@/client/generated"
import { LapsSection } from "./lapsSection"
import { ApiClient } from "@/client"
import { LapsTableTab } from "./components/LapsTableTab"
import LinePlotTab from "./components/LinePlotTab/LinePlotTab"
import BoxPlotTab from "./components/BoxPlotTab/LapsBoxPlot"
import { ViolinPlotTab } from "./components/ViolinPlotTab"
import type { ILapsQueryParams, ISessionPathnameParams } from "../types"

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
