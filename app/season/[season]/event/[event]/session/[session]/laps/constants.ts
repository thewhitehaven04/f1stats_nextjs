import type { ITab } from "@/components/Tabs/types"
import type { TLapDisplayTab } from "./types"

export const LAP_DISPLAY_TABS: ITab<TLapDisplayTab>[] = [
    {
        label: "Table",
        param: "table",
    },
    {
        label: "Plot",
        param: "plot",
    },
    {
        label: "Box plot",
        param: "box",
    },
    {
        label: "Violin",
        param: "violin",
    },
]
