import { useCallback, useMemo, useState } from "react"
import type { TGroup } from '../models/types'

export const useSelectionGroups = () => {
    const [activeGroupIndex, setActiveGroupIndex] = useState(0)
    const [groups, setGroups] = useState<TGroup[]>([])

    const addGroup = useCallback(
        (group: TGroup) => {
            setGroups((groups) => [...groups, group])
            setActiveGroupIndex(groups.length)
        },
        [groups],
    )

    const removeGroup = useCallback(
        (groupName: string) => {
            setGroups((groups) => groups.filter((g) => g.name !== groupName))
            if (activeGroupIndex === groups.length - 1) {
                setActiveGroupIndex(activeGroupIndex - 1)
            }
        },
        [activeGroupIndex, groups],
    )

    const activeGroup = useMemo(
        () => (groups.length ? groups[activeGroupIndex] : undefined),
        [activeGroupIndex, groups],
    )

    const setActiveGroup = useCallback(
        (groupName: string) => {
            const index = groups.findIndex((g) => g.name === groupName)
            setActiveGroupIndex(index)
        },
        [groups],
    )
    
    const resetGroups = useCallback(() => {
        setGroups([])
    }, [])

    return {
        activeGroup,
        setActiveGroup,
        groups,
        addGroup,
        removeGroup,
        resetGroups
    }
}
