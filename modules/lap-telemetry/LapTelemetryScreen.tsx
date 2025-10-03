import type { SessionLapsData } from "../../shared/client/generated"
import { useMemo, useState } from "react"
import { LapsTableSection } from "./features/lap-selector-table/LapSelectorTable"
import dynamic from "next/dynamic"
import { useLapSelection } from "../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/LapsTableSection/hooks/useLapSelection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "../../app/season/[season]/event/[event]/session/[session]/hooks/useSession"
import { ChartLoading } from "../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/ChartLoading"
import { useSelectionGroups } from "../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/LapsTableSection/hooks/useSelectionGroups"
import { SelectionCard } from "../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/LapsTableSection/components/SelectionCard"
import { getQueries } from "../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/helpers"
import { LapSelectionContext } from "../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/LapsTableSection/context"

const AverageTelemetrySection = dynamic(() => import("../../app/season/[season]/event/[event]/session/[session]/laps/components/Tabs/Analysis/AverageTelemetrySection/index"), {
    ssr: false,
    loading: () => <ChartLoading />,
})

const TelemetryChartSection = dynamic(() => import("./features/per-lap-telemetry/PerLapTelemetryComparisonView"), {
    ssr: false,
    loading: () => <ChartLoading />,
})

export const LapTelemetryScreen = ({ laps }: { laps: SessionLapsData }) => {
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
