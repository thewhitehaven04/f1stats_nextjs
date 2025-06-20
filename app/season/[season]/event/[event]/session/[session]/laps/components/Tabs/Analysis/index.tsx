import {
    getAveragedTelemetryApiSeasonYearEventEventSessionSessionTelemetryAveragePost,
    getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost,
    type AverageTelemetryPlotData,
    type DriverTelemetryPlotData,
    type LapSelectionData,
    type SessionIdentifier,
    type SessionQueryFilter,
} from "@/client/generated"
import { useRef, useState } from "react"
import { LapsTableSection } from "./LapsTableSection"
import dynamic from "next/dynamic"
import { useLapSelection } from "./LapsTableSection/hooks/useLapSelection"
import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiClient } from "@/client"
import { useSession } from "../../../../hooks/useSession"
import { ChartLoading } from "./ChartLoading"

const AverageTelemetrySection = dynamic(() => import("./AverageTelemetrySection/index"), {
    ssr: false,
    loading: () => <ChartLoading />,
})

const TelemetryChartSection = dynamic(() => import("./ChartSection/index"), {
    ssr: false,
    loading: () => <ChartLoading />,
})

export const getQueries = (selection: [string, number][]) =>
    selection.reduce(
        (acc, [key, value]) => {
            const driverLapArray = acc.find((query) => query.driver === key)
            if (driverLapArray) {
                driverLapArray.lap_filter?.push(value)
            } else {
                acc.push({
                    driver: key,
                    lap_filter: [value],
                })
            }
            return acc
        },
        [] as SessionQueryFilter["queries"],
    )

export const AnalysisTab = ({ laps }: { laps: LapSelectionData }) => {
    const ref = useRef<HTMLElement>(null)
    const { selection, updateSelection, resetSelection } = useLapSelection()
    const { event, season: year, session } = useSession()
    const [tab, setTab] = useState<"telemetry" | "averageTelemetry">("telemetry")

    const { data } = useQuery({
        queryKey: [tab, year, event, session, selection],
        queryFn: async () => {
            return tab === "averageTelemetry"
                ? (
                      await getAveragedTelemetryApiSeasonYearEventEventSessionSessionTelemetryAveragePost(
                          {
                              client: ApiClient,
                              body: {
                                  queries: getQueries(selection),
                              },
                              path: {
                                  event,
                                  session: session as SessionIdentifier,
                                  year,
                              },
                              throwOnError: true,
                          },
                      )
                  ).data
                : (
                      await getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost({
                          client: ApiClient,
                          body: { queries: getQueries(selection) },
                          path: {
                              event,
                              session: session as SessionIdentifier,
                              year,
                          },
                          throwOnError: true,
                      })
                  ).data
        },
    })

    const handleTabChange = (newTab: typeof tab) => {
        resetSelection()
        setTab(newTab)
    }

    return (
        <>
            <LapsTableSection laps={laps} onUpdateSelection={updateSelection} />
            <Tabs value={tab} className="mt-4">
                <TabsList className="w-full">
                    <TabsTrigger value="telemetry" onClick={() => handleTabChange("telemetry")}>
                        Per-lap telemetry
                    </TabsTrigger>
                    <TabsTrigger
                        value="averageTelemetry"
                        onClick={() => handleTabChange("averageTelemetry")}
                    >
                        Average telemetry
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="telemetry">
                    <TelemetryChartSection
                        data={(data as DriverTelemetryPlotData[]) || null}
                        ref={ref}
                    />
                </TabsContent>
                <TabsContent value="averageTelemetry">
                    <AverageTelemetrySection
                        data={(data as AverageTelemetryPlotData[]) || null}
                        ref={ref}
                    />
                </TabsContent>
            </Tabs>
        </>
    )
}
