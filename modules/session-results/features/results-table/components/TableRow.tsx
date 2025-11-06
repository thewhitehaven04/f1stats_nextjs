import { TableCell, TableRow } from "@/uiComponents/table"
import { flexRender, type RowData, type VisibilityRow } from "@tanstack/react-table"
import { memo } from "react"

export const ResultsTableRow = memo(function TableRowInner({
    getVisibleCells,
}: { getVisibleCells: VisibilityRow<RowData>["getVisibleCells"] }) {
    return (
        <TableRow>
            {getVisibleCells().map(({ id: cellId, column, getContext }) => (
                <TableCell className="pl-1" key={cellId}>
                    {flexRender(column.columnDef.cell, getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
})
