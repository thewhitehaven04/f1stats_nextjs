import { GroupSelectionContext } from "@/modules/lap-telemetry/context/lap-selection-context"
import { Checkbox } from "@/uiComponents/checkbox"
import type { CellContext } from "@tanstack/react-table"
import { useContext } from "react"
import type { ITableLapData } from "../models/types"
import { useLapGroupSelection } from '@/modules/lap-telemetry/hooks/useLapGroupSelectionAtom'
import { useLapSelection } from '@/modules/lap-telemetry/hooks/useLapSelectionAtom'

export const LapCheckbox = ({
    cell,
    driverName,
}: { cell: CellContext<ITableLapData, unknown>; driverName: string }) => {
    const lapId = cell.row.original[`${driverName}.LapId`]
    const { activeGroup, tab } = useContext(GroupSelectionContext)
    const { isLapSelected, updateSelection: updateLapSelection } = useLapSelection()
    const { isLapGroupSelected, updateSelection: updateGroupSelection } = useLapGroupSelection()

    const isSelected = activeGroup ? isLapGroupSelected(lapId, activeGroup) : isLapSelected(lapId)
    return (
        <Checkbox
            name={driverName}
            value={lapId}
            disabled={!cell.row.original[`${driverName}.LapTime`]}
            checked={isSelected}
            onCheckedChange={() => {
                if (tab === "telemetry") {
                    updateLapSelection({
                        lapId,
                        isSelected: !isSelected,
                        driver: driverName,
                    })
                }
                if (activeGroup) {
                    updateGroupSelection({
                        lapId,
                        isSelected: !isSelected,
                        group: activeGroup,
                    })
                }
            }}
        />
    )
}
