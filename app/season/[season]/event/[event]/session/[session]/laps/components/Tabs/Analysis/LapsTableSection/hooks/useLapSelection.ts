import { useDebouncedState } from "@/core/hooks/useDebouncedState"
import { useCallback } from "react"

export const useLapSelection = () => {
    const [selection, setSelection] = useDebouncedState<[string, number][]>([], 500)

    const updateSelection = useCallback(
        ({ driver, lap, state }: { driver: string; lap: number; state: boolean }) => {
            if (state) {
                setSelection((prev) => [...prev, [driver, lap]])
            } else {
                setSelection((prev) =>
                    prev.filter(([key, value]) => key !== driver || value !== lap),
                )
            }
        },
        [setSelection],
    )
    const resetSelection = () => {
        setSelection([])
    }
    return { selection, updateSelection, resetSelection }
}
