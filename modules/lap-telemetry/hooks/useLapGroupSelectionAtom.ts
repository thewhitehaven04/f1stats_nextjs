import { atom, useAtom } from "jotai"
import { useCallback } from "react"

export type TGroupLapSelectionInstance = {
    lapId: number
    group: string 
}

export const lapGroupSelectionAtom = atom<TGroupLapSelectionInstance[]>([])

export const useLapGroupSelection = () => {
    const [lapSelection, setLapSelection] = useAtom(lapGroupSelectionAtom)

    const updateSelection = useCallback(
        (instance: { lapId: number; state: boolean; group: string }) => {
            const { lapId, group, state } = instance

            if (state) {
                setLapSelection((prev: TGroupLapSelectionInstance[]) => [
                    ...prev,
                    {
                        lapId,
                        group,
                    },
                ])
            } else {
                setLapSelection((prev: TGroupLapSelectionInstance[]) =>
                    prev.filter(
                        (item: TGroupLapSelectionInstance) =>
                            item.lapId !== lapId || item.group !== group,
                    ),
                )
            }
        },
        [setLapSelection],
    )

    const resetSelection = useCallback(() => {
        setLapSelection([])
    }, [setLapSelection])

    const isLapGroupSelected = useCallback(
        (lapId: number, groupName: string) =>
            !!lapSelection.find(
                (item: TGroupLapSelectionInstance) =>
                    item.lapId === lapId && item.group === groupName,
            ),
        [lapSelection],
    )

    return { selection: lapSelection, updateSelection, resetSelection, isLapGroupSelected }
}
