import type { CellContext } from '@tanstack/react-table'
import type { ILapData } from '../../../../../../../../../../../../../modules/lap-telemetry/features/lap-selector-table/LapSelectorTable'

export const LapCheckbox = ({
    cell,
    driverName,
}: { cell: CellContext<ILapData, unknown>; driverName: string }) => {
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
