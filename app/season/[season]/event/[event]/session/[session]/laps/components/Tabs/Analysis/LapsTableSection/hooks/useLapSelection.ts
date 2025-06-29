import { useCallback, useRef, useState } from "react"

export const useLapSelection = () => {
    const [selection, setSelection] = useState<[string, number][]>([])

    const batch = useRef<(() => void)[]>([])
    const timeoutRef = useRef<NodeJS.Timeout>(null)
    const clearIfTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    const flushBatch = useCallback(() => {
        batch.current.forEach((fn) => fn())
        batch.current = []
    }, [])

    const updateSelection = useCallback(
        ({ driver, lap, state }: { driver: string; lap: number; state: boolean }) => {
            clearIfTimeout()

            if (state) {
                batch.current.push(() => setSelection((prev) => [...prev, [driver, lap]]))
                timeoutRef.current = setTimeout(flushBatch, 1000)
            } else {
                batch.current.push(() => {
                    setSelection((prev) =>
                        prev.filter(([key, value]) => key !== driver || value !== lap),
                    )
                })
            }
        },
        [flushBatch, clearIfTimeout],
    )

    const resetSelection = () => {
        clearIfTimeout()
        setSelection([])
    }

    return { selection, updateSelection, resetSelection }
}
