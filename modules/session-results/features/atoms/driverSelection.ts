import { atom, useAtomValue, useSetAtom } from "jotai"

const driverSelectionAtom = atom<string[]>([])

export const useHasDriverSelection = () => {
    const value = useAtomValue(driverSelectionAtom)
    return value.length > 0
}

export const useSetDriverSelection = () => {
    const setDriverSelection = useSetAtom(driverSelectionAtom)

    const appendDriver = (driver: string) => setDriverSelection((prev) => [...prev, driver])

    const removeDriver = (driver: string) =>
        setDriverSelection((prev) => prev.filter((d) => d !== driver))

    return { appendDriver, removeDriver }
}
