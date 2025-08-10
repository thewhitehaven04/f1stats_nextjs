import { useCallback, useRef, useState } from "react"



export type TLapSelectionInstance = {
    driver: string
    lap: number
    group: string
}

export const useLapSelection = () => {
    const [lapSelection, setLapSelection] = useState<TLapSelectionInstance[]>([])

    const batch = useRef<(() => void)[]>([])
    const timeoutRef = useRef<NodeJS.Timeout>(null)
    const clearIfTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    const flushBatchUpdates = useCallback(() => {
        batch.current.forEach((fn) => fn())
        batch.current = []
    }, [])

    const updateSelection = useCallback(
        (instance: {
            driver: string
            lap: number
            state: boolean
            group: string 
        }) => {
            const { driver, lap, group, state } = instance
            clearIfTimeout()

            if (state) {
                batch.current.push(() =>
                    setLapSelection((prev) => [
                        ...prev,
                        {
                            driver,
                            lap,
                            group 
                        },
                    ]),
                )
                timeoutRef.current = setTimeout(flushBatchUpdates, 1000)
            } else {
                batch.current.push(() => {
                    setLapSelection((prev) =>
                        prev.filter(
                            (item) =>
                                item.driver !== driver || item.lap !== lap || item.group.label !== group.label,
                        ),
                    )
                })
            }
        },
        [flushBatchUpdates, clearIfTimeout],
    )

    const resetSelection = () => {
        clearIfTimeout()
        setLapSelection([])
    }

    return { selection: lapSelection, updateSelection, resetSelection }
}
