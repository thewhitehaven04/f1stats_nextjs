export interface IStint {
    index: number
    text: string
}

export interface IStintSelectorProps {
    driverStints: {
        driver: string
        stints: { index: number; text: string }[]
    }[]
    onChange: (change: {
        driver: string
        stint: number
    }) => void
    onReset: () => void
    selectionValues: Record<string, number | undefined>
}
