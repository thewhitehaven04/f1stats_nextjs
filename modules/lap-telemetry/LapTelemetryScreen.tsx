import { useMemo, useState } from "react"
import { LapsTableSection } from "./features/lap-selector-table/LapSelectorTable"
import dynamic from "next/dynamic"
import { useSelectionGroups } from "./hooks/useSelectionGroups"
import { GroupSelectionContext } from "./context/lap-selection-context"
import { SelectionCard } from "./features/lap-selector-table/components/SelectionCard"
import { ChartLoadingIndicator } from "./components/ChartLoadingIndicator"
import { useSession } from "@/shared/hooks/useSession"
import type { SessionLapsData } from "@/shared/client/generated"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/uiComponents/tabs"
import { AggregateAveragesCardRow } from "./features/aggregate-averages/AggregateAveragesCard"

const AverageTelemetryComparisonView = dynamic(
    () => import("./features/average-telemetry/AverageTelemetryComparisonView"),
    {
        ssr: false,
        loading: () => <ChartLoadingIndicator />,
    },
)

const PerLapTelemetryComparisonView = dynamic(
    () => import("./features/per-lap-telemetry/PerLapTelemetryComparisonView"),
    {
        ssr: false,
        loading: () => <ChartLoadingIndicator />,
    },
)

export const LapTelemetryScreen = ({ laps }: { laps: SessionLapsData }) => {
    const { event, season: year, session } = useSession()
    const { groups, activeGroup, setActiveGroup, addGroup, resetGroups } = useSelectionGroups()

    const [tab, setTab] = useState<"telemetry" | "averageTelemetry">("telemetry")

    const handleTabChange = (newTab: typeof tab) => {
        resetGroups()
        setTab(newTab)
    }

    const ctxValue = useMemo(
        () => ({
            activeGroup: activeGroup?.name ?? undefined,
            tab,
        }),
        [activeGroup, tab],
    )

    return (
        <GroupSelectionContext.Provider value={ctxValue}>
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
                    <PerLapTelemetryComparisonView />
                </TabsContent>
                <TabsContent value="averageTelemetry" className="flex flex-col gap-8">
                    <SelectionCard
                        groups={groups}
                        addGroup={addGroup}
                        activeGroup={activeGroup ? activeGroup.name : undefined}
                        setActiveGroup={setActiveGroup}
                    />
                    <AggregateAveragesCardRow />
                    <AverageTelemetryComparisonView groups={groups} />
                </TabsContent>
            </Tabs>
        </GroupSelectionContext.Provider>
    )
}
