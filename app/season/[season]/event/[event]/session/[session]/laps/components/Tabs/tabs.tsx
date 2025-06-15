"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { AnalysisTab } from "./Analysis"
import {
    getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost,
    type SessionIdentifier,
} from "@/client/generated"
import dynamic from "next/dynamic"
import { ChartLoading } from "./Analysis/ChartLoading"
import { useSession } from "../../../hooks/useSession"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ApiClient } from "@/client"

const getTabQueryString = (readOnlySearch: ReadonlyURLSearchParams, tab: string) => {
    const search = new URLSearchParams(readOnlySearch)
    search.set("tab", tab)
    return search.toString()
}

const LinePlotTab = dynamic(() => import("./LapsLinePlot/LinePlotTab"), {
    loading: () => <ChartLoading />,
    ssr: false,
})
const BoxPlotTab = dynamic(() => import("./BoxPlot/index"), {
    loading: () => <ChartLoading />,
    ssr: false,
})
const ViolinPlotTab = dynamic(() => import("./ViolinPlot/index"), {
    loading: () => <ChartLoading />,
    ssr: false,
})

export const LapsTabs = () => {
    const search = useSearchParams()

    const { event, season: year, session } = useSession()

    const queries = search.getAll("driver").map((driver) => ({
        driver,
        lap_filter: null,
    }))

    const { data } = useSuspenseQuery({
        queryKey: ["laps", year, event, session],
        queryFn: () =>
            getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost({
                client: ApiClient,
                path: {
                    event,
                    session: session as SessionIdentifier,
                    year,
                },
                body: { queries },
                throwOnError: true,
            }).then((response) => response.data),
    })

    return (
        <>
            <Tabs value={search.get("tab") ?? "analysis"}>
                <TabsList className="gap-4 w-full">
                    <TabsTrigger value="analysis" asChild>
                        <Link
                            href={{
                                search: getTabQueryString(search, "analysis"),
                            }}
                        >
                            Lap analysis
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="lineplot">
                        <Link
                            href={{
                                search: getTabQueryString(search, "lineplot"),
                            }}
                        >
                            Line plot
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="boxplot">
                        <Link
                            href={{
                                search: getTabQueryString(search, "boxplot"),
                            }}
                        >
                            Box plot
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="violinplot">
                        <Link
                            href={{
                                search: getTabQueryString(search, "violinplot"),
                            }}
                        >
                            Violin plot
                        </Link>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="analysis">
                    <AnalysisTab laps={data} />
                </TabsContent>
                <TabsContent value="lineplot">
                    <LinePlotTab laps={data} />
                </TabsContent>
                <TabsContent value="boxplot">
                    <BoxPlotTab laps={data} />
                </TabsContent>
                <TabsContent value="violinplot">
                    <ViolinPlotTab laps={data} />
                </TabsContent>
            </Tabs>
        </>
    )
}
