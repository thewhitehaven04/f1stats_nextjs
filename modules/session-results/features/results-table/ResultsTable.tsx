"use client"

import { SESSION_TYPE_TO_RESULT_COLUMN_MAP } from '@/modules/session-results/features/results-table/columns'
import type { ESessionType, IBaseResultsData } from '@/modules/session-results/features/results-table/types'
import { TooltipButton } from '@/shared/components/TooltipButton'
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/uiComponents/table'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type RowData,
} from "@tanstack/react-table"
import { Table } from 'lucide-react'
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
            <Table className="rounded-md overflow-hidden">
                <TableHeader>
                    <TableRow>
                        {getFlatHeaders().map(({ column, id, getContext }) => (
                            <TableHead className="text-start px-1 bg-primary-foreground" key={id}>
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
