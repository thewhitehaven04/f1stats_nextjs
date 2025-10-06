import { useCallback, useState } from "react"

export type TLapSelectionInstance = {
    driver: string
    lap: number
    group?: string
}

export const useLapSelection = () => {
    const [lapSelection, setLapSelection] = useState<TLapSelectionInstance[]>([])

    const updateSelection = useCallback(
        (instance: {
            driver: string
            lap: number
            state: boolean
            group?: string
        }) => {
            const { driver, lap, group, state } = instance

            if (state) {
                setLapSelection((prev) => [
                    ...prev,
                    {
                        driver,
                        lap,
                        group,
                    },
                ])
            } else {
                setLapSelection((prev) =>
                    prev.filter(
                        (item) =>
                            item.driver !== driver || item.lap !== lap || item.group !== group,
                    ),
                )
            }
        },
        [],
    )

    const resetSelection = useCallback(() => {
        setLapSelection([])
    }, [])

    return { selection: lapSelection, updateSelection, resetSelection }
}
