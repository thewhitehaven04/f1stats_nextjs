import { useCallback, useState } from "react"

export const useLapSelection = () => {
    const [selection, setSelection] = useState<[string, number][]>([])
    const hasSelected = !!selection.length
    const updateSelection = useCallback(
        ({ driver, lap, state }: { driver: string; lap: number; state: boolean }) => {
            if (state) {
                setSelection((prev) => [...prev, [driver, lap]])
            } else {
                setSelection((prev) =>
                    prev.filter(([key, value]) => (key !== driver || value !== lap)),
                )
            }
        },
        [],
    )
    return { hasSelected, updateSelection }
}
