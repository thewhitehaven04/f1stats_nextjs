import { createContext } from 'react'

export const LapSelectionContext = createContext<{
    activeGroup: string | undefined
    updateLapSelection: (instance: {
        driver: string
        lap: number
        state: boolean
        group: string
    }) => void
    isLapSelected: (driver: string, lap: number, group: string) => boolean 
}>({
    activeGroup: undefined,
    updateLapSelection: () => {},
    isLapSelected: () => false
})