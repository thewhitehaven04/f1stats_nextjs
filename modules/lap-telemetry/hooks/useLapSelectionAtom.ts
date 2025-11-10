import { atom, useAtom } from "jotai"
import { useCallback } from "react"

export type TLapSelectionInstance = {
    lapId: number
    driver: string
}

export const lapSelectionAtom = atom<TLapSelectionInstance[]>([])

export const useLapSelection = () => {
    const [lapSelection, setLapSelection] = useAtom(lapSelectionAtom)

    const updateSelection = useCallback(
        (instance: { driver: string; lapId: number; state: boolean }) => {
            const { lapId, driver, state } = instance

            if (state) {
                setLapSelection((prev: TLapSelectionInstance[]) => [
                    ...prev,
                    {
                        lapId,
                        driver,
                    },
                ])
            } else {
                setLapSelection((prev: TLapSelectionInstance[]) =>
                    prev.filter(
                        (item: TLapSelectionInstance) =>
                            item.lapId !== lapId || item.driver !== driver,
                    ),
                )
            }
        },
        [setLapSelection],
    )

    const resetSelection = useCallback(() => {
        setLapSelection([])
    }, [setLapSelection])

    const isLapSelected = useCallback(
        (lapId: number) => !!lapSelection.find((item: TLapSelectionInstance) => item.lapId === lapId),
        [lapSelection],
    )

    return { selection: lapSelection, updateSelection, resetSelection, isLapSelected }
}
