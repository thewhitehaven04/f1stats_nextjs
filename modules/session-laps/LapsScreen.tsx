"use client"
import Link from "next/link"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { LapTelemetryScreen } from "../lap-telemetry/LapTelemetryScreen"
import {
    getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost,
    type SessionQuery,
} from "../../shared/client/generated"
import dynamic from "next/dynamic"
import { ChartLoading } from "../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/ChartLoading"
import { useSession } from "../../app/season/[season]/event/[event]/session/[session]/hooks/useSession"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ApiClient } from "../../shared/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/uiComponents/tabs"

const getTabQueryString = (readOnlySearch: ReadonlyURLSearchParams, tab: string) => {
    const search = new URLSearchParams(readOnlySearch)
    search.set("tab", tab)
    return search.toString()
}

const LinePlotTab = dynamic(
    () =>
        import(
            "../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/LapsLinePlot/LinePlotTab"
        ),
    {
        loading: () => <ChartLoading />,
        ssr: false,
    },
)
const BoxPlotTab = dynamic(
    () =>
        import(
            "../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/BoxPlot/index"
        ),
    {
        loading: () => <ChartLoading />,
        ssr: false,
    },
)
const ViolinPlotTab = dynamic(
    () =>
        import(
            "../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/ViolinPlot/index"
        ),
    {
        loading: () => <ChartLoading />,
        ssr: false,
    },
)

export const LapsScreen = () => {
    const search = useSearchParams()

    const { event, season: year, session } = useSession()

    const queries = search.getAll("driver").map((driver) => ({
        driver,
        lap_filter: null,
        group: null,
    })) satisfies SessionQuery[]

    const { data } = useSuspenseQuery({
        queryKey: ["laps", year, event, session, queries],
        queryFn: async () =>
            (
                await getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost({
                    client: ApiClient,
                    path: {
                        event,
                        session,
                        year,
                    },
                    body: { queries },
                    throwOnError: true,
                })
            ).data,
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
                    <LapTelemetryScreen laps={data} />
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
