"use client"
import Link from "next/link"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { LapTelemetryScreen } from "../lap-telemetry/LapTelemetryScreen"
import dynamic from "next/dynamic"
import { ChartLoadingIndicator } from "../lap-telemetry/components/ChartLoadingIndicator"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/uiComponents/tabs"
import {
    getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost,
    type SessionQuery,
} from "@/shared/client/generated"
import { ApiClient } from '@/shared/client'
import { useSession } from '@/shared/hooks/useSession'

const getTabQueryString = (readOnlySearch: ReadonlyURLSearchParams, tab: string) => {
    const search = new URLSearchParams(readOnlySearch)
    search.set("tab", tab)
    return search.toString()
}

const SessionLaptimeLineChartScreen = dynamic(
    () => import("./../session-laptime-line-chart/SessionLaptimeLineChartScreen"),
    {
        loading: () => <ChartLoadingIndicator />,
        ssr: false,
    },
)
const SessionLaptimeBoxChartScreen = dynamic(
    () => import("../session-laptime-box-chart/SessionBoxChartScreen"),
    {
        loading: () => <ChartLoadingIndicator />,
        ssr: false,
    },
)
const SessionLaptimeViolinChartScreen = dynamic(
    () => import("../session-laptime-violin-chart/SessionLaptimeViolinChartScreen"),
    {
        loading: () => <ChartLoadingIndicator />,
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
                    <SessionLaptimeLineChartScreen laps={data} />
                </TabsContent>
                <TabsContent value="boxplot">
                    <SessionLaptimeBoxChartScreen laps={data} />
                </TabsContent>
                <TabsContent value="violinplot">
                    <SessionLaptimeViolinChartScreen laps={data} />
                </TabsContent>
            </Tabs>
        </>
    )
}
