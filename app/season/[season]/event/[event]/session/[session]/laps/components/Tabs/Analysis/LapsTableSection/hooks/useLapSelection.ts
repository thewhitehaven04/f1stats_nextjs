import { useDebouncedState } from "@/core/hooks/useDebouncedState"
import { useCallback, useState } from "react"

export const useLapSelection = () => {
    const [selection, setSelection] = useDebouncedState<[string, number][]>([], 300)
    const hasSelected = !!selection.length
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
    return { selection, hasSelected, updateSelection }
}
