import { useCallback, useState } from "react"

export type TGroup = {
    name: string
    color: string
}

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

    const activeGroup = groups.length ? groups[activeGroupIndex] : undefined

    const setActiveGroup = (groupName: string) => {
        const index = groups.findIndex((g) => g.name === groupName)
        setActiveGroupIndex(index)
    }

    return {
        activeGroup,
        setActiveGroup,
        groups,
        addGroup,
        removeGroup,
    }
}
