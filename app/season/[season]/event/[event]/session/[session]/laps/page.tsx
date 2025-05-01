import {
    getSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPost,
    type SessionIdentifier,
} from "@/client/generated"
import { ApiClient } from "@/client"
import LinePlotTab from "./components/LapsLinePlotTab/LinePlotTab"
import { ViolinPlotTab } from "./components/ViolinPlotTab"
import type { ILapsQueryParams, ISessionPathnameParams } from "../types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BoxPlotTab from "./components/BoxPlotTab"
import { AnalysisTab } from "./components/AnalysisTab"

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
        <Tabs defaultValue="analysis">
            <TabsList className="gap-4 min-w-md">
                <TabsTrigger value="analysis">Lap analysis</TabsTrigger>
                <TabsTrigger value="lineplot">Line plot</TabsTrigger>
                <TabsTrigger value="boxplot">Box plot</TabsTrigger>
                <TabsTrigger value="violinplot">Violin plot</TabsTrigger>
            </TabsList>
            <TabsContent value="analysis">
                <AnalysisTab laps={lapSelectionData} />
            </TabsContent>
            <TabsContent value="lineplot">
                <LinePlotTab laps={lapSelectionData} />
            </TabsContent>
            <TabsContent value="boxplot">
                <BoxPlotTab laps={lapSelectionData} />
            </TabsContent>
            <TabsContent value="violinplot">
                <ViolinPlotTab laps={lapSelectionData} />
            </TabsContent>
        </Tabs>
    )
}
