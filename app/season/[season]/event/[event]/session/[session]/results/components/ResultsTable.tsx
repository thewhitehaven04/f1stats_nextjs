"use client"

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type RowData,
} from "@tanstack/react-table"
import type { ESessionType, IBaseResultsData } from "./types"
import { SESSION_TYPE_TO_RESULT_COLUMN_MAP } from "./constants"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TooltipButton } from "../../laps/components/Tabs/Analysis/LapsTableSection/components/TooltipButton"
export interface IResultsTableProps<T extends RowData> {
    rows: T[]
}

export const ResultsTable = <T extends IBaseResultsData>(
    props: IResultsTableProps<T> & { sessionType: ESessionType },
) => {
    const { rows, sessionType } = props

    const { getRowModel, getFlatHeaders, getIsSomeRowsSelected } = useReactTable<T>({
        data: rows,
        columns: SESSION_TYPE_TO_RESULT_COLUMN_MAP[sessionType] as ColumnDef<T>[],
        getRowId: (row) => row.driver.name,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <div className="w-full flex flex-col items-end gap-2">
            <TooltipButton
                type="submit"
                disabled={!getIsSomeRowsSelected()}
                tooltipText="You need to select at least one result"
                size="md"
                variant="secondary"
            >
                View lap information
            </TooltipButton>
            <Table>
                <TableHeader>
                    <TableRow>
                        {getFlatHeaders().map(({ column, id, getContext }) => (
                            <TableHead className="text-start px-1" key={id}>
                                {flexRender(column.columnDef.header, getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {getRowModel().rows.map(({ id, getVisibleCells }) => (
                        <TableRow key={id}>
                            {getVisibleCells().map(({ id: cellId, column, getContext }) => (
                                <TableCell className="pl-1" key={cellId}>
                                    {flexRender(column.columnDef.cell, getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
