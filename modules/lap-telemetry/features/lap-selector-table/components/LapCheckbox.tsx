import { LapSelectionContext } from "@/modules/lap-telemetry/context/lap-selection-context"
import { Checkbox } from "@/uiComponents/checkbox"
import type { CellContext } from "@tanstack/react-table"
import { useContext } from "react"
import type { ITableLapData } from "../models/types"

export const LapCheckbox = ({
    cell,
    driverName,
}: { cell: CellContext<ITableLapData, unknown>; driverName: string }) => {
    const lap = cell.row.index + 1
    const { updateLapSelection, activeGroup, isLapSelected, tab } = useContext(LapSelectionContext)
    const isSelected = isLapSelected(driverName, lap)
    return (
        <Checkbox
            name={driverName}
            value={lap}
            disabled={!cell.row.original[`${driverName}.LapTime`]}
            checked={isSelected}
            onCheckedChange={() => {
                if (tab === "telemetry") {
                    updateLapSelection({
                        driver: driverName,
                        lap: lap,
                        state: !isSelected,
                    })
                }
                if (activeGroup) {
                    updateLapSelection({
                        driver: driverName,
                        lap: lap,
                        state: !isSelected,
                        group: activeGroup,
                    })
                }
            }}
        />
    )
}
