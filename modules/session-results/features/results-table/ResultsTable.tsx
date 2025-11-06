"use client"

import { SESSION_TYPE_TO_RESULT_COLUMN_MAP } from "@/modules/session-results/features/results-table/columns"
import type {
    ESessionType,
    IBaseResultsData,
} from "@/modules/session-results/features/results-table/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/uiComponents/table"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type RowData,
} from "@tanstack/react-table"
import { memo } from "react"
export interface IResultsTableProps<T extends RowData> {
    rows: T[]
}

export const ResultsTable = memo(
    <T extends IBaseResultsData>(props: IResultsTableProps<T> & { sessionType: ESessionType }) => {
        const { rows, sessionType } = props

        const table = useReactTable<T>({
            data: rows,
            columns: SESSION_TYPE_TO_RESULT_COLUMN_MAP[sessionType] as ColumnDef<T>[],
            /** row selection state tracking is disabled on table level because
             * it causes re-renders for the sake of enabling/disabling a single button,
             * which seems like ridiculous overkill */
            enableRowSelection: false,
            getRowId: (row) => row.driver.name,
            getCoreRowModel: getCoreRowModel(),
        })

        return (
            <div className="w-full flex flex-col items-end gap-2">
                <Table className="rounded-md overflow-hidden">
                    <TableHeader>
                        <TableRow>
                            {table.getFlatHeaders().map(({ column, id, getContext }) => (
                                <TableHead
                                    className="text-start px-1 bg-primary-foreground"
                                    key={id}
                                >
                                    {flexRender(column.columnDef.header, getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.map(({ id, getVisibleCells }) => (
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
    },
)
