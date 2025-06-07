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

const AverageTelemetrySection = dynamic(
    async () => (await import("./AverageTelemetrySection/index")).AverageTelemetrySection,
    { ssr: false },
)

const TelemetryChartSection = dynamic(
    async () => (await import("./ChartSection/index")).TelemetryChartSection,
    { ssr: false },
)

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
    const { selection, updateSelection } = useLapSelection()
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

    console.log(data)
    return (
        <>
            <LapsTableSection laps={laps} onUpdateSelection={updateSelection} />
            <Tabs value={tab} className="mt-4">
                <TabsList className="w-full">
                    <TabsTrigger value="telemetry" onClick={() => setTab("telemetry")}>
                        Per-lap telemetry
                    </TabsTrigger>
                    <TabsTrigger
                        value="averageTelemetry"
                        onClick={() => setTab("averageTelemetry")}
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
