import { createContext } from "react"

export const GroupSelectionContext = createContext<{
    activeGroup: string | undefined
    tab: "telemetry" | "averageTelemetry"
}>({
    activeGroup: undefined,
    tab: "telemetry",
})
