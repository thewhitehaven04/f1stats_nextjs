import type { SessionLapsData } from "@/client/generated"
import { useMemo, useState } from "react"
import { LapsTableSection } from "./LapsTableSection"
import dynamic from "next/dynamic"
import { useLapSelection } from "./LapsTableSection/hooks/useLapSelection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "../../../../hooks/useSession"
import { ChartLoading } from "./ChartLoading"
import { useSelectionGroups } from "./LapsTableSection/hooks/useSelectionGroups"
import { SelectionCard } from "./LapsTableSection/components/SelectionCard"
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

    const handleTabChange = (newTab: typeof tab) => {
        resetSelection()
        resetGroups()
        setTab(newTab)
    }

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
                    <TelemetryChartSection
                        queries={queries}
                        season={year}
                        session={session}
                        event={event}
                    />
                </TabsContent>
                <TabsContent value="averageTelemetry">
                    <SelectionCard
                        groups={groups}
                        addGroup={addGroup}
                        activeGroup={activeGroup ? activeGroup.name : undefined}
                        setActiveGroup={setActiveGroup}
                    />
                    <AverageTelemetrySection
                        queries={queries}
                        season={year}
                        session={session}
                        event={event}
                    />
                </TabsContent>
            </Tabs>
        </LapSelectionContext.Provider>
    )
}
