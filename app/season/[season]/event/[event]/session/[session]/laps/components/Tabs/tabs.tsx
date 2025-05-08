"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"

const getTabQueryString = (readOnlySearch: ReadonlyURLSearchParams, tab: string) => {
    const search = new URLSearchParams(readOnlySearch)
    search.set("tab", tab)
    return search.toString()
}

export const LapsTabs = ({
    analysisSlot,
    linePlotSlot,
    boxPlotSlot,
    violinPlotSlot,
}: {
    analysisSlot: React.ReactNode
    linePlotSlot: React.ReactNode
    boxPlotSlot: React.ReactNode
    violinPlotSlot: React.ReactNode
}) => {
    const search = useSearchParams()

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
            <TabsContent value="analysis">{analysisSlot}</TabsContent>
            <TabsContent value="lineplot">{linePlotSlot}</TabsContent>
            <TabsContent value="boxplot">{boxPlotSlot}</TabsContent>
            <TabsContent value="violinplot">{violinPlotSlot}</TabsContent>
        </Tabs>
    )
}
