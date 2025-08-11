import {
    getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost,
    getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet,
    getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost,
    type AverageTelemetryPlotData,
    type DriverTelemetryPlotData,
    type LapSelectionData,
    type SessionQuery,
} from "@/client/generated"
import { Suspense, useState } from "react"
import { LapsTableSection } from "./LapsTableSection"
import dynamic from "next/dynamic"
import {
    useLapSelection,
    type TLapSelectionInstance,
} from "./LapsTableSection/hooks/useLapSelection"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiClient } from "@/client"
import { useSession } from "../../../../hooks/useSession"
import { ChartLoading } from "./ChartLoading"
import { DeltaCircuitMap } from "@/components/CircuitSection/CircuitMap"
import { useSelectionGroups, type TGroup } from "./LapsTableSection/hooks/useSelectionGroups"
import { LoadingSpinner } from "@/components/SectionLoadingSpinner"
import { SelectionCard } from "./LapsTableSection/components/SelectionCard"
import { getAlternativeColor } from "../../helpers/getAlternativeColor"

const AverageTelemetrySection = dynamic(() => import("./AverageTelemetrySection/index"), {
    ssr: false,
    loading: () => <ChartLoading />,
})

const TelemetryChartSection = dynamic(() => import("./ChartSection/index"), {
    ssr: false,
    loading: () => <ChartLoading />,
})

export const getQueries = (selection: TLapSelectionInstance[], groups: TGroup[]) =>
    selection.reduce((acc, { driver, lap, group }) => {
        const driverLapArray = acc.find((query) => query.group?.name === group)
        if (driverLapArray) {
            driverLapArray.lap_filter?.push(lap)
        } else {
            const selectedGroup = groups.find((g) => g.name === group)
            acc.push({
                driver,
                lap_filter: [lap],
                group: selectedGroup || null,
            })
        }
        return acc
    }, [] as SessionQuery[])

export const AnalysisTab = ({ laps }: { laps: LapSelectionData }) => {
    const { selection, updateSelection, resetSelection } = useLapSelection()
    const { event, season: year, session } = useSession()
    const { groups, activeGroup, setActiveGroup, addGroup, resetGroups } = useSelectionGroups()
    const queries = getQueries(selection, groups)

    const [tab, setTab] = useState<"telemetry" | "averageTelemetry">("telemetry")

    const { data: telemetry } = useQuery({
        queryKey: [tab, year, event, session, selection],
        queryFn: async () =>
            (tab === "averageTelemetry"
                ? await getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost(
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
                  )
                : await getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost({
                      client: ApiClient,
                      body: { queries },
                      path: {
                          event,
                          session,
                          year,
                      },
                      throwOnError: true,
                  })
            ).data,
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

    return (
        <>
            <LapsTableSection
                key={tab}
                laps={laps}
                selection={selection}
                onUpdateSelection={updateSelection}
                activeGroup={activeGroup?.name}
            />
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
        </>
    )
}
