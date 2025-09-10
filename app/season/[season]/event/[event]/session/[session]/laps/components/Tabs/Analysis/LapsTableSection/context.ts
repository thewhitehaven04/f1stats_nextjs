import { createContext } from 'react'

export const LapSelectionContext = createContext<{
    activeGroup: string | undefined
    updateLapSelection: (instance: {
        driver: string
        lap: number
        state: boolean
        group?: string
    }) => void
    isLapSelected: (driver: string, lap: number) => boolean 
    tab: "telemetry" | "averageTelemetry"
}>({
    activeGroup: undefined,
    updateLapSelection: () => {},
    isLapSelected: () => false,
    tab: 'telemetry'
})