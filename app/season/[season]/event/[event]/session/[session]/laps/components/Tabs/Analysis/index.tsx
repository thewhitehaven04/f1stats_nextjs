import {
    getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost,
    getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet,
    getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost,
    type AverageTelemetryPlotData,
    type DriverTelemetryPlotData,
    type GetAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePostResponse,
    type GetLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPostResponse,
    type SessionLapsData,
} from "@/client/generated"
import { useMemo, useRef, useState } from "react"
import { LapsTableSection } from "./LapsTableSection"
import dynamic from "next/dynamic"
import { useLapSelection } from "./LapsTableSection/hooks/useLapSelection"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiClient } from "@/client"
import { useSession } from "../../../../hooks/useSession"
import { ChartLoading } from "./ChartLoading"
import { DeltaCircuitMap } from "@/components/CircuitSection/CircuitMap"
import { useSelectionGroups } from "./LapsTableSection/hooks/useSelectionGroups"
import { SelectionCard } from "./LapsTableSection/components/SelectionCard"
import { getAlternativeColor } from "../../helpers/getAlternativeColor"
import { getQueries } from "./helpers"
import { LapSelectionContext } from "./LapsTableSection/context"

const AverageTelemetrySection = dynamic(() => import("./AverageTelemetrySection/index"), {
    ssr: false,
    loading: () => <ChartLoading />,
})

const TelemetryChartSection = dynamic(() => import("./ChartSection/index"), {
    ssr: false,
    loading: () => <ChartLoading />,
})

export const AnalysisTab = ({ laps }: { laps: SessionLapsData }) => {
    const { selection, updateSelection, resetSelection } = useLapSelection()
    const { event, season: year, session } = useSession()
    const { groups, activeGroup, setActiveGroup, addGroup, resetGroups } = useSelectionGroups()
    const queries = getQueries(selection, groups)

    const [tab, setTab] = useState<"telemetry" | "averageTelemetry">("telemetry")

    const timeoutRef = useRef<NodeJS.Timeout>(null)

    const { data: telemetry } = useQuery({
        queryKey: [tab, year, event, session, selection],
        queryFn: async () =>
            new Promise<
                | GetAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePostResponse
                | GetLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPostResponse
            >((resolve) => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current)

                timeoutRef.current = setTimeout(() => {
                    tab === "averageTelemetry"
                        ? resolve(
                              getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost(
                                  {
                                      client: ApiClient,
                                      body: { queries },
                                      path: {
                                          event,
                                          session,
                                          year,
                                      },
                                      throwOnError: true,
                                  },
                              ).then((res) => res.data),
                          )
                        : resolve(
                              getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost(
                                  {
                                      client: ApiClient,
                                      body: { queries },
                                      path: {
                                          event,
                                          session,
                                          year,
                                      },
                                      throwOnError: true,
                                  },
                              ).then((res) => res.data),
                          )
                }, 1000)
            }),
        enabled: () => {
            if (selection.length > 0) {
                if (tab === "telemetry") {
                    return true
                }
                return groups.length > 0
            }
            return false
        },
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
        resetGroups()
        setTab(newTab)
    }

    const colorMap = Object.fromEntries(
        Object.keys(telemetry?.color_map || {}).map((key) => [
            key,
            telemetry?.color_map[key].style === "alternative"
                ? getAlternativeColor(telemetry?.color_map[key].color)
                : telemetry?.color_map[key].color || "#FFF",
        ]),
    )

    const ctxValue = useMemo(
        () => ({
            activeGroup: activeGroup?.name ?? undefined,
            updateLapSelection: updateSelection,
            isLapSelected: (driver: string, lap: number) =>
                activeGroup
                    ? !!selection.find(
                          (s) =>
                              s.driver === driver && s.lap === lap && s.group === activeGroup.name,
                      )
                    : !!selection.find((s) => s.driver === driver && s.lap === lap),
            tab,
        }),
        [activeGroup, updateSelection, selection, tab],
    )

    return (
        <LapSelectionContext.Provider value={ctxValue}>
            <LapsTableSection key={tab} laps={laps} />
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
                        colorMap={colorMap}
                    />
                    <TelemetryChartSection
                        data={(telemetry?.telemetries as DriverTelemetryPlotData[]) || null}
                        colorMap={telemetry?.color_map || {}}
                    />
                </TabsContent>
                <TabsContent value="averageTelemetry">
                    <SelectionCard
                        groups={groups}
                        addGroup={addGroup}
                        activeGroup={activeGroup ? activeGroup.name : undefined}
                        setActiveGroup={setActiveGroup}
                    />
                    <DeltaCircuitMap
                        geometry={geometry}
                        driverDeltas={telemetry?.delta || []}
                        colorMap={colorMap}
                    />
                    <AverageTelemetrySection
                        data={(telemetry?.telemetries as AverageTelemetryPlotData[]) || null}
                        colorMap={colorMap}
                    />
                </TabsContent>
            </Tabs>
        </LapSelectionContext.Provider>
    )
}
