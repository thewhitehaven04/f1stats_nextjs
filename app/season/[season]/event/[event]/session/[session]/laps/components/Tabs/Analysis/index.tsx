import {
    getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost,
    getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet,
    getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost,
    type AverageTelemetryPlotData,
    type DriverTelemetryPlotData,
    type LapSelectionData,
    type SessionQueryFilter,
} from "@/client/generated"
import { useRef, useState } from "react"
import { LapsTableSection } from "./LapsTableSection"
import dynamic from "next/dynamic"
import { useLapSelection } from "./LapsTableSection/hooks/useLapSelection"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiClient } from "@/client"
import { useSession } from "../../../../hooks/useSession"
import { ChartLoading } from "./ChartLoading"
import { DeltaCircuitMap } from "@/components/CircuitSection/CircuitMap"

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

    const { data: telemetry } = useQuery({
        queryKey: [tab, year, event, session, selection],
        queryFn: async () =>
            (tab === "averageTelemetry"
                ? await getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost(
                      {
                          client: ApiClient,
                          body: {
                              queries: getQueries(selection),
                          },
                          path: {
                              event,
                              session,
                              year,
                          },
                          throwOnError: true,
                      },
                  )
                : await getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost({
                      client: ApiClient,
                      body: { queries: getQueries(selection) },
                      path: {
                          event,
                          session,
                          year,
                      },
                      throwOnError: true,
                  })
            ).data,
    })

    const { data: geometry } = useSuspenseQuery({
        queryKey: [year, event],
        queryFn: () =>
            getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet({
                path: { year, event },
                client: ApiClient,
                throwOnError: true,
            }).then((res) => res.data),
    })

    const handleTabChange = (newTab: typeof tab) => {
        resetSelection()
        setTab(newTab)
    }

    return (
        <>
            <LapsTableSection key={tab} laps={laps} onUpdateSelection={updateSelection} />
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
                    <DeltaCircuitMap
                        geometry={geometry}
                        driverDeltas={telemetry?.delta || []}
                        colorMap={telemetry?.color_map || {}}
                    />
                    <TelemetryChartSection
                        data={(telemetry?.telemetries as DriverTelemetryPlotData[]) || null}
                        colorMap={telemetry?.color_map || {}}
                        ref={ref}
                    />
                </TabsContent>
                <TabsContent value="averageTelemetry">
                    <DeltaCircuitMap
                        geometry={geometry}
                        driverDeltas={telemetry?.delta || []}
                        colorMap={telemetry?.color_map || {}}
                    />
                    <AverageTelemetrySection
                        data={(telemetry?.telemetries as AverageTelemetryPlotData[]) || null}
                        colorMap={telemetry?.color_map || {}}
                        ref={ref}
                    />
                </TabsContent>
            </Tabs>
        </>
    )
}
