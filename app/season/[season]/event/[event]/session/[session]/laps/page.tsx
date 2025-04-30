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
            cache: 'force-cache',
        }).then((data) => data.data)

    return (
        <section className="flex flex-col gap-2 overflow-x-visible">
            <div className="flex flex-row items-center gap-4">
                <h2 className="divider divider-start text-lg w-full">Lap by lap comparison</h2>
            </div>
            <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="gap-4 w-full">
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
        </section>
    )
}
