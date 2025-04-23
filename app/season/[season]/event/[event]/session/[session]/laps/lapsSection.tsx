"use client"

import { Tabs } from "@/components/Tabs"
import type { TLapDisplayTab } from "./types"
import { LAP_DISPLAY_TABS } from "./constants"
import { useState, type ReactNode } from "react"

export const LapsSection = ({
    tableSlot,
    linePlotSlot,
    boxPlotSlot,
    violinPlotSlot,
}: {
    tableSlot: ReactNode
    linePlotSlot: ReactNode
    boxPlotSlot: ReactNode
    violinPlotSlot: ReactNode
}) => {
    const [tab, setTab] = useState<TLapDisplayTab>(LAP_DISPLAY_TABS[0].param)
    return (
        <section className="flex flex-col gap-2 overflow-x-visible">
            <div className="flex flex-row items-center gap-4">
                <h2 className="divider divider-start text-lg w-full">Lap by lap comparison</h2>
            </div>
            <Tabs<TLapDisplayTab>
                tabs={LAP_DISPLAY_TABS}
                currentTab={tab}
                onTabChange={(tab) => setTab(tab)}
            />
            {tab === "table" && tableSlot}
            {tab === "plot" && linePlotSlot}
            {tab === "box" && boxPlotSlot}
            {tab === "violin" && violinPlotSlot}
        </section>
    )
}
