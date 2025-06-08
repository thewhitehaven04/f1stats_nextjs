"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { AnalysisTab } from "./Analysis"
import { useSession } from "../../../hooks/useSession"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
    getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost,
    type SessionIdentifier,
} from "@/client/generated"
import { ApiClient } from "@/client"
import { SectionLoadingSpinner } from "@/components/SectionLoadingSpinner"
import { Suspense } from "react"
import dynamic from "next/dynamic"

const getTabQueryString = (readOnlySearch: ReadonlyURLSearchParams, tab: string) => {
    const search = new URLSearchParams(readOnlySearch)
    search.set("tab", tab)
    return search.toString()
}

const LinePlotTab = dynamic(() => import("./LapsLinePlot/LinePlotTab"))
const BoxPlotTab = dynamic(() => import("./BoxPlot/index"))
const ViolinPlotTab = dynamic(() => import("./ViolinPlot/index"))

export const LapsTabs = () => {
    const search = useSearchParams()

    const { event, season: year, session } = useSession()

    const queries = search.getAll("driver").map((driver) => ({
        driver,
        lap_filter: null,
    }))

    console.log(queries)

    const { data: lapSelectionData } = useSuspenseQuery({
        queryKey: ["laps", year, event, session],
        queryFn: async () =>
            (
                await getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost({
                    client: ApiClient,
                    path: {
                        event,
                        session: session as SessionIdentifier,
                        year,
                    },
                    body: { queries },
                    throwOnError: true,
                })
            ).data,
    })

    return (
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
                <Suspense fallback={<SectionLoadingSpinner />}>
                    <AnalysisTab laps={lapSelectionData} />
                </Suspense>
            </TabsContent>
            <TabsContent value="lineplot">
                <Suspense fallback={<SectionLoadingSpinner />}>
                    <LinePlotTab laps={lapSelectionData} />
                </Suspense>
            </TabsContent>
            <TabsContent value="boxplot">
                <Suspense fallback={<SectionLoadingSpinner />}>
                    <BoxPlotTab laps={lapSelectionData} />
                </Suspense>
            </TabsContent>
            <TabsContent value="violinplot">
                <Suspense fallback={<SectionLoadingSpinner />}>
                    <ViolinPlotTab laps={lapSelectionData} />
                </Suspense>
            </TabsContent>
        </Tabs>
    )
}
