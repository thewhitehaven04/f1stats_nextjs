import type { SessionQuery } from "../../../../../../../../../../../shared/client/generated"
import type { TLapSelectionInstance } from "./LapsTableSection/hooks/useLapSelection"
import type { TGroup } from "./LapsTableSection/hooks/useSelectionGroups"

export const getQueries = (selection: TLapSelectionInstance[], groups: TGroup[]) =>
    selection.reduce((acc, { driver, lap, group }) => {
        const driverLapArray = acc.find((query) =>
            group ? query.group?.name === group : query.driver === driver,
        )
        if (driverLapArray) {
            driverLapArray.lap_filter?.push(lap)
        } else {
            const selectedGroup = groups.find((g) => g.name === group)
            acc.push({
                driver,
                lap_filter: [lap],
                group: selectedGroup || null,
            })
        }
        return acc
    }, [] as SessionQuery[])
